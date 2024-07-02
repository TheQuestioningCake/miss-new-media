const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min_length: 1,
      max_length: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    username: {
        type: String,
        required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
  }
);



const Thought = model('thought', thoughtSchema);

module.exports = Thought;