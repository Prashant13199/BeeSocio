import React, { useState } from "react";
import { signInWithGoogle } from "../../services/auth";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "../../firebase";
import googlelogo from "../../assets/googlelogo.png";
import Swal from "sweetalert2";

export default function SignInBtn() {
  const [loading, setLoading] = useState(false);
  const signInBtnClick = async () => {
    setLoading(true);
    let userBySignIn = await signInWithGoogle();
    if (userBySignIn) {
      database.ref(`/Users/${userBySignIn.uid}`).on("value", (snapshot) => {
        if (snapshot.val()) {
          setLoading(false);
          window.location.replace('/')
        } else {
          database
            .ref(`/Users/${userBySignIn.uid}`)
            .update({
              uid: userBySignIn.uid,
              email: userBySignIn.email,
              createdAccountOn: Date.now(),
              photo: "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png",
              username: userBySignIn.email.replace("@gmail.com", ""),
              timestamp: Date.now(),
            })
            .then(() => {
              setLoading(false);
              window.location.replace('/')
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else {
      setLoading(false)
      Swal.fire({
        title: "Error!",
        text: "Error occured, please try again...",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };
  return (
    <div className="login__withGoogle" onClick={signInBtnClick}>
      <img src={googlelogo} alt="Google Logo" />
      {!loading ? "Sign in using google" : "Please Wait..."}
    </div>
  );
}
