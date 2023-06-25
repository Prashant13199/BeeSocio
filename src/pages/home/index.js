import React, { useEffect, useState, useContext } from "react";
import { Feed } from "../../containers";
import Suggestions from "../../containers/suggestions";
import "./style.css";
import { Helmet } from "react-helmet";
import Status from "../../containers/status";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import ActiveUsers from "../../containers/ActiveUsers";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function Home() {

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  const currentuid = localStorage.getItem("uid");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setCurrentPhoto(snapshot.val().photo);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>BeeSocio</title>
      </Helmet>

      <div
        className="home"
        style={{ backgroundColor: mode === "light" ? "white" : "black", minHeight: "100vh" }}
      >
        <div style={{ overflowY: "auto", minWidth: "700px", paddingTop: "10px" }}>
          <div className="status">
            <Status />
          </div>
          <div className="feedscroll">
            <Feed />
          </div>
        </div>
        <div className="sug">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "30px",
            }}
          >
            <Link to="/profile" activeClassName="is-active" exact={true}>
              <div data-aos="fade-down">
                <img
                  src={currentPhoto ? currentPhoto : "https://api.dicebear.com/6.x/thumbs/png?seed=Bubba"}
                  style={{
                    borderRadius: "50%",
                    height: "80px",
                    width: "80px",
                    objectFit: "cover",
                  }}
                  alt="userphoto"
                />
              </div>

            </Link>
            <Link
              style={{
                textDecoration: "none",
                color: mode === "light" ? "black" : "white",
              }}
              to="/profile"
              activeClassName="is-active"
              exact={true}
            >
              <div style={{ marginLeft: "10px" }} data-aos="fade-left">
                <div style={{ fontWeight: "bold", fontSize: "26px" }}>
                  {currentUsername ? currentUsername.length > 20 ? currentUsername.substring(0, 20).concat('...') : currentUsername : 'Loading...'}
                </div>
              </div>
            </Link>
          </div>
          <Suggestions />
          <ActiveUsers />
          <div style={{ padding: "0px 40px", color: "grey", fontSize: "14px" }}>
            React · Firebase · version 3.1.0
            <br />
            ©2022 BeeSocio by{" "}
            <a
              style={{ textDecoration: "none" }}
              href="https://siyadevelopers.netlify.app"
              target="_blank"
            >
              Siya Developers
            </a>
            <p style={{ maxWidth: '300px' }}>
              Download BeeSocio Mobile App <a style={{ textDecoration: 'none' }} target="_blank" href="https://drive.google.com/file/d/1RO0QdqvLXWSDnfRqHloOUFpUpEFd6ulO/view?usp=share_link">.apk</a>
            </p>
          </div>
        </div>
      </div>
      <div className="home_mobile" style={{ backgroundColor: mode === "light" ? "white" : "black", marginTop: '10px' }}>
        <div className={mode === "light" ? "statuslight" : "statusdark"}>
          <Status />
        </div>
        <div className="feedscroll">
          <Feed />
        </div>
      </div>
    </>
  );
}
