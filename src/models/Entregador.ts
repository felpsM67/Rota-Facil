import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface EntregadorAttributes {
  id: number;
  nome: string;
  telefone: string;
  documento?: string;
  disponivel: boolean;
  ativo: boolean;
  userId?: number;
}

interface EntregadorCreationAttributes
  extends Optional<EntregadorAttributes, "id" | "disponivel" | "ativo"> {}

export class Entregador
  extends Model<EntregadorAttributes, EntregadorCreationAttributes>
  implements EntregadorAttributes
{
  declare id: number;
  declare nome: string;
  declare telefone: string;
  declare documento: string;
  declare disponivel: boolean;
  declare ativo: boolean;
  declare userId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Entregador.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(150), allowNull: false },
    telefone: { type: DataTypes.STRING(20), allowNull: false },
    documento: { type: DataTypes.STRING(20), allowNull: true },
    disponivel: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Entregador",
    tableName: "entregadores",
    timestamps: true,
  }
);

export default Entregador;