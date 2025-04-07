import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useParams, Link } from 'react-router-dom';

const OtherUserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const recipesRef = ref(db, `recipes/${userId}`);
        const followersRef = ref(db, `followers/${userId}`);
        const currentUserId = auth.currentUser?.uid;

        const [userSnapshot, recipesSnapshot, followersSnapshot] = await Promise.all([
          get(userRef),
          get(recipesRef),
          get(followersRef)
        ]);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.val());
        }

        if (recipesSnapshot.exists()) {
          setUploadedRecipes(Object.values(recipesSnapshot.val()));
        }

        if (followersSnapshot.exists()) {
          const followersData = followersSnapshot.val();
          setFollowersCount(Object.keys(followersData).length);
          setIsFollowing(followersData[currentUserId] !== undefined);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, auth.currentUser?.uid]);

  const handleFollowToggle = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    try {
      const db = getDatabase();
      const followersRef = ref(db, `followers/${userId}/${currentUserId}`);
      const followingRef = ref(db, `following/${currentUserId}/${userId}`);

      if (isFollowing) {
        await update(followersRef, null);
        await update(followingRef, null);
        setIsFollowing(false);
        setFollowersCount(followersCount - 1);
      } else {
        await update(followersRef, { followedAt: new Date().toISOString() });
        await update(followingRef, { followedAt: new Date().toISOString() });
        setIsFollowing(true);
        setFollowersCount(followersCount + 1);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (!userData) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h1>{userData.name}'s Profile</h1>
      <img src={userData.profilePic || '/default-avatar.png'} alt="Profile" width={150} />
      <p>Email: {userData.email}</p>
      <p>Followers: {followersCount}</p>
      <button onClick={handleFollowToggle}>{isFollowing ? 'Unfollow' : 'Follow'}</button>

      <h2>Uploaded Recipes</h2>
      <ul>
        {uploadedRecipes.map((recipe, index) => (
          <li key={index}>
            <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherUserProfile;
