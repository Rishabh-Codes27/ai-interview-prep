"use client"
import React, { useState, useEffect } from 'react';

function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark'
  );

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark-mode', !isDarkMode); // Toggle the class
  };

  useEffect(() => {
    // Apply the theme on initial load
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <button
      className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 mt-2"
      onClick={toggleTheme}
    >
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}

export default ThemeSwitcher;
