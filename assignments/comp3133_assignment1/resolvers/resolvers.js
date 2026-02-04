import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const resolvers = {
  Query: {
    login: () => ({ status: true, message: "stub", token: null, user: null }),
    getAllEmployees: () => [],
    searchEmployeeByEid: () => null,
    searchEmployeesByDesignationOrDepartment: () => []
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        return {
          status: false,
          message: 'Signup failed',
          error: 'User already exists',
          token: null,
          user: null
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      return {
        status: true,
        message: 'Signup successful',
        error: null,
        token: null,
        user
      };
    },
    addEmployee: () => null,
    updateEmployeeByEid: () => null,
    deleteEmployeeByEid: () => ({ status: true, message: "stub", error: null, data: null })
  }
};

export default resolvers;
