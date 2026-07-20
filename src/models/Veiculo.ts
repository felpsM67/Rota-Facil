import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type TipoVeiculo = "MOTO" | "CARRO" | "VAN" | "BICICLETA";

interface VeiculoAttributes {
  id: number;
  placa?: string;
  modelo?: string;
  tipo: TipoVeiculo;
  capacidadeEntregas: number;
  custoPorKm?: number;
  entregadorId?: number;
  userId: number;
  ativo: boolean;
}

interface VeiculoCreationAttributes
  extends Optional<VeiculoAttributes, "id" | "ativo"> {}

export class Veiculo
  extends Model<VeiculoAttributes, VeiculoCreationAttributes>
  implements VeiculoAttributes
{
  declare id: number;
  declare placa: string;
  declare modelo: string;
  declare tipo: TipoVeiculo;
  declare capacidadeEntregas: number;
  declare custoPorKm: number;
  declare entregadorId: number;
  declare userId: number;
  declare ativo: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Veiculo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    placa: { type: DataTypes.STRING(10), allowNull: true },
    modelo: { type: DataTypes.STRING(100), allowNull: true },
    tipo: {
      type: DataTypes.ENUM("MOTO", "CARRO", "VAN", "BICICLETA"),
      allowNull: false,
    },
    capacidadeEntregas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    custoPorKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    entregadorId: { type: DataTypes.INTEGER, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "Veiculo",
    tableName: "veiculos",
    timestamps: true,
  }
);

export default Veiculo;