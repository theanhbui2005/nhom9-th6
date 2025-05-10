import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import useDestinationModel from '@/models/quanlydiemden'; // Import the hook

const ThongKe = () => {
	const { destinations } = useDestinationModel(); // Use the hook to get destinations
	const [stats, setStats] = useState({
		totalItineraries: 0,
		popularDestination: '',
		totalRevenue: 0,
		categoryExpenses: {
			food: 0,
			accommodation: 0,
			transport: 0,
		},
	});

	useEffect(() => {
		// Calculate statistics from destinations
		const totalItineraries = destinations.length;
		const popularDestination = destinations[0]?.name || 'N/A';
		const totalRevenue = destinations.reduce(
			(acc, item) => acc + item.price,
			0
		);
		const categoryExpenses = destinations.reduce(
			(acc, item) => ({
				food: acc.food + (item.foodCost || 0),
				accommodation: acc.accommodation + (item.accommodationCost || 0),
				transport: acc.transport + (item.transportCost || 0),
			}),
			{ food: 0, accommodation: 0, transport: 0 }
		);

		setStats({ totalItineraries, popularDestination, totalRevenue, categoryExpenses });
	}, [destinations]);

	return (
		<Row gutter={16}>
			<Col span={8}>
				<Card>
					<Statistic title="Số lượt lịch trình" value={stats.totalItineraries} />
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic title="Địa điểm phổ biến" value={stats.popularDestination} />
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic title="Tổng số tiền thu về" value={stats.totalRevenue} prefix="₫" />
				</Card>
			</Col>
			{/* Remove or update category expenses if not applicable */}
			<Col span={8}>
				<Card>
					<Statistic title="Chi phí ăn uống" value={stats.categoryExpenses.food} prefix="₫" />
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic title="Chi phí lưu trú" value={stats.categoryExpenses.accommodation} prefix="₫" />
				</Card>
			</Col>
			<Col span={8}>
				<Card>
					<Statistic title="Chi phí di chuyển" value={stats.categoryExpenses.transport} prefix="₫" />
				</Card>
			</Col>
		</Row>
	);
};

export default ThongKe;
