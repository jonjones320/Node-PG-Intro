/** Routes for Biztime companies */

const db = require("../db");
const router = express.Router();
const express = require("express");
const ExpressError = require("../expressError");



// GET /invoices : Return info on invoices: like {invoices: [{id, comp_code}, ...]}

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
          `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices`);

    return res.json(results.rows);
  }
  catch (err) {
    return next(err);
  }
});


// GET /invoices/[id] : Returns obj on given invoice.
// If invoice cannot be found, returns 404. 
// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

router.get("/id",
      async function (req, res, next) {
  try {
    const id = req.query.code;

    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date 
       FROM invoices
       WHERE id=$1`, [id]);
    if (results.rows.length === 0) {
        throw new ExpressError("Invoice not found!", 404);
    };
    return res.json(results.rows);
  }
  catch (err) {
    return next(err);
  }
});



// POST /invoices : Adds an invoice. 
// Needs to be passed in JSON body of: {comp_code, amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.post("/", async function (req, res, next) {
  try {
    const { comp_code, amt } = req.body;

    const result = await db.query(
          `INSERT INTO invoices (comp_code, amt) 
           VALUES ($1, $2)
           RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [id, comp_code, amt, paid, add_date, paid_date]
    );

    return res.status(201).json(result.rows[0]);
  }
  catch (err) {
    return next(err);
  }
});


// PUT /invoices/[id] : Updates an invoice. 
// If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of {amt} Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.patch("/:id", async function (req, res, next) {
  try {
    const { amt, paid } = req.body;

    const result = await db.query(
          `UPDATE invoices SET amt=$2, paid=$3
           WHERE id = $1
           RETURNING id, amt, paid`,
        [amt, paid, req.params.id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("Invoice not found!", 404);
    };
    return res.json(result.rows[0]);
  }
  catch (err) {
    return next(err);
  }
});


// DELETE /invoices/[id] : Deletes an invoice.
// If invoice cannot be found, returns a 404. 
// Returns: {status: "deleted"} 
// Also, one route from the previous part should be updated:
// GET /companies/[code] : Return obj of company: {company: {code, name, description, invoices: [id, ...]}} 
// If the company given cannot be found, this should return a 404 status response.

router.delete("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM invoices WHERE id = $1",
        [req.params.id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("Invoice not found!", 404);
    };
    return res.json({message: `Deleted invoice ${req.params.id}`});
  }
  catch (err) {
    return next(err);
  }
});


module.exports = router;