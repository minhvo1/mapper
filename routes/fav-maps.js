const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //get all favMap
  router.get("/", (req, res) => {
    const userId = req.session.userId;

    db.query(
      `SELECT favourite_maps.id AS f_m_id, maps.id AS map_id,
        maps.map_name, users.first_name
        FROM favourite_maps
        JOIN maps ON maps.id = map_id
        JOIN users ON users.id = creator_id
        WHERE user_id = $1;`,
      [userId]
    )
      .then((data) => {
        const favMaps = data.rows;
        res.send({ data: favMaps });
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });

  //add favMap
  router.post("/", (req, res) => {
    const { mapId } = req.body;

    const checkQuery = `
      SELECT * FROM favourite_maps WHERE map_id = $1 AND user_id = $2
    `;
    db.query(checkQuery, [mapId, req.session.userId]).then((result) => {
      if (result.rows[0]) {
        return res.status(400).send({ message: "already in fav list" });
      }
      db.query(
        `INSERT INTO favourite_maps (map_id, user_id) VALUES ($1, $2) RETURNING *;`,
        [mapId, req.session.userId]
      )
        .then((data) => {
          console.log("fav");
          const favMap = data.rows[0];
          res.send({ data: favMap });
        })
        .catch((err) => {
          res.status(500).send({ error: err.message });
        });
    });
  });

  //delete favMap
  router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM favourite_maps WHERE map_id = $1 AND user_id = $2`;

    db.query(query, [id, req.session.userId])
      .then((data) => {
        console.log("deleted");
        res.send({ message: "deleted success", data: data.rows[0] });
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });

  return router;
};
