import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { database, auth } from "../../firebase";
import "./style.css";
import { ColorModeContext } from "../../services/ThemeContext";

export default function ActiveUsersSingle({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);
  const { mode } = useContext(ColorModeContext);
  let history = useHistory();

  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setPhoto(snapshot.val().photo);
        setUsername(snapshot.val().username);
        setStatus(snapshot.val().status);
      }
    });
  }, [uid]);

  const sendMessage = async () => {
    if (uid !== auth?.currentUser?.uid) {
      var names = [uid, auth?.currentUser?.uid];
      names.sort();
      let chatRoom = names.join("");
      database.ref(`Rooms/${chatRoom}`).set({ name1: uid, name2: auth?.currentUser?.uid, timestamp: Date.now() }).then(() => {
        history.push(`/message/rooms/${names.join("")
          }`);
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  return auth?.currentUser?.uid !== uid && status ? (
    <div
      style={{
        padding: "10px",
        height: "40px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            color: mode === "light" ? "black" : "white",
            fontWeight: "500",
          }}
          to={`/userprofile/${uid}`}
          activeClassName="is-active"
          exact={true}
        >
          <img
            className={status ? "activeuser__img_online" : "activeuser__img"}
            src={photo}
            alt=""
          />
          {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
        </Link>
      </div>
      <a className="sugfollow" onClick={() => sendMessage()}>
        Message
      </a>
    </div>
  ) : (
    <></>
  );
}

