const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { symptomsValidation } = require('../../validations');
const { symptomsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth(), validate(symptomsValidation.querySymptoms), symptomsController.getAllSymptoms);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Symptoms
 *   description: Symptoms management and retrieval
 */

/**
 * @swagger
 * /symptoms:
 *   get:
 *     summary: Get symptoms
 *     description: Only logged in users can retrieve symptoms.
 *     tags: [Symptoms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Symptom title
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Symptom keyword
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SymptomList'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
