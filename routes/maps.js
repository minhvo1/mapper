/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

//maps,
module.exports = (db) => {
  // get current user's map lists
  router.get("/", (req, res) => {
    const query = `SELECT * FROM maps WHERE creator_id = $1`;

    db.query(query, [req.session.userId])
      .then((data) => {
        const maps = data.rows;
        res.send({ message: "map lists", data: maps });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  router.post("/", (req, res) => {
    const { mapName } = req.body;

    if (!mapName) return res.status(400).send({ message: "need mapName" });

    const query = `
    INSERT INTO maps (map_name, creator_id) VALUES ($1, $2) RETURNING *
    `;

    db.query(query, [mapName, req.session.userId])
      .then((data) => {
        const map = data.rows[0];
        res.send({ message: "map created", data: map });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  return router;
};
