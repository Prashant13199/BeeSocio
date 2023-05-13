import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { database, auth } from "../../firebase";
import "./style.css";
import { Button } from "react-bootstrap";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function SearchUser({ uid }) {

  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [follow, setfollow] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const { mode } = useContext(ColorModeContext);
  let like = false;

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

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
        text: `${currentUsername} started following you`,
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
            color: mode === "light" ? "black" : "white",
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

  return (
    auth?.currentUser?.uid !== uid && (
      <div
        style={{
          padding: "10px",
          height: "70px",
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
          data-aos="fade-right"
        >
          <div>
            <Link to={`/userprofile/${uid}`}>
              <img
                className="searchuser__img"
                src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`}
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
              {username ? username.length > 15 ? username.substring(0, 15).concat('...') : username : 'Loading...'}
            </Link>
          </div>
        </div>
        <div className="sugfollow1" data-aos="fade-left">
          <a onClick={handlefollow}>
            {like ? (
              <Button
                style={{
                  width: "75px",
                }}
                variant="warning"
                size="sm"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                style={{
                  width: "75px",
                }}
                variant="primary"
                size="sm"
              >
                Follow
              </Button>
            )}
          </a>
        </div>
      </div>
    )
  );
}
