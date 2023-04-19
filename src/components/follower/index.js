import React, { useState, useEffect } from "react";
import "./style.css";
import { database } from "../../firebase";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

export default function Follower({ uid }) {
  const currentuid = localStorage.getItem("uid");
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const theme = localStorage.getItem("theme");
  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      setPhoto(snapshot.val().photo);
      setUsername(snapshot.val().username);
    });
  }, [uid]);
  const handleUnfollow = () => {
    Swal.fire({
      background:
        theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
      title: `Are you sure to remove ${username}?`,
      text: "You won't be able to revert this!",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        database
          .ref(`/Users/${uid}/following/${currentuid}`)
          .remove()
          .then(() => {
            console.log("follow removed");
          })
          .catch((e) => {
            console.log(e);
          });
        database
          .ref(`/Users/${currentuid}/followers/${uid}`)
          .remove()
          .then(() => {
            console.log("follow removed");
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire({
          background:
            theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: theme === "light" ? "black" : "white",
          title: "Removed!",

          text: "Follower removed",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      style={{
        padding: "10px",
        fontSize: "22px",
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
        <div>
          <Link to={`/userprofile/${uid}`}>
            <img
              className="like__img"
              src={photo}
              alt=""
              
            />
          </Link>
        </div>
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: theme === "light" ? "black" : "white",
              fontWeight: "500", marginLeft: "10px"
            }}
            to={`/userprofile/${uid}`}
            activeClassName="is-active"
            exact={true}
          >
            {username && username.length > 15 ? username.substring(0, 15).concat('...') : username}
          </Link>
        </div>
      </div>
      <div className="sugfollow1">
        <Button
          onClick={handleUnfollow}
          style={{
            width: "70px",
          }}
          variant="secondary"
          size="sm"
        >
          remove
        </Button>
      </div>
    </div>
  );
}
