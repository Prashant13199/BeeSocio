import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { database, auth } from "../../firebase";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function Like({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setPhoto(snapshot.val().photo);
        setUsername(snapshot.val().username);
        setStatus(snapshot.val().status);
      }
    });
  }, [uid]);

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])


  return (
    <div style={{ fontSize: "22px", margin: "10px 0px" }} data-aos="fade-right">
      <img
        className={status ? "like__img1_online" : "like__img1"}
        src={photo}
        alt=""
      />
      <Link
        style={{
          textDecoration: "none",
          color: mode === "light" ? "black" : "white",
          marginLeft: "10px"
        }}
        to={uid === auth?.currentUser?.uid ? '/profile' : `/userprofile/${uid}`}
        activeClassName="is-active"
        exact={true}
      >
        {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
      </Link>
    </div>
  );
}
