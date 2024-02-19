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
    const canRedeem = !!staff?.team.redeemed;
    let response: Record<string, any> = {
        canRedeem: canRedeem,
    };

    // if the gift is already redeemed,
    // return timestamp to inform user of when it was redeemed
    if (staff?.team.redeemed) {
        response = {
            redeemedAt: staff.team.redeemedAt,
            ...response,
        };
    }

    // if can redeem, return the team name
    // and ask for confirmation of redemption
    if (canRedeem) {
        response = {
            teamName: staff.team.name,
            ...response,
        };
    }

    return response;
}

/**
 * PUT /team
 * Retrieves a team_id and team name given a staff_pass_id
 */
async function updateRedemption(
    staffPassId: number,
    teamId: number
): Promise<Record<string, any>> {
    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });

    let response: Record<string, any> = {
        redeemed: false,
    };

    // check that the staff actually belongs to the teams
    if (staff?.team.id === teamId) {
        const updatedTeam = await staff.team.update({
            redeemed: true,
            redeemerId: staffPassId,
        });
        response["redeemed"] = updatedTeam === undefined;
    }

    return response;
}

export { getEligibility, updateRedemption };
