
function isLoggedIn(req, res, next) {
  if (req.session.email) {
    return next();
  }
  res.status(401).json({ error: 'Not logged in' });
}

module.exports = isLoggedIn;