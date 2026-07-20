import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type StatusParada =
  | "PENDENTE"
  | "EM_DESLOCAMENTO"
  | "CONCLUIDA"
  | "FALHOU"
  | "CANCELADA";

interface ParadaRotaAttributes {
  id: number;
  rotaId: number;
  entregaId: number;
  sequencia: number;
  status: StatusParada;
  chegadaPlanejada?: Date;
  chegadaReal?: Date;
  concluidaEm?: Date;
  distanciaAnteriorKm?: number;
  duracaoAnteriorMinutos?: number;
}

interface ParadaRotaCreationAttributes
  extends Optional<ParadaRotaAttributes, "id" | "status"> {}

export class ParadaRota
  extends Model<ParadaRotaAttributes, ParadaRotaCreationAttributes>
  implements ParadaRotaAttributes
{
  declare id: number;
  declare rotaId: number;
  declare entregaId: number;
  declare sequencia: number;
  declare status: StatusParada;
  declare chegadaPlanejada: Date;
  declare chegadaReal: Date;
  declare concluidaEm: Date;
  declare distanciaAnteriorKm: number;
  declare duracaoAnteriorMinutos: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ParadaRota.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rotaId: { type: DataTypes.INTEGER, allowNull: false },
    entregaId: { type: DataTypes.INTEGER, allowNull: false },
    sequencia: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "PENDENTE",
        "EM_DESLOCAMENTO",
        "CONCLUIDA",
        "FALHOU",
        "CANCELADA"
      ),
      allowNull: false,
      defaultValue: "PENDENTE",
    },
    chegadaPlanejada: { type: DataTypes.DATE, allowNull: true },
    chegadaReal: { type: DataTypes.DATE, allowNull: true },
    concluidaEm: { type: DataTypes.DATE, allowNull: true },
    distanciaAnteriorKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    duracaoAnteriorMinutos: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "ParadaRota",
    tableName: "paradas_rota",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["rotaId", "sequencia"] }, // impede ordem duplicada na mesma rota
    ],
  }
);

export default ParadaRota;