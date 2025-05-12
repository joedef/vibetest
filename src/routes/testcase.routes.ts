import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Testcase routes');
});

export default router;