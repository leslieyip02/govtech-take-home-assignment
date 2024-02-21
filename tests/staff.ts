import { expect } from "chai";
import { Server } from "http";
import request from "supertest";

import app from "../src/server";
import initializeDb from "../src/server/database";

/*
Test staff mapping

staff_pass_id       |team_name  |created_at
----------------------------------------------
STAFF_H123804820G   |BASS       |1623772799000
MANAGER_T999888420B |RUST       |1623772799000
BOSS_T000000001P    |RUST       |1623872111000
*/

describe("[/staff]:", async function () {
    const agent = request.agent(app);
    let server: Server;

    before((done) => {
        initializeDb().then(() => {
            const port = process.env["PORT"]!;
            server = app.listen(port, () => {
                console.log(
                    `[server]: Server is running at http://localhost:${port}`
                );
                done();
            });
        });
    });

    it("[/staff/:staffPassId?]: GET a staff's team", async function () {
        return agent
            .get("/staff/STAFF_H123804820G")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["teamName"]).equal("BASS");
            });
    });

    it("[/staff/:staffPassId?]: GET with an empty staffPassId", function () {
        return agent.get("/staff").expect(400).expect("Content-Type", /json/);
    });

    it("[/staff/:staffPassId?]: GET with a non-existant staffPassId", function () {
        return agent
            .get("/staff/foo")
            .expect(404)
            .expect("Content-Type", /json/);
    });

    after((done) => {
        server.close();
        done();
    });
});
