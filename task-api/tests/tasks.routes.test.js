const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('task routes', () => {
  beforeEach(() => taskService._reset());

  const createTask = (overrides = {}) =>
    request(app).post('/tasks').send({ title: 'Write tests', ...overrides });

  test('POST /tasks creates a task', async () => {
    const response = await createTask({ priority: 'high' });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: 'Write tests', priority: 'high', status: 'todo' });
  });

  test('POST /tasks validates required and enum fields', async () => {
    expect((await request(app).post('/tasks').send({ title: ' ' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'Bad', status: 'pending' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'Bad', dueDate: 'not-a-date' })).status).toBe(400);
  });

  test('GET /tasks lists and filters tasks', async () => {
    await createTask({ status: 'todo' });
    await createTask({ title: 'Done', status: 'done' });
    expect((await request(app).get('/tasks')).body).toHaveLength(2);
    const filtered = await request(app).get('/tasks?status=todo');
    expect(filtered.status).toBe(200);
    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].status).toBe('todo');
  });

  test('GET /tasks paginates from the first task and rejects invalid values', async () => {
    await createTask({ title: 'First' });
    await createTask({ title: 'Second' });
    const page = await request(app).get('/tasks?page=1&limit=1');
    expect(page.body[0].title).toBe('First');
    expect((await request(app).get('/tasks?page=0&limit=1')).status).toBe(400);
  });

  test('PUT /tasks/:id updates allowed fields and protects metadata', async () => {
    const created = (await createTask()).body;
    const response = await request(app).put(`/tasks/${created.id}`).send({
      title: 'Updated',
      id: 'spoofed-id',
      createdAt: 'spoofed-date',
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated');
    expect(response.body.id).toBe(created.id);
    expect(response.body.createdAt).toBe(created.createdAt);
    expect((await request(app).put('/tasks/missing')).status).toBe(404);
  });

  test('DELETE /tasks/:id deletes a task and handles missing IDs', async () => {
    const created = (await createTask()).body;
    expect((await request(app).delete(`/tasks/${created.id}`)).status).toBe(204);
    expect((await request(app).delete('/tasks/missing')).status).toBe(404);
  });

  test('PATCH /tasks/:id/complete completes a task', async () => {
    const created = (await createTask({ priority: 'high' })).body;
    const response = await request(app).patch(`/tasks/${created.id}/complete`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('done');
    expect(response.body.priority).toBe('high');
    expect((await request(app).patch('/tasks/missing/complete')).status).toBe(404);
  });

  test('GET /tasks/stats returns counts and overdue count', async () => {
    await createTask({ dueDate: '2000-01-01T00:00:00.000Z' });
    await createTask({ status: 'in_progress' });
    const response = await request(app).get('/tasks/stats');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ todo: 1, in_progress: 1, done: 0, overdue: 1 });
  });

  test('PATCH /tasks/:id/assign assigns and allows reassignment', async () => {
    const created = (await createTask()).body;
    const assigned = await request(app).patch(`/tasks/${created.id}/assign`).send({ assignee: ' Asha ' });
    expect(assigned.status).toBe(200);
    expect(assigned.body.assignee).toBe('Asha');
    expect((await request(app).patch(`/tasks/${created.id}/assign`).send({ assignee: 'Ravi' })).body.assignee).toBe('Ravi');
  });

  test('PATCH /tasks/:id/assign validates the name and task ID', async () => {
    const created = (await createTask()).body;
    expect((await request(app).patch(`/tasks/${created.id}/assign`).send({ assignee: ' ' })).status).toBe(400);
    expect((await request(app).patch('/tasks/missing/assign').send({ assignee: 'Asha' })).status).toBe(404);
  });
});
