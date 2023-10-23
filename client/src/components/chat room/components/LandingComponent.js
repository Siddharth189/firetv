import React, { useState, Fragment } from "react";
import "../styles/landing.scss";
import { useSelector } from "react-redux";
import { generateUserId, generateRandomColor } from "./Functions";
import LOGO from "../../../assets/images/logo.png";

const LandingComponent = ({ userState, setUserState }) => {
  const token = useSelector((store) => store.auth.token);
  const user = token ? JSON.parse(token).user : null;
  const userName1 = user ? user.name : null;
  const userId1 = user ? user._id : null;
  const userEmail1 = user ? user.email : null;

  const { userId, name, color } = userState;

  const [formData, setFormData] = useState(userName1);

  const [error, setError] = useState(false);

  const onChange = (e) => {
    const value = e.target.value;
    if (/^[a-z0-9 _]*[a-z0-9]*$/i.test(value) && value.length <= 30) {
      setFormData(value);
      if (error) {
        setError(false);
      }
    }
  };

  const onNameSubmit = (e) => {
    e.preventDefault();
    let name_text = formData.trim();
    if (name_text.length > 0) {
      setUserState({
        userId: userId1 ? userId1 : generateUserId(7),
        name: name_text,
        color: generateRandomColor(),
      });
    } else {
      setError(true);
      document.getElementsByClassName("input")[0].focus();
    }
    setFormData(name_text);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="navbar">
        <div className="brand">Virtual Movie Night(VMN)</div>
        <div className="right">
          <div className="img-container" title="React">
            <img
              src={LOGO}
              alt="Fire TV"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
        </div>
      </div>
      <div className="vmn-form">
        <div className="label">Please enter your name to continue...</div>
        <form onSubmit={onNameSubmit}>
          <input
            type="text"
            name="name"
            autoFocus
            autoComplete="off"
            placeholder={userName1}
            value={formData}
            onChange={onChange}
            className={`vmn-form-inpt input ${error && `error`}`}
          />
          {error && (
            <span className="material-icons error-icon">error_outline</span>
          )}
          <button className="vmn-form-btn" type="submit">
            Continue
          </button>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default LandingComponent;
