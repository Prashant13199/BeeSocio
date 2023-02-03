import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { database } from "../../firebase";
import "./style.css";

export default function SuggestionUSer({ uid }) {
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [follow, setfollow] = useState([]);
  const currentuid = localStorage.getItem("uid");
  const [currentusername, setCurrentUsername] = useState("");
  const theme = localStorage.getItem("theme");

  let like = false;
  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, [currentuid]);

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
    if (follow[i].uid === currentuid) {
      like = true;
    }
  }
  const handlefollow = async () => {
    if (like === false) {
      database
        .ref(`/Users/${uid}/followers/${currentuid}`)
        .set({
          id: currentuid,
          uid: currentuid,
        })
        .then(() => {
          console.log("following");
        })
        .catch((e) => {
          console.log(e);
        });
      database
        .ref(`/Users/${currentuid}/following/${uid}`)
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

      database.ref(`/Users/${uid}/activity/${currentuid}`).set({
        id: currentuid,
        text: `started following you`,
        timestamp: Date.now(),
        uid: currentuid,
      });
      database.ref(`/Users/${uid}/notification/${currentuid}`).set({
        text: `${currentusername} started following you`,
      });
    } else {
      Swal.fire({
        background:
          theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
        color: theme === "light" ? "black" : "white",
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
            .ref(`/Users/${uid}/followers/${currentuid}`)
            .remove()
            .then(() => {
              console.log("follow removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${currentuid}/following/${uid}`)
            .remove()
            .then(() => {
              console.log("follow removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${uid}/activity/${currentuid}`)
            .remove()
            .then(() => {
              console.log("activity removed");
              like = false;
            })
            .catch((e) => {
              console.log(e);
            });
          database
            .ref(`/Users/${uid}/notification/${currentuid}`)
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
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: theme === "light" ? "rgba(33,37,41,1)" : "white",
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
  return currentuid !== uid ? (
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
      <a onClick={handlefollow} className="sugfollow">
        {like ? "Unfollow" : "Follow"}
      </a>
    </div>
  ) : (
    <></>
  );
}
