const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// @route   GET api/auth
// @desc    Test route
// @access  PUBLIC
router.get('/', auth, (req, res) => {
  res.send('from auth router');
});

module.exports = router;
