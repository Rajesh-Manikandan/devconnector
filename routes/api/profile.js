const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get user profile by token
// @access  PRIVATE
router.get('/me', auth, async (req, res) => {
  try {
    const id = req.user.id;
    const profile = await Profile.findOne({ user: id }).populate('user', [
      'name,avatar'
    ]);

    console.log(profile);

    if (!profile) {
      return res
        .status(400)
        .send({ msg: 'No profile associated with this user' });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by User ID
// @access  PRIVATE
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const id = req.params.user_id;
    const profile = await Profile.findOne({
      user: id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).send({ msg: 'Profile not found' });
    }

    const user = await User.findById(id);
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile,users and posts
// @access  PRIVATE
router.delete('/', auth, async (req, res) => {
  try {
    // TODO Need to delete posts

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findByIdAndRemove(req.user.id);
    res.send({ msg: 'User removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add Profile Experience
// @access  PRIVATE
router.put(
  '/experience',
  [
    auth,
    [
      check('title')
        .not()
        .isEmpty(),
      check('company')
        .not()
        .isEmpty(),
      check('from')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.user.id;
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };

      let profile = await Profile.findOne({ user: id });

      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'No profile associated with this user' });
      }

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:experience_id
// @desc    Delete Profile Experience
// @access  PRIVATE
router.delete('/experience/:experience_id', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const experience_id = req.params.experience_id;

    let profile = await Profile.findOne({ user: user_id });

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'No profile associated with this user' });
    }

    profile.experience = profile.experience.filter(
      experience => experience._id != experience_id
    );

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    Add Profile Education
// @access  PRIVATE
router.put(
  '/education',
  [
    auth,
    [
      check('school')
        .not()
        .isEmpty(),
      check('degree')
        .not()
        .isEmpty(),
      check('fieldofstudy')
        .not()
        .isEmpty(),
      check('from')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.user.id;
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
      const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      let profile = await Profile.findOne({ user: id });

      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'No profile associated with this user' });
      }

      profile.education.unshift(newEducation);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/education/:education_id
// @desc    Delete Profile Education
// @access  PRIVATE
router.delete('/education/:education_id', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const education_id = req.params.education_id;

    let profile = await Profile.findOne({ user: user_id });

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'No profile associated with this user' });
    }

    const removeIndex = profile.education
      .map(edu => edu._id)
      .indexOf(education_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Create/Update User profile
// @access  PRIVATE
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is Required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is Required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
      } = req.body;

      const id = req.user.id;

      //Build Profile Object
      const profileobj = {};

      profileobj.user = id;
      if (company) profileobj.company = company;
      if (website) profileobj.website = website;
      if (location) profileobj.location = location;
      if (bio) profileobj.bio = bio;
      if (status) profileobj.status = status;
      if (githubusername) profileobj.githubusername = githubusername;
      if (skills) {
        profileobj.skills = skills.split(',').map(skill => skill.trim());
      }

      //Build sociallinks
      profileobj.social = {};
      if (youtube) profileobj.youtube = youtube;
      if (facebook) profileobj.facebook = facebook;
      if (twitter) profileobj.twitter = twitter;
      if (instagram) profileobj.instagram = instagram;
      if (linkedin) profileobj.linkedin = linkedin;

      let profile = await Profile.findOne({ user: id });

      if (profile) {
        //Update Profile
        profile = await Profile.findOneAndUpdate(
          { user: id },
          { $set: profileobj },
          { new: true }
        );
      } else {
        //Create Profile
        profile = new Profile(profileobj);
        profile = await profile.save();
      }

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
