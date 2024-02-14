// ImageList.js
import React from "react";
import { Row, Col } from "react-bootstrap";
import ImageCard from "./ImageCard";
const CDNURL =
  "https://qbcybijsurnlebeyrere.supabase.co/storage/v1/object/public/images/";
const ImageList = ({ user, images, deleteImage }) => {
  return (
    <Row xs={1} md={3} className="g-4">
      {images.map((image) => (
        <Col key={`${CDNURL}${user.id}/${image.name}`}>
          <ImageCard
            CDNURL={CDNURL}
            user={user}
            image={image}
            deleteImage={deleteImage}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ImageList;
