import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware.ts';

const cors = initMiddleware(
  Cors({
    origin: ['https://nextauthapp-six.vercel.app'], // Your frontend domain
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

export default cors;
