// index.js
const express = require('express');
const mysql = require('mysql2/promise'); // Import MySQL driver

const app = express();

// MySQL connection details
const dbConfig = {
  host: 'localhost',
  user: 'root', // MySQL administrative user
  password: 'radeon', // Password for administrative user
};

// Function to create a new database
const createDatabase = async (dbName) => {
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection(dbConfig);

    // Create new database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

    // Close connection
    await connection.end();

    console.log(`Database '${dbName}' created successfully.`);
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

// Create a new database
createDatabase('transactions');

const dbConfig1 = {
    host: 'localhost',
    user: 'root',
    password: 'radeon',
    database: 'transactions', // Specify the database name here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  // Create a connection pool
  const pool = mysql.createPool(dbConfig1);

  // Create the 'transactions' table if it doesn't exist
const createTable = async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          TransactionID VARCHAR(255) NOT NULL,
          CustomerName VARCHAR(255) NOT NULL,
          TransactionDate DATE NOT NULL,
          Amount DECIMAL(10, 2) NOT NULL,
          Status VARCHAR(50) NOT NULL,
          InvoiceURL VARCHAR(255) NOT NULL
        )
      `);
      connection.release();
      console.log("Table 'transactions' created successfully.");
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };
  
  // Call the createTable function to create the table
  createTable();
  
  module.exports = pool;
