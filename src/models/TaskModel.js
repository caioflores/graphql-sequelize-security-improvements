module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Task.associate = ({ User }) => {
    Task.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
  };

  return Task;
};
