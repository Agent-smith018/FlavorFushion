import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Button, Card, message, Modal, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ModerateComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [deleting, setDeleting] = useState(false); // Deleting state
  const [selectedComment, setSelectedComment] = useState(null); // Selected comment for deletion
  const db = getDatabase();

  useEffect(() => {
    const commentsRef = ref(db, "comments");
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setComments(Object.entries(data));
      }
      setLoading(false); // Stop loading once comments are fetched
    });
  }, [db]);

  const deleteComment = async (commentId) => {
    try {
      setDeleting(true); // Set deleting state to true
      await remove(ref(db, `comments/${commentId}`));
      message.success("Comment deleted successfully!");
      setComments((prevComments) => prevComments.filter(([id]) => id !== commentId)); // Remove deleted comment from state
      setDeleting(false); // Set deleting state to false
    } catch (error) {
      message.error("Error deleting comment. Please try again.");
      setDeleting(false);
    }
  };

  const showDeleteConfirm = (comment) => {
    setSelectedComment(comment);
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      content: `This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteComment(comment[0]), // Call delete function on confirmation
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Moderate Comments</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
          <p>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <h3>No comments available.</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "20px" }}>
          {comments.map(([id, comment]) => (
            <Card
              key={id}
              title={`Comment by ${comment.userName || "Anonymous"}`}
              extra={
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => showDeleteConfirm([id, comment])}
                  loading={deleting}
                >
                  Delete
                </Button>
              }
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <p><strong>Comment:</strong> {comment.text}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerateComments;
