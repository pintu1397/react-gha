import { useEffect, useState } from "react";
import { Container, Button, } from "react-bootstrap";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import Login from "./components/Login";
import ImageUploadForm from "./components/ImageUploadForm";
import ImageList from "./components/ImageList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    console.log(e);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      // After successful upload, fetch images and update the state
      await getImages();
    } else {
      console.log(error);
    }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <Login getImages={getImages} />
      ) : (
        <>
          <h1>Your images</h1>
          <Button onClick={() => signOut()}>Log Out</Button>
          <p>current user: {user.email}</p>
          <p>upload a Image</p>
          <ImageUploadForm uploadImage={uploadImage} />
          <hr />
          <h3>your image</h3>
          <ImageList user={user} images={images} deleteImage={deleteImage} />
        </>
      )}
    </Container>
  );
}

export default App;
