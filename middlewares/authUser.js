const authUser = (req, res, next) => {
  const { userId } = req.session;
  if (!userId) return res.status(403).send({ message: "must login" });

  next();
};

module.exports = { authUser };
