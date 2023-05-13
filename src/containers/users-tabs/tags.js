import { Grid } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { database } from "../../firebase";
import UserPost from "../../components/user-posts";
import empty from "../../assets/empty.png";
import { ColorModeContext } from "../../services/ThemeContext";

export default function TagTabUser({ props }) {

    const { mode } = useContext(ColorModeContext);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        database.ref(`Posts`).orderByChild("timestamp").limitToLast(6).on("value", (snapshot) => {
            let tagList = []
            snapshot.forEach((snap) => {
                if (snap.val().tagss) {
                    for (let i = 0; i < snap.val().tagss.length; i++) {
                        if (snap.val().tagss[i] === props.uid) {
                            tagList.push({ id: snap.key, post: snap.val() })
                        }
                    }
                }

            });

            tagList.reverse();
            setTags(tagList)
        });
    }, [props]);

    return (
        <>
            <Grid container
                spacing={
                    {
                        xs: 0.5,
                        md: 0.5
                    }
                }
                columns={
                    {
                        xs: 6,
                        sm: 12,
                        md: 12
                    }
                }>
                {
                    tags.length !== 0 && tags.map(({ id, post }) => {
                        return (
                            <UserPost key={id}
                                id={id}
                                uid={
                                    post.uid
                                }
                                photoURL={
                                    post.photoUrl
                                }
                                caption={
                                    post.caption
                                }
                                venue={post.venue}
                                timestamp={
                                    post.timestamp
                                }
                                tagss={
                                    post.tagss
                                } />
                        );
                    })
                } </Grid>
            {
                tags.length === 0 && <div style={
                    {
                        display: "grid",
                        placeItems: "center",
                        marginTop: "40px"
                    }
                }><img alt=""
                    src={empty}
                    height={"90px"} /><div style={
                        {
                            color: mode === "light" ? "black" : "white"
                        }
                    }>No Tags</div>
                </div>
            }
        </>
    );
}