// ImageUploadForm.js
import React from "react";
import { Form } from "react-bootstrap";

const ImageUploadForm = ({ uploadImage }) => {
  return (
    <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={(e) => uploadImage(e)}
      />
    </Form.Group>
  );
};

export default ImageUploadForm;
