import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import GoogleIcon from '../../assets/images/search.png'; 


const GoogleSignInButton = ({ onLogin }) => {
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');
      
      // Step 1: Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log('Firebase auth successful:', firebaseUser.email);
      
      // Step 2: Extract user details from Firebase
      const userData = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        firebaseUid: firebaseUser.uid,
        photoURL: firebaseUser.photoURL,
      };
      console.log('User data from Firebase:', userData);

      // Step 3: Send to WordPress to create/sync WooCommerce customer
      try {
        const res = await axios.post(
          "https://db.store1920.com/wp-json/custom/v1/google-login",
          {
            email: userData.email,
            name: userData.name,
            firebase_uid: userData.firebaseUid,
            photo_url: userData.photoURL,
          }
        );
        console.log('WordPress response:', res.data);

        const userInfo = {
          id: res.data.id || res.data.user_id,
          name: userData.name,
          email: userData.email,
          token: res.data.token,
          image: userData.photoURL, // Profile photo for navbar
          photoURL: userData.photoURL,
          firebaseUid: userData.firebaseUid,
        };

        console.log('User info being saved:', userInfo);
        console.log('Profile photo URL:', userData.photoURL);

        // Save to localStorage
        localStorage.setItem("token", userInfo.token);
        localStorage.setItem("userId", userInfo.id);
        localStorage.setItem("email", userInfo.email);

        // Update AuthContext
        login(userInfo);

        // Notify parent component
        onLogin?.(userInfo);
        
        console.log('Login successful!');
      } catch (wpError) {
        console.error('WordPress sync error:', wpError);
        
        // Even if WordPress fails, we can still log in with Firebase data
        const userInfo = {
          id: userData.firebaseUid,
          name: userData.name,
          email: userData.email,
          token: 'firebase-only', // Temporary token
          image: userData.photoURL, // Profile photo for navbar
          photoURL: userData.photoURL,
          firebaseUid: userData.firebaseUid,
        };

        localStorage.setItem("userId", userInfo.id);
        localStorage.setItem("email", userInfo.email);
        localStorage.setItem("token", userInfo.token);

        login(userInfo);
        onLogin?.(userInfo);
        
        console.log('Logged in with Firebase only (WordPress sync failed)');
      }
      
    } catch (err) {
      console.error("Google sign-in error details:", err);
      
      let errorMessage = "Google sign-in failed. ";
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in cancelled.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up blocked. Please allow pop-ups for this site.";
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <button className="google-signin-btn" onClick={handleGoogleSignIn}>
      <img
        src={GoogleIcon}
        alt="Google Sign-In"
        width={24}
        height={24}
        style={{ marginRight: "8px" }}
      />
    </button>
  );
};

export default GoogleSignInButton;
