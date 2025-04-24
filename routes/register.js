const express = require('express');
const fs = require("fs");
const bcrypt = require("bcryptjs");
const router = express.Router();

const USERS_FILE = "users.json";

router.get('/', function (req, res, next) {
    res.render('register', { error: null });
});

router.post('/', function (req, res, next) {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('register', { error: "Passwords don't match" });
    }

    let data;
    try {
        data = fs.readFileSync(USERS_FILE);
    } catch (err) {
        data = "[]";
    }

    let users;
    try {
        users = JSON.parse(data);
    } catch (err) {
        users = [];
    }

    if (users.find(user => user.email === email)) {
        return res.render('register', { error: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ email, password: hashedPassword });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.redirect('/login');
});

module.exports = router;
