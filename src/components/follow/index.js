import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { database, auth } from "../../firebase";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { ColorModeContext } from "../../services/ThemeContext";

export default function Follow({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const { mode } = useContext(ColorModeContext);
  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      setPhoto(snapshot.val().photo);
      setUsername(snapshot.val().username);
    });
  }, [uid]);
  const handleUnfollow = () => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: `Are you sure to unfollow ${username}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unfollow!",
    }).then((result) => {
      if (result.isConfirmed) {
        database
          .ref(`/Users/${uid}/followers/${auth?.currentUser?.uid}`)
          .remove()
          .then(() => {
            console.log("follow removed");
          })
          .catch((e) => {
            console.log(e);
          });
        database
          .ref(`/Users/${auth?.currentUser?.uid}/following/${uid}`)
          .remove()
          .then(() => {
            console.log("follow removed");
          })
          .catch((e) => {
            console.log(e);
          });
        database.ref(`/Users/${uid}/activity/${auth?.currentUser?.uid}`).remove()
          .then(() => {
            console.log("activity removed");
          })
          .catch((e) => {
            console.log(e);
          });
        database
          .ref(`/Users/${uid}/notification/${auth?.currentUser?.uid}`)
          .remove()
          .then(() => {
            console.log("notification removed");
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire({
          background:
            mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Unfollowed!",
          text: "Following removed",
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
              color: mode === "light" ? "black" : "white",
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
          variant="warning"
          size="sm"
        >
          Unfollow
        </Button>
      </div>
    </div>

  );
}
