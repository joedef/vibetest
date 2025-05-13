import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all bugs
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM bugs ORDER BY reported_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bugs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single bug by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM bugs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new bug
router.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      status, 
      severity, 
      reported_by 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO bugs (
        title, 
        description, 
        status, 
        severity, 
        reported_by
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, status, severity, reported_by]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a bug
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      status, 
      severity, 
      reported_by 
    } = req.body;
    
    // If status is being updated to 'Resolved' or 'Closed', set resolved_at
    let resolved_at = null;
    if (status === 'Resolved' || status === 'Closed') {
      resolved_at = new Date();
    }
    
    const result = await pool.query(
      `UPDATE bugs 
       SET title = $1, 
           description = $2, 
           status = $3, 
           severity = $4, 
           reported_by = $5,
           resolved_at = $6
       WHERE id = $7 
       RETURNING *`,
      [title, description, status, severity, reported_by, resolved_at, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a bug
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM bugs WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    console.error('Error deleting bug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link a bug to a test case
router.post('/:bugId/link/:testCaseId', async (req: Request, res: Response) => {
  try {
    const { bugId, testCaseId } = req.params;
    
    const result = await pool.query(
      'INSERT INTO test_case_bugs (test_case_id, bug_id) VALUES ($1, $2) RETURNING *',
      [testCaseId, bugId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error linking bug to test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlink a bug from a test case
router.delete('/:bugId/link/:testCaseId', async (req: Request, res: Response) => {
  try {
    const { bugId, testCaseId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM test_case_bugs WHERE test_case_id = $1 AND bug_id = $2 RETURNING *',
      [testCaseId, bugId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link removed successfully' });
  } catch (error) {
    console.error('Error unlinking bug from test case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;