import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { IconButton } from "@material-ui/core";
import "./chat.css";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { storage, database, auth } from "../../firebase";
import Swal from "sweetalert2";
import { Modal, Tab, Tabs } from "react-bootstrap";
import Compressor from "compressorjs";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { makeid } from "../../services/makeid";
import { Badge } from "@mui/material";
import ListGroup from "react-bootstrap/ListGroup";
import useRecorder from "./useRecorder";
import { time } from "../../services/time";
import { date } from "../../services/date";
import { timeDifference } from "../../services/timeDifference";
import { useLongPress } from "use-long-press";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import MicNoneIcon from '@mui/icons-material/MicNone';
import GifOutlinedIcon from '@mui/icons-material/GifOutlined';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import smile from "../../assets/smiling.png";
import thumbsup from "../../assets/thumbsup.png";
import moneymouth from "../../assets/moneymouth.png";
import smilingfacewithhearts from "../../assets/smilingfacewithhearts.png";
import grinningfacewithbigeyes from "../../assets/grinningfacewithbigeyes.png";
import facewithhandovermouth from "../../assets/facewithhandovermouth.png";
import laugh from "../../assets/laughing.png";
import cry from "../../assets/cry.png";
import heartlike from "../../assets/heartlike.png";
import wink from "../../assets/wink.png";
import sweat from "../../assets/sweat.png";
import starstruck from "../../assets/starstruck.png";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StickyBox from "react-sticky-box";
import loadingIcon from '../../assets/loading.gif'
import ReplyIcon from '@mui/icons-material/Reply';
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Like from '../like'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Button } from "react-bootstrap";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Forward from "./Forward";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplayIcon from '@mui/icons-material/Replay';
import { ColorModeContext } from "../../services/ThemeContext";

