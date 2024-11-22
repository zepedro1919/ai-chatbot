const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to your SQLite database
const dbPath = path.join(__dirname,'./renders.db');
const db = new sqlite3.Database(dbPath);

// Paths to folders containing images
const themes = ['corporate', 'education']; // Add more themes if needed
const baseFolderPath = path.join(__dirname, 'renders'); // Assuming 'renders' folder holds all theme folders

// Function to populate the renders table
const populateRendersTable = () => {
  db.serialize(() => {
    // Loop through each theme folder
    themes.forEach(theme => {
      const themeFolderPath = path.join(baseFolderPath, theme);
      
      // Check if theme folder exists
      if (fs.existsSync(themeFolderPath)) {
        // Read all images in the theme folder
        const images = fs.readdirSync(themeFolderPath).filter(file => 
          file.endsWith('.jpg') || file.endsWith('.png') // Include specific image formats
        );
        
        // Insert each image into the renders table
        images.forEach(image => {
          const imagePath = path.join(theme, image); // Use relative path for database storage

          db.run(
            `INSERT INTO renders (image_path, theme) VALUES (?, ?)`,
            [imagePath, theme],
            function (err) {
              if (err) {
                console.error('Error inserting data:', err.message);
              } else {
                console.log(`Inserted: ${imagePath} with theme: ${theme}`);
              }
            }
          );
        });
      } else {
        console.warn(`Theme folder not found: ${themeFolderPath}`);
      }
    });
  });
};

// Run the populate function
populateRendersTable();
