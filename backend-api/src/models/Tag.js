import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
}, { versionKey: false });

const TagModel = mongoose.model('Tag', tagSchema);

export default TagModel;
