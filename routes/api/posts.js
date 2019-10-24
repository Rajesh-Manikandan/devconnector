const express = require('express');
const router = express.Router();

// @route   GET api/post
// @desc    Test route
// @access  PUBLIC
router.get('/', (req, res) => {
  res.send('from post router');
});

module.exports = router;
