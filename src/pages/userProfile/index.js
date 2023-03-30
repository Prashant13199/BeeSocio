import React, { useEffect } from "react";
import UserProfileHeader from "../../components/userProfileHeader";
import { UserFeed } from "../../containers";
import "./style.css";
import { Helmet } from "react-helmet";

export default function UserProfile(props) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const theme = localStorage.getItem("theme");
    return (
        <>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <div style={{
                backgroundColor: theme === "light" ? "white" : "black",
                minHeight: "100vh",
            }}>
                <div className="profile">
                    <UserProfileHeader uid={
                        props.match.params.uid
                    } />
                    <UserFeed uid={
                        props.match.params.uid
                    } />
                </div>
            </div>
        </>
    );
}
