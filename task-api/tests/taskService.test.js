const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => taskService._reset());

  test('creates tasks with defaults and generated metadata', () => {
    const task = taskService.create({ title: 'Test API' });
    expect(task).toMatchObject({
      title: 'Test API',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      completedAt: null,
    });
    expect(task.id).toEqual(expect.any(String));
    expect(task.createdAt).toEqual(expect.any(String));
  });

  test('finds, lists, and filters tasks by exact status', () => {
    const todo = taskService.create({ title: 'Todo', status: 'todo' });
    taskService.create({ title: 'In progress', status: 'in_progress' });
    expect(taskService.findById(todo.id)).toEqual(todo);
    expect(taskService.getAll()).toHaveLength(2);
    expect(taskService.getByStatus('todo')).toEqual([todo]);
    expect(taskService.getByStatus('in')).toEqual([]);
  });

  test('uses one-based pagination', () => {
    for (let index = 1; index <= 3; index++) taskService.create({ title: `Task ${index}` });
    expect(taskService.getPaginated(1, 2).map((task) => task.title)).toEqual(['Task 1', 'Task 2']);
    expect(taskService.getPaginated(2, 2).map((task) => task.title)).toEqual(['Task 3']);
  });

  test('updates and removes tasks, returning null or false when absent', () => {
    const task = taskService.create({ title: 'Original' });
    expect(taskService.update(task.id, { title: 'Updated' }).title).toBe('Updated');
    expect(taskService.update('missing', { title: 'Nope' })).toBeNull();
    expect(taskService.remove(task.id)).toBe(true);
    expect(taskService.remove(task.id)).toBe(false);
  });

  test('completes a task without changing its priority', () => {
    const task = taskService.create({ title: 'Urgent', priority: 'high' });
    const completed = taskService.completeTask(task.id);
    expect(completed.status).toBe('done');
    expect(completed.priority).toBe('high');
    expect(completed.completedAt).toEqual(expect.any(String));
    expect(taskService.completeTask('missing')).toBeNull();
  });

  test('assigns and reassigns tasks', () => {
    const task = taskService.create({ title: 'Assign me' });
    expect(taskService.assignTask(task.id, 'Asha').assignee).toBe('Asha');
    expect(taskService.assignTask(task.id, 'Ravi').assignee).toBe('Ravi');
    expect(taskService.assignTask('missing', 'Asha')).toBeNull();
  });

  test('calculates status counts and overdue tasks', () => {
    taskService.create({ title: 'Todo', dueDate: '2000-01-01T00:00:00.000Z' });
    taskService.create({ title: 'Progress', status: 'in_progress' });
    taskService.create({ title: 'Done', status: 'done', dueDate: '2000-01-01T00:00:00.000Z' });
    expect(taskService.getStats()).toEqual({ todo: 1, in_progress: 1, done: 1, overdue: 1 });
  });
});
