import React from 'react';
import { useParams } from 'umi';

const BudgetDetail = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Chi tiết ngân sách</h1>
            <p>ID ngân sách: {id}</p>
            {/* Thêm logic để hiển thị chi tiết ngân sách từ API hoặc state */}
        </div>
    );
};

export default BudgetDetail;