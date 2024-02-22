import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /staff - Get the staff's team
 *
 * @param staffPassId Staff pass ID
 * @returns A record containing the staff's team
 */
async function getStaffTeam(
    staffPassId?: string
): Promise<Record<string, any>> {
    if (staffPassId === undefined) {
        return {
            exists: false,
            code: 400,
            message: "Please enter a Staff Pass ID",
        };
    }

    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });
    if (staff === null) {
        return {
            exists: false,
            code: 404,
            message: `Could not find Staff ${staffPassId}`,
        };
    } else if (staff.team === null || staff.team === undefined) {
        // it should never reach here
        return {
            exists: false,
            code: 400,
            message: `Staff ${staffPassId} does not belong to any team`,
        };
    }

    console.log(`[getStaffTeam]: ${JSON.stringify(staff)}`);
    return {
        exists: true,
        code: 200,
        teamId: staff.team.id,
        teamName: staff.team.name,
    };
}

export { getStaffTeam };
