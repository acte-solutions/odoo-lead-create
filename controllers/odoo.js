// Odoo lead creation
var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const validator = require('validator');

var Odoo = require('odoo-xmlrpc');

const HOST = process.env.ODOO_HOST;
const PORT = process.env.ODOO_PORT || 443;

const USER = process.env.ODOO_USER;
const PASS = process.env.ODOO_PASS;
const DB = process.env.ODOO_DB;

var odoo = new Odoo({
  url: HOST,
  port: PORT,
  db: DB,
  username: USER,
  password: PASS
});


/*
* CREATE LEAD
*/

router.post('/crm/lead/create', jsonParser, async (req, res) => {

  if(!validator.isEmail(req.body.email)){ return res.status(401).send('Validation error (email)'); }

  var xmlData = {
    active: true,
    name: req.body.name,
    contact_name: req.body.name,
    email_from: req.body.email,
    description: req.body.description,
    company_id: 2, //important if you use multicompany
  }

  return odoo.connect(function (err) {

      if (err) {
        console.log('ERROR', err);
        return res.status(500).send('ERROR CONNECTING TO SERVER');
      }

      var inParams = [];
      inParams.push(xmlData)
      var params = [];
      params.push(inParams);

      odoo.execute_kw('crm.lead', 'create', params, function (err, value) {
          if (err) {
            console.log(err);
            return res.status(400).send('ERROR CREATING RECORD');
          }

          console.log('Lead created', xmlData);
          return res.status(200).send('SUCCESS');
      });

  });
});


module.exports = router;
