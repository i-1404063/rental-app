module.exports = function (req, res, next) {
  // 401 = unauthorized user
  // 403 = forbidden if not admin

  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
};
