'use strict';

const repo = require('../repositories/messagesRepository');
const { BadRequestError, NotFoundError } = require('../utils/httpErrors');

class MessagesService {
  // PUBLIC_INTERFACE
  async list(params) {
    /** Fetch message history with optional pagination. */
    const page = params.page ? parseInt(params.page, 10) : 1;
    const limit = params.limit ? parseInt(params.limit, 10) : 20;
    return repo.listMessages({ page, limit });
  }

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Create a new message after validating required fields. */
    const { senderId, text, tags, status } = payload || {};
    if (!senderId || !text) {
      throw new BadRequestError('senderId and text are required');
    }
    return repo.createMessage({ senderId, text, tags: Array.isArray(tags) ? tags : [], status: status || 'sent' });
  }

  // PUBLIC_INTERFACE
  async update(id, payload) {
    /** Update message content and tags. */
    if (!id) throw new BadRequestError('id path param is required');
    const { text, tags } = payload || {};
    if (!text) throw new BadRequestError('text is required');
    const updated = await repo.updateMessage(id, { text, tags: Array.isArray(tags) ? tags : [] });
    if (!updated) throw new NotFoundError('Message not found');
    return updated;
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete a message by id. */
    if (!id) throw new BadRequestError('id path param is required');
    await repo.deleteMessage(id);
    return true;
  }
}

module.exports = new MessagesService();
