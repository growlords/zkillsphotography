import app from './app.mjs';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`[API Server] Running on http://localhost:${PORT}`);
  console.log(`[API Server] Uploads served at http://localhost:${PORT}/uploads`);
});
