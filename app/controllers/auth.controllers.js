const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      dob: req.body.dob,
      contactNumber: req.body.contactNumber,
    });

    await user.save();
    res.send({ message: `${req.body.fullName} have been registered successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while registering the user.' });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];
    res.status(200).send({
      id: user._id,
      email: user.email,
      accessToken: token,
      fullName: user.fullName,
      dob: user.dob,
      contactNumber: user.contactNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
