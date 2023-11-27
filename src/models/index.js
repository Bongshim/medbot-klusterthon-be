const { User } = require('./user.model');
const { Role } = require('./role.model');
const { Permission } = require('./permission.model');
const { MessageTemplate } = require('./message_template.model');
const { Variable } = require('./variable.model');
const { Token } = require('./token.model');
const { Media } = require('./media.model');
const { HealthBackground } = require('./healthBackground.model');
const { UserSymptoms } = require('./userSymptoms.model');
const { Symptoms } = require('./symptoms.model');

exports.association = () => {
  // User - Token
  User.hasOne(Token, { foreignKey: 'userId', as: 'userToken' });
  Token.belongsTo(User, { foreignKey: 'userId', as: 'userToken' });

  // User - User - createdBy
  User.hasMany(User, { foreignKey: 'createdBy' });
  User.belongsTo(User, { foreignKey: 'createdBy' });

  // Role - Permission
  Role.belongsToMany(Permission, { through: 'role_permission' });
  Permission.belongsToMany(Role, { through: 'role_permission' });

  // User - Role
  Role.hasMany(User, { foreignKey: 'roleId', as: 'userRole' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'userRole' });

  // Message Template - Variable
  MessageTemplate.belongsToMany(Variable, { through: 'message_variable' });
  Variable.belongsToMany(MessageTemplate, { through: 'message_variable' });

  // User - Message Template
  User.belongsToMany(MessageTemplate, { through: 'user_message_template' });
  MessageTemplate.belongsToMany(User, { through: 'user_message_template' });

  // User - Media
  User.hasMany(Media, { foreignKey: 'userId', as: 'media' });
  Media.belongsTo(User, { foreignKey: 'userId', as: 'media' });

  // User - Health Background
  User.hasOne(HealthBackground, { foreignKey: 'userId', as: 'healthBackground' });
  HealthBackground.belongsTo(User, { foreignKey: 'userId', as: 'users' });

  // User - User Symptoms
  User.hasMany(UserSymptoms, { foreignKey: 'userId', as: 'userSymptoms' });
  UserSymptoms.belongsTo(User, { foreignKey: 'userId', as: 'users' });

  // Symptoms - User Symptoms
  Symptoms.hasMany(UserSymptoms, { foreignKey: 'symptomId' });
  UserSymptoms.belongsTo(Symptoms, { foreignKey: 'symptomId' });
};
