import { test, expect, request } from '@playwright/test';

test.describe('Link API', () => {
  let linkId: number;
  let bugId: number;
  let testCaseId: number;
  const linkData = {
    title: 'Documentation Link',
    url: 'https://docs.example.com',
    description: 'Link to project documentation',
    category: 'Documentation',
    status: 'Active'
  };

  const bugData = {
    title: 'Login Button Not Working',
    description: 'The login button does not respond when clicked',
    status: 'Open',
    severity: 'Major',
    reported_by: 'John Doe'
  };

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
    const context = await request.newContext();

    // Create a bug first
    const bugResponse = await context.post('http://localhost:3000/api/bugs', {
      data: bugData
    });
    expect(bugResponse.status()).toBe(201);
    const createdBug = await bugResponse.json();
    bugId = createdBug.id;

    // Create a test case
    const testCaseResponse = await context.post('http://localhost:3000/api/testcases', {
      data: testCaseData
    });
    expect(testCaseResponse.status()).toBe(201);
    const createdTestCase = await testCaseResponse.json();
    testCaseId = createdTestCase.id;

    // Create a link between the bug and test case
    const response = await context.post(`http://localhost:3000/api/bugs/${bugId}/link/${testCaseId}`);
    expect(response.status()).toBe(201);
    const data = await response.json();
    linkId = data.id;
  });

  test.afterEach(async () => {
    // Clean up after each test
    const context = await request.newContext();
    // await context.delete(`http://localhost:3000/api/links/${linkId}`);
    await context.delete(`http://localhost:3000/api/bugs/${bugId}`);
    await context.delete(`http://localhost:3000/api/testcases/${testCaseId}`);
  });

  test('GET /api/links - should return all links', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/links');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test.skip('GET /api/links/:id - should return a specific link', async () => {
    const context = await request.newContext();
    const response = await context.get(`http://localhost:3000/api/links/${linkId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(linkId);
    expect(data.test_case_id).toBe(testCaseId);
    expect(data.bug_id).toBe(bugId);
  });

  test.skip('PUT /api/links/:id - should update a link', async () => {
    const context = await request.newContext();
    const updatedData = { ...linkData, status: 'Archived' };
    const response = await context.put(`http://localhost:3000/api/links/${linkId}`, {
      data: updatedData
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('Archived');
  });
}); 