import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Badge, IconButton } from "@mui/material";
import { database, auth } from "../../firebase";
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
import { ColorModeContext } from '../../services/ThemeContext';

export default function NavbarHead() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let history = useHistory();

  const [currentPhoto, setCurrentPhoto] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const audio = new Audio(audio1);
  const [items, setItems] = useState([]);
  const [mnotifications, setmNotification] = useState([]);
  const [notifications, setNotification] = useState([]);
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentPhoto(snapshot.val().photo);
        setCurrentUsername(snapshot.val().username);
      }
    });
    if (auth?.currentUser?.uid) {
      database.ref(`/Users/${auth?.currentUser?.uid}`).update({
        status: true,
      });
    }
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    database.ref(`/Users/${location && location.pathname.split('/')[2]}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setUsername(snapshot.val().username);
      }
    });
  }, [location])

  useEffect(() => {
    window.addEventListener("blur", () => {
      if (auth?.currentUser?.uid && isMobile) {
        database.ref(`/Users/${auth?.currentUser?.uid}`).update({
          status: false,
          lastseen: Date.now(),
        });
      }
    });
    window.addEventListener("focus", () => {
      if (auth?.currentUser?.uid) {
        database.ref(`/Users/${auth?.currentUser?.uid}`).update({
          status: true,
        });
      }
    });
    window.addEventListener("beforeunload", () => {
      if (auth?.currentUser?.uid) {
        database.ref(`/Users/${auth?.currentUser?.uid}`).update({
          status: false,
          lastseen: Date.now(),
        });
      }
    });
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    database.ref("/Users").on("value", (snapshot) => {
      let itemsList = [];
      snapshot.forEach((snap) => {
        if (snap.val().uid !== auth?.currentUser?.uid) {
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

  const handleOnSelect = (item) => {
    if (item.uid !== auth?.currentUser?.uid) {
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
      .ref(`/Users/${auth?.currentUser?.uid}/messages`)
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
  }, []);

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/messages`).on("value", (snapshot) => {
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
  }, []);

  useEffect(() => {
    database
      .ref(`/Users/${auth?.currentUser?.uid}/notification`)
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
  }, []);

  useEffect(() => {
    database
      .ref(`/Users/${auth?.currentUser?.uid}/notification`)
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
  }, []);

  const clearNotification = () => {
    database.ref(`/Users/${auth?.currentUser?.uid}/notification`).remove();
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
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: mode === "light" ? "black" : "white" }}>
            Create Post
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon style={{ color: "red", fontSize: "20px" }} />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <CreatePost handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <div className="nav__pc">
        <Navbar
          expand="lg"
          bg={mode === "light" ? "light" : "dark"}
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
                    color: mode === "light" ? "black" : "white",
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
                        backgroundColor: mode === "light" ? "white" : "black",
                        placeholderColor: "grey",
                        color: mode === "light" ? "black" : "white",
                        hoverBackgroundColor:
                          mode === "light" ? "lightblue" : "rgb(21, 64, 89)",
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
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      {location && location.pathname === '/' ? <HomeIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <HomeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>

                <Nav.Link eventKey="16">
                  <NavLink
                    to="/search"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      {location && location.pathname === '/search' ? <PersonSearchIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <PersonSearchOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>

                <Nav.Link eventKey="2">
                  <NavLink
                    to="/message"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      <Badge badgeContent={mnotifications.length} color="primary">
                        {location && location.pathname.includes('/message') ? <ChatBubbleIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <ChatBubbleOutlineOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>
                <Nav.Link eventKey="3">
                  <NavLink
                    to="/activity"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton onClick={() => {
                      clearNotification();
                    }}>
                      <Badge badgeContent={notifications.length} color="primary">
                        {location && location.pathname === '/activity' ? <FavoriteIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <FavoriteBorderOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>

                <Nav.Link
                  eventKey="4"
                >
                  <IconButton onClick={handleShow}>
                    <AddCircleOutlineIcon style={{ color: mode === "light" ? "black" : "white" }} />
                  </IconButton>
                </Nav.Link>

                <Nav.Link eventKey="7">
                  <NavLink
                    to="/profile"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      <img
                        className={location && location.pathname === '/profile' ? mode === "light" ? 'navbar__img_active_light' : "navbar__img_active_dark" : "navbar__img"}
                        alt=""
                        src={currentPhoto ? currentPhoto : "https://api.dicebear.com/6.x/thumbs/png?seed=Bubba"}
                      />
                    </IconButton>
                  </NavLink>
                </Nav.Link>
                <Nav.Link eventKey="16">
                  <NavLink to="" activeClassName="is-active" exact={true}>
                    <IconButton onClick={toggleColorMode}>
                      {mode === "light" ? <DarkModeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <LightModeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
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
              bg={mode === "light" ? "light" : "dark"}
              variant={mode === "light" ? "light" : "dark"}
              fixed="top"
              style={{
                height: "45px",
              }}
            >
              <Nav>
                <Nav.Link eventKey="17">
                  <NavLink to="" activeClassName="is-active" exact={true}>
                    <IconButton onClick={toggleColorMode}>
                      {mode === "light" ? <DarkModeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <LightModeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
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
                      color: mode === "light" ? "black" : "white",
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
                            backgroundColor: mode === "light" ? "white" : "black",
                            placeholderColor: "grey",
                            color: mode === "light" ? "black" : "white",
                            hoverBackgroundColor:
                              mode === "light" ? "lightblue" : "rgb(21, 64, 89)",
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
                        {location && location.pathname.includes('/message') ? <ChatBubbleIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <ChatBubbleOutlineOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                      </Badge>
                    </IconButton>

                  </NavLink>
                </Nav.Link>
              </Nav>

            </Navbar>
          </div>
          <div>
            <Navbar
              bg={mode === "light" ? "light" : "dark"}
              variant={mode === "light" ? "light" : "dark"}
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
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      {location && location.pathname === '/' ? <HomeIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <HomeOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
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
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      {location && location.pathname === '/search' ? <PersonSearchIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <PersonSearchOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
                    </IconButton>
                  </NavLink>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto">
                <Nav.Link eventKey="13">
                  <IconButton onClick={handleShow}>
                    <AddCircleOutlineIcon style={{ color: mode === "light" ? "black" : "white" }} />
                  </IconButton>
                </Nav.Link>
              </Nav>
              <Nav className="me-auto">
                <Nav.Link eventKey="14">
                  <NavLink
                    to="/activity"
                    activeClassName="is-active"
                    exact={true}
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >

                    <IconButton onClick={() => {
                      clearNotification();
                    }}>
                      <Badge badgeContent={notifications.length} color="primary">
                        {location && location.pathname === '/activity' ? <FavoriteIcon style={{ color: mode === "light" ? "black" : "white" }} /> : <FavoriteBorderOutlinedIcon style={{ color: mode === "light" ? "black" : "white" }} />}
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
                    activeStyle={{ backgroundColor: mode === "light" ? 'white' : 'black', borderRadius: '10px', paddingTop: '2px', paddingBottom: '6px' }}
                  >
                    <IconButton>
                      <img
                        className={location && location.pathname === '/profile' ? mode === "light" ? 'navbar__img_active_light' : "navbar__img_active_dark" : "navbar__img"}
                        alt=""
                        src={currentPhoto ? currentPhoto : "https://api.dicebear.com/6.x/thumbs/png?seed=Bubba"}
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
