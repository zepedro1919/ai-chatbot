import React, { useState, useEffect, useCallback } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './renderPage.css';
import icon from './contact_icon.png';
import icon2 from './re-render.png';
import logo from './naut_logo.png';

const RenderPage = () => {
    const location = useLocation();
    const theme = location.state?.type;

    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [render, setRender] = useState(null);
    const [editPrompt, setEditPrompt] = useState("");
    const [editedImageUrl, setEditedImageUrl] = useState(null);

    const [showGenie, setShowGenie] = useState(false); // State to show or hide the logo and bubble

    const navigate = useNavigate();
    
    // Fetch a random render based on the theme
    const fetchRandomRender = useCallback(async () => {
        setLoading(true);
        setDescription("Loading render...");
        setProgress(0);
        console.log("Initializing request to backend for random render...");

        let progressInterval;

        try {
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval); // Stop at 90% and wait for the actual render to load
                        return prev;
                    }
                    return prev + 1; // Increment progress
                });
            }, 50); // Update every 200 ms

            console.log("Theme selected: ", theme);
            const response = await axios.get(`http://localhost:5000/get-random-render?theme=${theme}`);
            console.log("Render fetched: ", response.data.render);
            setRender(response.data.render);
            setEditedImageUrl(null); // Reset edited image if user wants a new render
            setLoading(false);
            setDescription("");
            setProgress(100);
        } catch (error) {
            console.error("Error fetching render:", error);
            setLoading(false);
            setDescription("We apologize. An error occured, please comeback later.");
            setProgress(0);
        } finally {
            clearInterval(progressInterval);
        }
    }, [theme]);

    // Generate a variation or edit 
    const generateEdit = async (e) => {

        let progressInterval;

        e.preventDefault();

        if (!render || !editPrompt){
            console.error("Missing render or editPrompt. Render:", render, "EditPrompt:", editPrompt);
            return;
        } 

        console.log("Sending request to backend with:");
        console.log("Image path:", render.image_path);
        console.log("Edit prompt:", editPrompt);

        setLoading(true);
        setDescription("Loading render...");
        setProgress(0);

        try {
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval); // Stop at 90% and wait for the actual render to load
                        return prev;
                    }
                    return prev + 1; // Increment progress
                });
            }, 50);

            const response = await axios.post("http://localhost:5000/generate-edit", {
                imageUrl: render.image_path,
                editPrompt: editPrompt
            });
            console.log("Edit response:", response.data);
            setEditedImageUrl(response.data.imageUrl);
            console.log("Edited Image URL set in state:", response.data.imageUrl);
            setLoading(false);
            setDescription("");
            setProgress(100);
        } catch (error) {
            console.error("Error generating variation:", error.response?.data || error.message);
            setLoading(false);
            setProgress(0);
            setDescription("We apologize. An error occured, please comeback later.")
        } finally {
            clearInterval(progressInterval);
        }
    };

    useEffect (() => {
        fetchRandomRender();
    }, [theme]);

    useEffect(() => {
        console.log("Current render object: ", render);
    }, [render]);

    useEffect(() => {
        if (render) {
            setShowGenie(true);
        }
    }, [render]);

    const generateVariation = async () => {

        let progressInterval;

        if (!render) {
            console.error("Render not loaded");
            return;
        }
        setDescription("Loading render...")
        setLoading(true);
        setProgress(0);
        try {
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval); // Stop at 90% and wait for the actual render to load
                        return prev;
                    }
                    return prev + 1; // Increment progress
                });
            }, 50);

            const response = await axios.post("http://localhost:5000/generate-variation", {
                imageUrl: render.image_path,
            });

            setEditedImageUrl(response.data.imageUrl);
            console.log("Generated Variation URL: ", response.data.imageUrl);
            setLoading(false);
            setDescription("Render loaded!");
            setProgress(100);
        } catch (error) {
            console.error("Error generating variation:", error);
            setLoading(false);
            setDescription("A variation is not available for this render.");
        } finally {
            clearInterval(progressInterval);
        }
    };

    const handleVariationYes = () => {
        setShowGenie(false); // Hide Genie after choosing Yes
        generateVariation(); // Call the generateVariation function
    };

    const handleVariationNo = () => {
        setShowGenie(false); // Simply hide Genie
    }

    const maximizeImage = () => {
        const image = document.querySelector('.generated-image');
        if (image) {
            const fullscreen = image.requestFullscreen || image.webkitRequestFullscreen || image.mozRequestFullScreen || image.msRequestFullscreen;
            if (fullscreen) {
                fullscreen.call(image);
            }
        }
    };
    
    const contactSales = () => {
        navigate('/contact-sales', { state: { renderUrl: editedImageUrl ||  `http://localhost:5000/${render.image_path}`} });
    };

    return (
        <div className="render-page">
            <p className="description">{description}</p>
            
            {loading && (
                <div className='progress-bar-container'>
                    <div className='progress-bar' style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {showGenie && (
                <div className='genie-logo-container'>
                    <img 
                        src={ logo }
                        alt="Nautilus logo"
                        className='genie-logo'
                    />
                    <div className='message-bubble'>
                        <p>Do you want a variation of this render using AI?</p>
                        <div className='options-container'>
                            <button onClick={handleVariationYes}>Yes!</button>
                            <button onClick={handleVariationNo}>No thanks! I like this render.</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display the current render or the edited version */}
            {render && (
                <div className="image-container">
                    <img
                        key={editedImageUrl || render.image_path}
                        src={editedImageUrl || `http://localhost:5000/${render.image_path}`}
                        alt="Generated render"
                        className="generated-image"
                    />
                    <button className="maximize-btn" onClick={maximizeImage}>⤢</button>
                </div>
            )}
            
            <div className="chat-container">
                <div className="chat-left">
                    <button onClick={contactSales} className="contact-sales-btn">
                        <img src={icon} alt="Contact Icon" />
                    </button>

                    <button onClick={fetchRandomRender} className="re-render-btn">
                        <img src={icon2} alt="redo icon" />
                    </button>
                </div>

                <div className='chat-center'>
                    <textarea
                        rows="1"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Request modifications"
                        className="chat-input"
                    />
                </div>

                <div className="chat-right">
                    <button type="submit" className="chat-submit" onClick={generateEdit}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default RenderPage;