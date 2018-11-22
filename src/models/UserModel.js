const jwt = module.require('jsonwebtoken');
const bcrypt = module.require('bcrypt');

const errors = {
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  EMAIL_UNAVAILABLE: 'Email unavaiable',
};

const getError = error => new Error(errors[error]);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.hook('beforeCreate', async user => {
    const userWithPasswordEncrypted = user;

    try {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      userWithPasswordEncrypted.password = encryptedPassword;
    } catch (err) {
      throw err;
    }
  });

  User.signUp = async ({ email, password }) => {
    try {
      const user = await User.create({ email, password });
      return user;
    } catch (err) {
      throw getError('EMAIL_UNAVAILABLE');
    }
  };

  User.login = async ({ email, password }) => {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw getError('INVALID_EMAIL_OR_PASSWORD');
      }

      const respBcrypt = await bcrypt.compare(password, user.password);

      if (respBcrypt === false) {
        throw getError('INVALID_EMAIL_OR_PASSWORD');
      }

      const jwtUser = { userId: user.id };

      const token = jwt.sign(jwtUser, process.env.API_SECRET, {
        expiresIn: '4h',
      });

      return { token, user };
    } catch (err) {
      throw err;
    }
  };

  User.isLoggedIn = type => {
    if (type === 'private') {
      return true;
    }
    return false;
  };

  User.filterDataByUser = (data, user) => {
    if (data.UserId === user.id) {
      return data;
    }
    return null;
  };

  User.hasPermission = async ({ type, user }, promise) => {
    if (User.isLoggedIn(type)) {
      const data = await promise;
      return User.filterDataByUser(data, user);
    }
    return false;
  };

  return User;
};
