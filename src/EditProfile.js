import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { getDatabase, ref, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || "");
          setEmail(data.email || "");
          setImageUrl(data.profilePic || "/default-avatar.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth.currentUser, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      console.error("No user logged in");
      return;
    }

    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    try {
      // Update Firebase Authentication
      await updateProfile(auth.currentUser, { displayName: name });
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Upload profile picture if changed
      let uploadedImageUrl = imageUrl;
      if (image) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `profilePictures/${userId}`);
        const uploadTask = uploadBytesResumable(storageReference, image);
        await uploadTask;
        uploadedImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(uploadedImageUrl);
      }

      // Update Firebase Database
      await update(userRef, {
        name,
        email,
        profilePic: uploadedImageUrl,
      });

      alert("Profile updated successfully!");
      navigate("/profile"); // Redirect to profile page
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-picture">
          <img src={imageUrl} alt="Profile" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="input-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <button className="cancel-btn" onClick={() => navigate("/profile")}>
        Cancel
      </button>
    </div>
  );
};

export default EditProfile;
