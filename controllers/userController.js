const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const userObj = {
        users,
      };
      return res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean();

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({user});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user
async updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
},
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'No such user exists' })
    }

    await Thought.deleteMany({ userId: user._id });

    await User.updateMany(
      {}, // Filter (empty to match all documents)
      { $pull: { friends: user._id } }, // Update
      { multi: true } // Options (update multiple documents)
    );

    res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an friend to a user
  async addFriend(req, res) {
    try {
      // console.log('You are adding a friend');
      console.log('User ID:', req.params.userId);
      console.log('Friend ID:', req.params.friendId);
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      console.log(user)

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' })
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
//   // Remove friend from a user
  async removeFriend(req, res) {
    try {
      console.log("Removing friend");
      console.log('User ID:', req.params.userId);
      console.log('Friend ID:', req.params.friendId);

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};