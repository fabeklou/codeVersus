import mongoose from 'mongoose';

const programmingLanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 15,
    unique: true,
    required: true
  }
}, { versionKey: false });

const ProgrammingLanguageModel = mongoose
  .model('ProgrammingLanguage', programmingLanguageSchema);

export default ProgrammingLanguageModel;
