/** Routes for Biztime companies */

const db = require("../db");
const router = express.Router();
const slugify = require('slugify');
const express = require("express");
const ExpressError = require("../expressError");



// GET /companies : Returns list of companies, like {companies: [{code, name}, ...]} //

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
          `SELECT code, name, description FROM companies`);

    return res.json(results.rows);
  }
  catch (err) {
    return next(err);
  }
});



// GET /companies/[code] : Return obj of company: {company: {code, name, description}}

router.get("/code",
      async function (req, res, next) {
  try {
    const code = req.query.code;

    const result = await db.query(
      `SELECT code, name, description 
       FROM companies
       WHERE code=$1`, [code]);

    if (result.rows.length === 0) {
        throw new ExpressError("Company not found!", 404);
    };
    return res.json(result.rows);
  }
  catch (err) {
    return next(err);
  }
});



// POST /companies : Adds a company. 
// Needs to be given JSON like: {code, name, description} 
// Returns obj of new company:  {company: {code, name, description}}

router.post("/", async function (req, res, next) {
  try {
    const { name, description } = req.body;
    const code = slugify(name, { lower: true, strict: true });

    const result = await db.query(
          `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3)
           RETURNING code, name, description`,
        [code, name, description]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("Company not found!", 404);
    }
    return res.status(201).json(result.rows[0]);
  }
  catch (err) {
    return next(err);
  }
});



// PATCH /companies/[code] : Edit existing company. 
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description}.
// Returns update company object: {company: {code, name, description}}.

router.patch("/:code", async function (req, res, next) {
  try {
    const { code, name, description } = req.body;

    const result = await db.query(
          `UPDATE companies SET name=$2, description=$3
           WHERE code = $1
           RETURNING code, name, description`,
        [name, description, req.params.code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("Company not found!", 404);
    };
    return res.json(result.rows[0]);
  }
  catch (err) {
    return next(err);
  }
});



// DELETE /companies/[code] : Deletes company. 
// Should return 404 if company cannot be found.
// Returns {status: "deleted"}

router.delete("/:code", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM companies WHERE code = $1",
        [req.params.code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError("Company not found!", 404)
    };
    return res.json({message: "Deleted"});
  }
  catch (err) {
    return next(err);
  }
});



module.exports = router;