# Task Manager API

A Node.js and Express REST API developed as part of a Full Stack Developer Intern take-home assignment.

The project focuses on understanding an unfamiliar codebase, writing automated tests, identifying and fixing bugs, improving input validation, and implementing a new task assignment feature.

## Live API

[Open the live Task Manager API](https://take-home-assignment-the-untested-api-khf2.onrender.com/tasks)

## Features

- Create, list, update, and delete tasks
- Filter tasks by status
- Paginate task results
- Mark tasks as completed
- View task statistics and overdue tasks
- Assign and reassign tasks
- Validate task input
- Unit tests for service-layer business logic
- Integration tests for API routes
- Documented bug report and engineering decisions
- Render deployment support

## Technology Stack

- Node.js
- Express.js
- Jest
- Supertest
- UUID
- In-memory data store

## Project Structure

```text
task-api/
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── tasks.js
│   ├── services/
│   │   └── taskService.js
│   └── utils/
│       └── validators.js
├── tests/
│   ├── taskService.test.js
│   └── tasks.routes.test.js
├── BUG_REPORT.md
├── SUBMISSION_NOTES.md
├── package.json
├── package-lock.json
└── jest.config.js
```

## Installation

```bash
git clone https://github.com/Dhruv-081/Take-Home-Assignment-The-Untested-API
cd Take-Home-Assignment-The-Untested-API/task-api
npm install
```



## Run Locally

```bash
npm start
```

The API runs at `http://localhost:3000`.

## Run Tests

```bash
npm test
npm run coverage
```

## Test Results

| Metric | Result |
|---|---:|
| Tests passed | 17 |
| Statement coverage | 92.63% |
| Branch coverage | 80.37% |
| Function coverage | 93.75% |
| Line coverage | 96.21% |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks?status=todo` | Filter tasks by status |
| `GET` | `/tasks?page=1&limit=10` | Paginate tasks |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `PATCH` | `/tasks/:id/complete` | Mark a task as completed |
| `PATCH` | `/tasks/:id/assign` | Assign or reassign a task |
| `GET` | `/tasks/stats` | Get task counts and overdue count |

## Supported Values

Statuses:

```text
todo
in_progress
done
```

Priorities:

```text
low
medium
high
```

## API Examples

### Create a Task

```http
POST /tasks
Content-Type: application/json
```

```json
{
  "title": "Prepare internship submission",
  "description": "Complete the Task Manager API assignment",
  "priority": "high",
  "dueDate": "2026-10-01T18:00:00.000Z"
}
```

### Assign a Task

```http
PATCH /tasks/:id/assign
Content-Type: application/json
```

```json
{
  "assignee": "Asha"
}
```

Assignee names must be non-empty strings. Leading and trailing whitespace is removed. Reassignment is allowed.

### Complete a Task

```http
PATCH /tasks/:id/complete
```

Completing a task changes its status to `done` and sets `completedAt`. The original priority remains unchanged.

### View Statistics

```http
GET /tasks/stats
```

Live endpoint: [Task statistics](https://take-home-assignment-the-untested-api-khf2.onrender.com/tasks/stats)

Example response:

```json
{
  "todo": 2,
  "in_progress": 1,
  "done": 3,
  "overdue": 1
}
```

## Bugs Identified and Fixed

1. **Pagination skipped the first page.** The offset was changed from `page * limit` to `(page - 1) * limit`.
2. **Status filtering used partial matching.** `includes()` was replaced with exact status matching.
3. **Completing a task changed its priority.** Completion now preserves the original priority.
4. **Server-managed fields could be overwritten.** Updates now allow only editable task fields.
5. **Date validation accepted invalid empty values.** Dates must be valid date strings or explicit `null`.

See [BUG_REPORT.md](./BUG_REPORT.md) for details.

## Design Decisions

- `PATCH` is used for assignment because it performs a partial update.
- Assignee names must be non-empty strings.
- Reassignment is allowed because assignment is an editable task property.
- Server-managed fields such as `id` and `createdAt` cannot be changed through `PUT`.
- Pagination uses one-based page numbering.
- Missing task IDs return HTTP `404`.
- Invalid input returns HTTP `400`.

## Known Limitations

The API uses an in-memory data store. Data resets when the server restarts, sleeps, or redeploys. Authentication and authorization are not included. For production use, the in-memory store should be replaced with a persistent database such as PostgreSQL or MongoDB.

## Future Improvements

- Persistent database storage
- Authentication and authorization
- OpenAPI or Swagger documentation
- Request rate limiting
- Structured logging
- Additional malformed-request tests
- Docker support
- Database migrations
- API versioning
- Health-check and monitoring endpoints

## Deployment

Render configuration:

```text
Root Directory: task-api
Build Command: npm install
Start Command: npm start
```

The server uses the `PORT` environment variable and binds to `0.0.0.0` for public hosting.




