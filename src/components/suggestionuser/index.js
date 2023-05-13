import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { database, auth } from "../../firebase";
import "./style.css";
import { ColorModeContext } from "../../services/ThemeContext";

export default function SuggestionUSer({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [follow, setfollow] = useState([]);
  const [currentusername, setCurrentUsername] = useState("");
  const { mode } = useContext(ColorModeContext);

  let like = false;
  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, []);

  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setPhoto(snapshot.val().photo);
        setUsername(snapshot.val().username);
      }
    });
  }, [uid]);
  useEffect(() => {
    database.ref(`/Users/${uid}/followers`).on("value", (snapshot) => {
      let followList = [];
      snapshot.forEach((snap) => {
        followList.push({
          id: snap.key,
          uid: snap.val().uid,
        });
      });
      followList.reverse();
      setfollow(followList);
    });
  }, [uid]);
  for (var i = 0; i < follow.length; i++) {
    if (follow[i].uid === auth?.currentUser?.uid) {
      like = true;
    }
  }
  const handlefollow = async () => {
    if (like === false) {
      database
        .ref(`/Users/${uid}/followers/${auth?.currentUser?.uid}`)
        .set({
          id: auth?.currentUser?.uid,
          uid: auth?.currentUser?.uid,
        })
        .then(() => {
          console.log("following");
        })
        .catch((e) => {
          console.log(e);
        });
      database
        .ref(`/Users/${auth?.currentUser?.uid}/following/${uid}`)
        .set({
          id: uid,
          uid: uid,
        })
        .then(() => {
          console.log("following");
        })
        .catch((e) => {
          console.log(e);
        });

      database.ref(`/Users/${uid}/activity/${auth?.currentUser?.uid}`).set({
        id: auth?.currentUser?.uid,
        text: `started following you`,
        timestamp: Date.now(),
        uid: auth?.currentUser?.uid,
      });
      database.ref(`/Users/${uid}/notification/${auth?.currentUser?.uid}`).set({
        text: `${currentusername} started following you`,
      });
    } else {
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
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${auth?.currentUser?.uid}/following/${uid}`)
            .remove()
            .then(() => {
              console.log("follow removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${uid}/activity/${auth?.currentUser?.uid}`)
            .remove()
            .then(() => {
              console.log("activity removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${uid}/notification/${auth?.currentUser?.uid}`)
            .remove()
            .then(() => {
              console.log("activity removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          Swal.fire({
            background:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "rgba(33,37,41,1)" : "white",
            title: "Unfollowed!",
            text: "Following removed.",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
          });
        }
      });
    }
  };
  return auth?.currentUser?.uid !== uid && !like ? (
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
            className="suggestion__img"
            src={photo}
            alt=""

          />
          {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
        </Link>
      </div>
      <a onClick={handlefollow} className="sugfollow">
        {like ? "Unfollow" : "Follow"}
      </a>
    </div>
  ) : (
    <></>
  );
}
