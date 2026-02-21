const Employee = require("../models/Employee");
const { requireAuth } = require("../utils/auth");

function validateEmployeeInput(input) {
  if (input.salary != null && input.salary < 1000) {
    return "Salary must be >= 1000.";
  }
  if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
    return "Gender must be Male/Female/Other.";
  }
  return null;
}

module.exports = {
  Query: {
    getAllEmployees: async (_, __, context) => {
      requireAuth(context);

      const employees = await Employee.find().sort({ created_at: -1 });
      return { success: true, message: "Employees fetched.", employees };
    },

    getEmployeeByEid: async (_, { eid }, context) => {
      requireAuth(context);

      const employee = await Employee.findById(eid);
      if (!employee) return { success: false, message: "Employee not found.", employee: null };
      return { success: true, message: "Employee fetched.", employee };
    },

    searchEmployees: async (_, { designation, department }, context) => {
      requireAuth(context);

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      const employees = await Employee.find(filter);
      return { success: true, message: "Employees fetched.", employees };
    },
  },

  Mutation: {
    addEmployee: async (_, { input }, context) => {
      requireAuth(context);

      const error = validateEmployeeInput(input);
      if (error) return { success: false, message: error, employee: null };

      try {
        const employee = await Employee.create(input);
        return { success: true, message: "Employee created.", employee };
      } catch (e) {
        // Unique email conflict, etc.
        return { success: false, message: e.message, employee: null };
      }
    },

    updateEmployeeByEid: async (_, { eid, input }, context) => {
      requireAuth(context);

      const error = validateEmployeeInput(input);
      if (error) return { success: false, message: error, employee: null };

      try {
        const employee = await Employee.findByIdAndUpdate(eid, input, { new: true });
        if (!employee) return { success: false, message: "Employee not found.", employee: null };
        return { success: true, message: "Employee updated.", employee };
      } catch (e) {
        return { success: false, message: e.message, employee: null };
      }
    },

    deleteEmployeeByEid: async (_, { eid }, context) => {
      requireAuth(context);

      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) return { success: false, message: "Employee not found.", employee: null };
      return { success: true, message: "Employee deleted.", employee };
    },
  },
};