import { test, expect, request } from '@playwright/test';

test.describe.skip('Link API - Negative Tests', () => {
  let linkId: number;
  const linkData = {
    title: 'Documentation Link',
    url: 'https://docs.example.com',
    description: 'Link to project documentation',
    category: 'Documentation',
    status: 'Active'
  };

  // Run tests sequentially
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    // Create a link before each test
    const context = await request.newContext();
    const response = await context.post('http://localhost:3000/api/links', {
      data: linkData
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    linkId = data.id;
  });

  test.afterEach(async () => {
    // Clean up after each test
    const context = await request.newContext();
    await context.delete(`http://localhost:3000/api/links/${linkId}`);
  });

  test('POST /api/links - should fail with invalid URL format', async () => {
    const context = await request.newContext();
    const invalidData = { ...linkData, url: 'invalid-url' };
    const response = await context.post('http://localhost:3000/api/links', {
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/links - should fail with missing required fields', async () => {
    const context = await request.newContext();
    const invalidData = { title: 'Invalid Link' }; // Missing required fields
    const response = await context.post('http://localhost:3000/api/links', {
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('GET /api/links/:id - should fail with non-existent ID', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/links/999999');
    expect(response.status()).toBe(404);
  });

  test('PUT /api/links/:id - should fail with invalid status', async () => {
    const context = await request.newContext();
    const invalidData = { ...linkData, status: 'InvalidStatus' };
    const response = await context.put(`http://localhost:3000/api/links/${linkId}`, {
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('DELETE /api/links/:id - should fail with non-existent ID', async () => {
    const context = await request.newContext();
    const response = await context.delete('http://localhost:3000/api/links/999999');
    expect(response.status()).toBe(404);
  });
}); 