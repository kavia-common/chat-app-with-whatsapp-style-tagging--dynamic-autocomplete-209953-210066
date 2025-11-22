'use strict';

const express = require('express');
const controller = require('../controllers/tags');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tags
 *     description: Tag suggestions and management
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Fetch tag suggestions
 *     tags: [Tags]
 *     parameters:
 *       - in: query
 *         name: trigger
 *         schema: { type: string }
 *       - in: query
 *         name: input
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of tags
 *       default:
 *         description: Error response
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Add a new tag suggestion
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag: { type: string }
 *               type: { type: string, enum: [user, topic] }
 *               trigger: { type: string }
 *             required: [tag]
 *     responses:
 *       201:
 *         description: Tag created
 *       default:
 *         description: Error response
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Edit a tag suggestion
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag: { type: string }
 *               type: { type: string, enum: [user, topic] }
 *     responses:
 *       200:
 *         description: Tag updated
 *       404:
 *         description: Tag not found
 *       default:
 *         description: Error response
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag suggestion
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Tag deleted
 *       default:
 *         description: Error response
 */
router.delete('/:id', controller.remove.bind(controller));

module.exports = router;
