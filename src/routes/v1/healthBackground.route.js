const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { healthBackgroundValidation } = require('../../validations');
const { healthBackgroundController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(), healthBackgroundController.getHealthBackgroundByUserId)
  .patch(
    auth(),
    validate(healthBackgroundValidation.updateHealthBackgroundByUserId),
    healthBackgroundController.updateHealthBackgroundByUserId
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Health Background
 *   description: Health background management and retrieval
 */

/**
 * @swagger
 * /health-background:
 *   get:
 *     summary: Get health background
 *     description: Only logged in users can retrieve their own health background.
 *     tags: [Health Background]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthBackground'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   patch:
 *     summary: Update health background
 *     description: Logged in users can only update their own information.
 *     tags: [Health Background]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthBackground'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/HealthBackground'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /health-background/{id}:

 *
 */
