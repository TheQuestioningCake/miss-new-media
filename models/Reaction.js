const { Schema, model } = require('mongoose');


const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
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
    }
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
  }
);

reactionSchema.virtual('formattedDate').get(function(){
    const formattedDate = this.createdAt.toLocaleString('en-US')
    return formattedDate
  })


module.exports = reactionSchema;