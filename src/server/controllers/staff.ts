import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /staff
 * Get the staff's team
 */
async function getStaffTeam(
    staffPassId?: number
): Promise<Record<string, any>> {
    if (staffPassId === undefined) {
        return {
            exists: false,
            message: "Please enter a Staff Pass ID",
        };
    }

    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });
    if (staff === null) {
        return {
            exists: false,
            message: `Could not find Staff ${staffPassId}`,
        };
    } else if (staff.team === null || staff.team === undefined) {
        return {
            exists: false,
            message: `Staff ${staffPassId} does not belong to any team`,
        };
    }

    console.log(`[getStaffTeam]: ${JSON.stringify(staff)}`);
    return {
        exists: true,
        teamId: staff.team.id,
        teamName: staff.team.name,
    };
}

export { getStaffTeam };
