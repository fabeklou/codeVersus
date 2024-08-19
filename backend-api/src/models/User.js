import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userProfile: {
    bio: {
      type: String,
      default: 'code versus is so much fun.'
    },
    friends: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    },
    interests: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
      }],
      validate: {
        validator: (value) => {
          return value.length === new Set(value.map(
            (interest) => interest.toString())).size;
        },
        message: 'Interests must be unique for a user.'
      }
    },
    profilePicture: {
      type: String
    },
    githubLink: {
      type: String
    },
    xLink: {
      type: String
    },
    linkedinLink: {
      type: String
    }
  }
}, { versionKey: false });

/** Middleware to update the updatedAt field before saving */
userSchema.pre('save',
  function (next) {
    try {
      this.updatedAt = Date.now();
      next();
    } catch (err) {
      next(err);
    }
  });

/** Middleware to update the updatedAt field before any update operation */
userSchema.pre(['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'],
  function (next) {
    try {
      this.set({ updatedAt: Date.now() });
      next();
    } catch (err) {
      next(err);
    }
  });

const UserModel = mongoose.model('User', userSchema);

/** Add full-text search support */
UserModel.createIndexes({ username: 'text' });

export default UserModel;
