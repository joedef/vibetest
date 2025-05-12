import { test, expect, request } from '@playwright/test';

test.describe('Test Case API', () => {
  test('GET /api/testcases', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/testcases');
    expect(response.status()).toBe(200);
  });
});

test.describe('Bug API', () => {
  test('GET /api/bugs', async () => {
    const context = await request.newContext();
    const response = await context.get('http://localhost:3000/api/bugs');
    expect(response.status()).toBe(200);
  });
});