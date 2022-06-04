/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router  = express.Router();

module.exports = (db) => {
  router.post("/login", (req, res) => {

  });
  router.post("/register", (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if (!email.length || !password.length) {
      return res.status(400).send({message: 'invalid email or password'});
    }

    // check email if already in use
    db.query(`SELECT * FROM users WHERE email = $1`, [email])
      .then(result => {
        const user  = result.rows[0];

        if (user) { //if user exists in db return;
          return res.status(403).send({message: 'user already exists'});
        } else {

          const hashedPassword = bcrypt.hashSync(password, 10);
          db.query(`INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURN *`,
            [firstName, lastName, email, hashedPassword])
            .then(data => {
              const user = data.rows[0];
              return res.json({ user });
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });
        }
      })
      .catch(err => {
        res.status(500).json({error: err.message});
      });
  });
  router.get("/me", (req, res) => {
    db.query(`SELECT * FROM users WHERE users.id = $1`, [req.users.id])
      .then(data => {
        const user = data.rows[0];
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json({error: err.message});
      });
  });
  return router;
};
