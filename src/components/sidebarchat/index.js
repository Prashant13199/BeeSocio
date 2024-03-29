import React, { useEffect, useState, useContext } from "react";
import "./sidebarchat.css";
import { database } from "../../firebase";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "bootstrap/dist/css/bootstrap.min.css";
import { time } from "../../services/time";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ColorModeContext } from "../../services/ThemeContext";

function SidebarChat({ id, name1, addNewChat, name2, groupName }) {

  const currentuid = localStorage.getItem("uid");
  const location = useLocation();
  const [messages, setMessages] = useState("");
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);
  const [roomName, setRoomName] = useState("");
  const { mode } = useContext(ColorModeContext);
  const history = useHistory();
  const [active, setActive] = useState(false)
  const [mnotifications, setmNotification] = useState([]);

  useEffect(() => {
    if (location && location.pathname.split('/')[3] === id) {
      setActive(true)
    } else {
      setActive(false)
    }
    if (groupName) {
      database
        .ref(`/Rooms/${id}`)
        .on("value", (snapshot) => {
          if (snapshot.val() !== null) {
            setPhoto(snapshot.val().photo);
            setUsername(snapshot.val().groupName);
          }
        });
    } else {
      database
        .ref(`/Users/${currentuid === name1 ? name2 : name1}`)
        .on("value", (snapshot) => {
          if (snapshot.val() !== null) {
            setPhoto(snapshot.val().photo);
            setUsername(snapshot.val().username);
            setStatus(snapshot.val().status);
          }
        });
    }

    if (id) {
      database
        .ref(`RoomsMsg/${id}/messages`)
        .orderByChild("timestamp")
        .on("value", (snapshot) => {
          let message = [];
          snapshot.forEach((snap) => {
            message.push(snap.val());
          });
          message.reverse();
          setMessages(message);
        });
    }
    var names = [name1, name2];
    names.sort();
    setRoomName(names.join(""));
  }, [id, currentuid, name1, name2]);

  useEffect(() => {
    database.ref(`/Users/${currentuid}/messages`).on("value", (snapshot) => {
      let mNotification = [];
      snapshot.forEach((snap) => {
        mNotification.push({
          id: snap.key,
          text: snap.val().text,
        });
      });
      setmNotification(mNotification);
    });
  }, []);

  const removeNotification = async () => {
    database.ref(`/Users/${currentuid}/messages/${id}`).remove();
  };

  const handleLink = () => {
    removeNotification()
    history.push('/message')
    setTimeout(() => {
      history.push(`/message/rooms/${id}`)
    }, 0);
  }

  return groupName || messages[0]?.message ||
    messages[0]?.photo ||
    messages[0]?.sticker ||
    messages[0]?.gif ||
    messages[0]?.post ? (
    !addNewChat ? (
      <Link
        onClick={handleLink}
        key={id}
        style={{
          color: mode === "light" ? "black" : "white",
        }}
        className="chata"
      >
        <div className={active ? mode === "light" ? "sidebarChat_active" : "sidebarChatdark_active" : mode === "light" ? "sidebarChat" : "sidebarChatdark"}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img
              src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Bubba`}
              className={status ? "sidebarChat__img__online" : "sidebarChat__img"}
              alt=""

            />
            <div className="sidebarChat__info">
              <div style={{ display: "flex", height: "15px" }}>
                <h6 style={{ fontWeight: "700" }}>
                  {username.length < 20 ? username : username.substring(0, 20).concat("...")}
                </h6>
              </div>
              {messages[0]?.message &&
                !messages[0]?.statusreply &&
                !messages[0]?.photo && (
                  <div style={{ color: "gray" }}>
                    {messages[0]?.message.substring(0, 25)}
                    {messages[0]?.message.length > 25 && "..."}
                  </div>
                )}
              {messages[0]?.message && messages[0]?.statusreply && (
                <div style={{ color: "gray" }}>
                  {messages[0]?.uid !== currentuid
                    ? "Replied to status"
                    : "You replied to a status"}
                </div>
              )}
              {messages[0]?.photo && (
                <div style={{ color: "gray" }}>
                  {messages[0]?.uid !== currentuid
                    ? "Sent a media"
                    : "You sent a media"}
                </div>
              )}
              {messages[0]?.sticker && (
                <div style={{ color: "gray" }}>
                  {messages[0]?.uid !== currentuid
                    ? "Sent a sticker"
                    : "You sent a sticker"}
                </div>
              )}
              {messages[0]?.gif && (
                <div style={{ color: "gray" }}>
                  {messages[0]?.uid !== currentuid
                    ? "Sent a gif"
                    : "You sent a gif"}
                </div>
              )}
              {messages[0]?.post && (
                <div style={{ color: "gray" }}>
                  {messages[0]?.uid !== currentuid
                    ? "Sent a post"
                    : "You sent a post"}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sidebarchat_timestamp">
              {messages[0]?.timestamp && time(messages[0]?.timestamp)}
            </div>
            {mnotifications.map((noti) => {
              if (noti.id === roomName || noti.id === id) {
                return <div className="dot"></div>;
              }
            })}
          </div>
        </div>
      </Link>
    ) : (
      <></>
    )
  ) : (
    <></>
  );
}

export default SidebarChat;
