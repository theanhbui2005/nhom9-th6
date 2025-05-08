import React, { useEffect } from "react";
import { Form, Input, Button, Rate, InputNumber, Select, Modal } from "antd";
import { useModel } from "umi"; // Hoặc tùy thuộc vào cách quản lý model của bạn
import { Destination } from "@/services/Destination/typing"; // Đảm bảo import đúng

const { Option } = Select;

interface FormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (destination: Destination) => void;
  destination?: Destination | null;
}

const DestinationForm: React.FC<FormProps> = ({
  visible,
  onClose,
  onSubmit,
  destination,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (destination) {
      form.setFieldsValue({
        name: destination.name,
        image: destination.image,
        location: destination.location,
        rating: destination.rating,
        price: destination.price,
        category: destination.category,
      });
    } else {
      form.resetFields();
    }
  }, [destination, form]);

  const handleFinish = (values: any) => {
    const newDestination = {
      ...values,
      id: destination ? destination.id : Date.now().toString(), // Giữ id nếu chỉnh sửa
    };
    onSubmit(newDestination);
    form.resetFields();
  };

  return (
    <Modal
      title={destination ? "Chỉnh sửa điểm đến" : "Thêm điểm đến"}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          rating: 0,
        }}
      >
        <Form.Item
          label="Tên điểm đến"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên điểm đến!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ảnh"
          name="image"
          rules={[{ required: true, message: "Vui lòng nhập URL ảnh!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Vị trí"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đánh giá"
          name="rating"
          rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            prefix="₫"
            formatter={(value) => (value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "")}
            parser={(value) => (value ? value.replace(/₫\s?|(,*)/g, "") : "")}
          />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục">
            <Option value="biển">Biển</Option>
            <Option value="núi">Núi</Option>
            <Option value="thành phố">Thành phố</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {destination ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DestinationForm;
