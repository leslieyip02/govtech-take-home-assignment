import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /staff
 * Retrieves a team given a staff_pass_id,
 * and checks if the staff is eligible to claim
 */
async function getEligibility(
    staffPassId: number
): Promise<Record<string, any>> {
    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });

    if (staff === null) {
        return {
            canRedeem: false,
            message: "Staff does not exist",
        };
    } else if (staff.team === null || staff.team === undefined) {
        return {
            canRedeem: false,
            message: "Staff does not belong to any team",
        };
    }

    console.log(`[staff]: ${JSON.stringify(staff)}`);
    if (staff.team?.redeemed) {
        // if the gift is already redeemed,
        // return timestamp to inform user of when it was redeemed
        return {
            canRedeem: false,
            message: "Gift has already been redeeemed",
            redeemedAt: staff.team.redeemedAt,
        };
    } else {
        // if can redeem, return the team name
        // and ask for confirmation of redemption
        return {
            canRedeem: true,
            teamName: staff.team.name,
        };
    }
}

/**
 * PUT /team
 * Retrieves a team_id and team name given a staff_pass_id
 */
async function updateRedemption(
    staffPassId: number
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

    console.log(`[staff]: ${JSON.stringify(staff)}`);
    const updatedTeam = await staff.team.update({
        redeemed: true,
        redeemerId: staffPassId,
    });

    console.log(`[team]: ${JSON.stringify(updatedTeam)}`);
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

export { getEligibility, updateRedemption };
