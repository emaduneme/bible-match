import { createServer } from 'vite';

async function start() {
  try {
    const port = Number(process.env.PORT) || 5173;
    const server = await createServer({
      logLevel: 'info',
      server: {
        host: '127.0.0.1',
        port,
        strictPort: false,
        open: false,
      },
    });

    await server.listen();

    const protocol = server.config.server.https ? 'https' : 'http';
    const effectivePort = server.config.server.port ?? port;
    // Avoid calling server.printUrls() to prevent os.networkInterfaces access
    console.log(`Vite dev server running at ${protocol}://localhost:${effectivePort}`);
  } catch (err) {
    console.error('Failed to start Vite dev server:', err);
    process.exit(1);
  }
}

start();


