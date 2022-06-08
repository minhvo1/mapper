const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //get all favMap
  router.get("/:id", (req, res) => {
    const userId = req.session.userId;

    db.query(
      `SELECT maps.id, maps.name, users.first_name
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
    const { mapId, userId } = req.body;
    db.query(
      `INSERT INTO favourite_maps (map_id, user_id) VALUES ($1, $2) RETURNING *;`,
      [mapId, userId]
    )
      .then((data) => {
        const favMap = data.rows[0];
        res.send({ data: favMap });
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });

  //delete favMap
  router.delete("/:id", (req, res) => {
    const values = req.params.id;
    db.query(`DELETE FROM favourite_maps WHERE id = $1 RETURNING *`, [values])
      .then((data) => {
        res.send({ message: "deleted success", data: data.rows[0] });
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  });

  return router;
};
