'use strict';

const { query } = require('../db/pool');

/**
 * Maps DB rows to API message representation.
 */
function mapDbMessageToApi(row, tags = []) {
  return {
    id: String(row.id),
    text: row.content,
    tags: tags.map((t) => ({
      id: String(t.id),
      tag: t.value,
      type: t.type,
      color: t.color || (t.type === 'user' ? '#2b6cb0' : '#38a169'),
      createdAt: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
    })),
    timestamp: new Date(row.created_at).toISOString(),
    senderId: String(row.user_id),
    status: row.status,
  };
}

async function getMessageTags(messageId) {
  /* eslint-disable quotes */
  const sql = `
    SELECT t.id, t.type, t.value, t.display, t.created_at
    FROM "MessageTag" mt
    JOIN "Tag" t ON t.id = mt.tag_id
    WHERE mt.message_id = $1
    ORDER BY t.value ASC
  `;
  /* eslint-enable quotes */
  const { rows } = await query(sql, [messageId]);
  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    value: r.value,
    display: r.display,
    created_at: r.created_at,
  }));
}

/**
 * Fetch paginated messages with their tags.
 */
async function listMessages({ page = 1, limit = 20 } = {}) {
  const offset = (Math.max(1, page) - 1) * Math.max(1, limit);
  /* eslint-disable quotes */
  const sql = `
    SELECT m.id, m.user_id, m.content, m.status, m.created_at
    FROM "Message" m
    ORDER BY m.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  /* eslint-enable quotes */
  const { rows } = await query(sql, [limit, offset]);

  const results = [];
  for (const row of rows) {
    const tags = await getMessageTags(row.id);
    results.push(mapDbMessageToApi(row, tags));
  }
  return results;
}

/**
 * Insert a message and attach tags (by tag.value). Creates new Tag rows if necessary.
 */
async function createMessage({ senderId, text, tags = [], status = 'sent' }) {
  /* eslint-disable quotes */
  const insertSql = `
    INSERT INTO "Message"(user_id, content, status)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, content, status, created_at
  `;
  /* eslint-enable quotes */
  const { rows: [msg] } = await query(insertSql, [parseInt(senderId, 10), text, status]);

  // Resolve tag ids
  const tagIds = [];
  for (const t of tags) {
    /* eslint-disable quotes */
    const findTagSql = `SELECT id FROM "Tag" WHERE value = $1`;
    /* eslint-enable quotes */
    const { rows: existing } = await query(findTagSql, [t.tag || t.value || '']);
    let tagId;
    if (existing.length) {
      tagId = existing[0].id;
    } else {
      /* eslint-disable quotes */
      const insertTagSql = `
        INSERT INTO "Tag"(type, value, display)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      /* eslint-enable quotes */
      const { rows: [newTag] } = await query(insertTagSql, [t.type || 'topic', t.tag || t.value, t.tag || t.value]);
      tagId = newTag.id;
    }
    tagIds.push(tagId);
  }

  // Insert message-tag mappings
  for (const tagId of tagIds) {
    /* eslint-disable quotes */
    await query(`INSERT INTO "MessageTag"(message_id, tag_id) VALUES($1, $2) ON CONFLICT DO NOTHING`, [msg.id, tagId]);
    /* eslint-enable quotes */
  }

  const finalTags = await getMessageTags(msg.id);
  return mapDbMessageToApi(msg, finalTags);
}

/**
 * Update message text and replace tags set.
 */
async function updateMessage(id, { text, tags = [] }) {
  /* eslint-disable quotes */
  const updateSql = `
    UPDATE "Message"
    SET content = $1
    WHERE id = $2
    RETURNING id, user_id, content, status, created_at
  `;
  /* eslint-enable quotes */
  const { rows } = await query(updateSql, [text, parseInt(id, 10)]);
  if (!rows.length) return null;
  const message = rows[0];

  /* eslint-disable quotes */
  await query(`DELETE FROM "MessageTag" WHERE message_id = $1`, [message.id]);
  /* eslint-enable quotes */

  // Add new tags
  const tagIds = [];
  for (const t of tags) {
    /* eslint-disable quotes */
    const findTagSql = `SELECT id FROM "Tag" WHERE value = $1`;
    /* eslint-enable quotes */
    const { rows: existing } = await query(findTagSql, [t.tag || t.value || '']);
    let tagId;
    if (existing.length) {
      tagId = existing[0].id;
    } else {
      /* eslint-disable quotes */
      const insertTagSql = `
        INSERT INTO "Tag"(type, value, display)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      /* eslint-enable quotes */
      const { rows: [newTag] } = await query(insertTagSql, [t.type || 'topic', t.tag || t.value, t.tag || t.value]);
      tagId = newTag.id;
    }
    tagIds.push(tagId);
  }
  for (const tagId of tagIds) {
    /* eslint-disable quotes */
    await query(`INSERT INTO "MessageTag"(message_id, tag_id) VALUES($1, $2) ON CONFLICT DO NOTHING`, [message.id, tagId]);
    /* eslint-enable quotes */
  }

  const finalTags = await getMessageTags(message.id);
  return mapDbMessageToApi(message, finalTags);
}

async function deleteMessage(id) {
  /* eslint-disable quotes */
  await query(`DELETE FROM "Message" WHERE id = $1`, [parseInt(id, 10)]);
  /* eslint-enable quotes */
  return true;
}

module.exports = {
  listMessages,
  createMessage,
  updateMessage,
  deleteMessage,
};
