import { app } from "./index.js";

const PORT = 3007;
const server = app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running, exposed at http://127.0.0.1:${PORT}`);
});

async function terminate() {
  console.log(`Closing server`);
  server.close(() => {
    console.log(`Closed server`);
    process.exit(0);
  });
}

process.on("SIGTERM", terminate);
process.on("SIGINT", terminate);
