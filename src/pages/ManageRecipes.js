import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Button, Card, message, Modal, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [deleting, setDeleting] = useState(false); // Deleting state
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Selected recipe for deletion
  const db = getDatabase();

  useEffect(() => {
    const recipesRef = ref(db, "recipes");
    onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRecipes(Object.entries(data));
      }
      setLoading(false); // Stop loading when data is fetched
    });
  }, [db]);

  const deleteRecipe = async (recipeId) => {
    try {
      setDeleting(true); // Set deleting state to true
      await remove(ref(db, `recipes/${recipeId}`));
      message.success("Recipe deleted successfully!");
      setRecipes((prevRecipes) => prevRecipes.filter(([id]) => id !== recipeId)); // Remove deleted recipe from state
      setDeleting(false); // Set deleting state to false
    } catch (error) {
      message.error("Error deleting recipe. Please try again.");
      setDeleting(false);
    }
  };

  const showDeleteConfirm = (recipe) => {
    setSelectedRecipe(recipe);
    Modal.confirm({
      title: "Are you sure you want to delete this recipe?",
      content: `This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteRecipe(recipe[0]), // Call delete function on confirmation
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Manage Recipes</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
          <p>Loading recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <h3>No recipes available.</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {recipes.map(([id, recipe]) => (
            <Card
              key={id}
              title={recipe.title}
              extra={
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => showDeleteConfirm([id, recipe])}
                  loading={deleting}
                >
                  Delete
                </Button>
              }
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <p><strong>Description:</strong> {recipe.description}</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageRecipes;
