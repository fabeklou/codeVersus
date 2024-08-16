import TagModel from '../models/Tag.js';

class SnippetTag {
  static async createTag(tagName) {
    try {
      const tag = new TagModel({ name: tagName });
      await tag.save();
      return tag._id;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getTagByName(tagName) {
    try {
      const tag = await TagModel.findOne({ name: tagName });
      return tag;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getTags(page, limit) {
    try {
      const tags = await TagModel.find()
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return tags;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getTagById(tagId) {
    try {
      const tag = await TagModel.findOne({ _id: tagId });
      return tag;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default SnippetTag;
