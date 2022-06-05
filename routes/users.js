/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { authUser } = require("../middlewares/authUser");

module.exports = (db) => {
  router.get("/login", (req, res) => {
    const userId = req.session.userId;

    if (userId === undefined || !userId) {
      return res.render("login");
    }
    res.send({ message: "already logged in" });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(`SELECT * FROM users WHERE email = $1`, [email])
      .then((data) => {
        const user = data.rows[0];

        if (!user)
          return res.status(422).send({ message: "invalid email/password" });

        const validCredential = bcrypt.compareSync(password, user.password);

        if (!validCredential)
          return res.status(422).send({ message: "invalid email/password" });

        req.session.userId = user.id;
        console.log(req.session.userId);
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.send({ message: "logout success" });
  });

  router.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!email.length || !password.length) {
      return res.status(400).send({ message: "invalid email or password" });
    }

    // check email if already in use
    db.query(`SELECT * FROM users WHERE email = $1`, [email])
      .then((result) => {
        const user = result.rows[0];

        //if user exists in db return;
        if (user)
          return res.status(403).send({ message: "user already exists" });

        // create new user
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.query(
          `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
          [firstName, lastName, email, hashedPassword]
        )
          .then((data) => {
            const user = data.rows[0];
            req.session.userId = user.id;
            return res.send({ message: "user created", data: user });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/me", authUser, (req, res) => {
    db.query(`SELECT * FROM users WHERE users.id = $1`, [req.session.userId])
      .then((data) => {
        const user = data.rows[0];
        res.send({ message: "user profile", data: user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    res.send({message: 'user register'});
  });
  return router;
};
