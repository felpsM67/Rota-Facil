import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type TipoDespesa = "COMBUSTIVEL" | "PEDAGIO" | "ESTACIONAMENTO" | "MANUTENCAO" | "OUTRA";

interface DespesaRotaAttributes {
  id: number;
  rotaId: number;
  tipo: TipoDespesa;
  valor: number;
  descricao?: string;
  dataDespesa: Date;
}

interface DespesaRotaCreationAttributes
  extends Optional<DespesaRotaAttributes, "id" | "dataDespesa"> {}

export class DespesaRota
  extends Model<DespesaRotaAttributes, DespesaRotaCreationAttributes>
  implements DespesaRotaAttributes
{
  declare id: number;
  declare rotaId: number;
  declare tipo: TipoDespesa;
  declare valor: number;
  declare descricao: string;
  declare dataDespesa: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DespesaRota.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rotaId: { type: DataTypes.INTEGER, allowNull: false },
    tipo: {
      type: DataTypes.ENUM(
        "COMBUSTIVEL",
        "PEDAGIO",
        "ESTACIONAMENTO",
        "MANUTENCAO",
        "OUTRA"
      ),
      allowNull: false,
    },
    valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    descricao: { type: DataTypes.STRING(255), allowNull: true },
    dataDespesa: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "DespesaRota",
    tableName: "despesas_rota",
    timestamps: true,
    indexes: [{ fields: ["rotaId"] }],
  }
);

export default DespesaRota;