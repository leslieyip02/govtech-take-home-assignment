import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /redeem - Check if a team can redeem
 *
 * @param teamId Team's ID
 * @returns A record containing the team's redeemability
 */
async function getRedeemability(teamId: number): Promise<Record<string, any>> {
    const team = await Team.findByPk(teamId);
    if (team === null) {
        return {
            canRedeem: false,
            code: 404,
            message: "Team does not exist",
        };
    }

    console.log(`[team]: ${JSON.stringify(team)}`);
    if (team.redeemed) {
        // if the gift is already redeemed,
        // return timestamp to inform user of when it was redeemed
        return {
            canRedeem: false,
            code: 200,
            message: `Gift was redeeemed on ${team.redeemedAt.toLocaleString()}`,
        };
    } else {
        // if can redeem, return the team name
        // and ask for confirmation of redemption
        return {
            canRedeem: true,
            code: 200,
            teamName: team.name,
        };
    }
}

/**
 * PUT /redeem - Update redemption table
 *
 * @param staffPassId Staff pass ID
 * @param teamId Team's ID
 * @returns A record containing the result of the redemption
 */
async function updateRedemption(
    staffPassId: number,
    teamId: number
): Promise<Record<string, any>> {
    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });

    if (staff === null) {
        return {
            success: false,
            code: 404,
            message: `Could not find Staff ${staffPassId}`,
        };
    } else if (staff.team === null || staff.team === undefined) {
        // it should never reach
        return {
            success: false,
            code: 400,
            message: `Staff ${staffPassId} does not belong to any team`,
        };
    }

    console.log(`[updateRedemption]: ${JSON.stringify(staff)}`);
    if (staff.team.id != teamId) {
        return {
            success: false,
            code: 400,
            message: `Staff does not belong to team ${teamId}`,
        };
    } else if (staff.team.redeemed) {
        return {
            success: false,
            code: 400,
            message: `Gift was redeeemed on ${staff.team.redeemedAt.toLocaleString()}`,
        };
    }

    const updatedTeam = await staff.team.update({
        redeemerId: staffPassId,
        redeemed: true,
    });

    console.log(`[updateRedemption]: ${JSON.stringify(updatedTeam)}`);
    if (updatedTeam === undefined) {
        return {
            success: false,
            code: 500,
            message: "Could not update database",
        };
    } else {
        return {
            success: true,
            code: 200,
            message: "Successfully redeemed!",
        };
    }
}

export { getRedeemability, updateRedemption };
