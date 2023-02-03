import React, { useEffect, useState } from "react";
import "./style.css";
import { database } from "../../firebase";
import Swal from "sweetalert2";
import { makeid } from "../../services/makeid";
import { Button } from "react-bootstrap";

export default function Users2({
  uid,
  postUrl,
  postuid,
  postid,
}) {
  const currentuid = localStorage.getItem("uid");
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const theme = localStorage.getItem("theme");
  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      setPhoto(snapshot.val().photo);
      setUsername(snapshot.val().username);
    });
  }, [uid]);
  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setCurrentEmail(snapshot.val().email);
      }
    });
  }, [currentuid]);
  const sendPicMessage = async () => {
    Swal.fire({
      background:
        theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
      title: "You are sending post to",
      text: `${username.toLowerCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send",
    }).then((result) => {
      if (result.isConfirmed) {
        var names = [uid, currentuid];
        names.sort();
        let chatRoom = names.join("");
        database.ref(`/Rooms/${chatRoom}`).set({
          name1: uid,
          name2: currentuid,
          timestamp: Date.now(),
        });
        let mid = makeid(10);
        database.ref(`/RoomsMsg/${chatRoom}/messages/${mid}`).set({
          post: postUrl,
          uid: currentuid,
          email: currentEmail,
          timestamp: Date.now(),
          postuid: postuid,
          postid: postid,
        });
        database.ref(`/Rooms/${chatRoom}`).update({ timestamp: Date.now() });
        database
          .ref(`/Users/${uid}/messages/${chatRoom}`)
          .set({
            id: uid,
            text: `${currentUsername} sent you a post`,
          })
          .then(() => {
            Swal.fire({
              background:
                theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              color: theme === "light" ? "black" : "white",
              title: "Sent!",
              text: `Post sent to ${username}`,
              icon: "success",
              timer: 800,
              showConfirmButton: false,
            });
          });
      }
    });
  };
  return (
    <div style={{ margin: "10px 0px", fontSize: "22px", display: "flex", justifyContent: "space-between" }}>
      <div>
        <img
          className="like__img"
          src={photo}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
          }}
        />
        <a
          className="users2__a"

          style={{ color: theme === "light" ? "black" : "white" }}
        >
          {username && username.length > 15 ? username.substring(0, 15).concat('...') : username}
        </a>
      </div>
      <div>
        <Button
          onClick={sendPicMessage}
          style={{
            borderRadius: "8px",
            width: "70px",
          }}
          variant="primary"
          size="sm"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
