const OpenAI = require('openai');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { openAiKey } = require('../config/config');
const { openAiSystemPrompts } = require('../utils/constants');

const openai = new OpenAI({
  apiKey: openAiKey,
});

/**
 * Handle OpenAI requests
 * @param {string} userInput
 * @param {string} instructions
 * @returns
 */
const handleOpenAIRequests = async (userInput, instructions) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: 'system',
          content: instructions,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.info(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'OpenAI error');
  }
};

/**
 * Handle send health symptoms to OpenAI
 * @param {string} userInput
 * @returns
 */
const sendSymptomsToOpenAI = async (userInput) => {
  const response = await handleOpenAIRequests(userInput, openAiSystemPrompts.submitSymptom);
  return response;
};

/**
 * Handle get health questions from OpenAI
 * @param {string} userInput
 * @returns
 */
const getHealthQuestionsFromOpenAI = async (userInput) => {
  const response = await handleOpenAIRequests(userInput, openAiSystemPrompts.selectRelatedSymptom);
  return response;
};

/**
 * Handle get recommendations from OpenAI
 * @param {string} userInput
 * @returns
 */
const getRecommendationsFromOpenAI = async (userInput) => {
  const response = await handleOpenAIRequests(JSON.stringify(userInput), openAiSystemPrompts.getRecommendation);
  return response;
};

/**
 * Handle get more information on a symptom from OpenAI
 * @param {string} userInput
 * @returns
 */
const getReportFromOpenAI = async (userInput) => {
  const response = await handleOpenAIRequests(JSON.stringify(userInput), openAiSystemPrompts.getReport);
  return response;
};

module.exports = {
  sendSymptomsToOpenAI,
  getHealthQuestionsFromOpenAI,
  getRecommendationsFromOpenAI,
  getReportFromOpenAI,
};
