import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface ClienteAttributes {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  complemento?: string;
  latitude?: number;
  longitude?: number;
  ativo: boolean;
  userId: number;
}

interface ClienteCreationAttributes
  extends Optional<ClienteAttributes, "id" | "ativo"> {}

export class Cliente
  extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes
{
  declare id: number;
  declare nome: string;
  declare telefone: string;
  declare email: string;
  declare rua: string;
  declare numero: string;
  declare bairro: string;
  declare cidade: string;
  declare estado: string;
  declare cep: string;
  declare complemento: string;
  declare latitude: number;
  declare longitude: number;
  declare ativo: boolean;
  declare userId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cliente.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(150), allowNull: false },
    telefone: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: true },
    rua: { type: DataTypes.STRING(150), allowNull: true },
    numero: { type: DataTypes.STRING(20), allowNull: true },
    bairro: { type: DataTypes.STRING(100), allowNull: true },
    cidade: { type: DataTypes.STRING(100), allowNull: true },
    estado: { type: DataTypes.STRING(2), allowNull: true },
    cep: { type: DataTypes.STRING(9), allowNull: true },
    complemento: { type: DataTypes.STRING(150), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "clientes",
    timestamps: true,
  }
);

export default Cliente;