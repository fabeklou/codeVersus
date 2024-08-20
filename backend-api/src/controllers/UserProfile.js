import multer from 'multer';
import UserModel from '../models/User.js';
import SnippetModel from '../models/Snippet.js';
import upload from '../utils/multerProfilePicture.js';
import { sendToGCS, deleteFromGCS } from '../utils/manageCloudStorageFiles.js';
import UserInterests from '../controllers/UserInterests.js';
import InterestModel from '../models/Interest.js';

class UserProfile {
  static async saveInterestsAndGetIds(interests) {
    const interestIds = [];

    for (const interest of interests) {
      try {
        const interestId = await UserInterests.createInterest(interest);
        interestIds.push(interestId);
      } catch (error) {
        try {
          const interestInDb = await UserInterests.getInterestByName(interest);
          interestIds.push(interestInDb._id);
        } catch (error) {
          throw new Error(error);
        }
      }
    }

    return interestIds.length ? interestIds : null;
  }

  static async uploadMulter(req, res, next) {
    upload.single('profilePicture')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
        } else if (err.message === 'Invalid file type') {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  }

  static async getProfile(req, res) {
    const { userId } = req.session;

    try {
      const user = await UserModel
        .findById(userId,
          {
            password: 0,
            verified: 0
          })
        .populate({
          path: 'userProfile.friends',
          select: 'username -_id'
        })
        .populate({
          path: 'userProfile.interests',
          select: 'name'
        });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    const { userId } = req.session;
    const {
      bio,
      interests,
      githubLink,
      xLink,
      linkedinLink
    } = req.body;

    try {
      const user = await UserModel.findById(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      const interestIds = await UserProfile.saveInterestsAndGetIds(interests);

      const updatedUserProfile = {
        bio: bio || user.userProfile.bio,
        interests: interestIds || user.userProfile.interests,
        githubLink: githubLink || user.userProfile.githubLink,
        xLink: xLink || user.userProfile.xLink,
        linkedinLink: linkedinLink || user.userProfile.linkedinLink,
      };

      await UserModel.findByIdAndUpdate(
        userId,
        { userProfile: updatedUserProfile },
        { new: true, runValidators: true });

      return res.status(200).json({
        message: 'Profile updated successfully',
        userProfile: updatedUserProfile
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateProfilePicture(req, res) {
    const { userId } = req.session;
    const { file } = req;

    try {
      let profilePicture;

      const user = await UserModel.findById(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      profilePicture = await sendToGCS(file, user.username);

      await UserModel.findByIdAndUpdate(userId, { 'userProfile.profilePicture': profilePicture });

      return res.status(200).json({ profilePicture, message: 'Profile picture updated successfully.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteProfilePicture(req, res) {
    const { userId } = req.session;

    try {
      const profilePicture = process.env.GCP_DEFAULT_IMAGE_URL;

      const user = await UserModel.findById(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      await UserModel.findByIdAndUpdate(userId, { 'userProfile.profilePicture': profilePicture });

      return res.status(200).json({ profilePicture, message: 'Profile picture deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async searchUsers(pageNumber, pageLimit, filter, searchQuery) {
    try {
      if (searchQuery) {
        filter.$text = { $search: searchQuery };
      }

      const users = await UserModel
        .find(filter, {
          email: 0,
          password: 0,
          verified: 0,
          ...(searchQuery && { score: { $meta: "textScore" } })
        })
        .sort(searchQuery ? { score: { $meta: "textScore" } } : {})
        .populate({
          path: 'userProfile.friends',
          select: 'username -_id'
        })
        .populate({
          path: 'userProfile.interests',
          select: 'name -_id'
        })
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit)
        .lean();

      const usersData = {
        users: users,
        page: pageNumber,
        limit: pageLimit,
        total: users.length
      }

      return usersData;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getFriends(req, res) {
    const { userId } = req.session;
    const { page, limit, interests, query } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const filter = {};

      if (interests) {
        const dbInterests = await InterestModel.find({
          name: { $in: interests }
        }, '_id');

        const interestIds = dbInterests.map((dbInterest) => dbInterest._id);
        filter['userProfile.interests'] = { $in: interestIds };
      }

      filter._id = { $in: user.userProfile.friends };

      const usersData = await UserProfile
        .searchUsers(
          pageNumber,
          pageLimit,
          filter,
          query);

      return res.status(200).json(usersData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUsers(req, res) {
    const { userId } = req.session;
    const { page, limit, interests, query } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    try {
      const filter = { _id: { $ne: userId } };

      if (interests) {
        const interestsArray = Array.isArray(interests) ? interests : [interests];

        const dbInterests = await InterestModel.find(
          { name: { $in: interestsArray } },
          '_id'
        ).lean();

        /** Fallback to an empty array if dbInterests is undefined or null */
        const interestIds = (dbInterests || []).map((dbInterest) => dbInterest._id);

        filter['userProfile.interests'] = { $in: interestIds };
      }

      const usersData = await UserProfile
        .searchUsers(
          pageNumber,
          pageLimit,
          filter,
          query);

      return res.status(200).json(usersData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserProfile(req, res) {
    const { userId } = req.session;
    const { username } = req.params;

    try {
      const user = await UserModel
        .findOne({ username },
          {
            password: 0,
            email: 0,
            verified: 0,
            _id: 0
          });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async followUnfollowUser(req, res) {
    const { userId } = req.session;
    const { username } = req.params;

    try {
      const friend = await UserModel
        .findOne({ username });
      const user = await UserModel
        .findOne({ _id: userId });

      if (!friend) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.userProfile.friends.includes(friend._id)) {
        await UserModel.updateOne(
          { _id: userId },
          { $pull: { 'userProfile.friends': friend._id } });
        return res.status(200).json({ message: 'Friend removed successfully.' });
      }

      await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { 'userProfile.friends': friend._id } });

      return res.status(200).json({ message: 'Friend added successfully.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteUserAccount(req, res) {
    const { userId } = req.session;

    try {
      /** Delete all snippets associated with the user */
      await SnippetModel.deleteMany({ userId });

      await UserModel.findByIdAndDelete(userId);
      return res.status(200).json({ message: 'User account and snippets deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserProfile;
