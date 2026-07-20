import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type ResultadoTentativa =
  | "ENTREGUE"
  | "CLIENTE_AUSENTE"
  | "ENDERECO_INCORRETO"
  | "RECUSADA"
  | "LOCAL_FECHADO"
  | "PROBLEMA_VEICULO"
  | "OUTRO";

interface TentativaEntregaAttributes {
  id: number;
  entregaId: number;
  entregadorId?: number;
  paradaRotaId?: number;
  resultado: ResultadoTentativa;
  tentadoEm: Date;
  motivoFalha?: string;
  latitude?: number;
  longitude?: number;
  observacao?: string;
}

interface TentativaEntregaCreationAttributes
  extends Optional<TentativaEntregaAttributes, "id" | "tentadoEm"> {}

export class TentativaEntrega
  extends Model<TentativaEntregaAttributes, TentativaEntregaCreationAttributes>
  implements TentativaEntregaAttributes
{
  declare id: number;
  declare entregaId: number;
  declare entregadorId: number;
  declare paradaRotaId: number;
  declare resultado: ResultadoTentativa;
  declare tentadoEm: Date;
  declare motivoFalha: string;
  declare latitude: number;
  declare longitude: number;
  declare observacao: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TentativaEntrega.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entregaId: { type: DataTypes.INTEGER, allowNull: false },
    entregadorId: { type: DataTypes.INTEGER, allowNull: true },
    paradaRotaId: { type: DataTypes.INTEGER, allowNull: true },
    resultado: {
      type: DataTypes.ENUM(
        "ENTREGUE",
        "CLIENTE_AUSENTE",
        "ENDERECO_INCORRETO",
        "RECUSADA",
        "LOCAL_FECHADO",
        "PROBLEMA_VEICULO",
        "OUTRO"
      ),
      allowNull: false,
    },
    tentadoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    motivoFalha: { type: DataTypes.STRING(255), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    observacao: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "TentativaEntrega",
    tableName: "tentativas_entrega",
    timestamps: true,
    indexes: [{ fields: ["entregaId"] }],
  }
);

export default TentativaEntrega;