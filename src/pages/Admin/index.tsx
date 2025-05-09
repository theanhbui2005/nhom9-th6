import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormAdmin from './Form';

const Admin = () => {
	const { data, getDataAdmin, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('admin');

	useEffect(() => {
		getDataAdmin();
	}, []);

	const columns: IColumn<Admin.Record>[] = [
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 200,
		},
		{
			title: 'Thời gian',
			dataIndex: 'visitTime',
			key: 'visitTime',
			width: 150,
		},
		{
			title: 'Chi phí ăn uống',
			dataIndex: 'foodCost',
			key: 'foodCost',
			width: 100,
		},
		{
			title: 'Chi phí lưu trú',
			dataIndex: 'accommodationCost',
			key: 'accommodationCost',
			width: 100,
		},
		{
			title: 'Chi phí di chuyển',
			dataIndex: 'transportCost',
			key: 'transportCost',
			width: 100,
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			width: 100,
		},
		{
			title: 'Chỉnh sửa',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Edit
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('destinations') as any);
								const newData = dataLocal.filter((item: any) => item.description !== record.description);
								localStorage.setItem('destinations', JSON.stringify(newData));
								getDataAdmin();
							}}
							type='primary'
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
				}}
			>
				Thêm mới
			</Button>

			<Table dataSource={data} columns={columns} />

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Edit Destination' : 'Add Destination'}
				visible={visible}
				onOk={() => {}}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<FormAdmin />
			</Modal>
		</div>
	);
};

export default Admin;
