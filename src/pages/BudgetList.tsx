import React from 'react';
import { Link } from 'umi';

const BudgetList = () => {
    const budgets = [
        { id: 1, name: 'Ngân sách du lịch 1', total: 5000 },
        { id: 2, name: 'Ngân sách du lịch 2', total: 10000 },
    ];

    return (
        <div>
            <h1>Danh sách ngân sách</h1>
            <ul>
                {budgets.map((budget) => (
                    <li key={budget.id}>
                        <Link to={`/budget/detail/${budget.id}`}>
                            {budget.name} - Tổng: {budget.total} USD
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BudgetList;