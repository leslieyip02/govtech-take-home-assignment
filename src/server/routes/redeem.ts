import { Router } from "express";
import { getRedeemability, updateRedemption } from "../controllers/redeem";

const redeemRouter = Router();
redeemRouter
    .route("/redeem/:teamId")
    .get(async (req, res, next) => {
        console.log(`[/redeem]: GET ${JSON.stringify(req.params)}`);
        const params = req.params as Record<string, any>;
        const teamId = params["teamId"];
        getRedeemability(teamId)
            .then((redeemability) => {
                const code = redeemability["canRedeem"] ? 200 : 400;
                res.status(code).json(redeemability);
            })
            .finally(next);
    })
    .put(async (req, res, next) => {
        console.log(`[/redeem]: PUT ${JSON.stringify(req.body)}`);
        const body = req.body as Record<string, any>;
        const staffPassId = body["staffPassId"];
        const teamId = body["teamId"];
        updateRedemption(staffPassId, teamId)
            .then((updated) => res.status(200).json(updated))
            .finally(next);
    });

export default redeemRouter;
