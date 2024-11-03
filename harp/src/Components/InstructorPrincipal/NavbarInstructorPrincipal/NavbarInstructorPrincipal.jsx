// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// function NavbarInstructor({ toggleSidebar }) {
//   const [isMenuVisible, setIsMenuVisible] = useState(true);

//   const handleToggleMenu = () => {
//     setIsMenuVisible((prev) => !prev);
//     toggleSidebar();
//   };

//   return (
//     <nav className="navbar navbar-expand-lg fixed-top d-" style={{ width: '100%', backgroundColor: '#1E1B4B', overflow: 'hidden' }}>
//       <div className="d-flex justify-content-between align-items-center" style={{ width: '100%', padding: '1rem', position: 'relative' }}>
//         {/* Botón de menú */}
//         <button
//           className="btn d-flex align-items-center"
//           onClick={handleToggleMenu}
//           style={{
//             backgroundColor: 'transparent',
//             color: 'white',
//             border: 'none',
//             padding: '0.5rem 1rem',
//             marginLeft: '-0.4vw',
//           }}
//         >
//           <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
//           {isMenuVisible && <span style={{ marginLeft: '0.3rem' }}>Menú</span>}
//         </button>

//         {/* Título Harp */}
//         <h1 style={{
//           fontSize: '3vw',
//           position: 'absolute',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           margin: 0,
//         }}>
//           Harp
//         </h1>

//         {/* Botón de cerrar sesión */}
//         <Link className="btn btn-outline-light" to="/logout" style={{ color: 'white', fontSize: '1.2rem' }}>
//           Cerrar Sesión
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default NavbarInstructor;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarInstructor({ toggleSidebar }) {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    toggleSidebar();
  };

  const handleProfileSelect = (option) => {
    if (option === 'profile') navigate('/mi-cuenta');
    else if (option === 'settings') navigate('/configuracion');
    else if (option === 'logout') navigate('/logout');
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ width: '100%', backgroundColor: '#1E1B4B' }}>
      <div className="d-flex justify-content-between align-items-center" style={{ width: '100%', padding: '1rem' }}>
        <button
          className="btn d-flex align-items-center"
          onClick={handleToggleMenu}
          style={{ backgroundColor: 'transparent', color: 'white', border: 'none', padding: '0.5rem 1rem' }}
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
          {!isMenuVisible && <span style={{ marginLeft: '0.3rem' }}>Menú</span>}
        </button>

        <h1 style={{ fontSize: '3vw', margin: 0, color: 'white', textAlign: 'center', flexGrow: 1 }}>
          Harp
        </h1>

        <select className="form-select" style={{ width: '120px', backgroundColor: '#1E1B4B', color: 'white', border: 'none', marginRight: '0.5rem' }}>
          <option value="service1">Serv. 1</option>
          <option value="service2">Serv. 2</option>
          <option value="service3">Serv. 3</option>
        </select>

        <div className="dropdown" style={{ position: 'relative' }}>
          <button
            className="btn"
            onClick={toggleDropdown}
            style={{ backgroundColor: 'transparent', color: 'white', border: 'none', padding: '0' }}
          >
            Perfil
          </button>

          {showDropdown && (
            <ul className="dropdown-menu" style={{ position: 'absolute', right: '0', zIndex: 1000, backgroundColor: '#1E1B4B', borderRadius: '0.5rem', padding: '0.5rem 0' }}>
              <li>
                <button className="dropdown-item" onClick={() => handleProfileSelect('profile')} style={{ backgroundColor: 'transparent', color: 'white' }}>
                  Mi Cuenta
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => handleProfileSelect('settings')} style={{ backgroundColor: 'transparent', color: 'white' }}>
                  Configuración
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => handleProfileSelect('logout')} style={{ backgroundColor: 'transparent', color: 'white' }}>
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
