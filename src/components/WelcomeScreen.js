// src/components/WelcomeScreen.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';
import logo from './naut_logo.png';

const WelcomeScreen = () => {
    const navigate = useNavigate();

    // Automatically transition to the main app after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/experience'); // Route to your main app page
        }, 4000); // Adjust delay as desired
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="welcome-screen">
            <img src={logo} alt="Nautilus Logo" className="logo" />
            <h1 className="welcome-text">Welcome to the virtual experience</h1>
        </div>
    );
};

export default WelcomeScreen;
