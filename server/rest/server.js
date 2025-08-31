import express from "express";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});