const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./bank_system.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    const customerTable = `
      CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const loanTable = `
      CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        principal_amount DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `;

    const paymentTable = `
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
      )
    `;

    db.run(customerTable);
    db.run(loanTable);
    db.run(paymentTable);

    // Insert sample customers
    const sampleCustomers = [
      { id: 'CUST001', name: 'John Doe' },
      { id: 'CUST002', name: 'Jane Smith' },
      { id: 'CUST003', name: 'Alice Johnson' }
    ];

    sampleCustomers.forEach(customer => {
      db.run(
        'INSERT OR IGNORE INTO customers (customer_id, name) VALUES (?, ?)', 
        [customer.id, customer.name]
      );
    });
  });
}


// Helper function to calculate loan details
function calculateLoanDetails(principal, years, rate) {
  principal = Number(principal);
  years = Number(years);
  rate = Number(rate);

  const interest = principal * years * (rate / 100);
  const totalAmount = principal + interest;
  const monthlyEmi = totalAmount / (years * 12);
  
  return {
    interest: parseFloat(interest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    monthlyEmi: parseFloat(monthlyEmi.toFixed(2))
  };
}


// Helper function to get loan balance and EMIs left
function getLoanStatus(loanId, callback) {
  const query = `
    SELECT 
      l.loan_id,
      l.customer_id,
      l.principal_amount,
      l.total_amount,
      l.monthly_emi,
      l.interest_rate,
      l.loan_period_years,
      COALESCE(SUM(p.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN payments p ON l.loan_id = p.loan_id
    WHERE l.loan_id = ?
    GROUP BY l.loan_id
  `;

  db.get(query, [loanId], (err, row) => {
    if (err) {
      callback(err, null);
      return;
    }
    
    if (!row) {
      callback(new Error('Loan not found'), null);
      return;
    }

    const balanceAmount = parseFloat((row.total_amount - row.amount_paid).toFixed(2));
    const emisLeft = Math.ceil(balanceAmount / row.monthly_emi);

    callback(null, {
      ...row,
      balance_amount: balanceAmount,
      emis_left: Math.max(0, emisLeft)
    });
  });
}

// API Routes

// 1. LEND - Create a new loan
app.post('/api/v1/loans', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  // Validation
  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly < 0) {
    return res.status(400).json({ error: 'Invalid input values' });
  }

  // Check if customer exists
  db.get('SELECT customer_id FROM customers WHERE customer_id = ?', [customer_id], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const loanId = uuidv4();
    const { interest, totalAmount, monthlyEmi } = calculateLoanDetails(
      loan_amount, 
      loan_period_years, 
      interest_rate_yearly
    );

    const insertLoan = `
      INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                        interest_rate, loan_period_years, monthly_emi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertLoan, [
      loanId, customer_id, loan_amount, totalAmount, 
      interest_rate_yearly, loan_period_years, monthlyEmi
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create loan' });
      }

      res.status(201).json({
        loan_id: loanId,
        customer_id,
        total_amount_payable: totalAmount,
        monthly_emi: monthlyEmi
      });
    });
  });
});

// 2. PAYMENT - Record a payment
app.post('/api/v1/loans/:loan_id/payments', (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type = 'EMI' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  const paymentId = uuidv4();
  const insertPayment = `
    INSERT INTO payments (payment_id, loan_id, amount, payment_type)
    VALUES (?, ?, ?, ?)
  `;

  db.run(insertPayment, [paymentId, loan_id, amount, payment_type], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to record payment' });
    }

    // Get updated loan status
    getLoanStatus(loan_id, (err, loanStatus) => {
      if (err) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      res.json({
        payment_id: paymentId,
        loan_id,
        message: 'Payment recorded successfully',
        remaining_balance: loanStatus.balance_amount,
        emis_left: loanStatus.emis_left
      });
    });
  });
});

// 3. LEDGER - Get loan details and transaction history
app.get('/api/v1/loans/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;

  getLoanStatus(loan_id, (err, loanStatus) => {
    if (err) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get all transactions
    const transactionQuery = `
      SELECT payment_id as transaction_id, payment_date as date, amount, payment_type as type
      FROM payments 
      WHERE loan_id = ?
      ORDER BY payment_date DESC
    `;

    db.all(transactionQuery, [loan_id], (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch transactions' });
      }

      res.json({
        loan_id: loanStatus.loan_id,
        customer_id: loanStatus.customer_id,
        principal: loanStatus.principal_amount,
        total_amount: loanStatus.total_amount,
        monthly_emi: loanStatus.monthly_emi,
        amount_paid: loanStatus.amount_paid,
        balance_amount: loanStatus.balance_amount,
        emis_left: loanStatus.emis_left,
        transactions
      });
    });
  });
});

// 4. ACCOUNT OVERVIEW - Get all loans for a customer
app.get('/api/v1/customers/:customer_id/overview', (req, res) => {
  const { customer_id } = req.params;

  const query = `
    SELECT 
      l.loan_id,
      l.principal_amount,
      l.total_amount,
      (l.total_amount - l.principal_amount) as total_interest,
      l.monthly_emi,
      COALESCE(SUM(p.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN payments p ON l.loan_id = p.loan_id
    WHERE l.customer_id = ?
    GROUP BY l.loan_id
  `;

  db.all(query, [customer_id], (err, loans) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (loans.length === 0) {
      return res.status(404).json({ error: 'No loans found for customer' });
    }

    const processedLoans = loans.map(loan => {
      const balanceAmount = parseFloat((loan.total_amount - loan.amount_paid).toFixed(2));
      const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: loan.total_interest,
        emi_amount: loan.monthly_emi,
        amount_paid: loan.amount_paid,
        emis_left: Math.max(0, emisLeft)
      };
    });

    res.json({
      customer_id,
      total_loans: loans.length,
      loans: processedLoans
    });
  });
});

// Get all customers (helper endpoint)
app.get('/api/v1/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, customers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(customers);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Bank Lending System API running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});