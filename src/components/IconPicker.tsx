import React, { useState } from 'react';
import { Modal, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { filterIcons, getCategories } from '../utils/iconUtils';

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
  title?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  open,
  onClose,
  onSelect,
  selectedIcon = '',
  title = 'Select Icon'
}) => {
  const { t } = useTranslation(['assistModule', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredIcons = filterIcons(searchTerm, selectedCategory);

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    onClose();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      width={800}
      footer={null}
      className="icon-selection-modal"
    >
      <div className="mb-4">
        <Input
          placeholder={t('drawer.IconSearchPlaceholder', { ns: 'assistModule' })}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        <Select
          placeholder={t('drawer.IconCategoryLabel', { ns: 'assistModule' })}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full"
          options={[
            { label: 'All Categories', value: 'all' },
            ...getCategories().map(category => ({
              label: category.charAt(0).toUpperCase() + category.slice(1),
              value: category
            }))
          ]}
        />
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {filteredIcons.map((icon) => (
            <div
              key={icon.name}
              className={`p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedIcon === icon.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600'
              }`}
              onClick={() => handleIconSelect(icon.name)}
              title={icon.displayName}
            >
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 mb-1 flex items-center justify-center">
                  <img
                    src={icon.path}
                    alt={icon.displayName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback for missing icons - show a placeholder
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs">?</div>';
                      }
                    }}
                  />
                </div>
                <span className="text-xs text-center truncate w-full">
                  {icon.displayName}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No icons found matching your search criteria.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IconPicker;
