import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import UserPost from "../../components/user-posts";
import empty from "../../assets/empty.png";
import loadingIcon from '../../assets/loading.gif'

export default function VideoTab() {
    const theme = localStorage.getItem("theme");
    const currentuid = localStorage.getItem("uid");

    const [videos, setVideos] = useState([]);
    const [lastKey, setLastKey] = useState("")
    const [totalVideos, setTotalVideos] = useState(0)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        database.ref(`Users/${currentuid}/Videos`).orderByChild("timestamp").on("value", (snapshot) => {
            setTotalVideos(snapshot.numChildren())
        })
    }, [])

    useEffect(() => {
        database.ref(`Users/${currentuid}/Videos`).orderByChild("timestamp").limitToLast(9).on("value", (snapshot) => {
            let videoList = [];
            let flag = true;
            let key = ""
            snapshot.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                videoList.push({ id: snap.key, post: snap.val() });
            });
            setLastKey(key)
            videoList.reverse();
            setVideos(videoList);
        });
    }, []);

    const fetch = () => {
        setFetching(true)
        database.ref(`Users/${currentuid}/Videos`).orderByChild("timestamp").endBefore(lastKey).limitToLast(9).on("value", (snapshot) => {
            let videoList = [];
            let flag = true;
            let key = ""
            videoList.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                videoList.push({ id: snap.key, post: snap.val() });
            });
            setTimeout(() => {
                setLastKey(key)
                videoList.reverse();
                setVideos([...videos, ...videoList]);
                setFetching(false)
            }, 800);

        });
    }

    useEffect(() => {
        const handleScroll = () => {
            const offsetHeight = document.documentElement.offsetHeight;
            const innerHeight = window.innerHeight;
            const scrollTop = document.documentElement.scrollTop;
            const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;
            if (totalVideos > videos.length && hasReachedBottom) {
                fetch()
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [videos, totalVideos]);

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
                    videos.length !== 0 && videos.map(({ id, post }) => {
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
                                tagss={
                                    post.tagss
                                }
                                venue={post.venue}
                                timestamp={
                                    post.timestamp
                                } />
                        );
                    })
                } </Grid>
            {
                videos.length === 0 && <div style={
                    {
                        display: "grid",
                        placeItems: "center",
                        marginTop: "40px"
                    }
                }><img src={empty} alt=""
                    height={"90px"} /><div style={
                        {
                            color: theme === "light" ? "black" : "white"
                        }
                    }>No Videos</div>
                </div>
            }
            {(totalVideos > videos.length && fetching) && <center style={{ marginTop: "20px" }}>
                <img src={loadingIcon} height={'20px'} width={'20px'} />
            </center>}
        </>
    );
}