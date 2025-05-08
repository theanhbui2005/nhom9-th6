export default [
    ///////////////////////////////////
    // USER ROUTES
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },

    ///////////////////////////////////
    // DEFAULT MENU
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    {
        path: '/gioi-thieu',
        name: 'About',
        component: './TienIch/GioiThieu',
        hideInMenu: true,
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },

    ///////////////////////////////////
    // NOTIFICATION ROUTES
    {
        path: '/notification',
        routes: [
            {
                path: '/notification/subscribe',
                exact: true,
                component: './ThongBao/Subscribe',
            },
            {
                path: '/notification/check',
                exact: true,
                component: './ThongBao/Check',
            },
            {
                path: '/notification',
                exact: true,
                component: './ThongBao/NotifOneSignal',
            },
        ],
        layout: false,
        hideInMenu: true,
    },

    ///////////////////////////////////
    // BUDGET ROUTES
    {
        path: '/budget',
        name: 'Budget',
        icon: 'DollarOutlined',
        routes: [
            {
                path: '/budget/list',
                name: 'BudgetList',
                component: './Budget/BudgetList', // Hiển thị danh sách ngân sách
            },
            {
                path: '/budget/detail/:id',
                name: 'BudgetDetail',
                component: './Budget/BudgetDetail', // Hiển thị chi tiết ngân sách theo ID
                hideInMenu: true,
            },
        ],
    },

    ///////////////////////////////////
    // EXCEPTION ROUTES
    {
        path: '/',
        redirect: '/dashboard', // Redirect về Dashboard nếu không có route cụ thể
    },
    {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
    },
    {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
    },
    {
        component: './exception/404',
    },
];