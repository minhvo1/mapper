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
  // get map lists
  router.get("/", (req, res) => {
    const query = `SELECT * FROM maps WHERE creator_id = $1`;

    db.query(query, [req.session.userId])
      .then((data) => {
        const maps = data.rows;
        res.send({ message: "map lists", data: maps });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  // create map
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

  // create point
  router.post("/:id", (req, res) => {
    const mapId = req.params.id;

    if (!mapId) return res.status(400).send({ message: "invalid /:id" });

    const { lat, long, title, description, imageUrl } = req.body;

    if (!lat || !long || !title || !description || !imageUrl) {
      return res.status(400).send({ message: "invalid data" });
    }

    const query = `
    INSERT INTO points (lat, long, title, description, image_url, map_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    db.query(query, [lat, long, title, description, imageUrl, mapId])
      .then((data) => {
        const point = data.rows[0];
        res.send({ message: "point created", data: point });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  // get a map with points
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "invalid /:id" });

    const query = `
      SELECT maps.id as map_id, maps.map_name, points.lat, points.long, points.title, points.description,
              points.image_url, points.created_at
      FROM maps
      JOIN points ON points.map_id = maps.id
      WHERE maps.id = $1
      AND creator_id = $2;
    `;

    db.query(query, [id, req.session.userId])
      .then((data) => {
        const map = data.rows;
        res.send({ message: "a map", data: map });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  // delete a map
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "invalid /:id" });

    const query = `
      DELETE FROM maps WHERE id = $1 RETURNING *;
    `;
    db.query(query, [id])
      .then((data) => {
        const deletedMap = data.rows[0];
        if (!deletedMap)
          return res.status(400).send({ message: "invalid map id" });

        res.send({
          message: `deleted`,
          data: deletedMap,
        });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  return router;
};
