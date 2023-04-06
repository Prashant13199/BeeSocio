import React, { useState, useEffect } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Badge, IconButton } from "@mui/material";
import { database } from "../../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import icon from "../../bee.png";
import { isMobile } from "react-device-detect";
import { Modal } from "react-bootstrap";
import { CreatePost } from "../../containers";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useLocation } from "react-router-dom";
import audio1 from "../../notification.mp3";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function NavbarHead() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let history = useHistory();
  const currentuid = localStorage.getItem("uid");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const audio = new Audio(audio1);
  const [items, setItems] = useState([]);
  const [fetchedUid, setFetchedUid] = useState("");
  const theme = localStorage.getItem("theme");
  const [mnotifications, setmNotification] = useState([]);
  const [notifications, setNotification] = useState([]);

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setFetchedUid(snapshot.val().uid);
      } else {
        console.log("Error occured in fetching data");
        localStorage.clear();
        window.location.reload();
      }
    });
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentPhoto(snapshot.val().photo);
        setCurrentUsername(snapshot.val().username);
      }
    });
    if (fetchedUid) {
      database.ref(`/Users/${fetchedUid}`).update({
        status: true,
      });
    }
  }, [fetchedUid, currentuid]);

  useEffect(() => {
    database.ref(`/Users/${location && location.pathname.split('/')[2]}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setUsername(snapshot.val().username);
      }
    });
  }, [location])

  useEffect(() => {
    window.addEventListener("blur", () => {
      if (fetchedUid) {
        database.ref(`/Users/${fetchedUid}`).update({
          status: false,
          lastseen: Date.now(),
        });
      }
    });
    window.addEventListener("focus", () => {
      if (fetchedUid) {
        database.ref(`/Users/${fetchedUid}`).update({
          status: true,
        });
      }
    });
    window.addEventListener("beforeunload", () => {
      if (fetchedUid) {
        database.ref(`/Users/${fetchedUid}`).update({
          status: false,
          lastseen: Date.now(),
        });
      }
    });
  }, [fetchedUid]);

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
  }, [currentuid]);

  const handleOnSelect = (item) => {
    if (item.uid !== currentuid) {
      history.push(`/userprofile/${item.uid}`);
    } else {
      history.push(`/profile`);
    }
  };

  const formatResult = (item) => {
    return item;
  };

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleClear = () => { };

  const showNotification = (text, link) => {
    audio.play();
    const notification = new Notification("BeeSocio", {
      body: text,
      icon: icon,
    });
  };

  useEffect(() => {
    database
      .ref(`/Users/${currentuid}/messages`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let mnotificationList = [];
        snapshot.forEach((snap) => {
          mnotificationList.push({
            id: snap.key,
            text: snap.val().text,
          });
        });
        setmNotification(mnotificationList);
      });
  }, [currentuid]);

  useEffect(() => {
    database.ref(`/Users/${currentuid}/messages`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        if (snapshot.length !== 0 && !isMobile) {
          if (Notification.permission === "granted") {
            showNotification(snap.val().text, "/message");
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                showNotification(snap.val().text, "/message");
              }
            });
          }
        }
      });
    });
  }, [currentuid]);

  useEffect(() => {
    database
      .ref(`/Users/${currentuid}/notification`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let notificationList = [];
        snapshot.forEach((snap) => {
          notificationList.push({
            id: snap.key,
            text: snap.val().text,
          });
        });
        setNotification(notificationList);
      });
  }, [currentuid]);

  useEffect(() => {
    database
      .ref(`/Users/${currentuid}/notification`)
      .on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          if (snapshot.length !== 0 && !isMobile) {
            if (Notification.permission === "granted") {
              showNotification(snap.val().text, "/activity");
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  showNotification(snap.val().text, "/activity");
                }
              });
            }
          }
        });
      });
  }, [currentuid]);

  const clearNotification = () => {
    database.ref(`/Users/${currentuid}/notification`).remove();
  };

  const changeTheme = () => {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        scrollable
      >
        <Modal.Header
          style={{
            padding: "5px 10px",
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: theme === "light" ? "black" : "white" }}>
            Create Post
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon style={{ color: "red", fontSize: "20px" }} />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <CreatePost handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <div className="nav__pc">
        <Navbar
          expand="lg"
          bg={theme === "light" ? "light" : "dark"}
          fixed="top"
          variant="light"
          collapseOnSelect
          id="navbar"
          style={{
            height: "45px",
          }}
        >
          <Container>
            <Navbar.Brand>
              <Nav>
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: theme === "light" ? "black" : "white",
                    fontSize: "22px",
                    fontWeight: "350",
                  }}
                  to="/"
                  activeClassName="is-active"
                  exact={true}
                >
                  <img
                    alt=""
                    src={icon}
                    width="22px"
                    height="22px"
                    className="d-inline-block align-center"
                  />{" "}
                  Bee<strong>Socio</strong>
                </NavLink>
              </Nav>
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                <Nav.Item>
                  <div className="searchUser">
                    <ReactSearchAutocomplete
                      items={items}
                      onSearch={handleOnSearch}
                      onSelect={handleOnSelect}
                      onClear={handleClear}
                      formatResult={formatResult}
                      placeholder="Search"
                      styling={{
                        backgroundColor: theme === "light" ? "white" : "black",
                        placeholderColor: "grey",
                        color: theme === "light" ? "black" : "white",
                        hoverBackgroundColor:
                          theme === "light" ? "lightblue" : "rgb(21, 64, 89)",
                        height: "33px",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                  </div>
                </Nav.Item>
              </Nav>
              <Nav className="me-auto"></Nav>
              <Nav>
                <Nav.Link eventKey="1">
                  <NavLink
                    to="/"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      {location && location.pathname === '/' ? <HomeIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <HomeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>

                <Nav.Link eventKey="16">
                  <NavLink
                    to="/search"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      {location && location.pathname === '/search' ? <PersonSearchIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <PersonSearchOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>

                <Nav.Link eventKey="2">
                  <NavLink
                    to="/message"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      <Badge badgeContent={mnotifications.length} color="primary">
                        {location && location.pathname.includes('/message') ? <ChatBubbleIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <ChatBubbleOutlineOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>
                <Nav.Link eventKey="3">
                  <NavLink
                    to="/activity"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton onClick={() => {
                      clearNotification();
                    }}>
                      <Badge badgeContent={notifications.length} color="primary">
                        {location && location.pathname === '/activity' ? <FavoriteIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <FavoriteBorderOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>

                <Nav.Link
                  eventKey="4"
                >
                  <IconButton onClick={handleShow}>
                    <AddCircleOutlineIcon style={{ color: theme === "light" ? "black" : "white" }} />
                  </IconButton>
                </Nav.Link>

                <Nav.Link eventKey="7">
                  <NavLink
                    to="/profile"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      <img
                        className={location && location.pathname === '/profile' ? theme === "light" ? 'navbar__img_active_light' : "navbar__img_active_dark" : "navbar__img"}
                        alt=""
                        src={currentPhoto}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src =
                            "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                        }}
                      />
                    </IconButton>
                  </NavLink>
                </Nav.Link>
                <Nav.Link eventKey="16">
                  <NavLink to="" activeClassName="is-active" exact={true}>
                    <IconButton onClick={() => {
                      changeTheme();
                    }}>
                      {theme === "light" ? <DarkModeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <LightModeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {location && !location.pathname.includes("/message") && (
        <div className="nav__mobile">
          <div>
            <Navbar
              bg={theme === "light" ? "light" : "dark"}
              variant={theme === "light" ? "light" : "dark"}
              fixed="top"
              style={{
                height: "45px",
              }}
            >
              <Nav>
                <Nav.Link eventKey="17">
                  <NavLink to="" activeClassName="is-active" exact={true}>
                    <IconButton onClick={() => { changeTheme(); }}>
                      {theme === "light" ? <DarkModeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <LightModeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto"></Nav>
              <Navbar.Brand>
                <Nav>
                  {location && location.pathname === '/' && <NavLink
                    style={{
                      textDecoration: "none",
                      color: theme === "light" ? "black" : "white",
                      fontSize: "22px"
                    }}
                    to="/"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <img
                      alt=""
                      src={icon}
                      width="22px"
                      height="22px"
                      className="d-inline-block align-center"
                    />{" "}
                    Bee<strong>Socio</strong>
                  </NavLink>}
                  {location && location.pathname === '/activity' && <div style={{ fontSize: "22px" }}>Activity</div>}
                  {location && location.pathname === '/profile' && <div style={{ fontSize: "22px" }}>{currentUsername}</div>}
                  {location && location.pathname.includes('/userprofile') && <div style={{ fontSize: "22px" }}>{username && username.length > 20 ? username.substring(0, 20).concat('...') : username}</div>}
                  {location && location.pathname === '/search' &&
                    <Nav.Item>
                      <div className="searchUser">
                        <ReactSearchAutocomplete
                          items={items}
                          onSearch={handleOnSearch}
                          onSelect={handleOnSelect}
                          onClear={handleClear}
                          formatResult={formatResult}
                          placeholder="Search"
                          styling={{
                            backgroundColor: theme === "light" ? "white" : "black",
                            placeholderColor: "grey",
                            color: theme === "light" ? "black" : "white",
                            hoverBackgroundColor:
                              theme === "light" ? "lightblue" : "rgb(21, 64, 89)",
                            height: "33px",
                            borderRadius: "8px",
                            border: "none",
                          }}
                        />
                      </div>
                    </Nav.Item>
                  }
                </Nav>
              </Navbar.Brand>
              <Nav className="me-auto"></Nav>
              <Nav>
                <Nav.Link eventKey="10">
                  <NavLink
                    to="/message"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{
                      paddingBottom: "10px",
                      borderBottom: "2px solid skyblue",
                    }}
                  >

                    <IconButton>
                      <Badge badgeContent={mnotifications.length} color="primary">
                        {location && location.pathname.includes('/message') ? <ChatBubbleIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <ChatBubbleOutlineOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>
              </Nav>

            </Navbar>
          </div>
          <div>
            <Navbar
              bg={theme === "light" ? "light" : "dark"}
              variant={theme === "light" ? "light" : "dark"}
              fixed="bottom"
              style={{
                height: "45px",
              }}
            >
              <Nav className="me-auto">
                <Nav.Link eventKey="11">
                  <NavLink
                    to="/"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      {location && location.pathname === '/' ? <HomeIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <HomeOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto">
                <Nav.Link eventKey="12">
                  <NavLink
                    to="/search"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      {location && location.pathname === '/search' ? <PersonSearchIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <PersonSearchOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto">
                <Nav.Link eventKey="13">
                  <IconButton onClick={handleShow}>
                    <AddCircleOutlineIcon style={{ color: theme === "light" ? "black" : "white" }} />
                  </IconButton>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto">
                <Nav.Link eventKey="14">
                  <NavLink
                    to="/activity"
                    activeClassName="is-active"
                    exact={true}
                  >

                    <IconButton onClick={() => {
                      clearNotification();
                    }}>
                      <Badge badgeContent={notifications.length} color="primary">
                        {location && location.pathname === '/activity' ? <FavoriteIcon style={{ color: theme === "light" ? "black" : "white" }} /> : <FavoriteBorderOutlinedIcon style={{ color: theme === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>

              <Nav>
                <Nav.Link eventKey="15">
                  <NavLink
                    to="/profile"
                    activeClassName="is-active"
                    exact={true}
                  >
                    <IconButton>
                      <img
                        className={location && location.pathname === '/profile' ? theme === "light" ? 'navbar__img_active_light' : "navbar__img_active_dark" : "navbar__img"}
                        alt=""
                        src={currentPhoto}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src =
                            "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                        }}
                      />
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
            </Navbar>
          </div>
        </div>
      )}
    </>
  );
}
