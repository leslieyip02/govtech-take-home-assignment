import * as csv from "fast-csv";
import * as fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";

import Staff from "./models/staff";
import Team from "./models/team";

async function initializeDb(): Promise<any> {
    const dbName = process.env["DB_NAME"]!;
    const dbUser = process.env["DB_USER"]!;
    const dbPassword = process.env["DB_PASSWORD"]!;
    const dbHost = process.env["DB_HOST"]!;
    const dbPort = process.env["DB_PORT"]!;
    const dbUri = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
    const sequelize = new Sequelize(dbUri, { logging: false });

    Staff.initialize(sequelize);
    Team.initialize(sequelize);

    Staff.belongsTo(Team, {
        foreignKey: "teamId",
    });
    Team.belongsTo(Staff, {
        foreignKey: "redeemerId",
        as: "redeemer",
    });

    const csvPath = path.resolve(process.env["PWD"]!, process.env["CSV_PATH"]!);
    return sequelize
        .sync({ force: true })
        .then(() => ingestCsv(csvPath))
        .then(() => console.log("[ingestion]: Ingestion complete"));
}

async function ingestCsv(csvPath: string): Promise<void> {
    const rawStaffs: Record<string, any>[] = [];
    const rawTeams: Record<string, number> = {};
    let teamId = 0;

    return new Promise((resolve) => {
        fs.createReadStream(csvPath).pipe(
            csv
                .parse({
                    headers: ["staffPassId", "teamName", "createdAt"],
                    renameHeaders: true,
                })
                .on("error", (error) => console.error(error))
                .on("data", async (row) => {
                    const teamName = row["teamName"];
                    if (rawTeams[teamName] === undefined) {
                        rawTeams[teamName] = teamId;
                        teamId++;
                    }

                    rawStaffs.push({
                        id: row["staffPassId"],
                        teamId: rawTeams[teamName],
                        createdAt: row["createdAt"],
                    });
                })
                .on("end", async (rowCount: number) => {
                    console.log(`[ingestion]: Parsed ${rowCount} rows`);
                    Team.bulkCreate(
                        Object.entries(rawTeams).map((entry) => {
                            const [name, id] = entry;
                            return {
                                id: id,
                                name: name,
                            };
                        })
                    )
                        .then((teams) => {
                            teams.forEach((team) =>
                                console.log(
                                    `[ingestion]: Created Team ${team.id}`
                                )
                            );
                        })
                        .then(async () => {
                            // staff can only be created after team due to foreign key
                            return Staff.bulkCreate(rawStaffs).then((staffs) =>
                                staffs.forEach((staff) =>
                                    console.log(
                                        `[ingestion]: Created Staff ${staff.id}`
                                    )
                                )
                            );
                        })
                        .then(() => {
                            resolve();
                        });
                })
        );
    });
}

export default initializeDb;
