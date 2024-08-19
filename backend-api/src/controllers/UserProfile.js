import UserModel from '../models/User.js';
import SnippetModel from '../models/Snippet.js';
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
      return res.status(500).json({ error });
    }
  }

  static async updateProfile(req, res) {
    const { userId } = req.session;
    const { file } = req;
    const {
      bio,
      interests,
      githubLink,
      xLink,
      linkedinLink
    } = req.body;

    try {
      let profilePicture;

      const user = await UserModel.findById(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      if (file) {
        profilePicture = await sendToGCS(file, user.username);
      }

      const interestIds = await UserProfile.saveInterestsAndGetIds(interests);

      const updatedUserProfile = {
        bio: bio || user.userProfile.bio,
        interests: interestIds || user.userProfile.interests,
        githubLink: githubLink || user.userProfile.githubLink,
        xLink: xLink || user.userProfile.xLink,
        linkedinLink: linkedinLink || user.userProfile.linkedinLink,
        profilePicture: profilePicture || user.userProfile.profilePicture
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
      return res.status(500).json({ error });
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
          userProfile: 1,
          username: 1,
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

      const transformedUsers = users.map(user => {
        const { userProfile, ...rest } = user;
        const transformedUserProfile = {
          ...userProfile,
          friends: userProfile.friends.map((friend) => friend.username),
          interests: userProfile.interests.map((interest) => interest.name)
        };
        return {
          ...rest,
          userProfile: transformedUserProfile
        };
      });

      const usersData = {
        users: transformedUsers,
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
      return res.status(400).json({ error });
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
        const dbInterests = await InterestModel.find({
          name: { $in: interests }
        }, '_id');

        const interestIds = dbInterests.map((dbInterest) => dbInterest._id);
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
      return res.status(400).json({ error });
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
      return res.status(500).json({ error });
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
      return res.status(500).json({ error });
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
      return res.status(500).json({ error });
    }
  }
}

export default UserProfile;
