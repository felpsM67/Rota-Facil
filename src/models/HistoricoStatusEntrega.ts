import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface HistoricoStatusEntregaAttributes {
  id: number;
  entregaId: number;
  alteradoPorUserId?: number;
  statusAnterior?: string;
  novoStatus: string;
  motivo?: string;
  alteradoEm: Date;
}

interface HistoricoStatusEntregaCreationAttributes
  extends Optional<HistoricoStatusEntregaAttributes, "id" | "alteradoEm"> {}

export class HistoricoStatusEntrega
  extends Model<
    HistoricoStatusEntregaAttributes,
    HistoricoStatusEntregaCreationAttributes
    >
  implements HistoricoStatusEntregaAttributes
{
  declare id: number;
  declare entregaId: number;
  declare alteradoPorUserId: number;
  declare statusAnterior: string;
  declare novoStatus: string;
  declare motivo: string;
  declare alteradoEm: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

HistoricoStatusEntrega.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entregaId: { type: DataTypes.INTEGER, allowNull: false },
    alteradoPorUserId: { type: DataTypes.INTEGER, allowNull: true },
    statusAnterior: { type: DataTypes.STRING(30), allowNull: true },
    novoStatus: { type: DataTypes.STRING(30), allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: true },
    alteradoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "HistoricoStatusEntrega",
    tableName: "historico_status_entrega",
    timestamps: true,
    indexes: [{ fields: ["entregaId"] }],
  }
);

export default HistoricoStatusEntrega;