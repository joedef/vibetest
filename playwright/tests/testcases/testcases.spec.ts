import { test, expect, request } from '@playwright/test';

test.describe('Test Case API', () => {
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

  test('GET /api/testcases - should return all test cases', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/testcases');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/testcases/:id - should return a specific test case', async () => {
    const context = await request.newContext();
    const response = await context.get(`http://localhost:3000/api/testcases/${testCaseId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(testCaseId);
    expect(data.title).toBe(testCaseData.title);
  });

  test('PUT /api/testcases/:id - should update a test case', async () => {
    const context = await request.newContext();
    const updatedData = { ...testCaseData, title: 'Updated Test Case Title' };
    const response = await context.put(`http://localhost:3000/api/testcases/${testCaseId}`, {
      data: updatedData
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.title).toBe('Updated Test Case Title');
  });
}); 