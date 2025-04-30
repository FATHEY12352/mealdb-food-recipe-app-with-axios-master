// src/components/Header/SearchForm.js
import React, { useState } from 'react'; // إزالة useEffect
import "./Header.scss"; // تأكد أن هذا المسار صحيح
import { BsSearch } from "react-icons/bs";
import { useMealContext } from '../../context/mealContext';
import { useNavigate } from 'react-router-dom';
import { startFetchMealsBySearch } from '../../actions/mealsActions';

const SearchForm = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // --- تم حذف حالة errorMsg ---
  // const [errorMsg, setErrorMsg] = useState("");
  const { dispatch } = useMealContext(); // إزالة meals غير المستخدمة

  const handleSearchTerm = (e) => {
    e.preventDefault();
    // يمكنك تبسيط الشرط قليلًا
    const cleanedValue = e.target.value.replace(/[^\w\s]/gi, "");
    if (cleanedValue.length !== 0) {
      setSearchTerm(e.target.value); // ما زلنا نحدث searchTerm بالقيمة الأصلية
      // --- تم حذف استدعاء setErrorMsg("") ---
    } else {
      // --- تم حذف استدعاء setErrorMsg(...) ---
      // يمكنك إضافة console.log هنا إذا أردت معرفة متى يكون الإدخال غير صالح
      // console.log("Invalid search term entered");
    }
  };

  const handleSearchResult = (e) => {
    e.preventDefault();
    // منع البحث إذا كان searchTerm فارغًا (اختياري ولكن جيد)
    if (searchTerm.trim() === "") {
      return; // لا تفعل شيئًا إذا كان حقل البحث فارغًا
    }
    navigate("/");
    console.log("SEARCHING FOR:", searchTerm);
    startFetchMealsBySearch(dispatch, searchTerm);
  };

  return (
    // إضافة التحقق من onSubmit أيضًا لمنع الإرسال الفارغ
    <form className='search-form flex align-center' onSubmit={handleSearchResult}>
      <input
        type="text"
        className='form-control-input text-dark-gray fs-15'
        placeholder='Search recipes here ...'
        value={searchTerm} // التحكم في القيمة
        onChange={handleSearchTerm}
      />
      <button type="submit" className='form-submit-btn text-white text-uppercase fs-14'>
        <BsSearch className='btn-icon' size={20} />
      </button>
      {/* تم حذف عرض errorMsg من هنا */}
    </form>
  );
}

export default SearchForm;