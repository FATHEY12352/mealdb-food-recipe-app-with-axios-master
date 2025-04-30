// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword, // لإنشاء حساب جديد
  signInWithEmailAndPassword,    // لتسجيل الدخول
  signOut,                       // لتسجيل الخروج
  onAuthStateChanged           // لمراقبة حالة المستخدم
} from "firebase/auth";
import { auth } from '../firebase/config'; // استيراد خدمة auth من ملف الإعداد

// 1. إنشاء السياق
const AuthContext = createContext();

// 3. إنشاء الموفر (Provider Component)
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // حالة لتخزين المستخدم الحالي (null يعني غير مسجل)
  const [loading, setLoading] = useState(true);       // حالة لمعرفة ما إذا كان يتم التحقق من المستخدم الأولي

  // دالة لإنشاء حساب جديد
  const signup = (email, password) => {
    // نُرجع Promise حتى نتمكن من التعامل مع النجاح/الفشل في المكون
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // دالة لتسجيل الدخول
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // دالة لتسجيل الخروج
  const logout = () => {
    return signOut(auth);
  };

  // 4. مراقبة تغييرات حالة المصادقة
  useEffect(() => {
    // onAuthStateChanged تُرجع دالة لإلغاء الاشتراك (unsubscribe)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // عندما يتغير المستخدم (تسجيل دخول أو خروج)، يتم استدعاء هذه الدالة
      console.log("Auth State Changed, user:", user); // للتحقق في الكونسول
      setCurrentUser(user); // تحديث الحالة بالمستخدم الحالي (أو null)
      setLoading(false);      // تم التحقق الأولي، إيقاف حالة التحميل
    });

    // دالة التنظيف: إلغاء الاشتراك عند إلغاء تحميل المكون لمنع تسرب الذاكرة
    return () => {
      unsubscribe();
    };
  }, []); // مصفوفة الاعتماديات فارغة ليعمل هذا مرة واحدة عند التحميل

  // 5. تجميع القيمة التي سيوفرها السياق
  const value = {
    currentUser, // المستخدم الحالي (أو null)
    signup,      // دالة إنشاء الحساب
    login,       // دالة تسجيل الدخول
    logout       // دالة تسجيل الخروج
  };

  // 6. عرض المكونات الأبناء داخل الموفر
  //    لا نعرض الأبناء إلا بعد التأكد من حالة المستخدم الأولية (لتجنب وميض الواجهة)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 2. إنشاء Hook مخصص لاستخدام السياق بسهولة
export const useAuth = () => {
  return useContext(AuthContext);
};