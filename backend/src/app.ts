import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middlewares';
import routes from './routes';

const app = express();

const allowedOrigins = config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((s) => s.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: allowedOrigins === true ? false : true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'EventX API is running', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`EventX API server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
