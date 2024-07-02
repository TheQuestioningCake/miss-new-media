const { ObjectId } = require('mongoose').Types;
const { Thought, User} = require('../models')

module.exports = {
    async getThoughts(req, res) {
        try {
          const thoughts = await Thought.find();
          const thoughtObject = {
            thoughts
          };
          return res.json(thoughtObject);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },
    
      
      async getThought(req, res) {
        try {
          const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .lean();
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought matches that ID' });
          }
    
          res.json({
            thought,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },
    
      async createThought(req, res) {
        try {
          const thought = await Thought.create(req.body);
      
          const user = await User.findByIdAndUpdate(
            req.body.userId, 
            { $push: { thoughts: thought._id } }, 
            { new: true, runValidators: true } 
          );
      
          if (!user) {
            return res.status(404).json({ message: 'No user found matches this id!' });
          }
      
          res.json({ thought, user });
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
          if (!thought) {
            return res.status(404).json({ message: `Sorry can't find a thought with that ID` })
          }
    
          res.json({ message: 'Your thought was successfully deleted' });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      async updateThought(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body, 
            { new: true, runValidators: true } 
          );
      
          if (!thought) {
            return res.status(404).json({ message: 'Sorry no thought matches with that ID' });
          }
      
          res.json(thought);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
    
      async addReaction(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
          );
    
          console.log(thought)
    
          if (!thought) {
            return res
              .status(404)
              .json({ message: 'No thought matched with that ID :(' })
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async deleteReaction(req, res) {
        try {
    
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {_id: req.params.reactionId } } },
            { runValidators: true, new: true }
          );
    
          if (!thought) {
            return res
              .status(404)
              .json({ message: 'No thought found matched that ID :(' });
          }
    
          res.json(thought);
        } catch (err) {
          console.error(err)
          res.status(500).json(err);
        }
      },
}