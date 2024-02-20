import Staff from "../database/models/staff";
import Team from "../database/models/team";

/**
 * GET /staff
 * Get the staff's team
 */
async function getStaffTeam(staffPassId: number): Promise<Record<string, any>> {
    const staff = await Staff.findByPk(staffPassId, {
        include: Team,
    });
    if (staff === null) {
        return {
            exists: false,
            message: "Staff does not exist",
        };
    } else if (staff.team === null || staff.team === undefined) {
        return {
            exists: false,
            message: "Staff does not belong to any team",
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
