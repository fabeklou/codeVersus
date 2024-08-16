import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 15,
    unique: true,
    required: true
  }
}, { versionKey: false });

const InterestModel = mongoose.model('Interest', interestSchema);

export default InterestModel;
