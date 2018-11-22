const { User } = module.require('../../models');

module.exports = {
  Mutation: {
    signUp: async (obj, args, { auth }, info) => User.hasPermission(auth, User.signUp(args)),
  },
  Query: {
    user: async (obj, { id }, { auth }, info) => {
      User.hasPermission(auth, User.findById(id));
    },
    login: async (obj, args, { auth }, info) => User.hasPermission(auth, User.login(args)),
  },
};
