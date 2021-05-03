import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { iIssuedCredentials } from '@interfaces/didCode.interface';

// Some attributes are optional
export type tOptionalIssuedCredentials = Optional<iIssuedCredentials, 'id'>;

export class IssuedCredentialsModel extends Model<iIssuedCredentials, tOptionalIssuedCredentials> implements iIssuedCredentials {
  public id: number;
  public did: string;
  public jwt: string;
  public type: string;
  public asset: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof IssuedCredentialsModel {
  IssuedCredentialsModel.init(
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
      jwt: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      asset: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'issuedCredentials',
      sequelize,
    },
  );

  return IssuedCredentialsModel;
}
