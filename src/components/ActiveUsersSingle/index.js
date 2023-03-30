import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { database } from "../../firebase";
import "./style.css";

export default function ActiveUsersSingle({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);
  const currentuid = localStorage.getItem("uid");
  const theme = localStorage.getItem("theme");
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
        if (uid !== currentuid) {
            var names = [uid, currentuid];
            names.sort();
            let chatRoom = names.join("");
            database.ref(`Rooms/${chatRoom}`).set({ name1: uid, name2: currentuid, timestamp: Date.now() }).then(() => {
                history.push(`/message/rooms/${names.join("")
                    }`);
            }).catch((e) => {
                console.log(e);
            });
        }
    };

  return currentuid !== uid && status ? (
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
            color: theme === "light" ? "black" : "white",
            fontWeight: "500",
          }}
          to={`/userprofile/${uid}`}
          activeClassName="is-active"
          exact={true}
        >
          <img
            className="suggestion__img"
            src={photo}
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src =
                "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
            }}
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

