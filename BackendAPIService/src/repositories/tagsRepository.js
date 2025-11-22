'use strict';

const { query } = require('../db/pool');

function mapDbTagToApi(row) {
  return {
    id: String(row.id),
    tag: row.value,
    type: row.type,
    color: row.type === 'user' ? '#2b6cb0' : '#38a169',
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/**
 * Fetch tag suggestions filtered by trigger and search input.
 */
async function listTagSuggestions({ trigger, input = '' }) {
  /* eslint-disable quotes */
  const sql = `
    SELECT t.id, t.type, t.value, t.display, t.created_at
    FROM "TagSuggestion" ts
    JOIN "Tag" t ON t.value = ts.value
    WHERE ($1::text IS NULL OR ts.trigger = $1)
      AND ($2::text IS NULL OR t.value ILIKE '%' || $2 || '%')
    ORDER BY t.value ASC
    LIMIT 25
  `;
  /* eslint-enable quotes */
  const trig = trigger || null;
  const search = input || null;
  const { rows } = await query(sql, [trig, search]);
  return rows.map(mapDbTagToApi);
}

/**
 * Create a new tag suggestion (and Tag if missing).
 */
async function createTagSuggestion({ tag, type = 'topic', trigger = '#' }) {
  /* eslint-disable quotes */
  const findTagSql = `SELECT id FROM "Tag" WHERE value = $1`;
  /* eslint-enable quotes */
  const { rows: found } = await query(findTagSql, [tag]);
  let tagId;
  if (found.length) {
    tagId = found[0].id;
  } else {
    /* eslint-disable quotes */
    const insertTagSql = `
      INSERT INTO "Tag"(type, value, display)
      VALUES ($1, $2, $3)
      RETURNING id, type, value, display, created_at
    `;
    /* eslint-enable quotes */
    const { rows: [created] } = await query(insertTagSql, [type, tag, tag]);
    tagId = created.id;
  }

  /* eslint-disable quotes */
  await query(
    `INSERT INTO "TagSuggestion"(trigger, value, type) VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [trigger, tag, type]
  );
  /* eslint-enable quotes */

  /* eslint-disable quotes */
  const { rows: [row] } = await query(`SELECT id, type, value, display, created_at FROM "Tag" WHERE id = $1`, [tagId]);
  /* eslint-enable quotes */
  return mapDbTagToApi(row);
}

/**
 * Update a Tag (value/type). For simplicity we only allow changing tag value and type.
 */
async function updateTag(id, { tag, type }) {
  /* eslint-disable quotes */
  const sql = `
    UPDATE "Tag"
    SET value = COALESCE($1, value),
        display = COALESCE($1, display),
        type = COALESCE($2, type)
    WHERE id = $3
    RETURNING id, type, value, display, created_at
  `;
  /* eslint-enable quotes */
  const { rows } = await query(sql, [tag || null, type || null, parseInt(id, 10)]);
  if (!rows.length) return null;
  return mapDbTagToApi(rows[0]);
}

async function deleteTag(id) {
  /* eslint-disable quotes */
  await query(`DELETE FROM "Tag" WHERE id = $1`, [parseInt(id, 10)]);
  /* eslint-enable quotes */
  return true;
}

module.exports = {
  listTagSuggestions,
  createTagSuggestion,
  updateTag,
  deleteTag,
};
