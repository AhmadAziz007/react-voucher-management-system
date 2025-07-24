import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: "Users", to: "/users", icon: "bi bi-people" },
  { name: "Roles", to: "/roles", icon: "bi bi-person-gear" },
  { name: "Voucher", to: "/vouchers", icon: "bi bi-person-money" },
];

export default function Menu () {
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-white border-end vh-100 sidebar collapse shadow-sm"
    >
      <div className="position-sticky pt-4">
        <h5 className="text-center mb-4 fw-bold">Admin Panel</h5>
        <ul className="nav flex-column px-3">
          {menuItems.map((item) => (
            <li className="nav-item mb-2" key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-dark fw-medium ${isActive ? 'active' : ''}`
                }
              >
                <i className={item.icon} style={{ fontSize: '1.2rem' }}></i>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}