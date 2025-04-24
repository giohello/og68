const express = require('express');
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', requireAuth, function (req, res, next) {
    const filePath = path.join(__dirname, "..", "blogs.json");
    const data = fs.readFileSync(filePath);
    const blogs = JSON.parse(data);
    res.render("blogs", { blogs });
});

const fs = require("fs");
const path = require("path");

router.post("/", requireAuth, (req, res) => {
    const { title, content } = req.body;

    const blog = {
        title,
        content,
        author: req.session.user.email,
        date: new Date().toLocaleString()
    };

    const filePath = path.join(__dirname, "..", "blogs.json");
    const data = fs.readFileSync(filePath);
    const blogs = JSON.parse(data);
    blogs.push(blog);
    fs.writeFileSync(filePath, JSON.stringify(blogs, null, 2));

    res.redirect("/blogs");
});


module.exports = router;