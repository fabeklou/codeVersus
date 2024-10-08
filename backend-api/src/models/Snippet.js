import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 35,
    default: 'Untitled Snippet'
  },
  programmingLanguage: {
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
      ref: 'Tag'
    }],
    default: [],
    validate: {
      validator: (value) => {
        return value.length === new Set(value.map(tag => tag.toString())).size;
      },
      message: 'Tags must be unique within the snippet.'
    }
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
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

/** Middleware to update the updatedAt field before saving */
snippetSchema.pre('save',
  function (next) {
    try {
      this.updatedAt = Date.now();
      next();
    } catch (error) {
      next(error);
    }
  });

/** Middleware to update the updatedAt field before any update operation */
snippetSchema.pre(['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'],
  function (next) {
    try {
      this.set({ updatedAt: Date.now() });
      next();
    } catch (error) {
      next(error);
    }
  });

/** Add full-text search support */
snippetSchema.index({ title: 'text' });

const SnippetModel = mongoose.model('Snippet', snippetSchema);

export default SnippetModel;
