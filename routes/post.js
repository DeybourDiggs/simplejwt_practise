const router = require("express").Router();
const { publicPosts, privatePost} = require("../db")
const checkAuth = require('../middleware/checkAuth')


router.get('/public', (req, res) => {
    res.json({publicPosts})
})

router.get('/private', checkAuth, (req, res) => {
    res.json({privatePost})
})


module.exports = router;
