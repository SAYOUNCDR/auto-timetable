const verfyDev = (req, res, next) => {
  const devKey = req.headers["x-dev-key"];
  if (!devKey || devKey !== process.env.DEV_API_KEY) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or missing API key" });
  }
  next();
};
module.exports = verfyDev;
