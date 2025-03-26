import React, { useEffect } from 'react';
import './Intro.css';

const Intro = ({ onFinish }) => {
  useEffect(() => {


    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro">
      <div className="intro__logo">
        <img src="/logo.png" alt="Logo"/>
      </div>
    </div>
  );
};

export default Intro;
