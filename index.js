const express = require('express');
const multer = require('multer');
const uploadRoutes = require('./src/routes/upload');
const transactionsRoutes = require('./src/routes/transactions');
const pool = require('./src/database/db')

const app = express();

// Multer middleware configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.use('/uploads', uploadRoutes(upload)); // Pass the Multer middleware to uploadRoutes
app.use('/transactions', transactionsRoutes);

app.post('/fill-table', upload.single('csv'), async (req, res) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const results = [];
      // Read and parse the CSV file
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          // Insert data into the 'transactions' table
          const connection = await pool.getConnection();
          await connection.query('TRUNCATE TABLE transactions'); // Optional: Clear existing data
          await connection.query('INSERT INTO transactions (TransactionID, CustomerName, TransactionDate, Amount, Status, InvoiceURL) VALUES ?', [results.map(row => Object.values(row))]);
          connection.release();
  
          res.status(200).send('Data inserted into the table successfully.');
        });
    } catch (error) {
      console.error('Error inserting data into the table:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
