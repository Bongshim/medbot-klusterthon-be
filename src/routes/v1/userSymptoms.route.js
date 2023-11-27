const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userSymptomsValidation } = require('../../validations');
const { userSymptomsController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(userSymptomsValidation.getAllUserSymptoms), userSymptomsController.getAllUserSymptoms);

router
  .route('/:id')
  .get(auth(), validate(userSymptomsValidation.getUserSymptomsById), userSymptomsController.getUserSymptomsById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Health Assessment
 *   description: Health assessment management and retrieval
 */

/**
 * @swagger
 * /health-assessments:
 *   get:
 *     summary: Get health assessments
 *     description: Only logged in users can retrieve their health assessments.
 *     tags: [Health Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id
 *       - in: query
 *         name: symptomId
 *         schema:
 *           type: string
 *         description: Symptom Id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /health-assessments/{id}:
 *   get:
 *     summary: Get health assessments
 *     description: Only logged in users can retrieve their health assessments.
 *     tags: [Health Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Health Assessment Id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */
