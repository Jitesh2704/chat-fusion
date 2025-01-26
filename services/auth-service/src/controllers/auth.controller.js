const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const {
  fetchAndUpdateSpecificCounter,
} = require("../utils/fetchAndUpdateCounter");

exports.signup = async (req, res) => {
  try {
    const newUserCounter = await fetchAndUpdateSpecificCounter(
      "authCounter",
      "user_counter"
    );

    const user = new User({
      user_id: newUserCounter,
      username: req.body.username,
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    res.status(201).send({
      message: "User was registered successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while registering the user.",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    }).exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    res.status(200).send({
      user_id: user?.user_id,
      fname: user.fname,
      lname: user.lname,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      otp_verified: user.otp_verified,
      profile_image: user.profile_image,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while signing in.",
    });
  }
};

exports.signout = async (req, res) => {
  try {
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while signing out.",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const query = { email: req.body.email };
    const update = {
      password: bcrypt.hashSync(req.body.new_password, 8),
    };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    await User.findOneAndUpdate(query, update, { new: true });

    res.send({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating the password.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fields to be returned, search term, and search fields
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";
    const search = req.query.search || "";
    let searchFields = req.query.searchFields
      ? JSON.parse(req.query.searchFields)
      : [];

    // Build the base filter for querying
    const filter = { is_deleted: false };
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};

    // Determine fields to search
    if (search.trim() !== "") {
      if (searchFields.length === 0) {
        // If searchFields is empty, search all string fields
        searchFields = Object.keys(User.schema.paths).filter(
          (key) => User.schema.paths[key].instance === "String"
        );
      }

      // Add search conditions to the filter
      filter["$or"] = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    // Dynamically add filterFields to the filter
    Object.keys(filterFields).forEach((key) => {
      const value = filterFields[key];
      if (
        User.schema.path(key) instanceof mongoose.Schema.Types.Array &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.keys(value).forEach((subKey) => {
          filter[`${key}.${subKey}`] = {
            $in: Array.isArray(value[subKey]) ? value[subKey] : [value[subKey]],
          };
        });
      } else {
        filter[key] = value;
      }
    });

    // Fetching users with the constructed filters, search, and pagination
    const users = await User.find(filter, fields)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const userCounter = await fetchAndUpdateSpecificCounter(
      "authCounter",
      "user_counter"
    );
    const newUser = new User({
      ...req.body,
      user_id: userCounter,
      password: bcrypt.hashSync(req.body.password, 8),
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the event.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
      modified_by: req.params.id,
      mdate_time: new Date().toISOString(),
    };

    if (req.body.password) {
      updateFields.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      // This error is being checked in redux for the user availability.
      return res.status(404).send({ message: "User not found" });
    }
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating user with id " + req.params.id,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // Build filter for querying
    const filter = { is_deleted: false };
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};

    // Add filterFields to the filter if they exist
    Object.keys(filterFields).forEach((key) => {
      filter[key] = filterFields[key];
    });

    const user = await User.findOne(filter, fields);

    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving user ",
    });
  }
};
