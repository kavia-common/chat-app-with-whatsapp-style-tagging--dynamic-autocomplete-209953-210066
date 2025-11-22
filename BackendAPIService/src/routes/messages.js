'use strict';

const express = require('express');
const controller = require('../controllers/messages');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Message history and CRUD operations
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Fetch message history
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of messages
 *       default:
 *         description: Error response
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a new chat message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId: { type: string }
 *               text: { type: string }
 *               status: { type: string, enum: [sent, delivered, read] }
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag: { type: string }
 *                     type: { type: string, enum: [user, topic] }
 *     responses:
 *       201:
 *         description: Message created
 *       default:
 *         description: Error response
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Edit an existing message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text: { type: string }
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag: { type: string }
 *                     type: { type: string, enum: [user, topic] }
 *     responses:
 *       200:
 *         description: Message updated
 *       404:
 *         description: Message not found
 *       default:
 *         description: Error response
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Message deleted
 *       default:
 *         description: Error response
 */
router.delete('/:id', controller.remove.bind(controller));

module.exports = router;
