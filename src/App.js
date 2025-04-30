// src/App.jsx (أو .js)
import './App.scss';

// react router dom
import {
  BrowserRouter, // أبقينا عليه كغلاف خارجي
  Routes,
  Route
} from "react-router-dom";

// --- استيراد الـ Providers ---
import { AuthProvider } from './context/AuthContext';     // <-- أضفنا سياق المصادقة
import { SidebarProvider } from './context/sidebarContext'; // <-- أضفنا سياق الشريط الجانبي
import { MealProvider } from './context/mealContext';     // <-- أضفنا سياق الوجبات

// pages (استخدام الأسماء من الكود الأصلي مع تعديل المسار إذا لزم الأمر)
import { Home, MealDetails, Error, Category } from "./pages/index"; // تأكد من أن index.js يصدر الصفحات بالأسماء الصحيحة
import SignupPage from './pages/Auth/SignupPage';     // <-- استيراد صفحة التسجيل (تأكد من المسار)
import LoginPage from './pages/Auth/LoginPage';       // <-- استيراد صفحة الدخول (تأكد من المسار)


// components
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ProfilePage from './pages/ProfilePage'; // <-- 1. استيراد صفحة الملف الشخصي

function App() {
  return (
    <BrowserRouter> {/* BrowserRouter هو الغلاف الخارجي */}
      {/* ثم نضع الـ Providers لتغليف كل شيء تحته */}
      <AuthProvider>
        <SidebarProvider>
          <MealProvider>

            {/* الهيكل البصري: الهيدر والشريط الجانبي يظهران دائمًا */}
            <Header />
            <Sidebar />

            {/* المحتوى الرئيسي الذي يتغير بناءً على المسار */}
            <Routes>
              {/* المسارات الأصلية */}
              <Route path="/" element={<Home />} />
              <Route path="/meal/:id" element={<MealDetails />} />
              <Route path="/meal/category/:name" element={<Category />} />

              {/* المسارات الجديدة للمصادقة */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} /> {/* <-- 2. إضافة مسار الملف الشخصي */}


              {/* مسار الخطأ */}
              <Route path="*" element={<Error />} />
            </Routes>

          </MealProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;