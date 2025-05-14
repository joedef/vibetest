import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all test cases
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM test_cases');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single test case by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM test_cases WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test case not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new test case
router.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      preconditions,
      steps, 
      expected_result, 
      priority,
      status 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO test_cases (
        title, 
        description, 
        preconditions,
        steps, 
        expected_result, 
        priority,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, preconditions, steps, expected_result, priority, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a test case
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      preconditions,
      steps, 
      expected_result, 
      priority,
      status 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE test_cases 
       SET title = $1, 
           description = $2, 
           preconditions = $3,
           steps = $4, 
           expected_result = $5, 
           priority = $6,
           status = $7,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING *`,
      [title, description, preconditions, steps, expected_result, priority, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test case not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a test case
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM test_cases WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test case not found' });
    }
    
    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;