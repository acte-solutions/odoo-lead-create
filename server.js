const express = require('express')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 8081
const helmet = require('helmet')
const rateLimit = require("express-rate-limit");

const odoo = require('./controllers/odoo');

//Enable helmet globally
app.use(helmet())

// Rate limiter
const odooLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3 //max 3 request per hour
});

// Controller
app.post('/crm/*', odooLimiter, odoo);

// Start app
app.listen(port, () => console.log(`ACTE gateway running on port ${port}!`))
