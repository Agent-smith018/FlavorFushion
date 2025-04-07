import React, { useEffect, useState } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const notificationRef = ref(db, `notifications/${userId}`);
        const followersRef = ref(db, `followers/${userId}`);
        const followingRef = ref(db, `following/${userId}`);
        const recipesRef = ref(db, `recipes/${userId}`);

        const [userSnapshot, notificationSnapshot, followersSnapshot, followingSnapshot, recipesSnapshot] = await Promise.all([
          get(userRef),
          get(notificationRef),
          get(followersRef),
          get(followingRef),
          get(recipesRef)
        ]);

        if (userSnapshot.exists()) {
          const userInfo = userSnapshot.val();
          setUserData(userInfo);
          setImageUrl(userInfo.profilePic || '/default-avatar.png');
        }

        if (notificationSnapshot.exists()) {
          setNotifications(Object.values(notificationSnapshot.val()));
        }

        if (followersSnapshot.exists()) {
          setFollowers(Object.values(followersSnapshot.val()));
        }

        if (followingSnapshot.exists()) {
          setFollowing(Object.values(followingSnapshot.val()));
        }

        if (recipesSnapshot.exists()) {
          setRecipes(Object.values(recipesSnapshot.val()));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth.currentUser?.uid, navigate]);

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const filePath = `profilePictures/${auth.currentUser.uid}/${file.name}`;
        const storageReference = storageRef(storage, filePath);
        const uploadTask = uploadBytesResumable(storageReference, file);

        uploadTask.on(
          'state_changed',
          null,
          (error) => console.error('Error uploading image:', error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref());
            setImageUrl(downloadURL);

            // Update Realtime DB with profilePic URL
            const db = getDatabase();
            const userRef = ref(db, `users/${auth.currentUser.uid}`);
            await update(userRef, { profilePic: downloadURL });
            console.log('Profile picture URL saved to database');
          }
        );
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      try {
        const password = prompt('Enter your password to confirm deletion:');
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        alert('Your account has been deleted.');
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out: ' + error.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={imageUrl}
          alt="Profile"
          className="profile-img"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
        <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
        <div className="profile-info">
          <h2>{userData?.name || 'Anonymous User'}</h2>
          <p>{auth.currentUser?.email || 'No Email Provided'}</p>
        </div>
      </div>
      <div className="action-buttons">
        <button className="edit-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
      <div className="stats-section">
        <h3>Followers</h3>
        <p>{followers.length} Followers</p>
        <h3>Following</h3>
        <p>{following.length} Following</p>
      </div>
      <div className="notifications-section">
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          <ul>{notifications.map((note, index) => <li key={index}>{note.message}</li>)}</ul>
        ) : (
          <p>No notifications yet.</p>
        )}
      </div>
      <div className="recent-recipes-section">
        <h3>Your Recent Recipes</h3>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <h4>{recipe.name}</h4>
                <p>{recipe.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
