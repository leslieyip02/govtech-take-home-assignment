import express, { Express, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.${process.env["NODE_ENV"]}` });

const app: Express = express();
const port = process.env["PORT"] || 3000;

app.get("/", (_, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
