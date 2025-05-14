import { Router } from 'express';
import {
  getAllLinks,
  getLinkById,
  createLink,
  deleteLink,
  getBugsForTestCase,
  getTestCasesForBug
} from '../controllers/test-case-bug.controller';

const router = Router();

// Get all links
router.get('/', getAllLinks);

// Get a specific link by ID
router.get('/:id', getLinkById);

// Create a new link
router.post('/testcases/:testCaseId/bugs/:bugId', createLink);

// Delete a link
router.delete('/:id', deleteLink);

// Get all bugs for a test case
router.get('/testcases/:testCaseId/bugs', getBugsForTestCase);

// Get all test cases for a bug
router.get('/bugs/:bugId/testcases', getTestCasesForBug);

export default router; 