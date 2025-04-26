import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import ProfilePic from "./ProfilePic";

export default function Profie() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("")
  const [changePic, setChangePic] = useState(false)
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState("");


  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeprofile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  };

  const toggleEditBio = () => {
    setEditBio(!editBio);
    setBio(user.bio || ""); // Load existing bio into input
  };

  const saveBio = () => {
    fetch(`http://localhost:5000/user/updatebio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        bio: bio,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Bio updated", result);
        setUser({ ...user, bio: bio });
        setEditBio(false);
      })
      .catch((err) => {
        console.log("Error updating bio", err);
      });
  };


  useEffect(() => {
    fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setPic(result.post);
        setUser(result.user)
        console.log(pic);
      });
  }, []);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            onClick={changeprofile}
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        {/* profile-data */}
        <div className="pofile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic ? pic.length : "0"} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>

          {/* Bio Section */}
          <div className="profile-bio">
            {editBio ? (
              <div className="edit-bio">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                />
                <button onClick={saveBio}>Save</button>
                <button onClick={toggleEditBio} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            ) : (
              <div className="view-bio">
                <p>{user.bio ? user.bio : "No bio yet..."}</p>
                <button onClick={toggleEditBio}>Edit Bio</button>
              </div>
            )}
          </div>

          
        </div>
      </div>
      <hr
        style={{
          width: "90%",

          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics) => {
          return <img key={pics._id} src={pics.photo}
            onClick={() => {
              toggleDetails(pics)
            }}
            className="item"></img>;
        })}
      </div>
      {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails} />
      }
      {
        changePic &&
        <ProfilePic changeprofile={changeprofile} />
      }
    </div>
  );
}