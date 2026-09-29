# Bug Report and Engineering Notes

## Bugs identified and fixed

### 1. First pagination page skipped the first records

- **Location:** `src/services/taskService.js`, `getPaginated`
- **Expected:** `page=1&limit=2` should return records 1 and 2.
- **Actual:** The offset was calculated as `page * limit`, so page 1 started at index 2.
- **Discovery:** Unit and route tests for the first page exposed the missing records.
- **Fix:** Changed the offset to `(page - 1) * limit` and added validation for positive page and limit values.

### 2. Status filtering accepted partial matches

- **Location:** `src/services/taskService.js`, `getByStatus`
- **Expected:** A status filter should return tasks whose status exactly equals the requested status.
- **Actual:** `String.includes()` could match an unrelated partial value.
- **Discovery:** The service unit test checked that a partial status does not return tasks.
- **Fix:** Changed the comparison to strict equality.

### 3. Completing a task changed its priority

- **Location:** `src/services/taskService.js`, `completeTask`
- **Expected:** Completing a task should change completion state, not priority.
- **Actual:** Every completed task was forced to `medium` priority.
- **Discovery:** A regression test completed a high-priority task and checked that its priority was preserved.
- **Fix:** Removed the priority mutation.

### 4. PUT could overwrite server-managed fields

- **Location:** `src/routes/tasks.js`, PUT handler
- **Expected:** A client should not be able to change `id` or `createdAt` through a task update.
- **Actual:** The request body was merged into the stored task without an allowlist.
- **Discovery:** An integration test attempted to spoof those fields.
- **Fix:** The route now forwards only editable fields: `title`, `description`, `status`, `priority`, and `dueDate`.

### 5. Invalid empty dates were not rejected consistently

- **Location:** `src/utils/validators.js`
- **Expected:** A supplied date should be a valid date string, or the value should be explicit `null`.
- **Actual:** Empty strings could pass because the old condition only validated truthy values.
- **Discovery:** Validation edge-case tests.
- **Fix:** Added explicit date validation while continuing to allow `null`.

## Feature design: `PATCH /tasks/:id/assign`

- The endpoint accepts `{ "assignee": "name" }`.
- Assignee names must be non-empty strings after trimming.
- The trimmed name is stored on the task and the updated task is returned.
- Missing task IDs return `404`.
- Reassignment is allowed because assignment is an editable task property; rejecting it would require an additional unassign workflow.

## Known limitations and production questions

- The data store is in memory, so data is lost on restart and is not suitable for production persistence.
- There is no authentication or authorization, so any caller can modify or delete tasks.
- I would clarify the status vocabulary before shipping because the README and assignment text have inconsistent examples, while the source uses `todo`, `in_progress`, and `done`.
- I would ask whether `PUT` is intended to be a full replacement or a partial update; the current implementation preserves unspecified fields.
- I would add tests for malformed JSON, large payloads, concurrent updates, and a persistent database if the API were moving toward production.
