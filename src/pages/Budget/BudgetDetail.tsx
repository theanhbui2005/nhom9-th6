import React, { useState } from 'react';
import { useParams } from 'umi';
import { Progress, Alert, Form, InputNumber, Button } from 'antd';
import BudgetChart from '@/components/BudgetChart/BudgetChart';

const BudgetDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [budget, setBudget] = useState({
        id,
        name: `Ngân sách ${id}`,
        total: 10000,
        food: 3000,
        transport: 4000,
        accommodation: 2000,
    });
    const [isOverBudget, setIsOverBudget] = useState(false);

    const handleUpdateBudget = (values: any) => {
        const totalUsed = values.food + values.transport + values.accommodation;
        setIsOverBudget(totalUsed > budget.total);
        setBudget({ ...budget, ...values });
    };

    return (
        <div>
            <h1>Chi tiết ngân sách: {budget.name}</h1>
            <p>Tổng ngân sách: {budget.total} USD</p>

            <BudgetChart
                data={[
                    { name: 'Ăn uống', value: budget.food },
                    { name: 'Di chuyển', value: budget.transport },
                    { name: 'Lưu trú', value: budget.accommodation },
                ]}
            />

            {isOverBudget && (
                <Alert
                    message="Cảnh báo: Bạn đã vượt ngân sách!"
                    type="error"
                    showIcon
                    style={{ marginTop: '20px' }}
                />
            )}

            <Form
                layout="vertical"
                initialValues={{
                    food: budget.food,
                    transport: budget.transport,
                    accommodation: budget.accommodation,
                }}
                onFinish={handleUpdateBudget}
                style={{ marginTop: '20px' }}
            >
                <Form.Item label="Ăn uống" name="food">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Di chuyển" name="transport">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Lưu trú" name="accommodation">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Cập nhật ngân sách
                </Button>
            </Form>
        </div>
    );
};

export default BudgetDetail;