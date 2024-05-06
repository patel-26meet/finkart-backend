const express = require('express');
const router = express.Router();
const pool = require('../database/db')


// Retrieve all transactions
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM transactions');
        connection.release();
        res.json(rows);
      } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).send('Internal Server Error');
      }
});

// Update a transaction by ID
router.put('/:id', async (req, res) => {
    const { CustomerName, TransactionDate, Amount, Status, InvoiceURL } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE transactions SET CustomerName = ?, TransactionDate = ?, Amount = ?, Status = ?, InvoiceURL = ? WHERE TransactionID = ?', [CustomerName, TransactionDate, Amount, Status, InvoiceURL, req.params.id]);
    connection.release();
    res.status(200).send('Transaction updated successfully');
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a transaction by ID
router.delete('/:id',async (req, res) => {
    try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM transactions WHERE TransactionID = ?', [req.params.id]);
    connection.release();
    res.status(200).send('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
