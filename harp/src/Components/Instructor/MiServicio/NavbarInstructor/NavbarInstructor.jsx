import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarInstructor( toggleSidebar ) {
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
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark" style={{ backgroundColor: '#1E1B4B' }}>
      <div className="container-fluid">
        <button
          className="btn d-flex align-items-center"
          onClick={handleToggleMenu}
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
          {!isMenuVisible && <span className="ms-2">Menú</span>}
        </button>

        <h1 className="navbar-brand mx-auto" style={{ fontSize: '3vw' }}>
          Harp
        </h1>

        <select className="form-select" style={{ width: '120px' }}>
          <option value="service1">Serv. 1</option>
          <option value="service2">Serv. 2</option>
          <option value="service3">Serv. 3</option>
        </select>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
