import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebase";
import icon from "../../bee.png";
import TextField from "@mui/material/TextField";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import SignInBtn from "../../components/signin-btn";
import { IconButton, InputAdornment } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const login = async () => {
    setLoading(true);
    const user = await auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        setLoading(false);
        if (user.user.emailVerified) {
          window.location.reload();
        } else {
          Swal.fire({
            title: "Email not verified",
            text: "Please verify your email (Check spam..)",
            icon: "error",
            showConfirmButton: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: e,
          icon: "error",
          showConfirmButton: true,
        });
      });
    console.log(user)
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
        <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
          <TextField
            id="standard-helperText"
            label="Password"
            variant="standard"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
          <Button
            variant="primary"
            size="md"
            id="uploadBtn"
            onClick={login}
            style={{
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Please Wait.." : "Login"}
          </Button>
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
          <Link to="/forgotpassword">Forgot Password?</Link>
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
          <Link to="/register">Don't Have an Account?</Link>
        </div>
        <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
          <SignInBtn />
        </div>
      </div>
    </div>
  );
}
