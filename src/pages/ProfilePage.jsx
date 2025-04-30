// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'; // <-- Import useState and useEffect
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
// --- 1. Import Firestore functions and db ---
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy } from "firebase/firestore";
// --- 2. Import MealList component (assuming it can display meals based on passed data) ---
import MealList from '../components/Meal/MealList'; // <-- Adjust path if necessary
// --- 3. Import Loader component ---
import Loader from '../components/Loader/Loader'; // <-- Adjust path if necessary
// import './ProfilePage.scss'; // Your styles

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]); // <-- 4. State for saved recipes
  const [loadingFavorites, setLoadingFavorites] = useState(true); // <-- 5. State for loading favorites
  const [errorFavorites, setErrorFavorites] = useState(null); // <-- 6. State for errors

  // --- 7. useEffect to fetch saved recipes ---
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return; // Don't fetch if not logged in

      setLoadingFavorites(true); // Start loading
      setErrorFavorites(null);    // Reset errors
      const favorites = [];

      try {
        // Create a query to get all documents in the user's 'favorites' subcollection
        const favCollectionRef = collection(db, "users", currentUser.uid, "favorites");
        // Optional: Order by a field if you add one later (e.g., timestamp)
        // const q = query(favCollectionRef, orderBy("savedAt", "desc"));
        const querySnapshot = await getDocs(favCollectionRef); // Use getDocs with the collection reference

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          favorites.push({ ...doc.data(), id: doc.id }); // Add doc data and its ID
        });

        setSavedRecipes(favorites); // Update state with fetched recipes
        console.log("Fetched favorites:", favorites);

      } catch (error) {
        console.error("Error fetching favorite recipes: ", error);
        setErrorFavorites("Failed to load saved recipes. Please try again."); // Set error message
      } finally {
        setLoadingFavorites(false); // Stop loading regardless of success/failure
      }
    };

    fetchFavorites();
  }, [currentUser]); // Re-fetch if the user changes

  // --- [Protected route logic remains the same] ---
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // --- [End protected route logic] ---

  // --- [Styles remain the same] ---
  const styles = {
    pageContent: { /* ... as before ... */ backgroundColor: '#2c2c2c', color: '#e0e0e0', padding: '30px 40px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', textAlign: 'right', maxWidth: '800px', margin: 'auto' },
    section: { /* ... as before ... */ marginBottom: '40px' },
    sectionTitle: { /* ... as before ... */ color: '#ff8a65', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #ff8a65', fontSize: '28px', fontWeight: '600' },
    infoGrid: { /* ... as before ... */ display: 'grid', gap: '20px' },
    infoItem: { /* ... as before ... */ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #444' },
    label: { /* ... as before ... */ fontWeight: 'bold', color: '#bdbdbd', fontSize: '16px' },
    value: { /* ... as before ... */ color: '#f5f5f5', fontWeight: '500', fontSize: '16px' },
    savedListContainer: { /* Renamed for clarity */ minHeight: '150px' }, // Container for loader/error/list
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '20px' },
    noFavoritesMessage: { color: '#aaa', textAlign: 'center', fontStyle: 'italic', marginTop: '20px' }
  };
  // --- [End styles] ---

  return (
    <main className='main-content py-5'>
      <div className='container'>
        <div className='profile-page-content' style={styles.pageContent}>

          {/* --- [User Details Section remains the same] --- */}
          <section className='user-details-section' style={styles.section}>
            <h2 className='section-title' style={styles.sectionTitle}>Profile</h2>
            <div className='user-info-grid' style={styles.infoGrid}>
              <div style={styles.infoItem}> <strong style={styles.label}>Name:</strong> <span style={styles.value}>{currentUser.displayName || 'Not set'}</span> </div>
              <div style={styles.infoItem}> <strong style={styles.label}>Email:</strong> <span style={styles.value}>{currentUser.email}</span> </div>
            </div>
          </section>
          {/* --- [End User Details Section] --- */}


          {/* --- 8. Saved Recipes Section - Updated Display Logic --- */}
          <section className='saved-recipes-section' style={styles.section}>
            <h2 className='section-title' style={styles.sectionTitle}>Saved Recipes</h2>
            <div className='saved-recipes-list' style={styles.savedListContainer}>
              {loadingFavorites ? ( // Show loader while fetching
                <Loader />
              ) : errorFavorites ? ( // Show error message if fetching failed
                <p style={styles.errorMessage}>{errorFavorites}</p>
              ) : savedRecipes.length > 0 ? ( // If loading is done, no error, and recipes exist
                // Pass the saved recipes to MealList
                // IMPORTANT: MealList needs to accept and display meals in this format:
                // [{ id: '52768', strMeal: 'Apple Frangipan Tart', strMealThumb: '...', ... }, ...]
                <MealList meals={savedRecipes} />
              ) : ( // If loading is done, no error, but no recipes saved
                <p style={styles.noFavoritesMessage}>You haven't saved any recipes yet.</p>
              )}
            </div>
          </section>
          {/* --- [End Saved Recipes Section] --- */}

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;