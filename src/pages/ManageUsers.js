import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { ref, set } from "firebase/database";
import { rtdb } from "../firebase";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);

  useEffect(() => {
    // Fetch users and banned users from Firebase
    const fetchUsers = async () => {
      try {
        // Fetching active users from the "users" node in Firebase
        const usersSnapshot = await ref(rtdb, "users").get();
        const usersData = usersSnapshot.val();

        if (usersData) {
          console.log("Active Users Data:", usersData); // Debugging log
          setUsers(
            Object.entries(usersData).map(([id, userData]) => ({
              id, // Use the user ID as key
              ...userData,
            }))
          );
        } else {
          console.log("No active users found"); // Debugging log
        }

        // Fetching banned users from the "bannedUsers" node in Firebase
        const bannedUsersSnapshot = await ref(rtdb, "bannedUsers").get();
        const bannedData = bannedUsersSnapshot.val();

        if (bannedData) {
          console.log("Banned Users Data:", bannedData); // Debugging log
          setBannedUsers(
            Object.entries(bannedData).map(([id, userData]) => ({
              id, // Use the user ID as key
              ...userData,
            }))
          );
        } else {
          console.log("No banned users found"); // Debugging log
        }

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = (userId) => {
    try {
      // Add user to banned list
      const bannedUserRef = ref(rtdb, `bannedUsers/${userId}`);
      set(bannedUserRef, { banned: true });

      // Optionally, remove the user from the active users list
      const userRef = ref(rtdb, `users/${userId}`);
      set(userRef, null); // Remove user from active list

      alert("User banned successfully!");
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Error banning user. Please try again.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "name", // Display user 'name' instead of 'username'
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone", // Display user 'phone'
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button onClick={() => handleBanUser(record.id)}>Ban User</Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Users</h1>

      <h2>Banned Users</h2>
      <Table
        dataSource={bannedUsers}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <h2>Active Users</h2>
      {users.length === 0 ? (
        <p>No active users found.</p>
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default ManageUsers;
