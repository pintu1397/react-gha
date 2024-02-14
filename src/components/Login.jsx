// LoginForm.js
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

const Login = (getImages) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = useSupabaseClient();

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(
        "Error communicating with Supabase, make sure to use a real email address!"
      );
      console.error(error);
    } else {
      //alert("Login Successful!");
      await getImages();
    }
  }

  return (
    <>
      <h3>Welcome to ImageWall</h3>

      <Form>
        <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
          <Form.Label></Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleLogin}>
          Sign in
        </Button>
      </Form>
    </>
  );
};

export default Login;
