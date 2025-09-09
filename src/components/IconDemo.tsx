import React, { useState } from 'react';
import { Card, Button, Space, Typography, Row, Col } from 'antd';
import { getAllIcons, getCategories, getTotalIconCount } from '../utils/iconUtils';
import IconPicker from './IconPicker';

const { Title, Text } = Typography;

const IconDemo: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const selectedIconData = selectedIcon ? getAllIcons().find(icon => icon.name === selectedIcon) : null;

  return (
    <div className="p-6">
      <Title level={2}>Icon System Demo</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Icon Statistics">
            <Space direction="vertical" size="middle">
              <Text>Total Icons: <strong>{getTotalIconCount()}</strong></Text>
              <Text>Categories: <strong>{getCategories().join(', ')}</strong></Text>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Icon Selection">
            <Space direction="vertical" size="middle">
              <div>
                <Text>Selected Icon: </Text>
                {selectedIcon ? (
                  <Space>
                    <img 
                      src={selectedIconData?.path} 
                      alt={selectedIconData?.displayName}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Text strong>{selectedIconData?.displayName}</Text>
                    <Text code>{selectedIcon}</Text>
                  </Space>
                ) : (
                  <Text type="secondary">No icon selected</Text>
                )}
              </div>
              
              <Button 
                type="primary" 
                onClick={() => setIconPickerOpen(true)}
              >
                Choose Icon
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Sample Icons by Category">
            {getCategories().slice(0, 4).map(category => (
              <div key={category} className="mb-4">
                <Title level={4}>{category.charAt(0).toUpperCase() + category.slice(1)}</Title>
                <Row gutter={[8, 8]}>
                  {getAllIcons()
                    .filter(icon => icon.category === category)
                    .slice(0, 8)
                    .map(icon => (
                      <Col key={icon.name}>
                        <div 
                          className="p-2 border rounded cursor-pointer hover:bg-gray-100 text-center"
                          onClick={() => setSelectedIcon(icon.name)}
                          title={icon.displayName}
                        >
                          <img 
                            src={icon.path} 
                            alt={icon.displayName}
                            className="w-6 h-6 mb-1"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="text-xs truncate w-16">
                            {icon.displayName}
                          </div>
                        </div>
                      </Col>
                    ))}
                </Row>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <IconPicker
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={handleIconSelect}
        selectedIcon={selectedIcon}
        title="Select an Icon"
      />
    </div>
  );
};

export default IconDemo;
