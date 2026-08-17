import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { initDb } from './db/index.js';
import { authRoutes } from './routes/auth.js';
import { collegeRoutes } from './routes/colleges.js';
import { noteRoutes } from './routes/notes.js';
import { classifyRoutes } from './routes/classify.js';

const fastify = Fastify({
  logger: true
});

const PORT = Number(process.env.PORT) || 3001;

const start = async () => {
  try {
    // 1. Initialize DB Schema & Seeding (zero notes by default)
    initDb();

    // 2. Register Plugins
    await fastify.register(cors, {
      origin: true,
      credentials: true
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB max file size
      }
    });

    // 3. Register Routes
    await fastify.register(authRoutes);
    await fastify.register(collegeRoutes);
    await fastify.register(noteRoutes);
    await fastify.register(classifyRoutes);

    // 4. Healthcheck Route
    fastify.get('/health', async () => {
      return { status: 'ok', app: 'NoteNest API Server', timestamp: new Date().toISOString() };
    });

    // 5. Start Server
    const address = await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 NoteNest server running at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    console.error('Failed to start Fastify server:', err);
    process.exit(1);
  }
};

start();
