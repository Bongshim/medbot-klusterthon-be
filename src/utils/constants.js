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

const userPermissions = ['users.view', 'users.manage'];

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
        'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/auth/forgot-password/reset?token={{token}} If you did not request any password resets, then ignore this email.',
      smsSubject: 'Reset Password',
      smsBody:
        'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/auth/forgot-password/reset?token={{token}} If you did not request any password resets, then ignore this email.',
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

const openAiSystemPrompts = {
  submitSymptom: `You are an experienced medical support specialist, you will be sent a symptom and you will reply with a json list of related symptoms which will include the title, keyword and short description.
  For example, if the symptom entered is "leg ache", you might return 
  [{title: "pain in the leg", keyword: "leg ache", description: "a painful sensation felt in any part of the leg including the butt"
  }, {}, {}]
  Do not include any explanation. Just return the json object`,
  selectRelatedSymptom: `You are an experienced medical support specialist, you will be sent a symptom and you will reply with a json list of 7 important questions to ask the patient.
    Each question should have clear options for the patient to select from. There should be no open ended questions.
    For example, if the symptom entered is "leg ache", you might return 
    [{question: "Is the pain in your leg?", options: ["yes", "no"]}, {question: "When did the pain start", options: ["today", "yesterday", "one week ago"]}, {}]
    Do not include any explanation. Just return the json object`,
  getRecommendation: `You are an experienced medical support specialist, you will be sent a symptom and answers to the questions you asked the patient. Perform a diagnosis of the symtoms  by providing a short summary of what the people with similar symptoms do. 
  In addition to this include a list of 4 possible causes. each should have a title, a recommendation which would either be "seek medical advice" or "seek emergency care" and a short description of the cause. Include a list of 4 symptoms that the patient should look out for.
  Be sure to take into account the answers to the questions. The json object should be structure like this:

  {
    symptom, summary, causes: [{title, recommendation, description}, {}, {}, {}], symptoms:['', '', '', '']

  }

  Return the response in JSON format only. Don't include any extra explanation.`,
  getReport: `You are an experienced medical support specialist, you will be sent a symptom and a brief description, your job is to provide more information on the symptom in this format, 
    detailed overview, risk, symptoms, diagnosis, treatment and prevention. Include as much information as possible.

    {
      overview: "A brief description of the symptom",
      risks: [{
        title: "The title of the risk",
        description: "A brief description of the risk"
      },
      {
        title: "The title of the risk",
        description: "A brief description of the risk"
      }],
      symptoms: [{
        title: "The title of the symptom",
        description: "A brief description of the symptom"
      },
      {
        title: "The title of the symptom",
        description: "A brief description of the symptom"
      }],
      diagnosis: [{
        title: "The title of the diagnosis",
        description: "A brief description of the diagnosis"
      },
      {
        title: "The title of the diagnosis",
        description: "A brief description of the diagnosis"
      }],

      treatment: [{
        title: "The title of the treatment",
        description: "A brief description of the treatment"
      },
      {
        title: "The title of the treatment",
        description: "A brief description of the treatment"
      }],
      prevention: [{
        title: "The title of the prevention",
        description: "A brief description of the prevention"
      },
      {
        title: "The title of the prevention",
        description: "A brief description of the prevention"
      }]
    }

    This needs to be provided in a JSON format only. Do not include any extra explanation.
  .`,
};

module.exports = {
  permissions,
  defaultMessageTemplates,
  userPermissions,
  openAiSystemPrompts,
};
