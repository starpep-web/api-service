import 'dotenv/config';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export const NEO4J_URI = process.env.NEO4J_URI!;
