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
  userProfil: {
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
        ref: 'Tag'
      }]
    },
    profilePicture: {
      type: String
    }
  }
}, { versionKey: false });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
