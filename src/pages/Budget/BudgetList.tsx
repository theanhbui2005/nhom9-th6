import React, { useState } from 'react';
import { Link } from 'umi';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';

const BudgetList = () => {
    const [budgets, setBudgets] = useState([
        { id: 1, name: 'Ngân sách du lịch 1', total: 5000 },
        { id: 2, name: 'Ngân sách du lịch 2', total: 10000 },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddBudget = (values: any) => {
        const newBudget = {
            id: budgets.length + 1,
            ...values,
        };
        setBudgets([...budgets, newBudget]);
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div>
            <h1>Danh sách ngân sách</h1>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Thêm ngân sách
            </Button>
            <Table
                dataSource={budgets}
                columns={[
                    {
                        title: 'Tên ngân sách',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record) => (
                            <Link to={`/budget/detail/${record.id}`}>{text}</Link>
                        ),
                    },
                    {
                        title: 'Tổng ngân sách',
                        dataIndex: 'total',
                        key: 'total',
                    },
                ]}
                rowKey="id"
            />

            <Modal
                title="Thêm ngân sách mới"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleAddBudget} layout="vertical">
                    <Form.Item
                        label="Tên ngân sách"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên ngân sách!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tổng ngân sách"
                        name="total"
                        rules={[{ required: true, message: 'Vui lòng nhập tổng ngân sách!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BudgetList;