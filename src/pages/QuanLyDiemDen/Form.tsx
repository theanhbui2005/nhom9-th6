import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { useModel } from 'umi';
import { Destination } from '@/services/Destination/typing';

interface QuanLyDiemDenFormProps {
	initialValues: Destination | null;
	onSubmit: (values: Destination) => void;
	onCancel: () => void;
}

const QuanLyDiemDenForm: React.FC<QuanLyDiemDenFormProps> = ({ initialValues, onSubmit, onCancel }) => {
	const [form] = Form.useForm();
	const { data, getDataDestination, row, isEdit, setVisible } = useModel('quanlydiemden');

	React.useEffect(() => {
		if (initialValues) {
			form.setFieldsValue(initialValues);
		} else {
			form.resetFields();
		}
	}, [initialValues, form]);

	const handleFinish = (values: Destination) => {
		console.log('🚀 ~ QuanLyDiemDen ~ values:', values);
		const index = data.findIndex((item: any) => item.description === row?.description);
		const dataTemp = [...data];
		dataTemp.splice(index, 1, values);
		const dataLocal = isEdit ? dataTemp : [values, ...data];
		localStorage.setItem('destinationData', JSON.stringify(dataLocal));
		setVisible(false);
		getDataDestination();
		onSubmit(values);
	};

	return (
		<Form form={form} onFinish={handleFinish} layout="vertical">
			<Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
				<Input />
			</Form.Item>
			<Form.Item name="visitTime" label="Thời gian" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
				<Input />
			</Form.Item>
			<Form.Item name="foodCost" label="Chi phí ăn uống" rules={[{ required: true, message: 'Vui lòng nhập chi phí!' }]}>
				<InputNumber style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name="accommodationCost" label="Chi phí lưu trú" rules={[{ required: true, message: 'Vui lòng nhập chi phí!' }]}>
				<InputNumber style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name="transportCost" label="Chi phí di chuyển" rules={[{ required: true, message: 'Vui lòng nhập chi phí!' }]}>
				<InputNumber style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
				<InputNumber min={1} max={5} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name="imageUrl" label="Hình ảnh">
				<Input />
			</Form.Item>
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button onClick={onCancel} style={{ marginRight: 10 }}>
					Hủy
				</Button>
				<Button type="primary" htmlType="submit">
					{isEdit ? 'Lưu' : 'Thêm'}
				</Button>
			</div>
		</Form>
	);
};

export default QuanLyDiemDenForm;
