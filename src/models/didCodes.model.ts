import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { iDidCodeAsset } from '@interfaces/didCode.interface';

// Some attributes are optional
export type tDidCodeCreationAttributes = Optional<iDidCodeAsset, 'id'>;

export class DidCodeModel extends Model<iDidCodeAsset, tDidCodeCreationAttributes> implements iDidCodeAsset {
  public id: number;
  public did: string;
  public code: string;
  public asset: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof DidCodeModel {
  DidCodeModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      did: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      asset: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'didCodes',
      sequelize,
    },
  );

  return DidCodeModel;
}
