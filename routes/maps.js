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
    const query = `SELECT users.first_name, maps.* FROM maps LEFT JOIN users ON maps.creator_id = users.id WHERE 1=1 ORDER BY maps.created_at`;

    db.query(query)
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

    const userQuery = `SELECT first_name FROM users WHERE id = $1`;
    db.query(userQuery, [req.session.userId])
      .then((userResult) => {
        const user = userResult.rows[0];
        console.log(user);

        const query = `
           INSERT INTO maps (map_name, creator_id) VALUES ($1, $2) RETURNING *
        `;

        db.query(query, [mapName, req.session.userId])
          .then((data) => {
            const map = data.rows[0];
            map["creator_name"] = user.first_name;

            console.log(map);
            res.send({ message: "map created", data: map });
          })
          .catch((err) => res.status(500).send({ error: err.message }));
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  // create point
  router.post("/:id", (req, res) => {
    const mapId = req.params.id;

    if (!mapId) return res.status(400).send({ message: "invalid /:id" });

    const { lat, long, markerName, markerDesc, markerImgUrl } = req.body;

    const checkQuery = `
      SELECT id FROM maps WHERE creator_id = $1 AND id = $2
    `;
    db.query(checkQuery, [req.session.userId, mapId]).then((result) => {
      console.log(result.rows);
      if (!result.rows.length) {
        return res.status(400).send({ message: "not your map" });
      } else {
        const query = `
        INSERT INTO points (lat, long, title, description, image_url, map_id, creator_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;

        db.query(query, [
          lat,
          long,
          markerName,
          markerDesc,
          markerImgUrl,
          mapId,
          req.session.userId,
        ])
          .then((data) => {
            const point = data.rows[0];
            res.send({ message: "point created", data: point });
          })
          .catch((err) => res.status(500).send({ error: err.message }));
      }
    });

    // if (!lat || !long || !title || !description || !imageUrl) {
    //   return res.status(400).send({ message: "invalid data" });
    // }
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

    `;

    db.query(query, [id])
      .then((data) => {
        const map = data.rows;
        res.send({ message: "a map", data: map });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  router.delete("/points", (req, res) => {
    const { lat, long } = req.query;

    const query = `
      DELETE FROM points
      WHERE lat = $1
      AND long = $2
      AND creator_id = $3
      RETURNING *
    `;
    db.query(query, [lat, long, req.session.userId])
      .then((result) => {
        if (!result.rows.length) {
          return res.status(400).send({ message: "not your marker" });
        }
        res.send({ message: "success delete", data: result.rows[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err.message });
      });
  });

  // get a point info
  router.get("/point/single", (req, res) => {
    const { lat, long } = req.query;
    console.log(typeof lat);
    const query = `
      SELECT * FROM points
      WHERE lat = $1
      AND long = $2
    `;
    db.query(query, [lat, long])
      .then((result) => {
        console.log(result.rows);
        res.send({ message: "edit", data: result.rows[0] });
      })
      .catch((err) => res.status(500).send({ error: err.message }));
  });

  // edit a point info
  router.patch("/point/edit", (req, res) => {
    const { lat, long } = req.query;
    const { markerName, markerDesc, markerImgUrl } = req.body;
    console.log(req.body);

    const checkQuery = `
      SELECT * FROM points
      WHERE lat = $1
      AND long = $2
      AND creator_id = $3
    `;
    db.query(checkQuery, [lat, long, req.session.userId])
      .then((result) => {
        if (!result.rows.length) {
          return res.status(400).send({ message: "not your marker" });
        }
        const query = `
          UPDATE points
          SET title = $1, description = $2, image_url = $3
          WHERE lat = $4
          AND long = $5
          RETURNING *
        `;
        db.query(query, [markerName, markerDesc, markerImgUrl, lat, long])
          .then((result) => {
            console.log(result.rows);
            res.send({ message: "edit", data: result.rows[0] });
          })
          .catch((err) => res.status(500).send({ error: err.message }));
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
