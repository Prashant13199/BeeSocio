import React, { useEffect, useState, useContext } from "react";
import ProfileHeader from "../../components/profileHeader/profileHeader";
import { MyFeed } from "../../containers";
import "./style.css";
import { Helmet } from "react-helmet";
import { database } from "../../firebase";
import { ColorModeContext } from "../../services/ThemeContext";

export default function Profile() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { mode } = useContext(ColorModeContext);
    const currentuid = localStorage.getItem('uid')
    const [username, setUsername] = useState('Profile')

    useEffect(() => {
        database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
            if (snapshot.val()) {
                setUsername(snapshot.val().username);
            }
        });
    }, [])

    return (
        <>
            <Helmet>
                <title>{username}</title>
            </Helmet>
            <div style={{
                backgroundColor: mode === "light" ? "white" : "black",
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
