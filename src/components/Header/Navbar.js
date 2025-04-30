// src/components/Header/Navbar.js
import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss"; // تأكد من أن هذا الملف موجود ويحتوي على تنسيقات Navbar الأساسية
import { MdFoodBank} from "react-icons/md";
import { IoMdMenu, IoMdPerson } from "react-icons/io";
import { useSidebarContext } from '../../context/sidebarContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const {openSidebar} = useSidebarContext();
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    const offset = window.scrollY;
    if(offset > 60){
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    // --- تم حذف السطر التالي لأنه غير مستخدم ---
    // const scrollListener = () => handleScroll();

    // استخدام handleScroll مباشرة
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []); // مصفوفة الاعتماديات فارغة ليعمل مرة واحدة

  const goToProfile = () => {
    navigate('/profile');
  };

  // --- [أنماط styles تبقى كما هي] ---
  const styles = {
    authButton: {
      color: 'white',
      textDecoration: 'none',
      padding: '6px 12px',
      border: '1px solid white',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      fontSize: '13px',
      fontWeight: '500'
    },
    userProfileButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      marginRight: '20px',
      padding: '0',
      display: 'flex',
      alignItems: 'center'
    }
  };
  // --- نهاية الأنماط ---

  return (
    <nav className={`navbar bg-orange flex align-center ${scrolled ? 'scrolled': ""}`}>
      <div className='container w-100'>
        <div className='navbar-content flex align-center justify-between text-white'>
          <Link to = "/" className='navbar-brand fw-3 fs-22 flex align-center'>
            <MdFoodBank />
            <span className='navbar-brand-text fw-7'>FastEat.</span>
          </Link>

          <div className='navbar-controls flex align-center'>
            {currentUser ? (
              <button
                type="button"
                className='user-profile-btn flex align-center fs-14 fw-5'
                onClick={goToProfile}
                title="View Profile"
                style={styles.userProfileButton}
              >
                <IoMdPerson size={20} style={{ marginRight: '5px' }} />
                <span>Welcome, {currentUser.displayName || currentUser.email}</span>
              </button>
            ) : (
              <div className='auth-links flex align-center' style={{ marginRight: '15px' }}>
                <Link
                  to="/login"
                  className='auth-link-btn'
                  style={styles.authButton}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className='auth-link-btn'
                  style={{...styles.authButton, marginLeft: '10px'}}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button type = "button" className='navbar-show-btn text-white' onClick={openSidebar}>
              <IoMdMenu size = {27} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;