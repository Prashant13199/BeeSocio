import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebase";
import icon from "../../bee.png";
import TextField from "@mui/material/TextField";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const forgot = async () => {
    setLoading(true);
    await auth
      .sendPasswordResetEmail(email)
      .then((user) => {
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Reset link send to mail.",
          icon: "success",
          showConfirmButton: true,
        });
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: e,
          icon: "error",
          showConfirmButton: true,
        });
      });
  };
  return (
    <div className="login">
      <div className="login__container">
        <img src={icon} alt="WhatsApp Logo" />
        <div className="login__text">
          <h4>
            {" "}
            Bee<strong>Socio</strong>
          </h4>
        </div>
        <div className="d-grid gap-2">
          <TextField
            id="standard-helperText"
            label="Email"
            variant="standard"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
          <Button
            variant="primary"
            size="md"
            id="uploadBtn"
            onClick={forgot}
            style={{
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Please Wait.." : "Send Reset Link"}
          </Button>
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
          <Link to="/">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
