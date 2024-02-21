import { Router } from "express";

import { getStaffTeam } from "../controllers/staff";

const staffRouter = Router();
staffRouter.route("/staff/:staffPassId?").get(async (req, res, next) => {
    console.log(`[/staff]: GET ${JSON.stringify(req.params)}`);
    const params = req.params as Record<string, any>;
    const staffPassId = params["staffPassId"];
    getStaffTeam(staffPassId)
        .then((team) => {
            const code = team["exists"] ? 200 : 400;
            res.status(code).json(team);
        })
        .finally(next);
});

export default staffRouter;
