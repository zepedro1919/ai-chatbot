// Setup a basix Express server
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const sharp = require('sharp');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
app.use('/corporate', express.static('C:/Users/ASUS-JPB/Documents/GitHub/ai-chatbot/RENDERS_DB/renders/corporate'));
app.use('/education', express.static('C:/Users/ASUS-JPB/Documents/GitHub/ai-chatbot/RENDERS_DB/renders/education'));

const { sendEmail } = require("./emailService")

const PORT = 5000;

// Initialize the SQLite database connection
const db = new sqlite3.Database('C:/Users/ASUS-JPB/Documents/GitHub/ai-chatbot/RENDERS_DB/renders.db', (err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the SQLile database.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/get-random-render', (req, res) => {
    console.log("Request received at /get-random-render"); // Frontend request is hitting the /get-random-render
    const theme = req.query.theme; // education or corporate
    console.log("Requested theme:", theme);

    db.get(
        `SELECT * FROM renders WHERE theme = ? ORDER BY RANDOM() LIMIT 1`,
        [theme],
        (err, row) => {
            if (err) {
                console.error("Error retrieving render:", err);
                res.status(500).json({ error: "Failed to retrieve render" });
            } else {
                const normalizedPath = row.image_path.replace(/\\/g, '/');
                console.log("Image path: ", normalizedPath)
                res.json({ render: { ...row, image_path: normalizedPath } });
            }
        }
    );
});


app.post('/generate-edit', async (req, res) => {
    const { imageUrl, editPrompt } = req.body;

    console.log("Received imageUrl from frontend:", imageUrl); // Log input image URL
    console.log("Received editPrompt from frontend:", editPrompt); // Log input prompt

    if (!imageUrl || !editPrompt) {
        return res.status(400).json({ error: "Missing required parameters (imageUrl or editPrompt)." });
    }

    try {
        // Full path of the input image
        const inputImagePath = path.resolve(`C:/Users/ASUS-JPB/Documents/GitHub/ai-chatbot/RENDERS_DB/renders/${imageUrl.replace(/\\/g, '/')}`);
        console.log("Full image path being processed:", inputImagePath);

        // Check if the file exists
        if (!fs.existsSync(inputImagePath)) {
            console.error("Image file does not exist at path:", inputImagePath);
            return res.status(404).json({ error: "Image file not found on the server." });
        }

        // Determine the file extension
        const fileExtension = path.extname(inputImagePath).toLowerCase();

        // Temporary path for the converted PNG file
        let tempPngPath = inputImagePath;

        // If the image is not a PNG, convert it
        if (fileExtension !== '.png') {
            tempPngPath = path.join(__dirname, 'temp_image.png');

            // Convert image to PNG format using sharp
            await sharp(inputImagePath).toFormat('png').toFile(tempPngPath);
            console.log("Image converted to PNG format at:", tempPngPath);
        } else {
            console.log("Image is already in PNG format.");
        }

        // Create a blank mask (for full image editing)
        const maskPath = path.join(__dirname, 'blank_mask.png');
        const { width, height } = await sharp(tempPngPath).metadata();
        await sharp({
            create: {
                width: width,
                height: height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
            }
        }).png().toFile(maskPath);

        console.log("Blank mask created:", maskPath);

        const formData = new FormData();
        formData.append("image", fs.createReadStream(tempPngPath)); // Read the image file
        formData.append('mask', fs.createReadStream(maskPath));
        formData.append("prompt", editPrompt);
        formData.append("n", 1); // Number of variations
        formData.append("size", "1024x1024"); // Image size

        console.log("Sending data to OpenAI API:");
        console.log("FormData:", formData);
        console.log("Headers:", formData.getHeaders());

        const response = await axios.post(
            'https://api.openai.com/v1/images/edits',
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Add headers from formData
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                }
            }
        );
        console.log("OpenAI response:", response.data);

        // Extract the generated variation URL from the response
        const editedImageUrl = response.data.data[0].url;
        res.json({ imageUrl: editedImageUrl });

    } catch (error) {
        console.error("Error generating variation:", error.message, error.response?.data || error);
        res.status(500).json({ error: error.response?.data || "Failed to generate variation" });
    }
    
});

app.post('/generate-variation', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Missing required parameters (imageUrl)." });
    }

    try {
        // Full path of the input image
        const inputImagePath = path.resolve(`C:/Users/ASUS-JPB/Documents/GitHub/ai-chatbot/RENDERS_DB/renders/${imageUrl.replace(/\\/g, '/')}`);

        // Check if the file exists
        if (!fs.existsSync(inputImagePath)) {
            console.error("Image file does not exist at path:", inputImagePath);
            return res.status(404).json({ error: "Image file not found on the server." });
        }

        // Determine the file extension
        const fileExtension = path.extname(inputImagePath).toLowerCase();

        // Temporary path for the converted PNG file
        let tempPngPath = inputImagePath;

        // If the image is not a PNG, convert it
        if (fileExtension !== '.png') {
            tempPngPath = path.join(__dirname, 'temp_image.png');

            // Convert image to PNG format using sharp
            await sharp(inputImagePath).toFormat('png').toFile(tempPngPath);
            console.log("Image converted to PNG format at:", tempPngPath);
        } else {
            console.log("Image is already in PNG format.");
        }

        const formData = new FormData();
        formData.append("image", fs.createReadStream(tempPngPath)); // Read the image file
        formData.append("n", 1); // Number of variations
        formData.append("size", "1024x1024"); // Image size

        console.log("Sending data to OpenAI API:");
        console.log("FormData:", formData);
        console.log("Headers:", formData.getHeaders());

        const response = await axios.post(
            'https://api.openai.com/v1/images/variations',
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Add headers from formData
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                }
            }
        );
        console.log("OpenAI response:", response.data);

        // Extract the generated variation URL from the response
        const editedImageUrl = response.data.data[0].url;
        res.json({ imageUrl: editedImageUrl });

    } catch (error) {
        console.error("Error generating variation:", error.message, error.response?.data || error);
        res.status(500).json({ error: error.response?.data || "Failed to generate variation" });
    }
    
});

app.post('/send-email', sendEmail);

