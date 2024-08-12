class UserLogout {
  static async logout(req, res) {
    if (req.session.loggedIn) {
      req.session.destroy();
      return res.status(200).json({ message: 'User logged out successfully.' });
    }

    return res.status(400).json({ message: 'You were already logged out.' });
  }
}

export default UserLogout;
