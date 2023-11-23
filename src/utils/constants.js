const modules = ['users', 'variables', 'permissions', 'message_templates', 'roles'];

const permissions = modules.flatMap((moduleName) => {
  const actions = ['view', 'manage', 'update', 'create'];

  return actions.map((action) => ({
    name: `${moduleName}.${action}`,
    value: `${moduleName}.${action}`,
    groupName: moduleName,
    description: `Permission to ${action} ${moduleName}`,
  }));
});

const defaultMessageTemplates = [
  {
    messageTemplate: {
      title: 'WELCOME_EMAIL',
      description: 'Welcome email to new users',
      emailSubject: 'Welcome to the platform',
      emailBody: 'Hello {{firstName}}, welcome to the platform',
      smsSubject: 'Welcome to the platform',
      smsBody: 'Hello {{firstName}}, welcome to the platform',
      type: 'admin',
    },
    variables: [
      {
        name: 'firstName',
      },
    ],
  },
  {
    messageTemplate: {
      title: 'RESET_PASSWORD',
      description: 'Reset password message',
      emailSubject: 'Reset Password',
      emailBody:
        'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
      smsSubject: 'Reset Password',
      smsBody:
        'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
      type: 'admin',
    },
    variables: [
      {
        name: 'firstName',
      },
      {
        name: 'token',
      },
    ],
  },
];

module.exports = {
  permissions,
  defaultMessageTemplates,
};
