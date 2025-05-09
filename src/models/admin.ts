import { getData } from '@/services/Admin';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Admin.Record>();

	const getDataAdmin = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('destinations') as any);
		if (!dataLocal?.length) {
			const res = await getData();
			localStorage.setItem('destinations', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		setData,
		getDataAdmin,
	};
};
