import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 35,
    default: 'Untitled Snippet'
  },
  language: {
    type: String,
    maxLength: 15,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxLength: 200,
    required: true
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      unique: true
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
