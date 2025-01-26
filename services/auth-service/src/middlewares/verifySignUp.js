const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check for duplicate username
    const userByUsername = await User.findOne({ username: req.body.username }).exec();
    if (userByUsername) {
      return res.status(400).send({ userByUsername,message: "Failed! Username is already in use!" });
    }

    // Check for duplicate email
    const userByEmail = await User.findOne({ email: req.body.email }).exec();
    if (userByEmail) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    // If no duplicates, proceed to the next middleware
    next();
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send({ message: err });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
}

module.exports = verifySignUp