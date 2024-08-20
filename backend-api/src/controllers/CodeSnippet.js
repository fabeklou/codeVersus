import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import SnippetModel from '../models/Snippet.js';
import SnippetTag from '../controllers/SnippetTag.js';
import TagModel from '../models/Tag.js';

const snippetsRootFoler = process.env.SNIPPETS_ROOT_FOLDER || '../snippets';

(() => {
  fs.access(snippetsRootFoler, (error) => {
    if (error) {
      fs.mkdir(snippetsRootFoler, { recursive: true }, (error) => {
        if (error) {
          console.log('Error creating snippet root folder.');
        }
      })
    }
  })
})();

class CodeSnippet {
  static createUserSnippetsFolder(userSnippetsRootFolder) {
    if (!fs.existsSync(userSnippetsRootFolder)) {
      try {
        fs.mkdirSync(userSnippetsRootFolder);
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  static async readSnippetFromDisk(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8',
        (error, data) => {
          if (error) {
            reject(new Error('Error reading snippet from disk.'));
          }
          resolve(Buffer.from(data).toString('base64'));
        });
    });
  }

  static async saveSnippetOnDisk(filePath, codeSnippet) {
    let decodedCodeSnippet;

    try {
      decodedCodeSnippet = Buffer.from(codeSnippet, 'base64').toString('utf-8');
    } catch (error) {
      throw new Error('Error decoding code snippet.');
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, decodedCodeSnippet,
        (error) => {
          if (error) {
            reject(new Error('Error saving snippet on disk.'));
          }
          resolve();
        });
    });
  }

  static async deleteSnippetFromDisk(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath,
        (error) => {
          if (error) {
            reject(new Error('Error deleting snippet from disk.'));
          }
          resolve();
        });
    });
  }

  static async saveTagsAndGetIds(tags) {
    const tagIds = [];

    for (const tag of tags) {
      try {
        const tagId = await SnippetTag.createTag(tag);
        tagIds.push(tagId);
      } catch (error) {
        try {
          const tagInDb = await SnippetTag.getTagByName(tag);
          tagIds.push(tagInDb._id);
        } catch (error) {
          throw new Error(error);
        }
      }
    }

    return tagIds.length ? tagIds : null;
  }

  static async saveCodeSnippet(req, res) {
    const { userId } = req.session;
    const {
      title,
      language,
      codeSnippet,
      isPublic,
      description,
      tags
    } = req.body;

    const userSnippetsRootFolder = `${snippetsRootFoler}/${userId}`;

    /** Create user snippets folder if it does not exist */
    try {
      CodeSnippet.createUserSnippetsFolder(userSnippetsRootFolder);
    } catch (error) {
      return res.status(500).json({ error });
    }

    /** create array of tagIds */

    let tagIds;
    try {
      tagIds = await CodeSnippet.saveTagsAndGetIds(tags);
    } catch (error) {
      return res.status(500).json({ error: 'error while saving tags.' });
    }

    /** Save snippet on disk */

    const filePath = `${userSnippetsRootFolder}/${uuidv4()}`;
    try {
      await CodeSnippet.saveSnippetOnDisk(filePath, codeSnippet);
    } catch (error) {
      return res.status(500).json({ error });
    }

    /** Create dict of data to save in db */

    const snippetData = {
      title,
      language,
      isPublic,
      tags: tagIds,
      userId,
      description,
      filePath
    };

    /** Save snippet in database */
    try {
      const newSnippet = new SnippetModel(snippetData);
      await newSnippet.save();

      const responseData = {
        message: 'Snippet saved successfully.',
        data: {
          id: newSnippet._id,
          title: newSnippet.title,
        }
      }

      return res.status(200).json(responseData);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async searchCodeSnippets(pageNumber, pageLimit, filter, searchQuery) {
    try {
      /** Add full-text search to the filter, if searchQuery is provided */
      if (searchQuery) {
        filter.$text = { $search: searchQuery };
      }

      /** Insert textScore field, to be used for sorting
       * if searchQuery is not null
       **/
      const snippets = await SnippetModel
        .find(filter, {
          title: 1,
          language: 1,
          description: 1,
          tags: 1,
          userId: 1,
          isPublic: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          ...(searchQuery && { score: { $meta: "textScore" } })
        })
        .sort(searchQuery ? { score: { $meta: "textScore" } } : {})
        .populate({
          path: 'tags',
          select: 'name'
        })
        .populate({
          path: 'userId',
          select: 'username -_id'
        })
        .populate({
          path: 'likes',
          select: 'username -_id'
        })
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit)
        .lean();

      /** Rename userId to username */
      // const transformedSnippets = snippets.map(snippet => {
      //   return {
      //     ...snippet,
      //     username: snippet.userId,
      //     userId: undefined
      //   };
      // });

      const snippetsData = {
        snippets,
        page: pageNumber,
        limit: pageLimit,
        total: snippets.length
      }

      return snippetsData;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getCodeSnippets(req, res) {
    const { userId } = req.session;
    const { page, limit, language, tags, query } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    try {
      const filter = {
        userId,
        language: language || { $exists: true }
      };

      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];

        const dbTags = await TagModel.find(
          { name: { $in: tagsArray } },
          '_id'
        ).lean();

        const tagsIds = (dbTags || []).map(
          (dbTag) => dbTag._id);
        filter.tags = { $in: tagsIds };
      }

      const snippets = await CodeSnippet.searchCodeSnippets(
        pageNumber,
        pageLimit,
        filter,
        query);
      return res.status(200).json(snippets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getCodeSnippetById(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId })
        .populate({
          path: 'tags',
          select: 'name'
        })
        .populate({
          path: 'userId',
          select: 'username'
        })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      if (!snippet.isPublic && snippet.userId._id.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized access.' });
      }

      const codeSnippet = await CodeSnippet.readSnippetFromDisk(snippet.filePath);

      const snippetData = {
        id: snippet._id,
        title: snippet.title,
        language: snippet.language,
        codeSnippet,
        description: snippet.description,
        tags: snippet.tags,
        isPublic: snippet.isPublic,
        username: snippet.userId.username,
        privateLink: snippet.privateLink
      }

      return res.status(200).json(snippetData);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  static async updateCodeSnippetById(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;
    const {
      title,
      language,
      codeSnippet,
      isPublic,
      description,
      tags
    } = req.body;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId, userId })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      let tagIds;
      if (tags) {
        tagIds = await CodeSnippet.saveTagsAndGetIds(tags);
      }

      const updateValues = {
        title: title || snippet.title,
        language: language || snippet.language,
        description: description || snippet.description,
        tags: tagIds || snippet.tags,
        isPublic: isPublic
      };

      await SnippetModel.updateOne({ _id: snippetId }, updateValues);

      /** Save new code snippet on disk */
      if (codeSnippet) CodeSnippet.saveSnippetOnDisk(snippet.filePath, codeSnippet);

      return res.status(200).json({ message: 'Snippet updated successfully.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async deleteCodeSnippetById(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId, userId })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      await CodeSnippet.deleteSnippetFromDisk(snippet.filePath);
      await SnippetModel.deleteOne({ _id: snippetId });

      return res.status(200).json({ message: 'Snippet deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async generateCodeSnippetLink(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId, userId })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      if (snippet.privateLink) {
        return res.status(400).json({ error: 'Private link already exists for this snippet.' });
      }

      const apiUrl = process.env.BACKEND_API_URL;
      const uniqueId = uuidv4();
      const privateLink = `${apiUrl}/api/snippets/from/${uniqueId}`;
      await SnippetModel.updateOne({ _id: snippetId }, { privateLink: uniqueId });

      return res.status(200).json({ privateLink });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async getCodeSnippetLink(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId, userId })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      if (!snippet.privateLink) {
        return res.status(404).json({ error: 'No private link found for this snippet.' });
      }

      const apiUrl = process.env.BACKEND_API_URL;
      const privateLink = `${apiUrl}/api/snippets/from/${snippet.privateLink}`;

      return res.status(200).json({ privateLink });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async getCodeSnippetFromLink(req, res) {
    const { privateLink } = req.params;

    if (privateLink.trim() === '') {
      return res.status(404).json({ error: 'Snippet not found.' });
    }

    try {
      const snippet = await SnippetModel
        .findOne({ privateLink })
        .lean();

      if (!snippet) return res.status(404).json({ error: 'Snippet not found.' });

      const codeSnippet = await CodeSnippet.readSnippetFromDisk(snippet.filePath);

      const snippetData = {
        title: snippet.title,
        language: snippet.language,
        codeSnippet,
        description: snippet.description,
        tags: snippet.tags,
        username: snippet.userId.username,
        privateLink: snippet.privateLink
      };

      return res.status(200).json(snippetData);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async removeCodeSnippetLink(req, res) {
    const { userId } = req.session;
    const { snippetId } = req.params;

    try {
      const snippet = await SnippetModel
        .findOne({ _id: snippetId, userId })
        .lean();

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found.' });
      }

      if (!snippet.privateLink) {
        return res.status(400).json({ error: 'No private link found for this snippet.' });
      }

      await SnippetModel.updateOne({ _id: snippetId }, { privateLink: '' });

      return res.status(200).json({ message: 'Private link removed successfully.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async getPublicCodeSnippets(req, res) {
    const { userId } = req.session;
    const { page, limit, query, language, tags } = req.query;
    console.log('query ', query);
    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    try {
      /** filter public snippets based on language and tags */
      const filter = {
        isPublic: true,
        language: language || { $exists: true },
        userId: { $ne: userId }
      };

      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];

        const dbTags = await TagModel.find(
          { name: { $in: tagsArray } },
          '_id'
        ).lean();

        const tagsIds = (dbTags || []).map(
          (dbTag) => dbTag._id);

        filter.tags = { $in: tagsIds };
      }
      console.log('filter ', filter);
      const snippets = await CodeSnippet
        .searchCodeSnippets(
          pageNumber,
          pageLimit,
          filter,
          query);
      return res.status(200).json(snippets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async likeUnlikeCodeSnippet(req, res) {
    const { snippetId } = req.params;
    const { userId } = req.session;

    try {
      const snippet = await SnippetModel.findOne({ _id: snippetId });

      if (!snippet) return res.status(404).json({ error: 'Snippet not found.' });

      if (snippet.likes.includes(userId)) {
        await SnippetModel.updateOne(
          { _id: snippetId },
          { $pull: { likes: userId } });
        return res.status(200).json({ message: 'Code snippet unliked successfully.' });
      }

      await SnippetModel.updateOne(
        { _id: snippetId },
        { $addToSet: { likes: userId } });

      return res.status(200).json({ message: 'Code snippet liked successfully.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};

export default CodeSnippet;
