import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import albumRouter from './routes/album.js';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/albums', albumRouter);

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    data: {
      resource: 'Not found',
    },
  });
});

export default app;
