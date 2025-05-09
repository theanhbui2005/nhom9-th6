import { Button, Form, Input, InputNumber } from 'antd';
import { useModel } from 'umi';

const FormAdmin = () => {
	const { data, getDataAdmin, row, isEdit, setVisible } = useModel('admin');

	return (
		<Form
			onFinish={(values) => {
				const index = data.findIndex((item: any) => item.description === row?.description);
				const dataTemp: Admin.Record[] = [...data];
				dataTemp.splice(index, 1, values);
				const dataLocal = isEdit ? dataTemp : [values, ...data];
				localStorage.setItem('destinations', JSON.stringify(dataLocal));
				setVisible(false);
				getDataAdmin();
			}}
		>
			<Form.Item
				initialValue={row?.description}
				label='Mô tả'
				name='description'
				rules={[{ required: true, message: 'nhập mô tả' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				initialValue={row?.visitTime}
				label='Thời gian'
				name='visitTime'
				rules={[{ required: true, message: 'thời gian!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				initialValue={row?.foodCost}
				label='Chi phí ăn uống'
				name='foodCost'
				rules={[{ required: true, message: 'giá đồ ăn' }]}
			>
				<InputNumber min={0} />
			</Form.Item>

			<Form.Item
				initialValue={row?.rating}
				label='Đánh giá'
				name='rating'
				rules={[{ required: true, message: 'rating' }]}
			>
				<InputNumber min={0} max={5} />
			</Form.Item>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Save' : 'Insert'}
				</Button>
				<Button onClick={() => setVisible(false)}>Cancel</Button>
			</div>
		</Form>
	);
};

export default FormAdmin;
