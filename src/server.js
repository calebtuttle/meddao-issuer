import { mongoose } from "./init.js";
import { app } from "./index.js";

const PORT = 3007;
const server = app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running, exposed at http://127.0.0.1:${PORT}`);
});

async function terminate() {
  try {
    await mongoose.connection.close();
    console.log(`Closed MongoDB database connection`);
  } catch (err) {
    console.log(err);
    console.log("An error occurred while attempting to close the MongoDB connection");
  }
  console.log(`Closing server`);
  server.close(() => {
    console.log(`Closed server`);
    process.exit(0);
  });
}

process.on("SIGTERM", terminate);
process.on("SIGINT", terminate);
