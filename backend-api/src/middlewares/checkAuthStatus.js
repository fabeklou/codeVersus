const checkAuthStatus = async (req, res, next) => {
  if (req.session?.loggedIn) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized.' });
};

export default checkAuthStatus;
