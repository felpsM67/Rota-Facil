import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

// Interface com todos os atributos da tabela
interface UserAttributes {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  role: "ADMIN" | "OPERADOR" | "ENTREGADOR";
  ativo: boolean;
}

// Ao criar um novo usuário, id e ativo são opcionais
// (id é gerado pelo banco, ativo tem valor padrão)
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "ativo"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare nome: string;
  declare email: string;
  declare senhaHash: string;
  declare role: "ADMIN" | "OPERADOR" | "ENTREGADOR";
  declare ativo: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "OPERADOR", "ENTREGADOR"),
      allowNull: false,
      defaultValue: "OPERADOR",
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;