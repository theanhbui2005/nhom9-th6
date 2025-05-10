import { Button, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getDestinations, deleteDestination } from '../../services/destinationService';
import { Destination } from '@/services/Destination/typing';
import FormAdmin from '../Admin/Form';
import QuanLyDiemDenForm from './Form';

const QuanLyDiemDen = () => {
	const [data, setData] = useState<Destination[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [row, setRow] = useState<Destination | null>(null);

	useEffect(() => {
		setData(getDestinations());
	}, []);

	const handleDelete = (record: Destination) => {
		deleteDestination(record.description);
		setData(getDestinations());
	};

	const handleSubmit = (values: Destination) => {
		if (isEdit && row) {
			// Update logic here
			console.log('Updating:', values);
		} else {
			// Add logic here
			console.log('Adding:', values);
		}
		setVisible(false);
		setData(getDestinations());
	};

	const columns = [
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Thời gian',
			dataIndex: 'visitTime',
			key: 'visitTime',
		},
		{
			title: 'Chi phí ăn uống',
			dataIndex: 'foodCost',
			key: 'foodCost',
		},
		{
			title: 'Chi phí lưu trú',
			dataIndex: 'accommodationCost',
			key: 'accommodationCost',
		},
		{
			title: 'Chi phí di chuyển',
			dataIndex: 'transportCost',
			key: 'transportCost',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
		},
		{
			title: 'Hình ảnh',
			dataIndex: 'imageUrl',
			key: 'imageUrl',
			render: (url: string | undefined) => (url ? <img src={url} alt="destination" style={{ width: 100 }} /> : 'N/A'),
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (record: Destination) => (
				<div>
					<Button
						onClick={() => {
							setRow(record);
							setIsEdit(true);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Button style={{ marginLeft: 10 }} onClick={() => handleDelete(record)} danger>
						Xóa
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<Button
				type="primary"
				onClick={() => {
					setRow(null);
					setIsEdit(false);
					setVisible(true);
				}}
			>
				Thêm mới
			</Button>
			<Table dataSource={data} columns={columns} rowKey="description" />
			<Modal
				visible={visible}
				title={isEdit ? 'Sửa điểm đến' : 'Thêm điểm đến'}
				footer={null}
				onCancel={() => setVisible(false)}
			>
				<QuanLyDiemDenForm
					initialValues={row}
					onSubmit={handleSubmit}
					onCancel={() => setVisible(false)}
				/>
			</Modal>
		</div>
	);
};

export default QuanLyDiemDen;
