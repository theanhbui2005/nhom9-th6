import React from 'react';
import { Modal, Form, Input } from 'antd';

interface TravelPlanFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

const TravelPlanForm: React.FC<TravelPlanFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      form.resetFields();
      onSubmit(values.name);
    });
  };

  return (
    <Modal
      title="Tạo kế hoạch du lịch mới"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form 
        form={form} 
        layout="vertical" 
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Tên kế hoạch"
          rules={[
            { required: true, message: 'Vui lòng nhập tên kế hoạch' },
            { max: 100, message: 'Tên kế hoạch không được vượt quá 100 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên kế hoạch du lịch" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TravelPlanForm; 