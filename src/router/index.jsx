import { createBrowserRouter } from 'react-router-dom';
import Wrapper from '../pages/Wrapper';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Users from '../pages/users/Users';
import Roles from '../pages/roles/Roles';
import UserCreate from '../pages/users/UserCreate';
import UserEdit from '../pages/users/UserEdit';
import RoleCreate from '../pages/roles/RoleCreate';
import RoleEdit from '../pages/roles/RoleEdit';
import Vouchers from '../pages/voucher/Voucher';
import VoucherCreate from '../pages/voucher/VoucherCreate';
import VoucherEdit from '../pages/voucher/VoucherEdit';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Wrapper />,
    children: [
      { path: '/users', element: <Users /> },
      { path: '/users/create', element: <UserCreate /> },
      { path: '/users/:id/edit', element: <UserEdit /> },
      { path: '/roles', element: <Roles /> },
      { path: '/roles/create', element: <RoleCreate /> },
      { path: '/roles/:id/edit', element: <RoleEdit /> },
      { path: '/vouchers', element: <Vouchers /> },
      { path: '/vouchers/create', element: <VoucherCreate /> },
      { path: '/vouchers/:id/edit', element: <VoucherEdit /> },
    ],
  },
]);

export default router;