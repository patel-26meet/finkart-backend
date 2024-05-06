const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../database/db');

function uploadRoutes(upload) {
  const router = express.Router();

  // Route handler for file upload
  router.post('/upload', upload.single('csv'), async (req, res) => {
    try {
      // Check if req.file is defined
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', data => results.push(data))
        .on('end', async () => {
          try {
            // Use a database connection pool to handle connections
            const connection = await pool.getConnection();
            // Insert data into the database
            await connection.query('INSERT INTO transactions (TransactionID, CustomerName, TransactionDate, Amount, Status, InvoiceURL) VALUES ?', [results.map(row => Object.values(row))]);
            // Release the database connection
            connection.release();
            // Send success response
            res.status(200).send('File uploaded successfully');
          } catch (error) {
            console.error('Error inserting data into database:', error);
            res.status(500).send('Error inserting data into database');
          } finally {
            // Delete the temporary file after processing
            fs.unlinkSync(req.file.path);
          }
        });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}

module.exports = uploadRoutes;
