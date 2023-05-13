import React, { useEffect, useState, useContext } from "react";
import UserProfileHeader from "../../components/userProfileHeader";
import { UserFeed } from "../../containers";
import "./style.css";
import { Helmet } from "react-helmet";
import { database } from "../../firebase";
import { ColorModeContext } from "../../services/ThemeContext";

export default function UserProfile(props) {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mode } = useContext(ColorModeContext);
    const [username, setUsername] = useState('User Profile')

    useEffect(() => {
        database.ref(`/Users/${props.match.params.uid}/`).on("value", (snapshot) => {
            if (snapshot.val()) {
                setUsername(snapshot.val().username);
            }
        });
    }, [props.match.params.uid])

    return (
        <>
            <Helmet>
                <title>{username}</title>
            </Helmet>
            <div style={{
                backgroundColor: mode === "light" ? "white" : "black",
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
