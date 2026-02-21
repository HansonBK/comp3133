const auth = require("./auth");
const employee = require("./employee");

const resolvers = {
  Date: {
    __serialize(value) {
      return new Date(value).toISOString();
    },
    __parseValue(value) {
      return new Date(value);
    },
    __parseLiteral(ast) {
      return new Date(ast.value);
    },
  },

  Query: {
    ...auth.Query,
    ...employee.Query,
  },

  Mutation: {
    ...auth.Mutation,
    ...employee.Mutation,
  },
};

module.exports = resolvers;