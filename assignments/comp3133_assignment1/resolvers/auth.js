const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/auth");

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = {
  Query: {
    login: async (_, { input }) => {
      const { usernameOrEmail, password } = input;

      if (!usernameOrEmail || !password) {
        return { success: false, message: "username/email and password are required." };
      }

      const query = isEmail(usernameOrEmail)
        ? { email: usernameOrEmail.toLowerCase() }
        : { username: usernameOrEmail };

      const user = await User.findOne(query);
      if (!user) {
        return { success: false, message: "Invalid credentials." };
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return { success: false, message: "Invalid credentials." };
      }

      const token = signToken({ _id: user._id, username: user.username, email: user.email });
      return {
        success: true,
        message: "Login successful.",
        token,
        user,
      };
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { username, email, password } = input;

      if (!username || !email || !password) {
        return { success: false, message: "username, email, password are required." };
      }
      if (!isEmail(email)) {
        return { success: false, message: "Invalid email format." };
      }
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters." };
      }

      const exists = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
      if (exists) {
        return { success: false, message: "Username or email already exists." };
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashed,
      });

      const token = signToken({ _id: user._id, username: user.username, email: user.email });

      return {
        success: true,
        message: "Signup successful.",
        token,
        user,
      };
    },
  },
};