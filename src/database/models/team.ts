import {
    Association,
    DataTypes,
    ForeignKey,
    HasOneCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    Model,
    Sequelize,
} from "sequelize";
import Staff from "./staff";

export default class Team extends Model {
    declare id: number;
    declare name: string;
    declare redeemed: boolean;
    declare redeemerId: ForeignKey<string>;
    declare redeemer: Staff;
    declare redeemedAt: Date;

    declare createStaff: HasOneCreateAssociationMixin<Staff>;
    declare getStaff: HasOneGetAssociationMixin<Staff>;
    declare setStaff: HasOneSetAssociationMixin<Staff, number>;

    declare static associations: {
        staffs: Association<Team, Staff>;
    };

    public static initialize(sequelize: Sequelize) {
        Team.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    unique: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                redeemed: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                redeemedAt: {
                    type: DataTypes.DATE,
                },
            },
            { sequelize: sequelize, timestamps: false }
        );

        sequelize.addHook("afterUpdate", (instance: Team) => {
            instance.update({
                redeemedAt: sequelize.fn("NOW"),
            });
        });
    }
}
