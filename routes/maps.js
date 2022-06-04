/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

//maps, user_maps

module.exports = (db) => {
  // get current user's map lists
  router.get("/", (req, res) => {
    let query = `SELECT * FROM user_maps JOIN maps ON maps.id = user_maps.map_id WHERE user_id = $1`;

    db.query(query, [req.session.userId])
      .then((data) => {
        const maps = data.rows;
        res.send({ message: "map lists", data: maps });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // router.

  return router;
};
