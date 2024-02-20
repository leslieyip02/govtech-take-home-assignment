import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /redeem
 * Check if the team can redeem
 */
async function getRedeemability(teamId: number): Promise<Record<string, any>> {
    const team = await Team.findByPk(teamId);
    if (team === null) {
        return {
            canRedeem: false,
            message: "Team does not exist",
        };
    }

    console.log(`[team]: ${JSON.stringify(team)}`);
    if (team.redeemed) {
        // if the gift is already redeemed,
        // return timestamp to inform user of when it was redeemed
        return {
            canRedeem: false,
            message: "Gift has already been redeeemed",
            redeemedAt: team.redeemedAt,
        };
    } else {
        // if can redeem, return the team name
        // and ask for confirmation of redemption
        return {
            canRedeem: true,
            teamName: team.name,
        };
    }
}

/**
 * PUT /redeem
 * Update redemption table
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
            redeemed: false,
            message: "Staff does not exist",
        };
    } else if (staff.team === null || staff.team === undefined) {
        return {
            redeemed: false,
            message: "Staff does not belong to any team",
        };
    }

    console.log(`[updateRedemption]: ${JSON.stringify(staff)}`);
    if (staff.team.id != teamId) {
        return {
            redeemed: false,
            message: `Staff does not belong to team ${teamId}`,
        };
    }

    const updatedTeam = await staff.team.update({
        redeemerId: staffPassId,
        redeemed: true,
    });

    console.log(`[updateRedemption]: ${JSON.stringify(updatedTeam)}`);
    if (updatedTeam === undefined) {
        return {
            redeemed: false,
            message: "Could not update database",
        };
    } else {
        return {
            redeemed: true,
        };
    }
}

export { getRedeemability, updateRedemption };
