// ImageCard.js
import React, { useState } from "react";
import { Card, Button,Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageCard = ({ CDNURL, user, image, deleteImage }) => {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
    <Card style={{ width: "100%" }}>
      <Card.Img
        style={{ height: "200px", objectFit: "cover" }}
        variant="top"
        src={`${CDNURL}${user.id}/${image.name}`}
        onClick={handleImageClick}
      />
      <Card.Body>
        <Button variant="danger" onClick={() => deleteImage(image.name)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`${CDNURL}${user.id}/${image.name}`}
            alt="Preview"
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    
  );
};

export default ImageCard;
