import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Button,
  Row,
  Col
} from "antd";
import {
  AppstoreAddOutlined,
  CommentOutlined,
  UserOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // 🔥 Import Firebase Auth

// Import Firebase service functions
import {
  fetchTotalRecipes,
  fetchTotalUsers,
  fetchPendingRecipes,
  fetchActiveUsers
} from "./firebaseService";

const { Header, Sider, Content } = Layout;

const AdminPanel = () => {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingRecipes, setPendingRecipes] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const navigate = useNavigate(); // 🧭 Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalRecipesCount = await fetchTotalRecipes();
        setTotalRecipes(totalRecipesCount);

        const totalUsersCount = await fetchTotalUsers();
        setTotalUsers(totalUsersCount);

        const pendingRecipesCount = await fetchPendingRecipes();
        setPendingRecipes(pendingRecipesCount);

        const activeUsersCount = await fetchActiveUsers();
        setActiveUsers(activeUsersCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle menu item clicks for redirection
  const handleMenuClick = (key) => {
    if (key === "1") {
      navigate("/admin/manage-recipes");
    } else if (key === "2") {
      navigate("/admin/moderate-comments");
    } else if (key === "3") {
      navigate("/admin/manage-users");
    } else if (key === "4") {
      navigate("/admin/analytics");
    }
  };

  // 🔐 Logout function
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/login"); // redirect to login page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="1" icon={<AppstoreAddOutlined />}>
            Manage Recipes
          </Menu.Item>
          <Menu.Item key="2" icon={<CommentOutlined />}>
            Moderate Comments
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Manage Users
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>
            Analytics
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Admin Dashboard
          </div>
          <div>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card title="Total Recipes" bordered={false}>
                  <Statistic value={totalRecipes} prefix="📖" />
                </Card>
              </Col>
              <Col span={6}>
                <Card title="Total Users" bordered={false}>
                  <Statistic value={totalUsers} prefix="👥" />
                </Card>
              </Col>
              <Col span={6}>
                <Card title="Pending Recipes" bordered={false}>
                  <Statistic value={pendingRecipes} prefix="⏳" />
                </Card>
              </Col>
              <Col span={6}>
                <Card title="Active Users" bordered={false}>
                  <Statistic value={activeUsers} prefix="🔥" />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: "30px" }}>
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
