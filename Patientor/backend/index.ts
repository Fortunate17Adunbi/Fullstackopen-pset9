import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});
app.get("/api/patients", (_req, res) => {
  res.send("records");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});
