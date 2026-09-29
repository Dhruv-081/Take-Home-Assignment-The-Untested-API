const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const isValidDate = (value) => typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Date.parse(value));

const validateCreateTask = (body = {}) => {
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') return 'title is required and must be a non-empty string';
  if (body.description !== undefined && typeof body.description !== 'string') return 'description must be a string';
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  if (body.dueDate !== undefined && body.dueDate !== null && !isValidDate(body.dueDate)) return 'dueDate must be a valid ISO date string or null';
  return null;
};

const validateUpdateTask = (body = {}) => {
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) return 'title must be a non-empty string';
  if (body.description !== undefined && typeof body.description !== 'string') return 'description must be a string';
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  if (body.dueDate !== undefined && body.dueDate !== null && !isValidDate(body.dueDate)) return 'dueDate must be a valid ISO date string or null';
  return null;
};

const validateAssignee = (body = {}) => {
  if (typeof body.assignee !== 'string' || body.assignee.trim() === '') return 'assignee is required and must be a non-empty string';
  return null;
};

module.exports = { validateCreateTask, validateUpdateTask, validateAssignee };
