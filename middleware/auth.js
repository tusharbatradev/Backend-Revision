const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Token Invalid");
    }

    const decodedMessage = await jwt.verify(token, "PractiseBE@123");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User doesn't exist");
    }

    req.user = user;

    next();
  } catch (err) {
    res.send("ERROR: "+err);
  }
};

module.exports = { userAuth };
