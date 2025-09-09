import React, { useState } from "react";
import { Button, Drawer, Space, Form, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import IconPicker from "../../../components/IconPicker";



const MenuDrawer: React.FC = () => {
  const { t } = useTranslation(["assistModule", "common"]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");


  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form Submitted:", values);
      // TODO: send values to API
      onClose();
      form.resetFields();
      setSelectedIcon("");
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    form.setFieldsValue({ moduleIcon: iconName });
  };

  const openIconModal = () => {
    setIconModalOpen(true);
  };

  const renderField = (
    name: string,
    labelKey: string,
    placeholderKey: string,
    fieldType: string = "text"
  ) => (
    <Form.Item
      className="mb-2"
      name={name}
      label={
        <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
          {t(labelKey, { ns: "assistModule" })}
        </span>
      }
      rules={[{ required: true, message: t("common:validation.required") }]}
    >
      {fieldType === "text" ? (
      <Input
        size="large"
        className="rounded-md"
        placeholder={t(placeholderKey, { ns: "assistModule" })}
        aria-label={t(labelKey, { ns: "assistModule" })}
      />
      ) : fieldType === "select" ? (
        <Select
          size="large"
          style={{ borderRadius: "4px !important" }}
          className="rounded-md"
          placeholder={t(placeholderKey, { ns: "assistModule" })}
          aria-label={t(labelKey, { ns: "assistModule" })}
          options={[]}
        />
      ) : fieldType === "icon" ? (
        <div className="flex items-center gap-2">
          <Input
            size="large"
            className="rounded-md flex-1"
            placeholder={t(placeholderKey, { ns: "assistModule" })}
            value={selectedIcon}
            readOnly
            aria-label={t(labelKey, { ns: "assistModule" })}
          />
          <Button 
            type="default" 
            onClick={openIconModal}
            className="px-4"
          >
            {t("drawer.ModuleIconLabel", { ns: "assistModule" })}
          </Button>
        </div>
      ) : null}
    </Form.Item>
  );

  return (
    <>
      <Space>
        <Button size="large" className="shadow-lg hover:shadow-xl transition-all duration-300" type="primary" onClick={showDrawer} icon={<FaPlus />}/>

      </Space>

      <Drawer
        title={t("title", "Assist Module")}
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>{t("common:cancel")}</Button>
            <Button type="primary" onClick={handleSave}>
              {t("common:save")}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          {renderField("moduleName", "drawer.ModuleNameLabel", "drawer.ModuleNamePlaceholder", "text")}
          {renderField("moduleCode", "drawer.ModuleCodeLabel", "drawer.ModuleCodePlaceholder", "text")}
          {renderField("moduleParent", "drawer.ModuleParentLabel", "drawer.ModuleParentPlaceholder", "select")}
          {renderField("moduleSlug", "drawer.ModuleSlugLabel", "drawer.ModuleSlugPlaceholder", "text")}
          {renderField("moduleIcon", "drawer.ModuleIconLabel", "drawer.ModuleIconPlaceholder", "icon")}
        </Form>
      </Drawer>

      {/* Icon Selection Modal */}
      <IconPicker
        open={iconModalOpen}
        onClose={() => setIconModalOpen(false)}
        onSelect={handleIconSelect}
        selectedIcon={selectedIcon}
        title={t("drawer.ModuleIconLabel", { ns: "assistModule" })}
      />
    </>
  );
};

export default MenuDrawer;
