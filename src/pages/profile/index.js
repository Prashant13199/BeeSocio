import React, { useEffect } from "react";
import ProfileHeader from "../../components/profileHeader/profileHeader";
import { MyFeed } from "../../containers";
import "./style.css";
import { Helmet } from "react-helmet";

export default function Profile() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const theme = localStorage.getItem("theme");
    return (
        <>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <div style={{
                backgroundColor: theme === "light" ? "white" : "black",
                minHeight: "100vh",
            }}
            >
                <div className="profile">
                    <ProfileHeader />
                    <MyFeed />
                </div>
            </div>
        </>
    );
}
