import { test, expect, request } from '@playwright/test';

test.describe.skip('Test Case API - Negative Tests', () => {
  let testCaseId: number;
  const testCaseData = {
    title: 'Test Login Functionality',
    description: 'Verify that users can log in with valid credentials',
    preconditions: 'User is on the login page',
    steps: '1. Enter valid username\n2. Enter valid password\n3. Click login button',
    expected_result: 'User should be logged in successfully',
    priority: 'High',
    status: 'Ready'
  };

  // Run tests sequentially
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    // Create a test case before each test
    const context = await request.newContext();
    const response = await context.post('http://localhost:3000/api/testcases', {
      data: testCaseData
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    testCaseId = data.id;
  });

  test.afterEach(async () => {
    // Clean up after each test
    const context = await request.newContext();
    await context.delete(`http://localhost:3000/api/testcases/${testCaseId}`);
  });

  test('POST /api/testcases - should fail with invalid data', async () => {
    const context = await request.newContext();
    const invalidData = { ...testCaseData, title: '' }; // Empty title
    const response = await context.post('http://localhost:3000/api/testcases', {
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('GET /api/testcases/:id - should fail with non-existent ID', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/testcases/999999');
    expect(response.status()).toBe(404);
  });

  test('PUT /api/testcases/:id - should fail with invalid data', async () => {
    const context = await request.newContext();
    const invalidData = { ...testCaseData, priority: 'InvalidPriority' };
    const response = await context.put(`http://localhost:3000/api/testcases/${testCaseId}`, {
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('DELETE /api/testcases/:id - should fail with non-existent ID', async () => {
    const context = await request.newContext();
    const response = await context.delete('http://localhost:3000/api/testcases/999999');
    expect(response.status()).toBe(404);
  });
}); 