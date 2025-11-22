'use strict';

const messagesService = require('../services/messages');
const { toErrorResponse } = require('../utils/httpErrors');

class MessagesController {
  /**
   * GET /api/messages
   * Fetch message history.
   */
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** Route handler: lists messages with pagination. */
    try {
      const data = await messagesService.list(req.query || {});
      return res.status(200).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * POST /api/messages
   * Create a new message.
   */
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Route handler: creates a message. */
    try {
      const data = await messagesService.create(req.body || {});
      return res.status(201).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * PUT /api/messages/:id
   * Update an existing message by id.
   */
  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Route handler: updates a message. */
    try {
      const data = await messagesService.update(req.params.id, req.body || {});
      return res.status(200).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * DELETE /api/messages/:id
   * Delete a message by id.
   */
  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Route handler: deletes a message. */
    try {
      await messagesService.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }
}

module.exports = new MessagesController();
