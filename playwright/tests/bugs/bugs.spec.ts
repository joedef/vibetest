import { test, expect, request } from '@playwright/test';

test.describe('Bug API', () => {
  let bugId: number;
  const bugData = {
    title: 'Login Button Not Working',
    description: 'The login button does not respond when clicked',
    status: 'Open',
    severity: 'Major',
    reported_by: 'John Doe'
  };

  // Run tests sequentially
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    // Create a bug before each test
    const context = await request.newContext();
    const response = await context.post('http://localhost:3000/api/bugs', {
      data: bugData
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    bugId = data.id;
  });

  test.afterEach(async () => {
    // Clean up after each test
    const context = await request.newContext();
    await context.delete(`http://localhost:3000/api/bugs/${bugId}`);
  });

  test('GET /api/bugs - should return all bugs', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/bugs');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/bugs/:id - should return a specific bug', async () => {
    const context = await request.newContext();
    const response = await context.get(`http://localhost:3000/api/bugs/${bugId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(bugId);
    expect(data.title).toBe(bugData.title);
  });

  test('PUT /api/bugs/:id - should update a bug', async () => {
    const context = await request.newContext();
    const updatedData = { ...bugData, status: 'In Progress' };
    const response = await context.put(`http://localhost:3000/api/bugs/${bugId}`, {
      data: updatedData
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('In Progress');
  });
}); 