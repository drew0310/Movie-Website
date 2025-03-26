import React from 'react';
import './Snackbar.css';

const Snackbar = ({ message, visible }) => {
  return (
    <div className={`snackbar ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Snackbar;
