import { Router } from 'express';
import {
  getAllLinks,
  getLinkById,
  createLink,
  deleteLink,
  updateLink
} from '../controllers/link.controller';

const router = Router();

// GET all links
router.get('/', getAllLinks);

// GET a specific link by ID
router.get('/:id', getLinkById);

// POST a new link
router.post('/bugs/:bugId/link/:linkId', createLink);

// DELETE a link
router.delete('/:id', deleteLink);

// PUT update a link
router.put('/:id', updateLink);

export default router; 