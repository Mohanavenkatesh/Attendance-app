import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import system from "../img/system.png";
import light from "../img/light.png";
import dark from "../img/dark.png";
import settings from '../img/Settings.png'; // Person 1
import '../css/Setting.css';

const Settings = ({ setTheme, name, email }) => {
  const [theme, setLocalTheme] = useState("system");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [studentNotification, setStudentNotification] = useState("");
  const [studentTime, setStudentTime] = useState(0);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [systemTime, setSystemTime] = useState(0);
  const [accountDetails, setAccountDetails] = useState({
    name: name || "",
    email: email || "",
  });

  useEffect(() => {
    setAccountDetails({ name: name || "", email: email || "" });
  }, [name, email]);

  const handleThemeChange = (mode) => {
    setLocalTheme(mode);
    setTheme(mode);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    alert(`Notifications ${notificationsEnabled ? "disabled" : "enabled"}`);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    alert(`Language changed to ${e.target.value}`);
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    alert("Account details updated successfully!");
  };

  return (
    <div className="container p-4">
      <div className="d-flex flex-row justify-content-top align-items-center gap-5  ">
      <img src={settings} className='settings 'style={{width:'40px'}} alt="" />
      </div>
      <h2 className="setting mb-4 d-flex ">Settings</h2>

      {/* Theme Settings */}
      <div className="mb-4">
        <h4 className="inter ">Interface Theme</h4>
        <p className=" inter1 mt-3" style={{}}>Select or customize your UI theme</p>
        <div className="d-flex gap-5 theme-selection">
          
          {[
            { mode: "system", img: system },
            { mode: "light", img: light },
            { mode: "dark", img: dark },
          ].map(({ mode, img }) => (
            <label key={mode} className="text-center theme-option">
              <input
                type="radio"
                name="theme"
                value={mode}
                checked={theme === mode}
                onChange={() => handleThemeChange(mode)}
                className="me-5"
              />
              <img
                src={img}
                alt={mode}
                className="rounded border theme-img"
                width="150"
              />
              <div>{mode.charAt(0).toUpperCase() + mode.slice(1)}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Student Notifications */}
      <div className=" mb-4 ">
        <h4 className="inter mb-4">Student Notifications</h4>
  
        <input
          type="text"
          placeholder="Type here what you want to tell"
          className="student form-control mb-3 p-2"
          value={studentNotification}
          onChange={(e) => setStudentNotification(e.target.value)}
        />
        <label className="time" style={{width:''}}>Set time to notify students</label>
        <br /><br />
        <input
          type="range"
          min="-60"
          max="60"
          step="10"
          value={studentTime}
          onChange={(e) => setStudentTime(e.target.value)}
          className="range form-range "
         
        />
      </div>

      {/* System Notifications */}
      <div className="mb-4">
        <h4 className="inter">System Notifications</h4>
        <div className="check form-check form-switch ">
          <input
            className="form-check-input "
            type="checkbox"
            checked={systemNotifications}
            onChange={() => setSystemNotifications(!systemNotifications)}
          />
        </div>
        <br />
        <input
          type="range"
          min="-60"
          max="60"
          step="10"
          value={systemTime}
          onChange={(e) => setSystemTime(e.target.value)}
          className="range form-range "
        />
      </div>

      {/* Language Settings */}
      {/* <div className="mb-4">
        <h4 className="inter">Language</h4>
        <select
          className="form-select w-25"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div> */}

      {/* Account Settings */}
      {/* <div className="mb-4 w-25">
        <h4>Account Details</h4>
        <form onSubmit={handleAccountUpdate}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={accountDetails.name}
              onChange={(e) => setAccountDetails({ ...accountDetails, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={accountDetails.email}
              onChange={(e) => setAccountDetails({ ...accountDetails, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary "  style={{}}>Update Account</button>
        </form>
      </div> */}
    </div>
  );
};

export default Settings;
