// ImageCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";

const ImageCard = ({ CDNURL, user, image, deleteImage }) => {
  return (
    <Card>
      <Card.Img variant="top" src={`${CDNURL}${user.id}/${image.name}`} />
      <Card.Body>
        <Button variant="danger" onClick={() => deleteImage(image.name)}>
          Delete Image
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ImageCard;
