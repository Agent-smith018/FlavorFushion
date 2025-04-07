import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Row, Col, Card, Statistic, Spin } from "antd";
import { HeartOutlined, CommentOutlined, AppstoreAddOutlined, UserOutlined } from "@ant-design/icons"; // Add UserOutlined here

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const db = getDatabase();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true while data is being fetched
      const recipesRef = ref(db, "recipes");
      const usersRef = ref(db, "users");
      const commentsRef = ref(db, "comments");
      const likesRef = ref(db, "likes");

      let recipeCount = 0;
      let userCount = 0;
      let commentCount = 0;
      let likeCount = 0;

      // Fetch recipe count
      onValue(recipesRef, (snapshot) => {
        const data = snapshot.val();
        recipeCount = data ? Object.keys(data).length : 0;
        setAnalyticsData((prev) => ({ ...prev, recipeCount }));
      });

      // Fetch user count
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        userCount = data ? Object.keys(data).length : 0;
        setAnalyticsData((prev) => ({ ...prev, userCount }));
      });

      // Fetch comment count
      onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        commentCount = data ? Object.keys(data).length : 0;
        setAnalyticsData((prev) => ({ ...prev, commentCount }));
      });

      // Fetch like count
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        likeCount = data ? Object.keys(data).length : 0;
        setAnalyticsData((prev) => ({ ...prev, likeCount }));
      });

      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, [db]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Analytics Dashboard</h2>
      
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
          <p>Loading analytics...</p>
        </div>
      ) : (
        <Row gutter={16}>
          {/* Total Recipes */}
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Recipes"
                value={analyticsData.recipeCount}
                prefix={<AppstoreAddOutlined />}
                valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          {/* Total Users */}
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={analyticsData.userCount}
                prefix={<UserOutlined />}
                valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          {/* Total Comments */}
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Comments"
                value={analyticsData.commentCount}
                prefix={<CommentOutlined />}
                valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          {/* Total Likes */}
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Likes"
                value={analyticsData.likeCount}
                prefix={<HeartOutlined />}
                valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Analytics;
