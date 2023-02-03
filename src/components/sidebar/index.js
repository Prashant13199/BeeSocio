import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarChat from "../sidebarchat";
import { database } from "../../firebase";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { IconButton } from "@material-ui/core";
import ReactLoading from "react-loading";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { makeid } from '../../services/makeid.js'

function Sidebar() {
  let history = useHistory();
  const currentuid = localStorage.getItem("uid");
  const [rooms, setRooms] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = localStorage.getItem("theme");

  const handleOnSelect = (item) => {
    history.push('/message')
    setTimeout(() => {
      createChat(item.uid);
    }, 0);
  };

  const formatResult = (item) => {
    return item;
  };

  const handleClear = () => { };

  const checkUserInGroup = (id) => {
    let user = false;
    database.ref(`/Rooms/${id}/users`).on('value', snapshot => {
      if (snapshot.val() !== undefined) {
        snapshot.forEach((snap1) => {
          if (snap1.key === currentuid) {
            user = true
          }
        })
      }
    })
    return user
  }

  useEffect(() => {
    database.ref("/Rooms").orderByChild("timestamp").on("value", (snapshot) => {
      let roomList = []
      snapshot && snapshot.forEach((snap) => {
        if (snap.val() !== undefined) {
          if (snap.val().group) {
            if (checkUserInGroup(snap.key)) {
              roomList.push({
                id: snap.key,
                data: snap.val(),
              });
            }
          }
          else if (
            snap.val().name1 === currentuid ||
            snap.val().name2 === currentuid
          ) {
            roomList.push({
              id: snap.key,
              data: snap.val(),
            });
          }
        }
      });
      roomList.reverse();
      setRooms(roomList);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    database.ref("/Users").on("value", (snapshot) => {
      let itemsList = [];
      snapshot.forEach((snap) => {
        if (snap.val().uid !== currentuid) {
          itemsList.push({
            id: snap.key,
            name: snap.val().username,
            uid: snap.val().uid,
          });
        }
      });
      setItems(itemsList);
    });
  }, []);

  const createChat = async (roomName) => {
    if (roomName !== currentuid) {
      var names = [roomName, currentuid];
      names.sort();
      let chatRoom = names.join("");
      database
        .ref(`/Rooms/${chatRoom}`)
        .set({
          name1: roomName,
          name2: currentuid,
          timestamp: Date.now(),
        })
        .then(() => {
          history.push(`/message/rooms/${chatRoom}`);
        });
    }
  };

  const createGroup = () => {
    Swal.fire({
      background: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
      title: "Enter Group Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeHolder: "Enter Group Name"
      },
      inputValue: "",
      showCancelButton: true,
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value)
        let chatRoom = makeid(10);
        database
          .ref(`/Rooms/${chatRoom}`)
          .set({
            groupName: result.value,
            createdBy: currentuid,
            group: true,
            timestamp: Date.now(),
            photo: "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png",
          })
          .then(() => {
            database
              .ref(`/Rooms/${chatRoom}/users/${currentuid}`)
              .set({ id: currentuid, timestamp: Date.now() })
            history.push(`/message/rooms/${chatRoom}`);
          });
      }
    });
  }

  return (
    <>
      <div className="sidebar">
        <div className="sidebar__header">
          <Link to="/" style={{ color: theme === "light" ? "black" : "white", textDecoration: "none", fontSize: "24px", }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton>
                <ArrowBackIosIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />
              </IconButton>
              <div style={{ fontWeight: "700" }}>Chats</div>
            </div>
          </Link>
        </div>
        <div className="sidebar__search">
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            onClear={handleClear}
            formatResult={formatResult}
            placeholder="Start a new chat"
            styling={{
              backgroundColor: theme === "light" ? "white" : "black",
              placeholderColor: "gray",
              color: theme === "light" ? "black" : "white",
              hoverBackgroundColor:
                theme === "light" ? "lightblue" : "rgb(21, 64, 89)",
              height: "35px",
              borderRadius: "8px",
              border: "none",
            }}
          />
        </div>
        <div className="sidebar__search_mobile">
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            onClear={handleClear}
            formatResult={formatResult}
            placeholder="Start a new chat"
            styling={{
              backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              placeholderColor: "gray",
              color: theme === "light" ? "black" : "white",
              hoverBackgroundColor:
                theme === "light" ? "lightblue" : "rgb(21, 64, 89)",
              height: "35px",
              borderRadius: "8px",
              border: "none",
            }}
          />
        </div>
        <div style={{ margin: "10px" }}>
          <Button onClick={createGroup}
            variant="primary"
            size="sm"
            style={
              { width: "100%", marginTop: "5px" }
            }>
            <AddIcon fontSize="small" />&nbsp;Create New Group
          </Button>
        </div>
        <div className="sidebar__chats">
          {!loading ? (
            <>
              <SidebarChat addNewChat={true} />
              {rooms.length !== 0 && (
                rooms.map((room) => {
                  return (
                    <SidebarChat
                      key={room.id}
                      id={room.id}
                      name1={room.data.name1}
                      name2={room.data.name2}
                      groupName={room.data.groupName}
                    />
                  );
                })
              )}
            </>
          ) : (
            <div style={{ marginTop: "150px", minWidth: "50px" }}>
              <center>
                <ReactLoading
                  type="spinningBubbles"
                  color="#0892d0"
                  height={"30px"}
                  width={"30px"}
                />
              </center>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
