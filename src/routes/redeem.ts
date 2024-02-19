import { Router } from "express";
import { getEligibility, updateRedemption } from "../contollers/redeem";

const redeemRouter = Router();

redeemRouter
    .route("/redeem")
    .get(async (req, res, next) => {
        const params = req.params as Record<string, any>;
        const staffPassId = params["staffPassId"];
        getEligibility(staffPassId)
            .then((eligibility) => res.status(200).send(eligibility))
            .finally(next);
    })
    .put(async (req, res, next) => {
        const params = req.params as Record<string, any>;
        const staffPassId = params["staffPassId"];
        const teamId = params["teamId"];
        updateRedemption(staffPassId, teamId)
            .then((updated) => res.status(200).send(updated))
            .finally(next);
    });

export default redeemRouter;
