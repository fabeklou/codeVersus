import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Snippet'
  },
  language: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  privateLink: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { versionKey: false });

const SnippetModel = mongoose.model('Snippet', snippetSchema);

export default SnippetModel;
