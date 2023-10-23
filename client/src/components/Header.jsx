import React from "react";
import AVATAR from "../assets/images/avatar.png";
import LOGO from "../assets/images/logo.png";
import { logout } from "../utils/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Header() {
  const token = useSelector((store) => store.auth.token);
  const user = token ? JSON.parse(token).user : null;
  const userName = user ? user.name : null;
  const userId = user ? user._id : null;
  const userEmail = user ? user.email : null;
  console.log("user name => ", userName);
  console.log("user id => ", userId);

  const dispatch = useDispatch();
  const handleLogoutClick = () => {
    // dispatch(clearBookings());
    dispatch(logout());
  };
  return (
    <div className="header-class">
      <div className="flex-row">
        <Link to={"/"}>
          <img src={LOGO} alt="Logo" />
        </Link>
      </div>
      <div className="flex-row">
        {token === null ? (
          <div className="flex-row">
            <Link to={"/curated"} style={{ marginRight: "20px" }}>
              <h1>Curated Playlist</h1>
            </Link>
            <Link to={"/upload"} style={{ marginRight: "20px" }}>
              <h1>Upload</h1>
            </Link>
            <Link to={"/auth"} style={{ marginRight: "20px" }}>
              <h1>Sign in</h1>
            </Link>
            <img src={AVATAR} alt="user" style={{ borderRadius: "50%" }} />
          </div>
        ) : (
          <div className="flex-row">
            <Link to={"/curated"} style={{ marginRight: "20px" }}>
              <h1>Curated Playlist</h1>
            </Link>
            <Link to={"/upload"} style={{ marginRight: "20px" }}>
              <h1>Upload</h1>
            </Link>
            <Link to={"/user/" + userId}>
              <h1>{userName}</h1>
            </Link>
            <button className="header-btn" onClick={() => handleLogoutClick()}>
              Logout
            </button>
            <img src={AVATAR} alt="user" style={{ borderRadius: "50%" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
