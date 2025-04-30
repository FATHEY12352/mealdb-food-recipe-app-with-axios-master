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
    const scrollListener = () => handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const goToProfile = () => {
    navigate('/profile');
  };

  // --- أنماط مقترحة للروابط كأزرار (يمكن نقلها لـ Header.scss) ---
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
      // أضف تأثير hover في SCSS:
      // &:hover { background-color: white; color: var(--clr-orange); }
    },
    userProfileButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      marginRight: '20px',
      padding: '0', // إزالة أي padding افتراضي للزر
      display: 'flex', // لترتيب الأيقونة والنص
      alignItems: 'center' // لمحاذاة الأيقونة والنص عموديًا
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
              // --- المستخدم المسجل دخوله ---
              <button
                type="button"
                className='user-profile-btn flex align-center fs-14 fw-5' // يمكنك استخدام هذا الكلاس للتنسيق في SCSS
                onClick={goToProfile}
                title="View Profile"
                style={styles.userProfileButton} // تطبيق الأنماط المضمنة
              >
                <IoMdPerson size={20} style={{ marginRight: '5px' }} />
                <span>Welcome, {currentUser.displayName || currentUser.email}</span>
              </button>
            ) : (
              // --- المستخدم غير المسجل دخوله ---
              <div className='auth-links flex align-center' style={{ marginRight: '15px' }}>
                <Link
                  to="/login"
                  className='auth-link-btn' // استخدم هذا الكلاس للتنسيق في SCSS
                  style={styles.authButton} // تطبيق الأنماط المضمنة
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className='auth-link-btn' // استخدم هذا الكلاس للتنسيق في SCSS
                  style={{...styles.authButton, marginLeft: '10px'}} // إضافة هامش أيسر
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