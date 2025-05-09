import axios from 'axios';

export const getData = async () => {
	const data = localStorage.getItem('destinations');
	return data ? JSON.parse(data) : null;
};
