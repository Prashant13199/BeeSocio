import "./App.css";
import Home from "./pages/home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./pages/profile";
import UserProfile from "./pages/userProfile";
import React, { useState, useEffect } from "react";
import SingleFeed from "./pages/singlefeed";
import Search from "./pages/search";
import Message from "./pages/message";
import Activity from "./pages/activity";
import { NavbarHead } from "./containers";
import LoadingScreen from "react-loading-screen";
import logo from "./bee.png";
import Login from "./pages/Authentication/login";
import Register from "./pages/Authentication/register";
import ForgotPassword from "./pages/Authentication/forgotpassword";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconButton } from "@material-ui/core";
import Error from "./pages/error";

function App() {

  const currentuid = localStorage.getItem("uid");
  const theme = localStorage.getItem("theme");

  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 600) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 600) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  window.addEventListener("scroll", checkScrollTop);

  return (
    <LoadingScreen
      loading={loading}
      bgColor={theme === "light" ? "#f1f1f1" : "black"}
      spinnerColor="#9ee5f8"
      textColor={theme === "light" ? "#676767" : "white"}
      logoSrc={logo}
      text="BeeSocio"
    >
      <BrowserRouter>
        <div
          className="scrollTop"
          style={{ display: showScroll ? "flex" : "none",backgroundColor: theme === "light" ? "rgb(242, 241, 241)" : "rgb(24, 27, 30)"}}
          onClick={scrollTop}
        >
          <IconButton>
            <ExpandLessIcon color="primary" style={{ fontSize: "40px" }} />
          </IconButton>
        </div>
        {currentuid ? (
          <>
            <NavbarHead />
            <Switch>
              <Route path="/" component={Home} exact={true} />
              <Route
                path="/singlefeed/:postid"
                component={SingleFeed}
                exact={true}
              />
              <Route path="/profile" component={Profile} exact={true} />
              <Route
                path="/userprofile/:uid"
                component={UserProfile}
                exact={true}
              />
              <Route path="/activity" component={Activity} exact={true} />
              <Route path="/search" component={Search} exact={true} />
              <Route path="/message" component={Message} />
              <Route path="*" component={Error} />
            </Switch>
          </>
        ) : (
          <Switch>
            <Route path="/" component={Login} exact={true} />
            <Route path="/register" component={Register} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="*" component={Error} />
          </Switch>
        )}
      </BrowserRouter>
    </LoadingScreen>
  );
}

export default App;
