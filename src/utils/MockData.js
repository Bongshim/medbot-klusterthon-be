const logger = require('../config/logger');
const { Role } = require('../models/role.model');
const { Permission } = require('../models/permission.model');
const { User } = require('../models/user.model');
const { Variable } = require('../models/variable.model');
const { MessageTemplate } = require('../models/message_template.model');
const { createMessageTemplate } = require('../services/message_template.service');
const { createUser } = require('../services/user.service');
const { permissions, defaultMessageTemplates } = require('./constants');

const setRolePermissions = async (roleName, permissionsValue) => {
  const role = await Role.findOne({ where: { name: roleName } });
  const foundPermissions = await Permission.findAll({ where: { value: permissionsValue } });
  await role.setPermissions(foundPermissions);
};

const setAllPermissions = async () => {
  const adminPermissionsValue = permissions.map((permission) => permission.value);

  setRolePermissions('admin', adminPermissionsValue);
};

const createRoles = async () => {
  // create roles
  const roles = [
    {
      name: 'admin',
      description: 'system admin with access to all features',
    },
  ];

  // Fetch only the 'name' fields of existing roles
  const existingRoleNames = new Set((await Role.findAll({ attributes: ['name'] })).map((role) => role.dataValues.name));

  // Filter out roles that already exist
  const newRoles = roles.filter((role) => !existingRoleNames.has(role.name));

  if (newRoles.length > 0) {
    // Bulk create roles
    await Role.bulkCreate(newRoles);
    logger.info('roles created'.rainbow);
  }
};

const createVariables = async () => {
  // create variables
  const variables = [
    {
      name: 'lastName',
    },
    {
      name: 'firstName',
    },
    {
      name: 'token',
    },
    {
      name: 'code',
    },
  ];

  // Fetch only the 'name' fields of existing variables
  const existingVariableNames = new Set(
    (await Variable.findAll({ attributes: ['name'] })).map((variable) => variable.dataValues.name)
  );

  // Filter out variables that already exist
  const newVariables = variables.filter((variable) => !existingVariableNames.has(variable.name));

  if (newVariables.length > 0) {
    // Bulk create variables
    await Variable.bulkCreate(newVariables);
    logger.info('variables created'.rainbow);
  }
};

const createMessageTemplates = async () => {
  // Fetch only the 'title' fields of existing message templates
  const existingMessageTemplateTitles = new Set(
    (await MessageTemplate.findAll({ attributes: ['title'] })).map((template) => template.dataValues.title)
  );

  // Filter out message templates that already exist
  const newMessageTemplates = defaultMessageTemplates.filter(
    (template) => !existingMessageTemplateTitles.has(template.messageTemplate.title)
  );

  if (newMessageTemplates.length > 0) {
    // Bulk create message templates
    await Promise.all(newMessageTemplates.map((template) => createMessageTemplate(template)));
    logger.info('message templates created'.rainbow);
  }
};

const createUsers = async () => {
  // get role
  const [adminRole] = await Promise.all([Role.findOne({ where: { name: 'admin' } })]);

  const users = [
    {
      firstName: 'admin',
      lastName: 'admin',
      username: 'admin',
      phoneNumber: '12345678',
      email: 'admin@example.com',
      password: 'password1',
      userType: 'admin',
      roleId: adminRole.id,
    },
  ];

  // Get existing users' emails for comparison
  const existingUserEmails = new Set(
    (
      await User.findAll({
        where: {
          email: users.map((user) => user.email),
        },
        attributes: ['email'],
      })
    ).map((user) => user.dataValues.email)
  );

  // Filter out users that already exist
  const newUsers = users.filter((user) => !existingUserEmails.has(user.email));

  if (newUsers.length > 0) {
    // Bulk create users
    await Promise.all(newUsers.map((user) => createUser(user)));

    logger.info('users created'.rainbow);
  }
};

const createPermissions = async () => {
  // Fetch only the 'value' fields of existing permissions
  const existingPermissionValues = new Set(
    (await Permission.findAll({ attributes: ['value'] })).map((perm) => perm.dataValues.value)
  );

  // Filter out permissions that already exist
  const newPermissions = permissions.filter((permission) => !existingPermissionValues.has(permission.value));

  if (newPermissions.length > 0) {
    // Bulk create permissions
    await Permission.bulkCreate(newPermissions);
    logger.info('permissions created'.rainbow);
  }

  // set permissions for roles
  await setAllPermissions();
};

const initializeDatabase = async () => {
  await createRoles();
  await createVariables();
  await createMessageTemplates();
  await createUsers();
  await createPermissions();
};

module.exports = {
  initializeDatabase,
};
