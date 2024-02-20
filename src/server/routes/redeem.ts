import { Router } from "express";
import { getEligibility, updateRedemption } from "../controllers/redeem";

const redeemRouter = Router();

redeemRouter
    .route("/redeem/:staffPassId")
    .get(async (req, res, next) => {
        console.log(`[redeem]: GET ${JSON.stringify(req.params)}`);
        const params = req.params as Record<string, any>;
        const staffPassId = params["staffPassId"];
        getEligibility(staffPassId)
            .then((eligibility) => {
                const code = eligibility["canRedeem"] ? 200 : 400;
                res.status(code).json(eligibility);
            })
            .finally(next);
    })
    .put(async (req, res, next) => {
        console.log(`[redeem]: PUT ${JSON.stringify(req.body)}`);
        const body = req.body as Record<string, any>;
        const staffPassId = body["staffPassId"];
        updateRedemption(staffPassId)
            .then((updated) => res.status(200).json(updated))
            .finally(next);
    });

export default redeemRouter;
