'use strict';

const repo = require('../repositories/tagsRepository');
const { BadRequestError, NotFoundError } = require('../utils/httpErrors');

class TagsService {
  // PUBLIC_INTERFACE
  async list(params) {
    /** Retrieve tag suggestions by trigger and search input. */
    const trigger = params.trigger || undefined;
    const input = params.search || params.input || '';
    return repo.listTagSuggestions({ trigger, input });
  }

  // PUBLIC_INTERFACE
  async create(payload) {
    /** Create a new tag suggestion and ensure Tag exists. */
    const { tag, type, trigger } = payload || {};
    if (!tag) {
      throw new BadRequestError('tag is required');
    }
    return repo.createTagSuggestion({ tag, type: type || 'topic', trigger: trigger || '#' });
  }

  // PUBLIC_INTERFACE
  async update(id, payload) {
    /** Update a tag (value/type). */
    if (!id) throw new BadRequestError('id path param is required');
    const { tag, type } = payload || {};
    const updated = await repo.updateTag(id, { tag, type });
    if (!updated) throw new NotFoundError('Tag not found');
    return updated;
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete a tag by id. */
    if (!id) throw new BadRequestError('id path param is required');
    await repo.deleteTag(id);
    return true;
  }
}

module.exports = new TagsService();
