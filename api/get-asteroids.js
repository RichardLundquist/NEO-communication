import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api", async (req, res) => {

  
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;



 /*  try {
  } catch (error) {
  } */
});

// Serve the index.html for all other requests (client-side routing support)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(8000, () => console.log(`server is running on ${PORT}`));




  // remove the VITE_prefix in .env if using this backend
