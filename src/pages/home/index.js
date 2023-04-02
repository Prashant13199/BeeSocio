import React, { useEffect, useState, useLayoutEffect } from "react";
import { Feed } from "../../containers";
import Suggestions from "../../containers/suggestions";
import "./style.css";
import { Helmet } from "react-helmet";
import Status from "../../containers/status";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import ReactLoading from "react-loading";
import ActiveUsers from "../../containers/ActiveUsers";

export default function Home() {
  const currentuid = localStorage.getItem("uid");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [loading, setLoading] = useState(false)
  const theme = localStorage.getItem("theme");
  useLayoutEffect(() => {
    setLoading(true)
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setCurrentPhoto(snapshot.val().photo);
        setLoading(false)
      }
    });
  }, [currentuid]);

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
        style={{ backgroundColor: theme === "light" ? "white" : "black", minHeight: "100vh" }}
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
              <div>
                {!loading ? <img
                  src={currentPhoto}
                  style={{
                    borderRadius: "50%",
                    height: "80px",
                    width: "80px",
                    objectFit: "cover",
                  }}
                  alt="userphoto"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src =
                      "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                  }}
                /> : <div style={{
                  height: "80px",
                  width: "80px",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <ReactLoading
                    type="spinningBubbles"
                    color="#0892d0"
                    height={"20px"}
                    width={"20px"}
                  /></div>}
              </div>
            </Link>
            <Link
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
              to="/profile"
              activeClassName="is-active"
              exact={true}
            >
              <div style={{ marginLeft: "10px" }}>
                <div style={{ fontWeight: "bold", fontSize: "26px" }}>
                  {currentUsername && currentUsername.length > 20 ? currentUsername.substring(0, 20).concat('...') : currentUsername}
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
            <p style={{maxWidth: '300px'}}>
              Download BeeSocio Mobile App <a style={{textDecoration: 'none'}} target="_blank" href="https://drive.google.com/file/d/1VwXzEe5hy3ODfx-0qsQecrhJ4XSwsX-A/view?usp=share_link">.apk</a>
            </p>
          </div>
        </div>
      </div>
      <div className="home_mobile" style={{ backgroundColor: theme === "light" ? "white" : "black", marginTop: '10px' }}>
        <div className={theme === "light" ? "statuslight" : "statusdark"}>
          <Status />
        </div>
        <div className="feedscroll">
          <Feed />
        </div>
      </div>
    </>
  );
}
