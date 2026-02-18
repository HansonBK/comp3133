import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { uploadEmployeePhoto } from '../config/cloudinary.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENDERS = new Set(['Male', 'Female', 'Other']);

const requireFields = (obj, fields) => {
  const missing = fields.filter((field) => !obj[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

const validateEmail = (email) => {
  if (email && !EMAIL_REGEX.test(email)) {
    throw new Error('Invalid email format');
  }
};

const validateEmployeeInput = (input, { partial = false } = {}) => {
  if (!partial) {
    requireFields(input, [
      'first_name',
      'last_name',
      'email',
      'gender',
      'designation',
      'salary',
      'date_of_joining',
      'department'
    ]);
  }

  if (input.email) validateEmail(input.email);
  if (input.gender && !GENDERS.has(input.gender)) {
    throw new Error('Gender must be Male, Female, or Other');
  }
  if (input.salary !== undefined && Number(input.salary) < 1000) {
    throw new Error('Salary must be >= 1000');
  }
  if (input.date_of_joining && Number.isNaN(Date.parse(input.date_of_joining))) {
    throw new Error('date_of_joining must be a valid date');
  }
};

const resolvers = {
  Query: {
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      });
      if (!user) {
        return {
          status: false,
          message: 'Login failed',
          error: 'User not found',
          token: null,
          user: null
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          status: false,
          message: 'Login failed',
          error: 'Invalid credentials',
          token: null,
          user: null
        };
      }

      return {
        status: true,
        message: 'Login successful',
        error: null,
        token: null,
        user
      };
    },
    getAllEmployees: async () => Employee.find(),
    searchEmployeeByEid: async (_, { eid }) => Employee.findById(eid),
    searchEmployeesByDesignationOrDepartment: async (_, { designation, department }) => {
      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;
      return Employee.find(filter);
    }
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      requireFields({ username, email, password }, ['username', 'email', 'password']);
      validateEmail(email);
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
    addEmployee: async (_, args) => {
      validateEmployeeInput(args);
      const {
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo
      } = args;

      const existing = await Employee.findOne({ email });
      if (existing) {
        throw new Error('Employee email already exists');
      }

      const photoUrl = await uploadEmployeePhoto(employee_photo);

      const employee = await Employee.create({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo: photoUrl || null
      });

      return employee;
    },
    updateEmployeeByEid: async (_, { eid, ...updates }) => {
      if (!eid) {
        throw new Error('eid is required');
      }
      validateEmployeeInput(updates, { partial: true });
      if (updates.employee_photo) {
        const photoUrl = await uploadEmployeePhoto(updates.employee_photo);
        updates.employee_photo = photoUrl;
      }
      const employee = await Employee.findByIdAndUpdate(eid, updates, {
        new: true,
        runValidators: true
      });
      return employee;
    },
    deleteEmployeeByEid: async (_, { eid }) => {
      const deleted = await Employee.findByIdAndDelete(eid);
      if (!deleted) {
        return {
          status: false,
          message: 'Delete failed',
          error: 'Employee not found',
          data: null
        };
      }
      return {
        status: true,
        message: 'Employee deleted',
        error: null,
        data: eid
      };
    }
  }
};

export default resolvers;
