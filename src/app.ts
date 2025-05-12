import express from 'express';
import testcaseRoutes from './routes/testcase.routes';
import bugRoutes from './routes/bug.routes';

const app = express();

app.use(express.json());

app.get('/health', (_, res) => res.send('OK'));
app.use('/api/testcases', testcaseRoutes);
app.use('/api/bugs', bugRoutes);

export default app;