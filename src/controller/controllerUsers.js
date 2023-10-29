const express = require('express');
const router = express.Router();
const UsersDao = require('../dao/user.dao');
const user = new UsersDao()


router.get('/', async (req, res) => {
    const users = await user.findAll()
    res.render('users', { users });
  });

module.exports = router