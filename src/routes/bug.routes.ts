import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Bug routes');
});

export default router;