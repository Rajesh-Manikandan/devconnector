const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  PUBLIC
router.get('/', (req, res) => {
  res.send('from profile router');
});

module.exports = router;
