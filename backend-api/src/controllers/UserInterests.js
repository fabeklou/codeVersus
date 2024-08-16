import InterestModel from '../models/Interest.js';

class UserInterests {
  static async createInterest(interestName) {
    try {
      const interest = new InterestModel({ name: interestName });
      await interest.save();
      return interest._id;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getInterestByName(interestName) {
    try {
      const interest = await InterestModel.findOne({ name: interestName });
      return interest;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getInterests(page, limit) {
    try {
      const interests = await InterestModel.find()
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return interests;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getInterestById(interestId) {
    try {
      const interest = await InterestModel.findOne({ _id: interestId });
      return interest;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default UserInterests;
