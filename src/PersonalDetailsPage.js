import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database"; // Import set to save data in DB
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Import for profile picture handling



const PersonalDetailsPage = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    address: "",
    phone: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      // Check if personal details already exist in the database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Redirect to dashboard if details already filled
            navigate("/dashboard");
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [navigate, user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profilePic: file,
      }));
    }
  };

  // Handle form submission to save personal details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset any previous errors

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      let profilePicURL = userDetails.profilePicURL || ""; // Keep old URL if no new picture is provided
      if (userDetails.profilePic) {
        // Upload new profile picture if selected
        const storage = getStorage();
        const profilePicRef = storageRef(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(profilePicRef, userDetails.profilePic);
        profilePicURL = await getDownloadURL(profilePicRef);
      }

      // Create user data to be stored
      const userData = {
        name: userDetails.name,
        dob: userDetails.dob,
        address: userDetails.address,
        phone: userDetails.phone,
        profilePic: profilePicURL || "", // Store the profile picture URL (or empty string if no picture)
      };

      // Save or update the user's personal details in the Realtime Database
      await set(userRef, userData);

      setLoading(false);
      navigate("/dashboard"); // Redirect to the dashboard after saving details
    } catch (error) {
      setLoading(false);
      setError("Failed to save details: " + error.message);
    }
  };

  return (
    <div>
      <h2>Fill Your Personal Details</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={userDetails.dob}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="text"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Profile Picture:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Details"}
        </button>
      </form>
    </div>
  );
};

export default PersonalDetailsPage;
