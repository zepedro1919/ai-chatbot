import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./contactSales.css";

const ContactSales = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const renderUrl = location.state?.renderUrl; // Get the render image URL from state

    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [subject, setSubject] = useState("Interested in this render");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form...");
        if (!userEmail || !userName || !message) {
            alert("Please fill out all fields before submitting.");
            return; // stops the function execution
        }

        console.log("All fields are filled. Sending email...");
        try {
            console.log("Sending email...");
            await axios.post("http://localhost:5000/send-email", {
                userEmail,
                userName,
                subject,
                message,
                renderUrl,
            });
            console.log("Email sent successfully!");
            alert("Your email has been sent to our sales team!");
            navigate("/"); // Redirect back to the homepage or another page
        } catch (error) {
            console.error("Eror sending email:", error.response?.data || error.message);
            alert("Failed to send your email. Please try again later.");
        }
    };

    return (
        <div className="contact-sales-page">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userName">Your Name</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userEmail">Your Email</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter the subject"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                    />
                </div>
                <div className="form-image">
                    <label>Selected Render</label>
                    <img src={renderUrl} alt="Selected Render" className="render-preview" />
                </div>
                <button onClick={handleSubmit} className="submit-btn">Contact our Sales Department</button>
            </form>
        </div>
    );
};

export default ContactSales;