const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const users = require("../data/user.json");

router.get("/login", (req, res, next) => {
  return res.status(200).render("login");
});

router.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  const userIndex = users.findIndex(
    (u) => u.username === username && u.password === password
  );

  if (userIndex == -1) {
    return res.redirect("/auth/unauthorized");
  }
  const foundUser = users.findIndex((user) => {
    return user.username == username;
  });

  const token = jwt.sign(users[userIndex], "secret-binar");
  req.headers.authorization = `Bearer ${token}`;

  req.token = `Bearer ${token}`;
  console.log("headers nya => ", req.headers.authorization);

  if (foundUser.role == "superuser") {
    return res.redirect("/user/dashboard", token);
  } else {
    res.setHeader("authorization", `Bearer ${token}`);
    return res.redirect(`/play?token=${token}`);
  }
});

router.get("/unauthorized", (req, res, next) => {
  return res.status(401).render("unauthorized");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const newUser = { username, password, role: "user" };

  let appendUser = [];
  users.push(newUser);
  appendUser = users;

  const jsonData = JSON.stringify(appendUser, null, 2);
  console.log("sdsasa => ", jsonData);
  fs.writeFileSync("data/user.json", jsonData, "utf8", (err) => {
    if (err) {
      res.redirect("error");
    }
  });

  return res.redirect("/auth/login");
});

module.exports = router;
