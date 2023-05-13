import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import { storage, database, auth } from "../../firebase";
import Compressor from "compressorjs";
import Swal from "sweetalert2";
import { makeid } from "../../services/makeid";
import { Button } from "react-bootstrap";
import { WithContext as ReactTags } from "react-tag-input";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { ColorModeContext } from "../../services/ThemeContext";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function CreatePost({ handleClose }) {
  const [compressedFile, setCompressedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [tags, setTags] = useState([]);
  const [tagss, setTagss] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const { mode } = useContext(ColorModeContext);
  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, []);

  useEffect(() => {
    let users = [];
    database.ref(`/Users`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.val().uid && snap.val().uid !== auth?.currentUser?.uid) {
          users.push({
            id: snap.val().uid,
            text: snap.val().username,
          });
        }
      });
      setSuggestions(users);
    });
  }, []);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
    setTagss(tagss.filter((id, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
    setTagss([...tagss, tag.id]);
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };

  let fileName = "";
  let imageName = "";

  const handleChange = (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].name.toLowerCase().includes(".jpg") ||
        e.target.files[0].name.toLowerCase().includes(".png") ||
        e.target.files[0].name.toLowerCase().includes(".jpeg") ||
        e.target.files[0].name.toLowerCase().includes(".ico") ||
        e.target.files[0].name.toLowerCase().includes(".mp4") ||
        e.target.files[0].name.toLowerCase().includes(".mov") ||
        e.target.files[0].name.toLowerCase().includes(".avi") ||
        e.target.files[0].name.toLowerCase().includes(".mkv") ||
        e.target.files[0].name.toLowerCase().includes(".webm")
      )
    ) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      const image = e.target.files[0];
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
        background: mode === "light" ? "white" : "#1F1B24",
        color: mode === "light" ? "black" : "white",
        title: "Error!",
        text: "File not supported",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
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
  const handleUpload = () => {
    if (image && !link) {
      imageName = makeid(10);
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg")
      ) {
        fileName = `${imageName}.jpg`;
      } else if (image.name.includes(".gif")) {
        fileName = `${imageName}.gif`;
      } else if (image.name.toLowerCase().includes(".ico")) {
        fileName = `${imageName}.ico`;
      } else if (
        image.name.toLowerCase().includes(".mp4") ||
        image.name.toLowerCase().includes(".mov") ||
        image.name.toLowerCase().includes(".avi") ||
        image.name.toLowerCase().includes(".mkv") ||
        image.name.toLowerCase().includes(".webm")
      ) {
        fileName = `${imageName}.mp4`;
      }
      const uploadTask = storage.ref(`images/${fileName}`).put(compressedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          document.getElementById("uploadBtn").disabled = true;
          document.getElementById(
            "uploadBtn"
          ).innerHTML = `Uploading ${progress}`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(`${fileName}`)
            .getDownloadURL()
            .then((imageUrl) => {
              database.ref(`/Posts/${imageName}`).set({
                timestamp: Date.now(),
                caption: caption,
                photoUrl: imageUrl,
                uid: auth?.currentUser?.uid,
                tagss: tagss,
                venue: venue,
              });
              if (fileName.includes('.mp4')) {
                database.ref(`Users/${auth?.currentUser?.uid}/Videos/${imageName}`).set({
                  timestamp: Date.now(),
                  caption: caption,
                  photoUrl: imageUrl,
                  uid: auth?.currentUser?.uid,
                  tagss: tagss,
                  venue: venue,
                });
              } else {
                database.ref(`Users/${auth?.currentUser?.uid}/Posts/${imageName}`).set({
                  timestamp: Date.now(),
                  caption: caption,
                  photoUrl: imageUrl,
                  uid: auth?.currentUser?.uid,
                  tagss: tagss,
                  venue: venue,
                });
              }
              for (let i = 0; i < tagss.length; i++) {
                database
                  .ref(`/Users/${tagss[i]}/activity/${imageName}`)
                  .update({
                    text: `tagged you in a post`,
                    uid: auth?.currentUser?.uid,
                    id: imageName,
                    timestamp: Date.now(),
                    photoUrl: imageUrl,
                    postid: imageName,
                  });
                database
                  .ref(`/Users/${tagss[i]}/notification/${imageName}`)
                  .update({
                    text: `${currentUsername} tagged you in a post`,
                    id: auth?.currentUser?.uid,
                  });
              }
            });
          setCaption("");
          setProgress(0);
          setImage(null);
          document.getElementById("image-preview").style.display = "none";
          document.getElementById("createPost").value = "";
          handleClose();
          Swal.fire({
            background: mode === "light" ? "white" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Post Added!",
            text: "Your post has been added.",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
          });
        }
      );
    } else if (link) {
      imageName = makeid(10);
      database.ref(`Users/${auth?.currentUser?.uid}/Posts/${imageName}`).set({
        timestamp: Date.now(),
        caption: caption,
        photoUrl: link,
        uid: auth?.currentUser?.uid,
        tagss: tagss,
        venue: venue,
      });
      database
        .ref(`/Posts/${imageName}`)
        .set({
          timestamp: Date.now(),
          caption: caption,
          photoUrl: link,
          uid: auth?.currentUser?.uid,
          tagss: tagss,
          venue: venue,
        })
        .then(() => {
          for (let i = 0; i < tagss.length; i++) {
            database.ref(`/Users/${tagss[i]}/activity/${imageName}`).update({
              text: `tagged you in a post`,
              uid: auth?.currentUser?.uid,
              id: imageName,
              timestamp: Date.now(),
              photoUrl: link,
              postid: imageName,
            });
            database
              .ref(`/Users/${tagss[i]}/notification/${imageName}`)
              .update({
                text: `${currentUsername} tagged you in a post`,
                id: auth?.currentUser?.uid,
              });
          }
          setImage(null);
          handleClose();
          setLink("");
          document.getElementById("image-preview").style.display = "none";
          Swal.fire({
            background: mode === "light" ? "white" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Post Added!",
            text: "Your post has been added.",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="createPost">
      <div className="createPost__loggedIn">
        <div className="createPost__imagePreview">
          <img
            id="image-preview"
            alt="If not visible, try different link"
            style={{
              color: mode === "light" ? "black" : "white",
              height: "50vh",
              width: "100%",
              marginBottom: "20px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </div>
        {image && (
          <ReactTags
            tags={tags}
            suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            inputFieldPosition="bottom"
            autocomplete
            placeholder="Tag people ..."
          />
        )}
        {image && (
          <div className="createPost__loggedInCenter">
            <input
              className="createPost__textarea"
              rows="1"
              style={{
                backgroundColor:
                  mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                color: mode === "light" ? "#1F1B24" : "white", marginTop: "10px"
              }}
              placeholder="enter location ..."
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            ></input>
            <input
              className="createPost__textarea"
              rows="1"
              style={{
                backgroundColor:
                  mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                color: mode === "light" ? "#1F1B24" : "white", marginTop: "10px"
              }}
              placeholder="enter caption ..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></input>
          </div>
        )}
        {!image && (
          <center>
            <div className="createPost__imageUpload">
              <label htmlFor="createPost" style={{ cursor: "pointer" }}>
                <AddAPhotoIcon style={{ fontSize: "60px", color: mode === 'light' ? 'black' : 'white' }} />
              </label>
              <input
                type="file"
                id="createPost"
                accept="image/*,video/*"
                onChange={handleChange}
              ></input>
            </div>
            <br />
            <div style={{ color: mode === "light" ? "black" : "white" }}>or</div>
            <br />
            <div className="commentInput">
              <input
                className="commentInput__textarea"
                placeholder="Paste image link here"
                value={link}
                style={{
                  backgroundColor:
                    mode === "light"
                      ? "rgba(248,249,250,1)"
                      : "rgba(33,37,41,1)",
                  color: mode === "light" ? "#1F1B24" : "white",
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleLink();
                  }
                }}
                onChange={(e) => setLink(e.target.value)}
                maxLength="500"
              ></input>
              <div
                style={{
                  opacity: link ? 1 : 0.6,
                  cursor: link ? "pointer" : "default",
                }}
                className="commentInput__btn"
                onClick={handleLink}
              >
                <Button
                  style={{
                    disabled: link ? false : true,
                    opacity: link ? 1 : 0.5,
                  }}
                  variant="secondary"
                  size="sm"
                >
                  OK
                </Button>
              </div>
            </div>
          </center>
        )}
        {image && (
          <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
            <Button
              variant="primary"
              size="md"
              id="uploadBtn"
              onClick={handleUpload}
              style={{
                color: image || link ? "white" : "gray",
                cursor: image || link ? "pointer" : "default",
              }}
            >
              Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
