Task Manager API
A Node.js and Express REST API developed as part of a Full Stack Developer Intern takehome assignment.
The project focuses on understanding an unfamiliar codebase, writing automated tests,
identifying and fixing bugs, improving input validation, and implementing a new task
assignment feature.
Live API
Open the live Task Manager API
Features
• Create, list, update, and delete tasks
• Filter tasks by status
• Paginate task results
• Mark tasks as completed
• View task statistics
• Track overdue tasks
• Assign and reassign tasks
• Validate task input
• Unit tests for service-layer business logic
• Integration tests for API routes
• Documented bug report and engineering decisions
• Render deployment support
Technology Stack
• Node.js
• Express.js
• Jest
• Supertest
• UUID
• In-memory data store
Project Structure
Plain Text
task-api/
├── src/
│ ├── app.js
│ ├── routes/
│ │ └── tasks.js
│ ├── services/
│ │ └── taskService.js
│ └── utils/
│ └── validators.js
├── tests/
│ ├── taskService.test.js
│ └── tasks.routes.test.js
├── BUG_REPORT.md
├── SUBMISSION_NOTES.md
├── package.json
├── package-lock.json
└── jest.config.js
Installation
Clone the repository:
Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
Navigate to the API directory:
Bash
cd YOUR_REPOSITORY/task-api
Install dependencies:
Bash
npm install
Run Locally
Start the API server:
Bash
npm start
The API will be available at:
Plain Text
http://localhost:3000
Run Tests
Run the test suite:
Bash
npm test
Run tests with coverage:
Bash
npm run coverage
Test Results
The test suite contains  passing tests.
Metric Result
Tests passed
Statement coverage .%
Branch coverage .%
Function coverage .%
Line coverage .%
API Endpoints
Supported Task Statuses
Plain Text
todo
in_progress
done
Supported Priorities
Plain Text
low
medium
high
API Usage Examples
Method Endpoint Description
GET /tasks List all tasks
GET /tasks?status=todo Filter tasks by status
GET /tasks?page=&limit= Get paginated tasks
POST /tasks Create a task
PUT /tasks/:id Update a task
DELETE /tasks/:id Delete a task
PATCH /tasks/:id/complete Mark a task as completed
PATCH /tasks/:id/assign Assign or reassign a task
GET /tasks/stats
Get task counts and overdue
count
Create a Task
Plain Text
POST /tasks
Content-Type: application/json
Request body:
JSON
{
 "title": "Prepare internship submission",
 "description": "Complete the Task Manager API assignment",
 "priority": "high",
 "dueDate": "2026-10-01T18:00:00.000Z"
}
List All Tasks
Plain Text
GET /tasks
Live endpoint:
Plain Text
https://take-home-assignment-the-untested-api-khf2.onrender.com/tasks
Filter Tasks by Status
Plain Text
GET /tasks?status=todo
Paginate Tasks
Plain Text
GET /tasks?page=1&limit=10
Update a Task
Plain Text
PUT /tasks/:id
Content-Type: application/json
Request body:
JSON
{
 "title": "Updated task title",
 "description": "Updated description",
 "priority": "medium"
}
Assign a Task
Plain Text
PATCH /tasks/:id/assign
Content-Type: application/json
Request body:
JSON
{
 "assignee": "Asha"
}
The assignee must be a non-empty string. Leading and trailing whitespace is removed.
Reassignment is allowed.
Mark a Task as Complete
Plain Text
PATCH /tasks/:id/complete
Completing a task changes its status to done and sets the completedAt timestamp. The task
priority remains unchanged.
Delete a Task
Plain Text
DELETE /tasks/:id
A successful deletion returns HTTP status  .
View Task Statistics
Plain Text
GET /tasks/stats
Live endpoint:
Plain Text
https://take-home-assignment-the-untested-api-khf2.onrender.com/tasks/stats
Example response:
JSON
{
 "todo": 2,
 "in_progress": 1,
 "done": 3,
 "overdue": 1
}
Bugs Identified and Fixed
. Pagination skipped the first page
The original pagination logic calculated the offset using page * limit . This caused page  to
skip the first set of tasks. It was corrected to (page -  ) * limit .
. Status filtering used partial matching
The original status filter used includes() , which could return tasks for partial status values. It
was changed to exact matching with task.status === status .
. Completing a task changed its priority
The original completion logic changed every completed task's priority to medium . This
behavior was removed so that completing a task preserves its original priority.
. Server-managed fields could be overwritten
The original update route allowed clients to overwrite fields such as id and createdAt . The
update route now accepts only editable fields: title , description , status , priority , and
dueDate .
. Date validation accepted invalid empty values
Date validation was strengthened so that dueDate must be a valid date string or explicit
null .
More details are available in BUG_REPORT.md.
Design Decisions
• PATCH is used for task assignment because it performs a partial update.
• Assignee names must be non-empty strings.
• Leading and trailing whitespace is removed from assignee names.
• Reassignment is allowed because assignment is treated as an editable task property.
• Server-managed fields such as id and createdAt cannot be changed through PUT .
• Pagination uses one-based page numbering.
• Completing a task does not change its priority.
• Invalid pagination values return HTTP status  .
• Missing task IDs return HTTP status  .
Known Limitations
The API currently uses an in-memory data store.
This means:
• Data resets whenever the server restarts.
• Data may disappear when the Render service sleeps or redeploys.
• The API is intended for assignment demonstration purposes rather than production
persistence.
• Authentication and authorization are not included.
For production use, the in-memory store should be replaced with a persistent database
such as PostgreSQL or MongoDB.
Future Improvements
If more time were available, I would add:
• Persistent database storage
• Authentication and authorization
• OpenAPI or Swagger documentation
• Request rate limiting
• Structured logging
• Additional malformed-request tests
• Automated deployment checks
• Docker support
• Database migrations
• API versioning
• Health-check and monitoring endpoints
Deployment
The application is configured for Render deployment.
Plain Text
Root Directory: task-api
Build Command: npm install
Start Command: npm start
The server uses the PORT environment variable and binds to ... for public hosting.
Documentation
• Bug Report
• Submission Notes
• Assignment Brief
License
This project was created for educational and interview-assignment purposes.