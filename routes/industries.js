/** Routes for Biztime industries */

const db = require("../db");
const router = express.Router();
const slugify = require('slugify');
const express = require("express");
const ExpressError = require("../expressError");



router.get("/", async function (req, res, next) {
    try {
      const result = await db.query(
            `SELECT industries.industry, ARRAY_AGG(field.comp_code) AS company_codes
            FROM industries
            LEFT JOIN field ON industries.code = field.indust_code
            GROUP BY industries.industry`
          );
  
      return res.json({ industries: result.rows });
    }
  
    catch (err) {
      return next(err);
    }
  });


router.post("/", async function (req, res, next) {
    try {
      const { industry } = req.body;
      const code = slugify(industry, { lower: true, strict: true });
  
      const result = await db.query(
            `INSERT INTO industries (code, industry) 
             VALUES ($1, $2)
             RETURNING code, industry`,
          [code, industry]
      );

      return res.status(201).json(result.rows[0]);
    }
    catch (err) {
      return next(err);
    }
});



router.post("/fields", async function (req, res, next) {
try {
    const { comp_code, indust_code } = req.body;

    const result = await db.query(
        `INSERT INTO fields (comp_code, indust_code)
            VALUES ($1, $2)
            RETURNING comp_code, indust_code`,
        [comp_code, indust_code]
    );
    return res.json(result.rows[0]);
}
catch (err) {
    if (err.code === '23505') { // unique violation
      next(new ExpressError("Association already exists!", 400));
    } else {
      next(err);
    }
  }
});


module.exports = router;