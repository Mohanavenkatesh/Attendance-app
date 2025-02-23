import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <button onClick={() => setTheme('light')} className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-light'}`}>Light Theme</button>
        <button onClick={() => setTheme('dark')} className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-light'}`}>Dark Theme</button>
        <button onClick={() => setTheme('system')} className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-light'}`}>System Preference</button>
      </div>
    </div>
  );
};

export default Settings;