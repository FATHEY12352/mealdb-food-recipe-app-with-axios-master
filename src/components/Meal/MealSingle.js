// src/components/Meal/MealSingle.jsx
import React from 'react';
import "./Meal.scss"; // تأكد من وجود هذا الملف وتنسيقاته
import { FaUtensilSpoon } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BiChevronsRight } from "react-icons/bi";
import { AiOutlineCheckSquare } from 'react-icons/ai';
// --- استيراد أيقونات القلب ---
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// --- قبول الـ Props الجديدة في تعريف المكون ---
const MealSingle = ({meal, currentUser, isSaved, isSaving, handleToggleSave}) => {

  // --- معالجة tags و instructions ---
  let tags = meal?.tags?.split(',');
  let instructions = meal?.instructions?.split('\r\n');
  instructions = instructions?.filter(instruction => instruction?.length > 1);
  // --- نهاية المعالجة ---

  // --- أنماط زر الحفظ (يفضل نقلها لملف Meal.scss) ---
  const styles = {
      saveButton: {
        background: 'none', // بدون خلفية
        border: 'none', // بدون حدود
        color: '#ff6f61', // لون برتقالي مشابه للعنوان أو حسب تصميمك
        cursor: 'pointer', // مؤشر اليد
        padding: '0', // إزالة الحشو الافتراضي
        marginLeft: '15px', // مسافة بين الزر والعنوان
        display: 'inline-flex', // مهم لمحاذاة الأيقونة
        alignItems: 'center', // محاذاة الأيقونة عموديا
        verticalAlign: 'middle' // محاذاة الزر مع وسط النص
      },
      // نمط للزر عند تعطيله
      disabledSaveButton: {
        cursor: 'not-allowed',
        opacity: 0.6
      },
      // حاوية العنوان والزر
      titleContainer: {
          display: 'flex',
          alignItems: 'center', // محاذاة العنوان والزر عموديًا
          marginBottom: '15px', // مسافة أسفل العنوان والزر
          flexWrap: 'wrap' // السماح بالالتفاف إذا كان العنوان طويلاً جدًا
      },
      // تعديل بسيط لهامش العنوان ليتناسب مع الزر
      titleStyle: {
          margin: '0', // إزالة أي هوامش افتراضية من h3
          marginRight: 'auto' // يدفع الزر إلى اليمين (إذا كانت اللغة الإنجليزية) أو اليسار (إذا كانت العربية مع RTL)
                                // يمكنك تعديل هذا ليتناسب مع التصميم المطلوب
      }
  };
  // --- نهاية الأنماط ---


  return (
    <div className='section-wrapper'>
      <div className='container'>
        {/* --- Breadcrumb --- */}
        <div className='breadcrumb bg-orange text-white'>
          <ul className='flex align-center my-2'>
            <li className='breadcrumb-item'> <Link to = "/" className='flex align-center'> <AiFillHome size = {22} /> </Link> </li>
            <li className='flex align-center mx-1'> <BiChevronsRight size = {23} /> </li>
            <li className='breadcrumb-item flex'> <span className='fs-15 fw-5 text-uppercase'>{meal?.title}</span> </li>
          </ul>
        </div>
        {/* --- نهاية Breadcrumb --- */}


        <div className='sc-title'>Meal Details</div>
        <section className='sc-details bg-white'>
          <div className='details-head grid'>
            <div className='details-img'>
              <img src = {meal?.thumbnail} alt = {meal?.title || 'Meal image'} className='img-cover' />
            </div>

            <div className='details-intro'>
              {/* --- حاوية العنوان والزر --- */}
              <div style={styles.titleContainer}>
                  <h3 className='title text-orange' style={styles.titleStyle}>{meal?.title}</h3>
                  {/* --- زر الحفظ --- */}
                  {currentUser && ( // اعرض الزر فقط للمستخدم المسجل
                    <button
                      onClick={handleToggleSave} // الدالة من الـ props
                      disabled={isSaving}     // حالة التعطيل من الـ props
                      className="btn-save-recipe-inline" // كلاس للتنسيق في SCSS
                      style={isSaving ? {...styles.saveButton, ...styles.disabledSaveButton} : styles.saveButton} // تطبيق الأنماط
                      title={isSaved ? "Remove from Favorites" : "Save to Favorites"} // التلميح من الـ props
                    >
                      {/* الأيقونة بناءً على isSaved من الـ props */}
                      {isSaving ? '...' : (isSaved ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />)}
                    </button>
                  )}
                  {/* --- نهاية زر الحفظ --- */}
              </div>
              {/* --- نهاية حاوية العنوان والزر --- */}


              {/* --- باقي تفاصيل الوجبة --- */}
               <div className='py-4'>
                 <div className='category flex align-center'>
                   <span className='text-uppercase fw-8 ls-1 my-1'>category:  </span>
                   <span className='text-uppercase ls-2'>{ meal?.category }</span>
                 </div>
                 <div className='source flex align-center'>
                   <span className='fw-7'>Source:  </span>
                   {/* إضافة تحقق إضافي لـ meal.source قبل استخدامه */}
                   <a href = {meal?.source} target="_blank" rel="noopener noreferrer">
                      {meal?.source ? (meal.source.length > 40 ? meal.source.substring(0, 40) + "..." : meal.source) : "Not found" }
                   </a>
                 </div>
               </div>
               {/* Tags */}
               { meal?.tags && meal.tags.length > 0 && ( // التحقق من وجود tags قبل عرض القسم
                   <div className='tags flex align-start flex-wrap'>
                     <h6 className='fs-16'>Tags:</h6>
                     <ul className='flex align-center flex-wrap'>
                         { tags?.map((tag, idx) => tag && <li key = {idx} className = "fs-14">{tag.trim()}</li>) }
                     </ul>
                   </div>
               )}
               {/* Ingredients */}
               { meal?.ingredients && meal.ingredients.length > 0 && ( // التحقق من وجود ingredients
                   <div className='ingredients my-5 px-3 py-3'>
                     <h6 className='fs-16 text-white'>Ingredients</h6>
                     <ul className='grid'>
                         { meal.ingredients.map((ingredient, idx) => (
                           <li key = {idx} className = "flex align-center">
                             <span className='li-dot'>{idx + 1}</span>
                             <span className='text-capitalize text-white fs-15'>{ingredient}</span>
                           </li>
                         )) }
                     </ul>
                   </div>
               )}
              {/* --- نهاية باقي تفاصيل الوجبة --- */}
            </div>
          </div>

           {/* --- تفاصيل الجسم (Measures, Instructions) --- */}
          <div className='details-body'>
             {/* Measures */}
             { meal?.measures && meal.measures.length > 0 && ( // التحقق من وجود measures
                 <div className='measures my-4'>
                   <h6 className='fs-16'>Measure:</h6>
                   <ul className='grid'>
                       { meal.measures.map((measure, idx) => (
                         <li key = {idx} className = "fs-14 flex align-end">
                           <span className='li-icon fs-12 text-orange'> <FaUtensilSpoon /> </span>
                           <span className='li-text fs-15 fw-6 op-09'>{measure}</span>
                         </li>
                       )) }
                   </ul>
                 </div>
             )}
             {/* Instructions */}
             { instructions && instructions.length > 0 && ( // التحقق من وجود instructions
                 <div className='instructions my-4'>
                   <h6 className='fs-16'>Instructions:</h6>
                   <ul className='grid'>
                       { instructions.map((instruction, idx) => (
                         <li key = {idx} className = "fs-14">
                           <AiOutlineCheckSquare size = {18} className = "text-orange li-icon" />
                           <span className='li-text fs-16 fw-5 op-09'>{instruction}</span>
                         </li>
                       )) }
                   </ul>
                 </div>
             )}
           </div>
          {/* --- نهاية تفاصيل الجسم --- */}
        </section>
      </div>
    </div>
  );
}

export default MealSingle;