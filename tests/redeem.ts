import { expect } from "chai";
import { Server } from "http";
import request from "supertest";

import app from "../src/server";
import initializeDb from "../src/server/database";
import Team from "../src/server/database/models/team";

/*
Test staff mapping

staff_pass_id       |team_name  |created_at
----------------------------------------------
STAFF_H123804820G   |BASS       |1623772799000
MANAGER_T999888420B |RUST       |1623772799000
BOSS_T000000001P    |RUST       |1623872111000
*/

describe("[/redeem]:", async function () {
    const agent = request.agent(app);
    let server: Server;
    let rustTeamId: number;

    before((done) => {
        initializeDb()
            .then(() => {
                return Team.findOne({
                    where: {
                        name: "RUST",
                    },
                });
            })
            .then((team) => {
                rustTeamId = team!.id;
                const port = process.env["PORT"]!;
                server = app.listen(port, () => {
                    console.log(
                        `[server]: Server is running at http://localhost:${port}`
                    );
                });
                done();
            });
    });

    it("[/redeem/:teamId]: GET a team's eligibility to redeem", async function () {
        return agent
            .get(`/redeem/${rustTeamId}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["canRedeem"]).equal(true);
            });
    });

    it("[/redeem]: PUT Redeem with a staffPassId that does not belong to the team", async function () {
        return agent
            .put(`/redeem/${rustTeamId}`)
            .send({
                staffPassId: "STAFF_H123804820G",
                teamId: rustTeamId,
            })
            .expect(400)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["success"]).equal(false);
            });
    });

    it("[/redeem]: PUT Redeem with a valid staffPassId", async function () {
        return agent
            .put(`/redeem/${rustTeamId}`)
            .send({
                staffPassId: "MANAGER_T999888420B",
                teamId: rustTeamId,
            })
            .expect(200)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["success"]).equal(true);
            });
    });

    it("[/redeem/:teamId]: GET a team's eligibility to redeem after redemption", async function () {
        return agent
            .get(`/redeem/${rustTeamId}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["canRedeem"]).equal(false);
            });
    });

    it("[/redeem]: PUT Redeem with the same staffPassId after redemption", async function () {
        return agent
            .put(`/redeem/${rustTeamId}`)
            .send({
                staffPassId: "MANAGER_T999888420B",
                teamId: rustTeamId,
            })
            .expect(400)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["success"]).equal(false);
            });
    });

    it("[/redeem]: PUT Redeem with a different staffPassId belonging to the same team", async function () {
        return agent
            .put(`/redeem/${rustTeamId}`)
            .send({
                staffPassId: "BOSS_T000000001P",
                teamId: rustTeamId,
            })
            .expect(400)
            .expect("Content-Type", /json/)
            .then((response) => {
                return expect(response.body["success"]).equal(false);
            });
    });

    after((done) => {
        server.close();
        done();
    });
});
