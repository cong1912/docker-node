const User = require("../models/userModels");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashpassword,
    });
    req.session.user = newUser;
    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (e) {
    res.status(400).json({ status: "fail" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "user not fould" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({ status: "ok", message: "" });
    } else {
      res
        .status(400)
        .json({ status: "fail", message: "password is not  correct" });
    }
  } catch (e) {
    res.status(400).json({ status: "fail" });
  }
};
