const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { openaiValidation } = require('../../validations');
const { openaiController } = require('../../controllers');

const router = express.Router();

router
  .route('/send-symptom')
  .post(auth(), validate(openaiValidation.sendSymptomsToOpenAI), openaiController.sendSymptomsToOpenAI);

router
  .route('/questions')
  .get(auth(), validate(openaiValidation.getHealthQuestionsFromOpenAI), openaiController.getHealthQuestionsFromOpenAI);

router
  .route('/recommendations')
  .post(auth(), validate(openaiValidation.getRecommendationsFromOpenAI), openaiController.getRecommendationsFromOpenAI);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI
 */

/**
 * @swagger
 * /ai/send-symptom:
 *   post:
 *     summary: Send symptom to AI
 *     description: Send symptom to AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptom:
 *                 type: string
 *             example:
 *               symptom: "headache"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: string
 *                example:
 *                  message: "success"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /ai/questions:
 *   get:
 *     summary: Get questions from AI
 *     description: Get questions from AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: symptom
 *         schema:
 *           type: string
 *         description: symptom
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: string
 *                example:
 *                  message: "success"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /ai/recommendations:
 *   post:
 *     summary: Get recommendations from AI
 *     description: Get recommendations from AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recommendation'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    $ref: '#/components/responses/Recommendation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