function Chat() {

  let [audioURL, isRecording, startRecording, stopRecording, setAudioURL, audio] = useRecorder();
  const messageEl = useRef(null);
  const history = useHistory();
  const { roomId } = useParams();
  const mounted = useRef(false);
  const { mode } = useContext(ColorModeContext);
  const textarea = document.querySelector("#autoresizing");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);
  const [show7, setShow7] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const handleClose7 = () => {
    setShow7(false)
    setShowImage("")
  };
  const handleShow7 = () => setShow7(true);
  const [show8, setShow8] = useState(false);
  const handleClose8 = () => setShow8(false);
  const handleShow8 = () => setShow8(true);
  const [show9, setShow9] = useState(false);
  const handleClose9 = () => setShow9(false);
  const handleShow9 = () => setShow9(true);
  const [show10, setShow10] = useState(false);
  const handleClose10 = () => setShow10(false);
  const handleShow10 = () => setShow10(true);
  const [show11, setShow11] = useState(false);
  const handleClose11 = () => setShow11(false);
  const handleShow11 = () => setShow11(true);

  const [currentUsername, setCurrentUsername] = useState("");
  const [uid, setUid] = useState("");
  const [showImage, setShowImage] = useState("")
  const [progress, setProgress] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [image, setImage] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [messages1, setMessages1] = useState([]);
  const [dates, setDates] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [themes, setThemes] = useState([])
  const [msgData, setMsgData] = useState({});
  const [mediaName, setMediaName] = useState("");
  const [showreply, setShowreply] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [showmedia, setShowmedia] = useState(false);
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(false);
  const [lastseen, setLastSeen] = useState("");
  const [seen, setSeen] = useState(false);
  const [seenGroup, setSeenGroup] = useState([])
  const [typing, setTyping] = useState(false);
  const [typinguser, setTypingUser] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [fetching, setFetching] = useState(false)
  const [totalMessageCount, setTotalMessageCount] = useState(0)
  const [lastKey, setLastKey] = useState("")
  const [group, setGroup] = useState("")
  const [groupUsers, setGroupUsers] = useState([])
  const [groupAdmin, setGroupAdmin] = useState("")
  const [items, setItems] = useState("");
  const [mnotifications, setmNotification] = useState([]);
  const [link, setLink] = useState("");
  const [likeData, setLikeData] = useState("")
  const [groups, setGroups] = useState([])
  const [chatTheme, setChatTheme] = useState('')
  const [newMessage, setNewMessage] = useState("")

  if (textarea) {
    textarea.addEventListener("input", autoResize, false);
    function autoResize() {
      this.style.height = "35px";
      this.style.paddingBottom = "5px";
      this.style.overflowY = "auto";
      this.style.height = Math.min(this.scrollHeight, 200) + "px";
    }
  }

  useEffect(() => {
    database.ref(`/Rooms`).on('value', snapshot => {
      let grp = []
      snapshot.forEach((snap) => {
        if (snap.val().group === true) {
          {
            snap.val().users && Object.entries(snap.val().users).map(([k, v]) => {
              if (v.id === auth?.currentUser?.uid) {
                grp.push(
                  snap.key
                )
              }
            })
          }
        }
      })
      setGroups(grp)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Rooms/${roomId}/${uid}`).on("value", (snapshot) => {
      setTyping(snapshot.val().typing);
      setTypingUser(snapshot.key)
    });
    groupUsers && groupUsers.map((user) => {
      if (user !== auth?.currentUser?.uid) {
        database.ref(`/Rooms/${roomId}/${user}`).on("value", snapshot => {
          if (snapshot.val().typing === true) {
            setTyping(snapshot.val().typing)
            setTypingUser(snapshot.key)
          }
        })
      }
    })
  }, [typing])

  useEffect(() => {
    database.ref(`/Rooms/${roomId}`).on('value', snapshot => {
      setGroupAdmin(snapshot.val().createdBy)
    })
    database.ref(`/Rooms/${roomId}/users`).orderByChild('timestamp').on('value', snapshot => {
      let grplist = []
      snapshot.forEach((snap) => {
        grplist.push(snap.key)
      })
      grplist.reverse()
      setGroupUsers(grplist)
    })
  }, [roomId, group])

  useEffect(() => {
    const scrollElement = document.querySelector(".chat__body");
    messageEl.current.addEventListener("scroll", () => {
      scrollElement.addEventListener("scroll", handleScroll1);
    });
  }, []);

  function handleScroll1() {
    const scrollElement = document.querySelector(".chat__body");
    if (scrollElement.scrollTop === 0) {
      document.getElementById("fetchMore").click();
    }
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const scrollTop = () => {
    messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const convert_to_username = (id) => {
    let name = ""
    database.ref(`/Users/${id}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        name = snapshot.val().username
      }
    });
    return name;
  }
  const convert_to_pic = (id) => {
    let pic = ""
    database.ref(`/Users/${id}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        pic = snapshot.val().photo
      }
    });
    return pic;
  }

  useEffect(() => {
    database.ref(`/Rooms/${roomId}`).on('value', snapshot => {
      setChatTheme(snapshot.val().chatTheme)
    })
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setCurrentEmail(snapshot.val().email);
      }
    });
    database.ref(`/Rooms/${roomId}`).on("value", (snapshot) => {
      if (snapshot.val().groupName) {
        setUsername(snapshot.val().groupName);
        setPhoto(snapshot.val().photo);
        setGroup(true)
      }
      else if (snapshot.val()) {
        database
          .ref(
            `/Users/${auth?.currentUser?.uid === snapshot.val().name1
              ? snapshot.val().name2
              : snapshot.val().name1
            }/`
          )
          .on("value", (snapshot) => {
            if (snapshot.val()) {
              setUsername(snapshot.val().username);
              setPhoto(snapshot.val().photo);
              setUid(snapshot.val().uid);
              setStatus(snapshot.val().status);
              setLastSeen(snapshot.val().lastseen);
            }
          });
      }
    });
  }, [auth?.currentUser?.uid, roomId]);

  useEffect(() => {
    database.ref("/Stickers").on("value", (snapshot) => {
      let stickerList = [];
      snapshot.forEach((snap) => {
        stickerList.push({
          id: snap.key,
          photo: snap.val().url,
        });
      });
      stickerList.reverse();
      setStickers(stickerList);
    });
    database.ref("/Gifs").on("value", (snapshot) => {
      let gifList = [];
      snapshot.forEach((snap) => {
        gifList.push({
          id: snap.key,
          photo: snap.val().url,
        });
      });
      gifList.reverse();
      setGifs(gifList);
    });
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
    database.ref("/chattheme").on("value", (snapshot) => {
      let themeList = [];
      snapshot.forEach((snap) => {
        themeList.push({
          id: snap.key,
          photo: snap.val().url,
        });
      });
      themeList.reverse();
      setThemes(themeList);
    });
  }, []);

  useEffect(() => {
    if (messageEl) {
      setTimeout(() => messageEl.current.scrollTo({
        top: messageEl.current.scrollHeight
      }), 0)

      messageEl.current.addEventListener("scroll", () => {
        const scrollElement = document.querySelector(".chat__body");
        scrollElement.addEventListener("scroll", () => {
          if (messageEl.current.scrollHeight - scrollElement.scrollTop > 1000) {
            setShowScroll(true);
          } else {
            setShowScroll(false);
          }

        });
      });
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        database.ref(`/Rooms/${roomId}/seen/${uid}`).on("value", (snapshot) => {
          if (snapshot.val()) {
            setSeen(true)
            database.ref(`/Users/${uid}/messages/${roomId}`).remove()
          } else {
            setSeen(false)
          }
        });
        database.ref(`/Rooms/${roomId}/seenusers`).on('value', snapshot => {
          let seenuser = []
          if (snapshot.val()) {
            snapshot.forEach((snap) => {
              seenuser.push({
                id: snap.val().id
              })
              database.ref(`/Users/${snap.val().id}/messages/${roomId}`).remove()
            })
            setSeenGroup(seenuser)
          }
        })
        //   const { currentTarget: target } = event;
        //   target.scroll({ top: target.scrollHeight });
      });
    }
  }, [auth?.currentUser?.uid, roomId, group, uid]);

  const fetchId = async (id) => {
    database
      .ref(`/RoomsMsg/${roomId}/messages`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let newMessageList = [];
        let mySet = new Set()
        let newDatas = []
        let flag = false
        let flag1 = false
        snapshot.forEach((snap) => {
          if (snap.key === id || flag) {
            flag = true
            mySet.add(date(snap.val().timestamp))
            newMessageList.push({
              id: snap.key,
              message: snap.val()
            })
          }
        });
        let newDateList = Array.from(mySet);

        snapshot.forEach((snap) => {
          if (snap.key === id || flag1) {
            flag1 = true
            for (let date1 in newDateList) {
              if (date(snap.val().timestamp) === newDateList[date1]) {
                let message = []
                message.push({
                  id: snap.key,
                  message: snap.val(),
                })
                newDatas.push({
                  id: newDateList[date1],
                  message: message
                })
              }
            }
          }
        });

        setDates(newDateList)
        setMessages(newDatas);
        setMessages1(newMessageList)
      });
  }

  const fetch = async () => {
    setFetching(true)
    database
      .ref(`/RoomsMsg/${roomId}/messages`)
      .orderByChild("timestamp").endBefore(lastKey).limitToLast(15)
      .on("value", (snapshot) => {
        let newMessageList = [];
        let mySet = new Set()
        let newDatas = []
        let flag = true
        let key = ""
        snapshot.forEach((snap) => {
          mySet.add(date(snap.val().timestamp))
          newMessageList.push({
            id: snap.key,
            message: snap.val()
          })
          if (flag) {
            flag = false
            key = snap.val().timestamp
          }
        });
        setLastKey(key)
        let newDateList = Array.from(mySet);

        snapshot.forEach((snap) => {
          if (snap.val()) {
            for (let date1 in newDateList) {
              if (date(snap.val().timestamp) === newDateList[date1]) {
                let message = []
                message.push({
                  id: snap.key,
                  message: snap.val(),
                })
                newDatas.push({
                  id: newDateList[date1],
                  message: message
                })
              }
            }
          }
        });

        setTimeout(() => {
          setDates(Array.from(new Set([...newDateList, ...dates])))
          setMessages([...newDatas, ...messages])
          setMessages1([...newMessageList, ...messages1])
          setFetching(false)
          handleScroll(messages1 && messages1[0]?.id)
        }
          , 500)

      });
  }

  useEffect(() => {
    database.ref(`/RoomsMsg/${roomId}/messages`).orderByChild("timestamp").on("value", (snapshot) => {
      setTotalMessageCount(snapshot.numChildren())
    })
  }, [])

  useEffect(() => {
    database.ref(`/RoomsMsg/${roomId}/messages`).orderByChild("timestamp").limitToLast(15).on("value", (snapshot) => {
      let messageList = [];
      let mySet = new Set()
      let datas = []
      let flag = true
      let key = ""
      snapshot.forEach((snap) => {
        mySet.add(date(snap.val().timestamp))
        messageList.push({
          id: snap.key,
          message: snap.val()
        })
        if (flag) {
          flag = false
          key = snap.val().timestamp
        }
      });

      let dateList = Array.from(mySet);
      setLastKey(key)

      snapshot.forEach((snap) => {
        if (snap.val()) {
          for (let date1 in dateList) {
            if (date(snap.val().timestamp) === dateList[date1]) {
              let message = []
              message.push({
                id: snap.key,
                message: snap.val(),
              })
              datas.push({
                id: dateList[date1],
                message: message
              })
            }
          }
        }
      });
      setDates(dateList)
      setMessages(datas);
      setMessages1(messageList)
    });
  }, []);

  useEffect(() => {
    if (messages1.length !== 0) {
      if (
        messages1[messages1.length - 1].message.uid !== auth?.currentUser?.uid &&
        mounted.current
      ) {
        if (uid) {
          database.ref(`/Rooms/${roomId}/seen/${auth?.currentUser?.uid}`).set({ id: auth?.currentUser?.uid });
        }
        if (group) {
          database.ref(`/Rooms/${roomId}/seenusers/${auth?.currentUser?.uid}`).set({ id: auth?.currentUser?.uid })
        }
        setTimeout(() => {
          database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).set({ id: messages1[messages1.length - 1].id });
        }, 2000);
      }
    }
  }, [group, uid, messages1])

  useEffect(() => {
    if (messages1.length !== 0) {
      if (
        messages1[messages1.length - 1].message.uid !== auth?.currentUser?.uid &&
        mounted.current
      ) {
        setTimeout(() => {
          database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).set({ id: messages1[messages1.length - 1].id });
        }, 2000);
      }
    }
    database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).on('value', snapshot => {
      setNewMessage(snapshot.val().id)
    })
  }, [])

  const removeRoom = async (roomId) => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Are you sure to delete?",
      text: "All users chat will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (group) {
            var imageRef = storage.refFromURL(photo);
            imageRef.delete().then(() => {
              console.log("removed from storage");
            }).catch((e) => {
              console.log(e);
            });
          }
        }
        catch (e) {
          console.log(e);
        }
        try {
          if (uid) {
            database.ref(`/Users/${uid}/messages/${roomId}`).remove();
          }
          if (group) {
            for (let i = 0; i < groupUsers.length; i++) {
              database.ref(`/Users/${groupUsers[i]}/messages/${roomId}`).remove();
            }
          }
        }
        catch (e) {
          console.log(e);
        }
        const storageRef = storage.ref(`chats/${roomId}/`);
        storageRef.listAll().then((listResults) => {
          listResults.items.map((item) => {
            item.delete();
          });
        });
        database.ref(`/Rooms/${roomId}`).remove();
        database.ref(`/RoomsMsg/${roomId}`).remove();
        history.push("/message");
        Swal.fire({
          background:
            mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Deleted!",
          text: "Your Chat has been deleted.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleChange = (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].name.toLowerCase().includes(".jpg") ||
        e.target.files[0].name.toLowerCase().includes(".png") ||
        e.target.files[0].name.toLowerCase().includes(".jpeg") ||
        e.target.files[0].name.toLowerCase().includes(".ico") ||
        e.target.files[0].name.toLowerCase().includes(".mp4") ||
        e.target.files[0].name.toLowerCase().includes(".mov") ||
        e.target.files[0].name.toLowerCase().includes(".pdf") ||
        e.target.files[0].name.toLowerCase().includes(".zip") ||
        e.target.files[0].name.toLowerCase().includes(".mp3") ||
        e.target.files[0].name.toLowerCase().includes(".m4a") ||
        e.target.files[0].name.toLowerCase().includes(".gif") ||
        e.target.files[0].name.toLowerCase().includes(".webm"))
    ) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview1");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      const image = e.target.files[0];
      setMediaName(image.name);
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg") ||
        image.name.toLowerCase().includes(".ico")
      ) {
        new Compressor(image, {
          quality: 0.4,
          success: (compressedResult) => {
            setCompressedFile(compressedResult);
          },
        });
      } else {
        setCompressedFile(image);
      }
    } else {
      Swal.fire({
        background:
          mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
        color: mode === "light" ? "black" : "white",
        title: "Error!",
        text: "File not supported",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const sendMessage = async () => {
    setSeen([])
    setSeenGroup([])
    database.ref(`/Rooms/${roomId}/${auth?.currentUser?.uid}`).set({ typing: false })
    if (uid) {
      database.ref(`/Rooms/${roomId}/seen/${uid}`).remove()
    }
    database.ref(`/Rooms/${roomId}/seenusers`).remove()
    textarea.focus();
    let mid = makeid(10);
    if (input.trim() || image) {
      if (showreply && !showmedia) {
        setShowreply(false);
        database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).update({
          message: input,
          uid: auth?.currentUser?.uid,
          timestamp: Date.now(),
          replyid: msgData.id,
          replyto: msgData.message ? msgData.message : "",
          replygif: msgData.gif ? msgData.gif : "",
          replysticker: msgData.sticker ? msgData.sticker : "",
          replyphoto: msgData.photo ? msgData.photo : "",
          fname: msgData.fname ? msgData.fname : "",
          replymessage: msgData.message ? msgData.message : "",
          replypostid: msgData.postid ? msgData.postid : "",
          replypost: msgData.post ? msgData.post : "",
          replypostusername: msgData.postusername ? msgData.postusername : "",
        })
          .then(async () => {
            console.log("message sent");
            if (uid) {
              database.ref(`/Users/${uid}/messages/${roomId}`).set({
                id: auth?.currentUser?.uid,
                text: `${currentUsername} sent text`,
              });
            }
            groupUsers && groupUsers.map((name) => {
              if (name !== auth?.currentUser?.uid) {
                database.ref(`/Users/${name}/messages/${roomId}`).set({
                  id: auth?.currentUser?.uid,
                  text: `${currentUsername} sent text in group ${username}`,
                });
              }
            })
            database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now() });
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (showedit) {
        database.ref(`/RoomsMsg/${roomId}/messages/${msgData.id}`).update({
          message: input,
          edited: true,
        }).then(() => {
          setShowedit(false);
          handleClose2();
        })
      } else if (showmedia) {
        let fileName = "";
        if (image) {
          var imageName = makeid(10);
          var filename_n = image.name.split(".").pop().toLowerCase();
          if (
            filename_n === "jpg" ||
            filename_n === "png" ||
            filename_n === "jpeg"
          ) {
            fileName = `${imageName}.jpg`;
          } else if (filename_n === "gif") {
            fileName = `${imageName}.gif`;
          } else if (filename_n === "ico") {
            fileName = `${imageName}.ico`;
          } else if (filename_n === "mp4") {
            fileName = `${imageName}.mp4`;
          } else if (filename_n === "mov") {
            fileName = `${imageName}.mp4`;
          } else if (filename_n === "webm") {
            fileName = `${imageName}.mp4`;
          } else if (filename_n === "zip") {
            fileName = `${imageName}.zip`;
          } else if (filename_n === "pdf") {
            fileName = `${imageName}.pdf`;
          } else if (filename_n === "mp3" || filename_n === "m4a") {
            fileName = `${imageName}.mp3`;
          } else if (filename_n === "gif") {
            fileName = `${imageName}.gif`;
          }
          const uploadTask = storage.ref(`chats/${roomId}/${fileName}`).put(compressedFile);
          uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
            setShowmedia(false);
          },
            (error) => {
              console.log(error);
            },
            () => {
              storage.ref(`chats/${roomId}`).child(`${fileName}`).getDownloadURL().then((imageUrl) => {
                let mid = makeid(10);
                if (showreply) {
                  database
                    .ref(`/RoomsMsg/${roomId}/messages/${mid}`)
                    .update({
                      photo: imageUrl,
                      photoreply: true,
                      message: input,
                      uid: auth?.currentUser?.uid,
                      timestamp: Date.now(),
                      replyto: msgData.message,
                      replyid: msgData.id,
                      fname: image.name ? image.name : "",
                      replygif: msgData.gif ? msgData.gif : "",
                      replysticker: msgData.sticker ? msgData.sticker : "",
                      replymessage: msgData.message ? msgData.message : "",
                      replypostid: msgData.postid ? msgData.postid : "",
                      replypost: msgData.post ? msgData.post : "",
                      replypostusername: msgData.postusername ? msgData.postusername : "",
                    })
                    .then(() => {
                      console.log("message updated");
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                } else {
                  database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).set({
                    message: input,
                    uid: auth?.currentUser?.uid,
                    timestamp: Date.now(),
                    photo: imageUrl,
                    fname: image.name,
                  });
                }
              });
              if (uid) {
                database.ref(`/Users/${uid}/messages/${roomId}`).set({
                  id: auth?.currentUser?.uid,
                  text: `${currentUsername} sent media`,
                });
              }
              groupUsers && groupUsers.map((name) => {
                if (name !== auth?.currentUser?.uid) {
                  database.ref(`/Users/${name}/messages/${roomId}`).set({
                    id: auth?.currentUser?.uid,
                    text: `${currentUsername} sent media in group ${username}`,
                  });
                }
              })
              database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now() });
              document.getElementById("fileInput").value = null;
              setProgress(0);
              setImage(null);
              setCompressedFile(null);
              setInput("");
              resettextarea();
              setMediaName("");
            }
          );
        }
      } else {
        database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).set({
          message: input,
          uid: auth?.currentUser?.uid,
          timestamp: Date.now(),
        }).then(async () => {
          console.log("message sent");
          if (uid) {
            database.ref(`/Users/${uid}/messages/${roomId}`).set({
              id: auth?.currentUser?.uid,
              text: `${currentUsername} sent text`,
            });
          }
          groupUsers && groupUsers.map((name) => {
            if (name !== auth?.currentUser?.uid) {
              database.ref(`/Users/${name}/messages/${roomId}`).set({
                id: auth?.currentUser?.uid,
                text: `${currentUsername} sent text in group ${username}`,
              });
            }
          })
          database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now() });
        })
      }
      setInput("");
      resettextarea();
    } else if (audioURL) {
      imageName = makeid(10);
      let fileName = `${imageName}.mp3`;
      const uploadTask = storage.ref(`chats/${roomId}/${fileName}`).put(audio);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          setAudioURL("");
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage.ref(`chats/${roomId}`).child(`${fileName}`).getDownloadURL().then((imageUrl) => {
            let mid = makeid(10);
            database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).set({
              message: input,
              uid: auth?.currentUser?.uid,
              timestamp: Date.now(),
              photo: imageUrl,
            }).then(async () => {
              setAudioURL("");
              setProgress(0);
              if (uid) {
                database.ref(`/Users/${uid}/messages/${roomId}`).set({
                  id: auth?.currentUser?.uid,
                  text: `${currentUsername} sent recording`,
                });
              }
              groupUsers && groupUsers.map((name) => {
                if (name !== auth?.currentUser?.uid) {
                  database.ref(`/Users/${name}/messages/${roomId}`).set({
                    id: auth?.currentUser?.uid,
                    text: `${currentUsername} sent recording in group ${username}`,
                  });
                }
              })
              database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now() });
            })
          });
        }
      );
    } else {
      setInput("");
      resettextarea();
    }
    database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).set({ id: mid });
    setTimeout(() => messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight
    }), 0)
  };

  const deleteMsg = async () => {
    if (msgData.uid === auth?.currentUser?.uid) {
      Swal.fire({
        background:
          mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
        color: mode === "light" ? "black" : "white",
        title: "Are you sure to delete?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (msgData.photo) {
            try {
              var imageRef = storage.refFromURL(msgData.photo);
              imageRef.delete().then(() => {
                console.log("removed from storage");
              }).catch((e) => {
                console.log(e);
              });
            }
            catch (e) {
              console.log(e);
            }
          }
          await database
            .ref(`/RoomsMsg/${roomId}/messages/${msgData.id}`)
            .remove()
            .then(() => {
              handleClose2();
              console.log("message Deleted");
              Swal.fire({
                background:
                  mode === "light"
                    ? "rgba(248,249,250,1)"
                    : "rgba(33,37,41,1)",
                color: mode === "light" ? "black" : "white",
                title: "Message Deleted!",
                text: "Your Message has been deleted.",
                icon: "success",
                timer: 800,
                showConfirmButton: false,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  };

  const likeMessage = async (emojilink, id, uid) => {
    if (uid !== auth?.currentUser?.uid) {
      database.ref(`/Rooms/${roomId}`).update({
        timestamp: Date.now(),
      });
      database.ref(`/RoomsMsg/${roomId}/messages/${id}/like/${auth?.currentUser?.uid}`).update({
        id: emojilink,
      });
      if (uid !== auth?.currentUser?.uid) {
        database.ref(`/Users/${uid}/messages/${roomId}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} reacted to message`,
        });
      }
    }
  }

  const likeMsg = async (emojilink) => {
    if (msgData.uid !== auth?.currentUser?.uid) {
      database.ref(`/Rooms/${roomId}`).update({
        timestamp: Date.now(),
      });
      database.ref(`/RoomsMsg/${roomId}/messages/${msgData.id}/like/${auth?.currentUser?.uid}`).update({
        id: emojilink,
      });
      if (msgData.uid !== auth?.currentUser?.uid) {
        database.ref(`/Users/${uid}/messages/${roomId}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} reacted to message`,
        });
      }
    }
    handleClose2();
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

  const handleScroll = async (id) => {
    if (id) {
      const element = document.getElementById(id);
      if (element === null) {
        messageEl.current.scrollTo({
          top: 0
        })
        setFetching(true)
        setTimeout(() => {
          fetchId(id)
          document.getElementById(id).scrollIntoView()
          setFetching(false)
        }, 800)
      } else {
        element.scrollIntoView();
      }
    } else {
      console.log("cannot scroll");
    }
  };

  const handleMedia = () => {
    document.getElementById("image-preview1").style.display = "none";
    document.getElementById("fileInput").value = null;
    setImage(null);
    setMediaName("");
    setCompressedFile(null);
    setShowmedia(false);
  };

  const sendGif = async (url) => {
    setSeen([])
    setSeenGroup([])
    handleClose();
    if (uid) {
      database.ref(`/Rooms/${roomId}/seen/${uid}`).remove()
    }
    database.ref(`/Rooms/${roomId}/seenusers`).remove()
    let mid = makeid(10);
    if (!showreply) {
      database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).set({
        gif: url,
        uid: auth?.currentUser?.uid,
        timestamp: Date.now(),
      });
    } else {
      setShowreply(false);
      database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).update({
        gif: url,
        gifreply: true,
        uid: auth?.currentUser?.uid,
        timestamp: Date.now(),
        replyto: msgData.message,
        replyid: msgData.id,
        replypostid: msgData.postid ? msgData.postid : "",
        replypost: msgData.post ? msgData.post : "",
        replypostusername: msgData.postusername ? msgData.postusername : "",
        replygif: msgData.gif ? msgData.gif : "",
        replysticker: msgData.sticker ? msgData.sticker : "",
        replyphoto: msgData.photo ? msgData.photo : "",
        fname: msgData.fname ? msgData.fname : "",
        replymessage: msgData.message ? msgData.message : "",
      })
        .then(() => {
          console.log("message updated");
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (uid) {
      database.ref(`/Users/${uid}/messages/${roomId}`).set({
        id: auth?.currentUser?.uid,
        text: `${currentUsername} sent gif`,
      });
    }
    groupUsers && groupUsers.map((name) => {
      if (name !== auth?.currentUser?.uid) {
        database.ref(`/Users/${name}/messages/${roomId}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} sent gif in group ${username}`,
        });
      }
    })
    database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now() });
    database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).set({ id: mid });
    setTimeout(() => messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight
    }), 0)
  };

  const sendSticker = async (url) => {
    setSeen([])
    setSeenGroup([])
    handleClose();
    if (uid) {
      database.ref(`/Rooms/${roomId}/seen/${uid}`).remove()
    }
    database.ref(`/Rooms/${roomId}/seenusers`).remove()
    let mid = makeid(10);
    if (!showreply) {
      database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).set({
        sticker: url,
        uid: auth?.currentUser?.uid,
        timestamp: Date.now(),
      });
    } else {
      setShowreply(false);
      database.ref(`/RoomsMsg/${roomId}/messages/${mid}`).update({
        sticker: url,
        stickerreply: true,
        uid: auth?.currentUser?.uid,
        timestamp: Date.now(),
        replyto: msgData.message,
        replyid: msgData.id,
        replygif: msgData.gif ? msgData.gif : "",
        replysticker: msgData.sticker ? msgData.sticker : "",
        replyphoto: msgData.photo ? msgData.photo : "",
        fname: msgData.fname ? msgData.fname : "",
        replymessage: msgData.message ? msgData.message : "",
        replypostid: msgData.postid ? msgData.postid : "",
        replypost: msgData.post ? msgData.post : "",
        replypostusername: msgData.postusername ? msgData.postusername : "",
      })
        .then(() => {
          console.log("sticker sent");
        })
        .catch((e) => {
          console.log(e);
        });
    }
    groupUsers && groupUsers.map((name) => {
      if (name !== auth?.currentUser?.uid) {
        database.ref(`/Users/${name}/messages/${roomId}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} sent sticker`,
        });
      }
    })
    if (uid) {
      database.ref(`/Users/${uid}/messages/${roomId}`).set({
        id: auth?.currentUser?.uid,
        text: `${currentUsername} sent sticker`,
      });
    }
    database.ref(`Rooms/${roomId}`).update({ timestamp: Date.now(), });
    database.ref(`/Rooms/${roomId}/seenMsg/${auth?.currentUser?.uid}`).set({ id: mid });
    setTimeout(() => messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight
    }), 0)
  };

  function resettextarea() {
    document.getElementById("autoresizing").style.height = "35px";
  }

  const callback = useCallback(
    (e, id) => {
      e.preventDefault();
      handleShow2(true);
      database
        .ref(`/RoomsMsg/${roomId}/messages/${id.context}`)
        .on("value", (snapshot) => {
          setMsgData({
            id: snapshot.key,
            postid: snapshot.val().postid,
            photo: snapshot.val().photo,
            like: snapshot.val().like,
            message: snapshot.val().message ? snapshot.val().message : null,
            gif: snapshot.val().gif,
            sticker: snapshot.val().sticker,
            fname: snapshot.val().fname ? snapshot.val().fname : null,
            post: snapshot.val().post,
            postusername: snapshot.val().username,
            uid: snapshot.val().uid,
          });
        });
    },
    [roomId]
  );

  const setReplyIcon = async (id) => {
    database
      .ref(`/RoomsMsg/${roomId}/messages/${id}`)
      .on("value", (snapshot) => {
        setMsgData({
          id: snapshot.key,
          postid: snapshot.val().postid,
          photo: snapshot.val().photo,
          like: snapshot.val().like,
          message: snapshot.val().message ? snapshot.val().message : null,
          gif: snapshot.val().gif,
          sticker: snapshot.val().sticker,
          fname: snapshot.val().fname ? snapshot.val().fname : null,
          post: snapshot.val().post,
          postusername: snapshot.val().username,
          uid: snapshot.val().uid,
        });
      });
    setShowreply(true);
    setShowedit(false);
    let element = document.getElementById("autoresizing")
    setTimeout(() => element.focus(), 500);
  }

  const bind = useLongPress(callback, {
    filterEvents: (event) => true,
    threshold: 300,
    captureEvent: true,
    cancelOnMovement: true,
    detect: "both",
  });

  const MessageData = async (id) => {
    handleShow2(true);
    database
      .ref(`/RoomsMsg/${roomId}/messages/${id}`)
      .on("value", (snapshot) => {
        setMsgData({
          id: snapshot.key,
          postid: snapshot.val().postid,
          photo: snapshot.val().photo,
          like: snapshot.val().like,
          message: snapshot.val().message ? snapshot.val().message : null,
          gif: snapshot.val().gif,
          sticker: snapshot.val().sticker,
          fname: snapshot.val().fname ? snapshot.val().fname : null,
          post: snapshot.val().post,
          postusername: snapshot.val().username,
          uid: snapshot.val().uid,
        });
      })
  }

  const handleTyping = (e) => {
    if (e.length > 0) {
      database.ref(`/Rooms/${roomId}/${auth?.currentUser?.uid}`).update({
        typing: true,
      });

    } else {
      database.ref(`/Rooms/${roomId}/${auth?.currentUser?.uid}`).update({
        typing: false,
      });
    }
  };

  const copyToClipboard = (element) => {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(element).select();
    document.execCommand("copy");
    $temp.remove();
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Success!",
      text: "Copied to clipboard",
      icon: "success",
      timer: 800,
      showConfirmButton: false,
    });
    handleClose2();
  };

  const handleOnSelect = async (item) => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Confirm?",
      text: `Are you sure add ${convert_to_username(item.uid)}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add!",
    }).then((result) => {
      if (result.isConfirmed) {
        database
          .ref(`/Rooms/${roomId}/users/${item.uid}`).set({ id: item.uid, timestamp: Date.now() })
          .then(() => {
            database.ref(`/Users/${item.uid}/messages/${roomId}`).set({
              id: auth?.currentUser?.uid,
              text: `${currentUsername} added you to group ${username}`,
            });
            let msgid = makeid(10)
            database.ref(`/RoomsMsg/${roomId}/messages/${msgid}`).set({
              message: `${currentUsername} added ${convert_to_username(item.uid)}`,
              uid: auth?.currentUser?.uid,
              timestamp: Date.now(),
            });
            Swal.fire({
              background:
                mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              color: mode === "light" ? "black" : "white",
              title: 'Success',
              text: `${item.name} added to group`,
              icon: "success",
              timer: 800,
              showConfirmButton: false,
            });

          }).catch((e) => {
            console.log(e)
          })
      } else {

      }
    })

  };

  const formatResult = (item) => {
    return item;
  };

  const handleClear = () => { };

  const deleteGroupUser = async (user) => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: `Are you sure to remove ${convert_to_username(user)}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let msgid = makeid(10)
        await database.ref(`/RoomsMsg/${roomId}/messages/${msgid}`).set({
          message: `${currentUsername} removed`,
          uid: auth?.currentUser?.uid,
          timestamp: Date.now(),
        });
        await database.ref(`/Users/${user}/messages/${roomId}`).remove()
        await database.ref(`/Rooms/${roomId}/users/${user}`).remove()
          .then(() => {
            Swal.fire({
              background:
                mode === "light"
                  ? "rgba(248,249,250,1)"
                  : "rgba(33,37,41,1)",
              color: mode === "light" ? "black" : "white",
              title: "Removed!",
              text: "User removed from group",
              icon: "success",
              timer: 800,
              showConfirmButton: false,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  }

  const handleUpload = async () => {
    if (image && !link) {
      var imageName = roomId;
      let fileName = "";
      if (image.name.toLowerCase().includes(".jpg") || image.name.toLowerCase().includes(".png") || image.name.toLowerCase().includes(".jpeg")) {
        fileName = `${imageName}.jpg`;
      } else if (image.name.toLowerCase().includes(".gif")) {
        fileName = `${imageName}.gif`;
      }
      const uploadTask = storage.ref(`userphoto/${fileName}`).put(compressedFile);
      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
        document.getElementById("uploadBtn").disabled = true;
        document.getElementById("uploadBtn").innerHTML = `Uploading ${progress}`;
      }, (error) => {
        console.log(error);
      }, () => {
        storage.ref("userphoto").child(`${fileName}`).getDownloadURL().then((imageUrl) => {
          database.ref(`/Rooms/${roomId}`).update({ photo: imageUrl });
          Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Success!",
            text: "Group Photo Changed",
            icon: "success",
            timer: 800,
            showConfirmButton: false
          });
        }).catch((e) => {
          console.log(e);
          Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Error!",
            text: e,
            icon: "error",
            timer: 800,
            showConfirmButton: false
          });
        });
        setProgress(0);
        setImage(null);
        handleClose4();
        document.getElementById("image-preview").style.display = "none";
        document.getElementById("fileInputGroupPhoto").value = "";
      });
    } else if (link) {
      database.ref(`/Rooms/${roomId}`).update({ photo: link }).then(() => {
        setImage(null);
        handleClose4();
        setLink("");
        document.getElementById("image-preview").style.display = "none";
        Swal.fire({
          background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Success!",
          text: "User Photo Changed",
          icon: "success",
          timer: 800,
          showConfirmButton: false
        });
      }).catch((e) => {
        console.log(e);
        Swal.fire({
          background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Error!",
          text: e,
          icon: "error",
          timer: 800,
          showConfirmButton: false
        });
      });
    }
  };

  const handleLink = () => {
    if (link) {
      var selectedImageSrc = link;
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      setImage(link);
    }
  };

  const handleChange1 = (e) => {
    if (e.target.files[0] && (e.target.files[0].name.toLowerCase().includes(".jpg") || e.target.files[0].name.toLowerCase().includes(".png") || e.target.files[0].name.toLowerCase().includes(".jpeg") || e.target.files[0].name.toLowerCase().includes(".gif"))) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      const image = e.target.files[0];
      if (image.name.toLowerCase().includes(".jpg") || image.name.toLowerCase().includes(".png") || image.name.toLowerCase().includes(".jpeg")) {
        new Compressor(image, {
          quality: 0.4,
          success: (compressedResult) => {
            setCompressedFile(compressedResult);
          }
        });
      } else {
        setCompressedFile(image);
      }
    } else {
      Swal.fire({
        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
        color: mode === "light" ? "black" : "white",
        title: "Error!",
        text: "File not supported",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const changeGroupUsername = async () => {
    handleClose3()
    Swal.fire({
      background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Change Username",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeHolder: username ? username : ""
      },
      inputValue: username,
      showCancelButton: true,
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        database.ref(`/Rooms/${roomId}`).update({ groupName: result.value }).then(() => {
          Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Username Changed",
            timer: 800,
            icon: "success",
            text: `Username Changed to ${result.value}`,
            showConfirmButton: false
          });
        }).catch((e) => {
          Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Error",
            timer: 1500,
            icon: "error",
            text: e,
            showConfirmButton: false
          });
        });
      }
    });
  }

  const removeLikeMsg = async (like, id) => {
    if (auth?.currentUser?.uid === like) {
      database.ref(`/RoomsMsg/${roomId}/messages/${id}/like/${like}`).remove().then(() => {
        console.log("like removed")
        handleClose6()
      }).catch((e) => {
        console.log(e)
      })
    }

  }

  const leaveGroup = async () => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Confirm?",
      text: `Are you sure leave?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let msgid = makeid(10)
        await database.ref(`/RoomsMsg/${roomId}/messages/${msgid}`).set({
          message: `${currentUsername} left`,
          uid: auth?.currentUser?.uid,
          timestamp: Date.now(),
        });
        await database.ref(`/Rooms/${roomId}/users/${auth?.currentUser?.uid}`).remove().then(() => {
          history.push('/message')
          Swal.fire({
            background:
              mode === "light"
                ? "rgba(248,249,250,1)"
                : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Left!",
            text: "You left group",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
          });
        }).catch((e) => {
          console.log(e)
        })
      }
    }
    )
  }

  const handleOnSelect_forward = (item) => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "You are forwarding message to",
      text: `${item.name.toLowerCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send",
    }).then((result) => {
      if (result.isConfirmed) {
        var names = [item.uid, auth?.currentUser?.uid];
        names.sort();
        let chatRoom = names.join("");
        database.ref(`/Rooms/${chatRoom}/seen/${item.uid}`).remove()
        database.ref(`/Rooms/${chatRoom}`).set({
          name1: item.uid,
          name2: auth?.currentUser?.uid,
          timestamp: Date.now(),
        });
        let mid = makeid(10);
        database.ref(`/RoomsMsg/${chatRoom}/messages/${mid}`).set({
          forwarded: true,
          post: msgData.postUrl ? msgData.postUrl : "",
          uid: auth?.currentUser?.uid,
          email: currentEmail,
          timestamp: Date.now(),
          postuid: msgData.postuid ? msgData.postuid : "",
          postid: msgData.postid ? msgData.postid : "",
          photo: msgData.photo ? msgData.photo : "",
          message: msgData.message ? msgData.message : "",
          sticker: msgData.sticker ? msgData.sticker : "",
          gif: msgData.gif ? msgData.gif : ""
        });
        database.ref(`/Rooms/${chatRoom}`).update({ timestamp: Date.now() });
        database.ref(`/Users/${item.uid}/messages/${chatRoom}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} forwarded you a message `,
        })
          .then(() => {
            handleClose9()
            handleClose2()
            Swal.fire({
              background:
                mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              color: mode === "light" ? "black" : "white",
              title: "Sent!",
              text: `Message forwarded to ${item.name}`,
              icon: "success",
              timer: 800,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const setRoomTheme = (id) => {
    database.ref(`/Rooms/${roomId}`).update({
      "chatTheme": id,
    }).then(() => {
      Swal.fire({
        background:
          mode === "light"
            ? "rgba(248,249,250,1)"
            : "rgba(33,37,41,1)",
        color: mode === "light" ? "black" : "white",
        title: "Theme Changed!",
        text: "Your Theme has been applied.",
        icon: "success",
        timer: 800,
        showConfirmButton: false,
      });
      handleClose10()
    })
  }

  const resetChatTheme = () => {
    database.ref(`/Rooms/${roomId}/chatTheme`).remove()
      .then(() => {
        Swal.fire({
          background:
            mode === "light"
              ? "rgba(248,249,250,1)"
              : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Theme Changed!",
          text: "Your Theme has been Reset.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
        handleClose10()
      })
  }

  return (
    <>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header
          style={{
            padding: "5px 10px",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: mode === "light" ? "black" : "white" }}>
            Gifs & Stickers
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Tabs
            defaultActiveKey="gif"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab
              eventKey="gif"
              title="GIF"
              style={{
                height: "60vh",
                overflowY: "auto",
              }}
            >
              <center>
                {gifs.map((gif) => (
                  <img
                    src={gif.photo}
                    alt=""
                    width="160px"
                    height="100px"
                    onClick={() => sendGif(gif.photo)}
                    style={{ cursor: "pointer", margin: "5px" }}
                  />
                ))}
              </center>
            </Tab>
            <Tab
              eventKey="sticker"
              title="STICKER"
              style={{
                height: "60vh",
                overflowY: "auto",
              }}
            >
              <center>
                {stickers.map((sticker1) => (
                  <img
                    alt=""
                    src={sticker1.photo}
                    width="65px"
                    height="65px"
                    onClick={() => sendSticker(sticker1.photo)}
                    style={{ cursor: "pointer", margin: "8px" }}
                  />
                ))}
              </center>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
      <Modal
        show={show2}
        size="sm"
        onHide={handleClose2}
        centered
        scrollable
      >
        <Modal.Body
          style={{
            padding: 0,
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
          className="noselect"
        >
          <ListGroup>
            {msgData.uid !== auth?.currentUser?.uid && !msgData.like && (
              <ListGroup.Item
                variant="secondary"
                action
              >
                <div
                  class="btn-group-sm mr-2"
                  role="group"
                  aria-label="First group"
                >
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(thumbsup)}
                  >
                    <img src={thumbsup} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(smile)}
                  >
                    <img src={smile} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(laugh)}
                  >
                    <img src={laugh} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(heartlike)}
                  >
                    <img src={heartlike} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(cry)}
                  >
                    <img src={cry} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(sweat)}
                  >
                    <img src={sweat} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(wink)}
                  >
                    <img src={wink} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(moneymouth)}
                  >
                    <img src={moneymouth} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(smilingfacewithhearts)}
                  >
                    <img src={smilingfacewithhearts} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(grinningfacewithbigeyes)}
                  >
                    <img src={grinningfacewithbigeyes} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(facewithhandovermouth)}
                  >
                    <img src={facewithhandovermouth} height={"25px"} alt="" />
                  </button>
                  <button
                    type="button"
                    class="btn"
                    onClick={() => likeMsg(starstruck)}
                  >
                    <img src={starstruck} height={"25px"} alt="" />
                  </button>
                </div>
              </ListGroup.Item>
            )}
            {msgData.message && (
              <ListGroup.Item
                variant="primary"
                action
                onClick={() => {
                  copyToClipboard(msgData.message);
                }}
              >
                Copy text
              </ListGroup.Item>
            )}
            {msgData.uid === auth?.currentUser?.uid && (
              <ListGroup.Item
                variant="danger"
                action
                onClick={() => {
                  deleteMsg();
                }}
              >
                Delete
              </ListGroup.Item>
            )}
            <ListGroup.Item
              variant="success"
              action
              onClick={() => {
                handleShow9();
              }}
            >
              Forward
            </ListGroup.Item>
            {msgData.uid === auth?.currentUser?.uid && msgData.message && (
              <ListGroup.Item
                variant="info"
                action
                onClick={() => {
                  setShowedit(true);
                  setShowreply(false);
                  setInput(msgData.message);
                  handleClose2();
                  let element = document.getElementById("autoresizing")
                  setTimeout(() => element.focus(), 500);
                }}
              >
                Edit
              </ListGroup.Item>
            )}
            {(msgData.message ||
              msgData.gif ||
              msgData.sticker ||
              msgData.photo ||
              msgData.postid) && (
                <ListGroup.Item
                  variant="secondary"
                  action
                  onClick={() => {
                    setShowreply(true);
                    setShowedit(false);
                    handleClose2();
                    let element = document.getElementById("autoresizing")
                    setTimeout(() => element.focus(), 500);
                  }}
                >
                  Reply
                </ListGroup.Item>
              )}
            <ListGroup.Item
              variant="warning"
              action
              onClick={() => {
                handleClose2();
              }}
            >
              Cancel
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
      <Modal
        show={show3}
        size="md"
        onHide={handleClose3}
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
            {username}
          </Modal.Title>
          <IconButton onClick={handleClose3}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "10px",
            maxHeight: "70vh",
            overflow: "auto",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
        >
          <div style={{
            display: "grid", placeItems: "center", marginTop: "10px"
          }}
          >
            <img alt="" onClick={() => handleShow4()} src={photo} style={{
              height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px", cursor: "pointer"
            }} />
            <h2 onClick={() => changeGroupUsername()} style={{
              color: mode === "light" ? "black" : "white", cursor: "pointer", marginTop: "20px"
            }}>
              {username}
            </h2>
          </div>
          <br />
          {groupAdmin === auth?.currentUser?.uid && <><ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            onClear={handleClear}
            formatResult={formatResult}
            placeholder="Add New User"
            styling={{
              backgroundColor: mode === "light" ? "white" : "black",
              placeholderColor: "gray",
              color: mode === "light" ? "black" : "white",
              hoverBackgroundColor:
                mode === "light" ? "lightblue" : "rgb(21, 64, 89)",
              height: "35px",
              borderRadius: "8px",
              border: "none",
            }}
          />
            <br /></>}
          {groupUsers && groupUsers.map((user) => {
            return <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Like uid={user} key={user} />
              {user === groupAdmin && <div style={{
                display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", color: "gray"
              }}>
                Admin
              </div>}
              {user !== auth?.currentUser?.uid && groupAdmin === auth?.currentUser?.uid && <Link style={{
                cursor: "pointer", textDecoration: "none",
                display: "flex", justifyContent: "center", alignItems: "center"
              }} onClick={() => deleteGroupUser(user)}>
                remove
              </Link>}
            </div>
          })}
          <br />

          {groupAdmin !== auth?.currentUser?.uid ? <Button onClick={leaveGroup}
            variant="danger"
            size="sm"
            style={{ width: "100%", height: "30px" }}>
            Leave Group
          </Button>
            : <Button onClick={() => {
              removeRoom(roomId);
            }}
              variant="danger"
              size="sm"
              style={{ width: "100%", height: "30px" }}>
              Delete Group
            </Button>
          }
        </Modal.Body>
      </Modal>
      <Modal
        show={show4}
        onHide={handleClose4}
        centered
        scrollable
      >
        <Modal.Header style={
          {
            padding: "5px 10px",
            backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }
        }>
          <Modal.Title style={
            {
              color: mode === "light" ? "black" : "white"
            }
          }>
            Upload Picture
          </Modal.Title>
          <IconButton onClick={
            () => {
              setLink("");
              setImage(null);
              setCompressedFile(null);
              handleClose4()
              document.getElementById("image-preview").style.display = "none";
            }
          }>
            <CloseOutlinedIcon style={
              {
                color: "red",
                fontSize: "20px"
              }
            } />
          </IconButton>
        </Modal.Header>
        <Modal.Body style={
          {
            backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }
        }>
          <div className="createPost">
            <div className="createPost__loggedIn">
              <div className="createPost__imagePreview">
                <img id="image-preview" alt="If not visible, try different link"
                  style={{
                    color: mode === "light" ? "black" : "white",
                    height: "250px",
                    width: "100%",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    objectFit: "contain",
                  }} />
              </div>
              {
                !image && (
                  <>
                    <center>
                      <div className="createPost__imageUpload">
                        <label htmlFor="fileInputGroupPhoto"
                          style={
                            { cursor: "pointer" }
                          }>
                          <AddAPhotoIcon color="primary"
                            style={
                              { fontSize: "60px" }
                            } />
                        </label>
                        <input type="file" id="fileInputGroupPhoto" accept="image/*"
                          onChange={handleChange1}></input>
                      </div>
                      <br />
                      <div style={
                        {
                          color: mode === "light" ? "black" : "white"
                        }
                      }>or</div>
                      <br />
                      <div className="commentInput">
                        <input className="commentInput__textarea" placeholder="Paste image link here"
                          value={link}
                          style={
                            {
                              backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                              color: mode === "light" ? "#1F1B24" : "white"
                            }
                          }
                          onKeyPress={
                            (event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleLink();
                              }
                            }
                          }
                          onChange={
                            (e) => setLink(e.target.value)
                          }
                          maxLength="500"></input>
                        <div style={
                          {
                            opacity: link ? 1 : 0.6,
                            cursor: link ? "pointer" : "default"
                          }
                        }
                          className="commentInput__btn"
                          onClick={handleLink}>
                          <Button style={
                            {
                              disabled: link ? false : true,
                              opacity: link ? 1 : 0.5
                            }
                          }
                            variant="secondary"
                            size="sm">
                            OK
                          </Button>
                        </div>
                      </div>
                    </center>
                  </>
                )
              }
              {
                image && (
                  <>
                    <div className="d-grid gap-2"
                      style={
                        { marginTop: "10px" }
                      }>
                      <Button variant="primary" size="md" id="uploadBtn"
                        onClick={handleUpload}
                        style={
                          {
                            color: image || link ? "white" : "gray",
                            cursor: image || link ? "pointer" : "default"
                          }
                        }>
                        Upload
                      </Button>
                    </div>

                  </>
                )
              } </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={show5}
        size="md"
        onHide={handleClose5}
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
            Seen
          </Modal.Title>
          <IconButton onClick={handleClose5}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "10px",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
          className="noselect"
        >
          <ListGroup>
            {seenGroup && seenGroup.map((user) => {
              return <Like uid={user.id} key={user.id} />
            })}
          </ListGroup>
        </Modal.Body>
      </Modal>
      <Modal
        show={show6}
        size="sm"
        onHide={handleClose6}
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
            Reacted
          </Modal.Title>
          <IconButton onClick={handleClose6}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "10px",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
          className="noselect"
        >
          <p style={{ color: "gray", fontSize: "small" }}>Click on reaction to remove it</p>
          {likeData.like && Object.entries(likeData.like).map(([k, v]) => {
            return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Like uid={k} key={k} />
              <img src={v.id} className={mode === "light" ? "heartIconlight_modal" : "heartIcondark_modal"} alt="" onClick={() => {
                removeLikeMsg(k, likeData.id)
              }} />
            </div>
          })}
        </Modal.Body>
      </Modal>
      <Modal
        show={show7}
        size="lg"
        onHide={handleClose7}
        centered
        scrollable
        fullScreen={true}
        style={{ padding: 0 }}
      >
        <Modal.Body
          style={{
            padding: 0,
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
        >
          <div style={{
            position: "relative", padding: 0
          }}>

            {!showImage.includes(".pdf") && <>{showImage.includes(".mp4") ?
              <video
                preload="metadata"
                src={showImage}
                style={{
                  height: "85vh", objectFit: "contain", width: "100%"
                }}
                controls />
              :
              <img src={showImage} style={{
                height: "85vh", objectFit: "contain", width: "100%"
              }} />
            }</>}
            {showImage.includes(".pdf") &&
              <iframe src={showImage} style={{
                height: "85vh", width: "100%"
              }} frameborder="0" />
            }

            <IconButton onClick={handleClose7} style={{
              position: "absolute", right: 0, top: 0
            }}>
              <CloseOutlinedIcon color="error" />
            </IconButton>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={show8}
        onHide={handleClose8}
        centered
        scrollable
      >
        <Modal.Body style={{
          padding: 0,
          backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
        }}>
          <div style={{
            position: "relative", padding: 0
          }}>
            <img src={photo} style={{
              height: "60vh", objectFit: "cover", width: "100%"
            }} />
            <IconButton onClick={handleClose8} style={{
              position: "absolute", right: 0, top: 0
            }}>
              <CloseOutlinedIcon color="error" />
            </IconButton>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={show9}
        onHide={handleClose9}
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
            Forward To
          </Modal.Title>
          <IconButton onClick={handleClose9}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "60vh",
            overflowY: "auto",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect_forward}
            onClear={handleClear}
            formatResult={formatResult}
            placeholder="Search user"
            styling={{
              backgroundColor: mode === "light" ? "white" : "black",
              placeholderColor: "gray",
              color: mode === "light" ? "black" : "white",
              hoverBackgroundColor:
                mode === "light" ? "lightblue" : "rgb(21, 64, 89)",
              height: "35px",
              borderRadius: "10px",
              border: "none",
            }}
          />
          {groups && groups.map((group) => {
            return <Forward id={group} key={group} messageData={msgData} uid={uid} handleClose2={handleClose2} handleClose9={handleClose9} />
          })}
        </Modal.Body>
      </Modal>
      <Modal
        show={show10}
        onHide={handleClose10}
        size="lg"
        centered
      >
        <Modal.Header
          style={{
            padding: "5px 10px",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: mode === "light" ? "black" : "white" }}>
            Chat Themes
          </Modal.Title>
          <div style={{ display: "flex" }}>
            <IconButton onClick={resetChatTheme}>
              <ReplayIcon color="primary" />
            </IconButton>
            <IconButton onClick={handleClose10}>
              <CloseOutlinedIcon color="error" />
            </IconButton>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: 0,
            overflow: "scroll",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <div style={{
            display: "flex"
          }}>
            {themes.map((them) => (
              <img
                src={them.photo}
                alt=""
                className="theme_pic"
                onClick={() => setRoomTheme(them.photo)}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={show11}
        size="sm"
        onHide={handleClose11}
        centered
        scrollable
      >
        <Modal.Body
          style={{
            padding: 0,
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
          }}
          className="noselect"
        >
          <ListGroup>
            <ListGroup.Item
              variant="success"
              action
              onClick={() => {
                handleClose11()
                handleShow10();
              }}
            >
              Change Theme
            </ListGroup.Item>
            {!group && <ListGroup.Item
              variant="danger"
              action
              onClick={() => {
                removeRoom(roomId);
              }}
            >
              Delete Room
            </ListGroup.Item>}
            {group && <ListGroup.Item
              variant="info"
              action
              onClick={() => {
                handleShow3();
                handleClose11()
              }}
            >
              Group Details
            </ListGroup.Item>}
            <ListGroup.Item
              variant="warning"
              action
              onClick={() => {
                handleClose11();
              }}
            >
              Cancel
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>

      <div className="chat" id={chatTheme ? "" : mode === "light" ? "chat_light" : "chat_dark"} style={{ backgroundImage: chatTheme ? `url(${chatTheme})` : "", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
        <div className="chat__header" style={{ backgroundColor: mode === "light" ? "rgba(248,249,250,0.5)" : "rgba(33,37,41,0.5)" }}>
          <Link to="/message">
            <IconButton>
              <Badge
                badgeContent={mnotifications.length}
                color="primary"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <ArrowBackIosIcon style={{ color: mode === 'light' ? 'black' : 'white' }} />
              </Badge>
            </IconButton>
          </Link>
          <img
            className="roomPic"
            src={photo}
            alt=""
            onClick={handleShow8}
          />
          <div className="chat__headerInfo">
            {uid ? <Link
              style={{
                textDecoration: "none",
                color: mode === "light" ? "black" : "white",
                fontWeight: "600"
              }}
              to={`/userprofile/${uid}`}
            >
              {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
            </Link>
              :
              <div onClick={handleShow3} style={{ cursor: "pointer", color: mode === "light" ? "black" : "white", fontWeight: "600" }}>
                {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
              </div>
            }
            {!group && <>
              {status ? (
                <div style={{ color: mode === "light" ? "black" : "white", fontSize: "12px", display: "flex", opacity: 0.6 }}>
                  <div className="chatonline"></div>
                  <div>Active now</div>
                </div>
              ) : (
                <div style={{ color: mode === "light" ? "black" : "white", fontSize: "12px", opacity: 0.6 }}>
                  Active {timeDifference(new Date(), new Date(lastseen))}
                </div>
              )}
            </>}
          </div>
          <div className="chat__headerRight">
            <IconButton onClick={handleShow11}>
              <MoreHorizIcon style={{ color: mode === 'light' ? 'black' : 'white' }} />
            </IconButton>
          </div>
        </div>
        <div className="chat__body" ref={messageEl} id={chatTheme ? "" : mode === "light" ? "chat__body_light" : "chat__body_dark"}>
          {!fetching ? (messages1.length < totalMessageCount) &&
            <p className="chat_timeline" onClick={() => fetch()} id="fetchMore">
              <div className={mode === "light" ? "datelight" : "datedark"} style={{ width: "180px", backgroundColor: mode === "light" ? "white" : "black", color: mode === "light" ? "black" : "white", borderRadius: "20px", padding: "2px", fontSize: "12px", textAlign: "center", cursor: "pointer" }}>
                Load More Messages
              </div>
            </p> :
            fetching && (messages1.length < totalMessageCount) &&
            <p className="chat_timeline">
              <img src={loadingIcon} height={'20px'} width={'20px'} />
            </p>}
          {dates && dates.map((data) => {
            return <>
              <StickyBox style={{ zIndex: "2" }}>
                <p className="chat_timeline">
                  <div className={mode === "light" ? "datelight" : "datedark"} style={{ width: "140px", color: mode === "light" ? "black" : "white", borderRadius: "20px", padding: "2px", fontSize: "12px", textAlign: "center" }}>{data}</div>
                </p>
              </StickyBox>
              {messages && messages.map(({ id, message }) => {
                return <> {data === id &&
                  message && message.map(({ id, message }) => {
                    return <>
                      <div
                        key={message.timestamp}
                        {...bind(id)}
                        id={id}
                        style={{ zIndex: "1" }}
                        className="noselect"
                      >
                        <div style={{ display: "flex" }}>
                          <img alt="" src={convert_to_pic(message.uid)} style={{ height: "20px", width: "10px", objectFit: "cover", display: auth?.currentUser?.uid !== message.uid ? "block" : "none", borderRadius: "10px", minWidth: "20px", margin: "5px" }} />
                          <div className={`chat__message ${message.uid === auth?.currentUser?.uid && "chat__receiver"}`}
                            style={{
                              color: mode === "light" ? "black" : "white", backgroundColor: mode === "light" ? message.uid === auth?.currentUser?.uid ? "#ffc8b8" : "#c8e1fd" : message.uid === auth?.currentUser?.uid ? "#844836" : "#274261",
                            }}
                          >
                            <div className={message.uid === auth?.currentUser?.uid ? "emojiplate" : "emojiplateuser"}>
                              <div
                                class="btn-group-sm mr-2"
                                role="group"
                                aria-label="First group"
                              >
                                <button
                                  type="button"
                                  class="btn"
                                  onClick={() => likeMessage(thumbsup, id, message.uid)}
                                >
                                  <img src={thumbsup} height={"25px"} alt="" />
                                </button>
                                <button
                                  type="button"
                                  class="btn"
                                  onClick={() => likeMessage(smile, id, message.uid)}
                                >
                                  <img src={smile} height={"25px"} alt="" />
                                </button>
                                <button
                                  type="button"
                                  class="btn"
                                  onClick={() => likeMessage(laugh, id, message.uid)}
                                >
                                  <img src={laugh} height={"25px"} alt="" />
                                </button>
                                <button
                                  type="button"
                                  class="btn"
                                  onClick={() => likeMessage(heartlike, id, message.uid)}
                                >
                                  <img src={heartlike} height={"25px"} alt="" />
                                </button>
                                <button
                                  type="button"
                                  class="btn"
                                  onClick={() => likeMessage(cry, id, message.uid)}
                                >
                                  <img src={cry} height={"25px"} alt="" />
                                </button>
                              </div>
                            </div>
                            <ReplyIcon style={{ fontSize: "25px" }} className={message.uid === auth?.currentUser?.uid ? "replyicon" : "replyiconuser"} color="primary" onClick={(e) => {
                              setReplyIcon(id)
                            }} />
                            <ExpandMoreIcon style={{ fontSize: "25px" }} className={message.uid === auth?.currentUser?.uid ? "moreoption" : "moreoptionuser"} color="primary" onClick={() => MessageData(id)} />
                            {message.forwarded &&
                              <div>
                                <i style={{
                                  color: mode === "light" ? "darkgray" : "lightgray"
                                }}>
                                  forwarded
                                </i>
                              </div>
                            }
                            {message.statusreply &&
                              <>
                                <div style={{ marginBottom: "5px" }}>
                                  {message.uid === auth?.currentUser?.uid ? "You replied to status" : "Replied to your status"}
                                </div>
                                {message.statusphoto.includes(".mp4") ? (
                                  <video
                                    className="chatpost__img"
                                    src={message.statusphoto}
                                    controls
                                  ></video>
                                ) : (
                                  <img
                                    alt=""
                                    className="chatpost__img"
                                    src={message.statusphoto}
                                  />
                                )}

                              </>}
                            {(message.replysticker || message.replygif || message.replyphoto || message.replypost) &&
                              <div
                                onClick={() => handleScroll(message.replyid)}
                                style={{
                                  cursor: "pointer",
                                  backgroundColor:
                                    mode === "light"
                                      ? message.uid === auth?.currentUser?.uid
                                        ? "#ffb098"
                                        : "#95c6ff"
                                      : message.uid === auth?.currentUser?.uid
                                        ? "#4f1c0d"
                                        : "#193d66",
                                  padding: "5px",
                                  color: mode === "light" ? "black" : "white",
                                }}
                              >
                                {message.replyto}
                                {message.replysticker &&
                                  <img
                                    src={message.replysticker}
                                    className="chat__img_reply"
                                    alt=""
                                  />}
                                {message.replygif &&
                                  <img
                                    src={message.replygif}
                                    className="chat__img_reply"
                                    alt=""
                                  />}
                                {message.replyphoto &&
                                  <>
                                    {message.replyphoto.includes(".mp3") && (
                                      <audio
                                        preload="metadata"
                                        src={message.replyphoto}
                                        controls
                                      ></audio>
                                    )}
                                    {message.replyphoto.includes(".mp4") && (
                                      <video
                                        preload="metadata"
                                        className="chat__img_reply"
                                        src={message.replyphoto}
                                        controls
                                      ></video>
                                    )}

                                    {(message.replyphoto.includes(".jpg") ||
                                      message.replyphoto.includes(".gif") ||
                                      message.replyphoto.includes(".ico")) && (
                                        <img
                                          alt=""
                                          className="chat__img_reply"
                                          src={message.replyphoto}
                                        />
                                      )}
                                    {message.replyphoto.includes(".pdf") && message.fname}
                                    {message.replyphoto.includes(".zip") && message.fname}
                                    {message.replymessage && (
                                      <div className="mediaText">{message.replymessage}</div>
                                    )}</>}
                                {message.replypost &&
                                  <>
                                    {message.replyto}
                                    {message.replypost.includes(".mp4") ? (
                                      <video
                                        className="chat__img_reply"
                                        src={message.replypost}
                                        controls
                                      ></video>
                                    ) : (
                                      <img
                                        alt=""
                                        className="chat__img_reply"
                                        src={message.replypost}

                                      />
                                    )}
                                  </>}
                              </div>
                            }
                            {message.replyto && <p
                              onClick={() => handleScroll(message.replyid)}
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  mode === "light"
                                    ? message.uid === auth?.currentUser?.uid
                                      ? "#ffb098"
                                      : "#95c6ff"
                                    : message.uid === auth?.currentUser?.uid
                                      ? "#4f1c0d"
                                      : "#193d66",
                                padding: "5px",
                                color: mode === "light" ? "black" : "white",
                              }}
                            >
                              {message.replyto}
                            </p>
                            }
                            {message.gif &&
                              <img src={message.gif} className="chatgif__img" alt="" />
                            }
                            {message.sticker &&
                              <img src={message.sticker} className="chatsticker__img" alt="" />
                            }
                            {message.photo &&
                              <>
                                {message.photo.includes(".mp3") &&
                                  <audio
                                    preload="metadata"
                                    src={message.photo}
                                    controls
                                  ></audio>}
                                {message.photo.includes(".mp4") && (
                                  <div style={{ position: "relative" }} onClick={() => {
                                    setShowImage(message.photo)
                                    handleShow7()
                                  }}>
                                    <video
                                      src={message.photo}
                                      className="chatpost__img"
                                    />
                                    <PlayArrowIcon color="primary" style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      fontSize: "80px"
                                    }} />
                                  </div>
                                )}
                                {(message.photo.includes(".jpg") ||
                                  message.photo.includes(".gif") ||
                                  message.photo.includes(".ico")) && (
                                    <img
                                      className="chatpost__img"
                                      onClick={() => {
                                        setShowImage(message.photo)
                                        handleShow7()
                                      }}
                                      alt=""
                                      src={message.photo}

                                    />
                                  )}
                                {message.photo.includes(".pdf") &&
                                  <div style={{ display: "flex" }}>
                                    <div onClick={() => {
                                      setShowImage(message.photo)
                                      handleShow7()
                                    }}
                                    >
                                      {message.fname}{" "}

                                    </div>
                                    <a
                                      href={message.photo}
                                      target="_blank"
                                      style={{ textDecoration: "none", marginLeft: "10px" }}
                                    >

                                      <DownloadForOfflineRoundedIcon
                                        color="primary"
                                      />
                                    </a>
                                  </div>
                                }

                                {message.photo.includes(".zip") &&
                                  <a
                                    href={message.photo}
                                    target="_blank"
                                    style={{ textDecoration: "none" }}
                                  >
                                    {message.fname}{" "}
                                    <DownloadForOfflineRoundedIcon
                                      color="primary"
                                    />
                                  </a>
                                }
                              </>}
                            {message.message && (
                              <div
                                className="mediaText"
                                style={{ whiteSpace: "pre-line" }}
                              >
                                {message.message && message.message.split(" ").map((m) => {
                                  if (m.includes('https://')) {
                                    return <a href={m} target='_blank'>{m}</a>
                                  }
                                  else if (m.includes('www') || m.includes('.com') || m.includes('.app')) {
                                    return <a href={`https://${m}`} target='_blank'>{m}</a>
                                  }
                                  else
                                    return <span> {m}</span>
                                })}
                              </div>
                            )}
                            {message.post && <div>
                              <div style={{ margin: "5px" }}>
                                <Link
                                  style={{ textDecoration: "none", color: mode === "light" ? "black" : "white", display: "flex" }}
                                  to={message.postuid === auth?.currentUser?.uid ? `/profile` : `/userprofile/${message.postuid}`}
                                >
                                  <img src={convert_to_pic(message.postuid)} style={{
                                    height: "25px", width: "25px", objectFit: "cover", borderRadius: "10px"
                                  }} />
                                  <div style={{ marginLeft: "5px" }}>{convert_to_username(message.postuid)}</div>
                                </Link>
                              </div>
                              <Link to={`/singlefeed/${message.postid}`}>
                                <div style={{ cursor: "pointer" }}>
                                  {message.post.includes(".mp4") ? (
                                    <video
                                      className="chatpost__img"
                                      src={message.post}
                                      controls
                                    ></video>
                                  ) : (
                                    <img
                                      alt=""
                                      className="chatpost__img"
                                      src={message.post}

                                    />
                                  )}
                                </div>
                              </Link>
                            </div>
                            }
                            <div
                              className={
                                message.uid === auth?.currentUser?.uid
                                  ? "chat__timestamp_right"
                                  : "chat__timestamp"
                              }
                              style={{
                                color: mode === "light" ? "gray" : "lightgray",
                                display: message.edited ? "block" : "none",
                              }}
                            >
                              Edited
                            </div>
                            <div
                              className={
                                message.uid === auth?.currentUser?.uid
                                  ? "chat__timestamp_right"
                                  : "chat__timestamp"
                              }
                              style={{
                                color: mode === "light" ? "gray" : "lightgray",
                              }}
                            >
                              {time(message.timestamp)}
                            </div>
                            <div
                              className={
                                message.uid === auth?.currentUser?.uid
                                  ? "msglike_receive"
                                  : "msglike"
                              }
                              onClick={
                                () => {
                                  setLikeData({ like: message.like, id: id })
                                  handleShow6()
                                }
                              }
                              style={{ display: message.like ? "block" : "none" }}
                            >
                              {message.like && Object.entries(message.like).map(([k, v]) => {
                                return <img src={v.id} alt="" className={mode === "light" ? "heartIconlight" : "heartIcondark"} style={{ margin: "0px 1px" }} />
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      {newMessage === id && messages1.length && messages1[messages1.length - 1].message.uid !== auth?.currentUser?.uid && messages1[messages1.length - 1].id !== newMessage && <p className="chat_timeline">
                        <div className={mode === "light" ? "datelight" : "datedark"} style={{ width: "120px", color: mode === "light" ? "black" : "white", borderRadius: "20px", padding: "2px", fontSize: "12px", textAlign: "center" }}>New Message</div>
                      </p>}
                    </>
                  }
                  )}
                </>
              })}
            </>
          })}
          {seen && messages1.length && messages1[messages1.length - 1].message.uid === auth?.currentUser?.uid && (
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                width: "fit-content",
              }}
            >
              <img alt="" src={photo} style={{
                height: "20px", width: "20px", objectFit: "cover", borderRadius: "50%", margin: "2px"
              }} />
            </div>
          )}
          {seenGroup.length !== 0 && messages1.length && messages1[messages1.length - 1].message.uid === auth?.currentUser?.uid && (
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                width: "fit-content",
                cursor: "pointer"
              }}
              onClick={() => handleShow5()}
            >
              {seenGroup && seenGroup.map((user) => {
                return <img alt="" src={convert_to_pic(user.id)} style={{
                  height: "20px", width: "20px", objectFit: "cover", borderRadius: "50%", margin: "2px"
                }} />
              })}
            </div>
          )}
        </div>
        <div style={{ display: showScroll ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={scrollTop}
          >
            <div></div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <ExpandMoreIcon color="primary" style={{ fontSize: "30px" }} />
            </div>
            <div></div>
          </div>
        </div>
        {showreply && (
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton>
                <ReplyOutlinedIcon color="primary" />
              </IconButton>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {msgData.sticker && (
                <div>
                  <img src={msgData.sticker} className="showreply_img" alt="" />
                </div>
              )}
              {msgData.photo && !msgData.photo.includes(".mp3") && !msgData.message && (
                <div>
                  <img src={msgData.photo} className="showreply_img" alt="" />
                  <div style={{ color: mode === "light" ? "black" : "white", display: "grid", placeItems: "center" }}>{msgData.fname}</div>
                </div>
              )}
              {msgData.photo && msgData.photo.includes(".mp3") && !msgData.message && (
                <div>
                  <audio preload="none" src={msgData.photo} controls></audio>
                  <div style={{ color: mode === "light" ? "black" : "white", display: "grid", placeItems: "center" }}>{msgData.fname}</div>
                </div>
              )}
              {msgData.post && (
                <div>
                  <div>{msgData.postusername}</div>
                  <img src={msgData.post} className="showreply_img" alt="" />
                </div>
              )}
              {msgData.message && (
                <div
                  style={{
                    margin: "0px 10px",
                    color: mode === "light" ? "black" : "white",
                  }}
                >
                  {msgData.message}
                </div>
              )}
              {msgData.gif && (
                <div>
                  <img src={msgData.gif} className="showreply_img" alt="" />
                </div>
              )}
            </div>
            <IconButton onClick={() => setShowreply(false)}>
              <CloseOutlinedIcon color="error" style={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        )}
        {showedit && (
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
            }}
          >
            <div></div>
            <div style={{ color: mode === "light" ? "black" : "white", alignItems: "center", justifyContent: "center", display: "flex" }}>
              <EditIcon color="primary" />
              &nbsp; Edit Mode
            </div>
            <IconButton onClick={() => {
              setShowedit(false);
              setInput("");
              resettextarea();
            }}>
              <CloseOutlinedIcon color="error" style={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        )}
        <div style={{ display: isRecording ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
            }}
          >
            <div></div>
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                color: mode === "light" ? "black" : "white",
              }}
            >
              Recording
            </div>
            <div></div>
          </div>
        </div>
        <div style={{ display: audioURL ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
            }}
          >
            <div></div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <audio src={audioURL} controls />
            </div>
            <IconButton onClick={() => {
              setAudioURL("")
            }}>
              <CloseOutlinedIcon color="error" style={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        </div>
        <div style={{ display: image ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
            }}
          >
            <div></div>
            <div className="createPost__imagePreview" style={{ display: "grid", placeItems: "center" }} >
              <img id="image-preview1" alt="" />
              {mediaName && (
                <div
                  style={{
                    textAlign: "center",
                    color: mode === "light" ? "black" : "white",
                  }}
                >
                  {mediaName}
                </div>
              )}
            </div>
            <IconButton style={{ height: "100%" }} onClick={() => {
              handleMedia()
            }}>
              <CloseOutlinedIcon color="error" style={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        </div>
        <div style={{ display: typing ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
              color: mode === "light" ? "black" : "white",
            }}
          >
            {typinguser ? <i>{convert_to_username(typinguser)} is Typing...</i> : <i>{username} is Typing...</i>}
          </div>
        </div>
        <div style={{ display: progress !== 0 ? "block" : "none" }}>
          <div
            className={mode === "light" ? "datelight" : "datedark"}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "5px 10px",
              padding: "0px 5px",
              borderRadius: "20px",
              color: mode === "light" ? "black" : "white",
            }}
          >
            Sending {progress}
          </div>
        </div>
        <div className="chat__footer" id={mode === "light" ? "chat__footer_light" : "chat__footer_dark"}>
          <div>
            <div className="createPost__imageUpload">
              <label htmlFor="fileInput" onClick={() => setShowmedia(true)}>
                <AttachFileOutlinedIcon style={{ cursor: "pointer", color: mode === 'light' ? 'black' : 'white' }} />
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*,video/*,audio/*,.pdf,.zip"
                onChange={handleChange}
              />
            </div>
            <textarea
              className={mode === "light" ? "textAreaLight" : "textAreaDark"}
              data-autogrow="false"
              value={input}
              id="autoresizing"
              autoCapitalize="none"
              onChange={(e) => {
                handleTyping(e.target.value);
                setInput(e.target.value);
              }}
              placeholder="Type a message"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                  setShowreply(false);
                  setImage(null);
                }
              }}
            />

            <IconButton onClick={handleShow} style={{ height: "100%", marginTop: "auto" }}>
              <GifOutlinedIcon style={{ color: mode === 'light' ? 'black' : 'white' }} />
            </IconButton>

            <IconButton onClick={() => {
              sendMessage();
              setShowreply(false);
              setImage(null);
            }}
              style={{ display: input.length > 0 || image || audioURL ? "block" : "none", height: "100%", marginTop: "auto" }}
            >
              <SendOutlinedIcon style={{ color: mode === 'light' ? 'black' : 'white' }} />
            </IconButton>
            <IconButton onClick={isRecording ? stopRecording : startRecording} style={{ display: showreply || input.length > 0 || image ? "none" : "block", height: "100%", marginTop: "auto" }}>
              {isRecording ? <StopIcon style={{ color: mode === 'light' ? 'black' : 'white' }} /> : <MicNoneIcon style={{ color: mode === 'light' ? 'black' : 'white' }} />}
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
