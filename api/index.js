const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "rasulnekzad",
  host: "localhost",
  database: "studentinfo",
  password: "",
  port: 5432,
});

router.get("/", (req, res) => {
  let sql = `SELECT * FROM ${req.query.table_name} WHERE 1 = 1`;
  // multiple params named filter in URL, e.g., &filter=..., stored in array
  let filters = req.query.filter;
  if (filters && !Array.isArray(filters)) {
    // If only 1 filter in URL, force into array
    filters = [filters];
  }
  const hasFilters = filters && filters.length;
  if (hasFilters) {
    for (let filter of filters) {
      const colName = filter.split(";")[0];
      const value = filter.split(";")[1];
      sql += ` AND ${colName} = '${value}'`;
    }
  }
  sql += `;`;
  console.log(sql);
  pool.query(sql, (err, result) => {
    try {
      console.log(result.rows);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(400).send("Error retrieving data.");
    }
  });
});

router.post("/", (req, res) => {
  let sql = `INSERT INTO ${req.query.table_name} VALUES (`;
  for (let key in req.query) {
    if (key === "table_name") {
      continue;
    }
    sql += `${req.query[key]},`;
  }
  sql = sql.substring(0, sql.length - 1);
  sql += `) RETURNING *;`;
  console.log(sql);
  pool.query(sql, (err, result) => {
    try {
      console.log(result);
      console.log(result.rows);
      res.status(200).json(result.rows);
    } catch (err) {
      console.log(err);
      res.status(400).send("Error inserting data.");
    }
  });
});

module.exports = router;
