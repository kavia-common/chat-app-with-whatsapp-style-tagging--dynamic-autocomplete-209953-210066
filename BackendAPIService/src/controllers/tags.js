'use strict';

const tagsService = require('../services/tags');
const { toErrorResponse } = require('../utils/httpErrors');

class TagsController {
  /**
   * GET /api/tags
   * Fetch tag suggestions.
   */
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** Route handler: lists tag suggestions. */
    try {
      const data = await tagsService.list(req.query || {});
      return res.status(200).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * POST /api/tags
   * Create a new tag suggestion (and Tag if required).
   */
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Route handler: creates tag suggestion. */
    try {
      const data = await tagsService.create(req.body || {});
      return res.status(201).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * PUT /api/tags/:id
   * Update a tag by id.
   */
  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Route handler: updates tag. */
    try {
      const data = await tagsService.update(req.params.id, req.body || {});
      return res.status(200).json(data);
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }

  /**
   * DELETE /api/tags/:id
   * Delete a tag by id.
   */
  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Route handler: deletes tag. */
    try {
      await tagsService.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      const { status, payload } = toErrorResponse(err);
      return res.status(status).json(payload);
    }
  }
}

module.exports = new TagsController();
