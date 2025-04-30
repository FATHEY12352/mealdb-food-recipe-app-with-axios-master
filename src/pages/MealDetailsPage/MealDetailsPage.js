// src/pages/MealDetailsPage/MealDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./MealDetailsPage.scss";
import MealSingle from "../../components/Meal/MealSingle"; // <-- المكون الذي سيعرض الزر
import { useMealContext } from '../../context/mealContext';
import { useAuth } from '../../context/AuthContext';
import { startFetchSingleMeal } from '../../actions/mealsActions';
import Loader from '../../components/Loader/Loader';
import { db } from '../../firebase/config';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
// --- إزالة استيراد أيقونات القلب من هنا ---
// import { FaHeart, FaRegHeart } from 'react-icons/fa';


const MealDetailsPage = () => {
  const { id } = useParams();
  const { dispatch, meal, mealLoading } = useMealContext();
  const { currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- [useEffect للتحقق من الحفظ يبقى كما هو] ---
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!currentUser || !id) return; // إضافة تحقق من وجود id
      const favRef = doc(db, "users", currentUser.uid, "favorites", id);
      try {
        const docSnap = await getDoc(favRef);
        setIsSaved(docSnap.exists());
      } catch (error) {
        console.error("Error checking save status:", error);
      }
    };
    checkSaveStatus();
  }, [currentUser, id]);

  // --- [دالة handleToggleSave تبقى كما هي] ---
  const handleToggleSave = async () => {
    if (!currentUser) {
      alert("Please log in to save recipes.");
      return;
    }
    if (isSaving || !singleMeal.id) return; // إضافة تحقق من وجود singleMeal.id

    setIsSaving(true);
    // تأكد من أن singleMeal معرفة قبل استخدامها هنا
    const mealDataToSave = {
        idMeal: singleMeal.id,
        strMeal: singleMeal.title,
        strMealThumb: singleMeal.thumbnail,
        strCategory: singleMeal.category
    };
    const favRef = doc(db, "users", currentUser.uid, "favorites", mealDataToSave.idMeal); // استخدام idMeal الصحيح

    try {
      if (isSaved) {
        await deleteDoc(favRef);
        setIsSaved(false);
      } else {
        await setDoc(favRef, mealDataToSave);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save state:", error);
      alert("An error occurred while saving/unsaving the recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- [useEffect لجلب الوجبة و [كود معالجة بيانات الوجبة] يبقيان كما هما] ---
  useEffect(() => {
    if(id) { // تحقق من وجود id قبل الجلب
        startFetchSingleMeal(dispatch, id);
    }
  }, [id, dispatch]);

  let ingredientsArr = [], measuresArr = [], singleMeal = {};
  if(meal && meal?.length > 0){
    for(let props in meal[0]){
      if(props.includes('strIngredient')){ if(meal[0][props]) ingredientsArr.push(meal[0][props]); }
      if(props.includes('strMeasure')){ if(meal[0][props] && meal[0][props].length > 1){ measuresArr.push(meal[0][props]); } }
    }
    singleMeal = {
      id: meal[0]?.idMeal,
      title: meal[0]?.strMeal,
      category: meal[0]?.strCategory,
      area: meal[0]?.strArea,
      thumbnail: meal[0]?.strMealThumb,
      instructions: meal[0]?.strInstructions,
      source: meal[0]?.strSource,
      tags: meal[0]?.strTags,
      youtube: meal[0]?.strYoutube,
      ingredients: ingredientsArr,
      measures: measuresArr
    }
  }
  // --- [نهاية كود معالجة بيانات الوجبة] ---

  return (
    <main className='main-content bg-whitesmoke'>
      { mealLoading ? <Loader /> :
        // --- تعديل: التأكد من وجود singleMeal.id قبل تمريره ---
        (singleMeal.id) ? (
          // --- حذف الزر من هنا ---
          // <div className="meal-details-content"> {/* لا حاجة لهذا الغلاف الإضافي هنا */}
            <MealSingle
              meal = {singleMeal}
              // --- 1. تمرير الـ Props اللازمة لـ MealSingle ---
              currentUser={currentUser}
              isSaved={isSaved}
              isSaving={isSaving}
              handleToggleSave={handleToggleSave}
              // --- نهاية تمرير الـ Props ---
            />
          // </div>
        ) : (
          <div className="container text-center py-5">Meal details not found or still loading.</div> // رسالة أوضح
        )
      }
    </main>
  );
}

// --- حذف الأنماط الخاصة بالزر من هنا ---
// const styles = { ... };

export default MealDetailsPage; 