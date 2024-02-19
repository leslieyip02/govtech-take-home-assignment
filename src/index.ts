import bodyparser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Response } from "express";

import redeemRouter from "./routes/redeem";
import initializeDb from "./database";

dotenv.config();
dotenv.config({ path: `.env.${process.env["NODE_ENV"]}` });

initializeDb();

const app: Express = express();
app.use(bodyparser.json());
app.get("/", (_, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.use(redeemRouter);

const port = process.env["PORT"]!;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
