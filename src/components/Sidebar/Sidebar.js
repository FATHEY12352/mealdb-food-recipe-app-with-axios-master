// src/components/Sidebar/Sidebar.js
import React from 'react';
import { useSidebarContext } from '../../context/sidebarContext';
import { ImCancelCircle} from "react-icons/im";
import "./Sidebar.scss"; // تأكد من وجود هذا الملف
import { Link, useNavigate } from "react-router-dom";
import { useMealContext } from '../../context/mealContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { isSidebarOpen, closeSidebar} = useSidebarContext();
    const { categories } = useMealContext();
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
      closeSidebar();
      try {
        await logout();
        console.log("User logged out from Sidebar");
        // navigate('/'); // اختياري: توجيه للصفحة الرئيسية
      } catch (error) {
        console.error("Failed to log out:", error);
      }
    };

    // --- نمط بسيط لزر تسجيل الخروج ليبدو كرابط (يفضل نقله لـ Sidebar.scss) ---
    const logoutButtonStyle = {
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      padding: '0',
      textAlign: 'inherit',
      width: '100%',
      fontFamily: 'inherit',
      fontSize: 'inherit', // يرث حجم خط الروابط الأخرى
      lineHeight: 'inherit' // يرث ارتفاع سطر الروابط الأخرى
      // أضف تأثير hover في SCSS:
      // &:hover { color: var(--clr-orange); }
    };
    // --- نهاية الأنماط ---

    return (
        <nav className={`sidebar ${isSidebarOpen ? 'sidebar-visible' : ""}`}>
            <button type = "button" className='navbar-hide-btn' onClick={closeSidebar}>
                <ImCancelCircle size = {24} />
            </button>

            <div className='side-content'>
                <ul className='side-nav'>
                    {/* Category Links */}
                    {
                       categories?.map(category => (
                            <li className='side-item' key = {category.idCategory}>
                                <Link
                                  to = {`/meal/category/${category.strCategory}`}
                                  className='side-link ls-1 fs-13'
                                  onClick={closeSidebar}
                                >
                                    {category.strCategory}
                                </Link>
                            </li>
                        ))
                    }

                    {/* Conditional Logout Button */}
                    {currentUser && (
                      // استخدم نفس كلاس العنصر الآخر أو كلاس مخصص
                      <li className='side-item logout-item'>
                        <button
                          type="button"
                          // يمكنك استخدام نفس الكلاسات + كلاس إضافي إذا أردت
                          className='side-link ls-1 fs-13 btn-logout'
                          style={logoutButtonStyle} // تطبيق النمط المضمن
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Sidebar;