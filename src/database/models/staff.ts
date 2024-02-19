import {
    Association,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    DataTypes,
    ForeignKey,
    Model,
    Sequelize,
} from "sequelize";
import Team from "./team";

export default class Staff extends Model {
    declare id: string;
    declare teamId: ForeignKey<number>;
    declare team: Team;
    declare createdAt: number;

    declare createTeam: HasOneCreateAssociationMixin<Team>;
    declare getTeam: HasOneGetAssociationMixin<Team>;
    declare setTeam: HasOneSetAssociationMixin<Team, number>;

    declare static associations: {
        team: Association<Staff, Team>;
    };

    public static initialize(sequelize: Sequelize) {
        Staff.init(
            {
                id: {
                    type: DataTypes.STRING,
                    unique: true,
                    primaryKey: true,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.BIGINT,
                },
            },
            { sequelize: sequelize, timestamps: false }
        );
    }
}
