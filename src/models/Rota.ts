import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type StatusRota = "PLANEJADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
type MetodoOtimizacao =
  | "MANUAL"
  | "DISTANCIA_SIMPLES"
  | "GOOGLE_ROUTES"
  | "OSRM"
  | "OTIMIZADA";

interface RotaAttributes {
  id: number;
  userId: number;
  entregadorId: number;
  veiculoId?: number;
  dataRota: string;
  status: StatusRota;
  metodoOtimizacao: MetodoOtimizacao;

  enderecoOrigem?: string;
  latitudeOrigem?: number;
  longitudeOrigem?: number;

  inicioPlanejado?: Date;
  fimPlanejado?: Date;
  inicioReal?: Date;
  fimReal?: Date;

  distanciaEstimadaKm?: number;
  duracaoEstimadaMinutos?: number;
  distanciaRealKm?: number;
  duracaoRealMinutos?: number;
}

interface RotaCreationAttributes
  extends Optional<RotaAttributes, "id" | "status" | "metodoOtimizacao"> {}

export class Rota
  extends Model<RotaAttributes, RotaCreationAttributes>
  implements RotaAttributes
{
  declare id: number;
  declare userId: number;
  declare entregadorId: number;
  declare veiculoId: number;
  declare dataRota: string;
  declare status: StatusRota;
  declare metodoOtimizacao: MetodoOtimizacao;

  declare enderecoOrigem: string;
  declare latitudeOrigem: number;
  declare longitudeOrigem: number;

  declare inicioPlanejado: Date;
  declare fimPlanejado: Date;
  declare inicioReal: Date;
  declare fimReal: Date;

  declare distanciaEstimadaKm: number;
  declare duracaoEstimadaMinutos: number;
  declare distanciaRealKm: number;
  declare duracaoRealMinutos: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Rota.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    entregadorId: { type: DataTypes.INTEGER, allowNull: false },
    veiculoId: { type: DataTypes.INTEGER, allowNull: true },
    dataRota: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("PLANEJADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"),
      allowNull: false,
      defaultValue: "PLANEJADA",
    },
    metodoOtimizacao: {
      type: DataTypes.ENUM(
        "MANUAL",
        "DISTANCIA_SIMPLES",
        "GOOGLE_ROUTES",
        "OSRM",
        "OTIMIZADA"
      ),
      allowNull: false,
      defaultValue: "DISTANCIA_SIMPLES",
    },

    enderecoOrigem: { type: DataTypes.STRING(255), allowNull: true },
    latitudeOrigem: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitudeOrigem: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

    inicioPlanejado: { type: DataTypes.DATE, allowNull: true },
    fimPlanejado: { type: DataTypes.DATE, allowNull: true },
    inicioReal: { type: DataTypes.DATE, allowNull: true },
    fimReal: { type: DataTypes.DATE, allowNull: true },

    distanciaEstimadaKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    duracaoEstimadaMinutos: { type: DataTypes.INTEGER, allowNull: true },
    distanciaRealKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    duracaoRealMinutos: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Rota",
    tableName: "rotas",
    timestamps: true,
    indexes: [{ fields: ["status"] }, { fields: ["dataRota"] }],
  }
);

export default Rota;