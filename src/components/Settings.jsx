import React, { useState, useEffect } from 'react';

const Settings = ({ setTheme, name, email }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [accountDetails, setAccountDetails] = useState({
    name: name || '',
    email: email || '',
  });

  // Update account details when props change
  useEffect(() => {
    setAccountDetails({
      name: name || '',
      email: email || '',
    });
  }, [name, email]);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    alert(`Notifications ${notificationsEnabled ? 'disabled' : 'enabled'}`);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    alert(`Language changed to ${e.target.value}`);
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    alert('Account details updated successfully!');
    // Here you can send the updated details to the backend
  };

  return (
    <div className="settings-container p-4">
      <h2 className="mb-4">Settings</h2>

      {/* Theme Settings */}
      <div className="theme-settings mb-4">
        <h4>Theme</h4>
        <div className="theme-toggle">
          <button className="btn btn-dark me-2" onClick={() => setTheme('dark')}>Dark Theme</button>
          <button className="btn btn-light me-2" onClick={() => setTheme('light')}>Light Theme</button>
          <button className="btn btn-secondary" onClick={() => setTheme('system')}>System Preference</button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="notification-settings mb-4">
        <h4>Notifications</h4>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="notificationToggle"
            checked={notificationsEnabled}
            onChange={handleNotificationToggle}
          />
          <label className="form-check-label" htmlFor="notificationToggle">
            Enable Notifications
          </label>
        </div>
      </div>

      {/* Language Settings */}
      <div className="language-settings mb-4">
        <h4>Language</h4>
        <select
          className="form-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Account Settings */}
      <div className="account-settings">
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
          <button type="submit" className="btn btn-primary">Update Account</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;