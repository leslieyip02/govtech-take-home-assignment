import bodyparser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import path from "path";

import initializeDb from "./database";
import redeemRouter from "./routes/redeem";
import staffRouter from "./routes/staff";

dotenv.config();
dotenv.config({ path: `.env.${process.env["NODE_ENV"]}` });

const app: Express = express();
app.use(bodyparser.json());

// serve index.html
app.use(express.static(path.join(__dirname, "../../public")));
app.get("/", (_, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// use routers
app.use(staffRouter);
app.use(redeemRouter);

// only run server if not imported,
// since app is imported by the test suites
if (require.main === module) {
    initializeDb().then(() => {
        const port = process.env["PORT"]!;
        app.listen(port, () => {
            console.log(
                `[server]: Server is running at http://localhost:${port}`
            );
        });
    });
}

export default app;
