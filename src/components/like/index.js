import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { database } from "../../firebase";

export default function Like({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);

  const theme = localStorage.getItem("theme");
  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setPhoto(snapshot.val().photo);
        setUsername(snapshot.val().username);
        setStatus(snapshot.val().status);
      }
    });
  }, [uid]);
  const currentuid = localStorage.getItem("uid");
  return (
    <div style={{ fontSize: "22px", margin: "10px 0px" }}>
      <img
        className={status ? "like__img1_online" : "like__img1"}
        src={photo}
        alt=""
      />
      <Link
        style={{
          textDecoration: "none",
          color: theme === "light" ? "black" : "white",
          marginLeft: "10px"
        }}
        to={uid === currentuid ? '/profile' : `/userprofile/${uid}`}
        activeClassName="is-active"
        exact={true}
      >
        {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
      </Link>
    </div>
  );
}
