const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
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
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean();

      if (!user) {
        return res.status(404).json({ message: 'No account found' });
      }

      res.json({user});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
async updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'No account found' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
},
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'No account found' })
    }

    await Thought.deleteMany({ userId: user._id });

    await User.updateMany(
      {}, 
      { $pull: { friends: user._id } }, 
      { multi: true } 
    );

    res.json({ message: 'User Terminated' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
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
          .json({ message: 'No account found' })
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
      console.log("Friend Removed");
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
          .json({ message: 'No account found' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};