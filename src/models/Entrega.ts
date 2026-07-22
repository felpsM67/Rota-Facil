import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

type Prioridade = "BAIXA" | "NORMAL" | "ALTA" | "URGENTE";
type StatusEntrega =
  | "PENDENTE"
  | "ATRIBUIDA"
  | "EM_ROTA"
  | "ENTREGUE"
  | "FALHOU"
  | "REAGENDADA"
  | "CANCELADA";

interface EntregaAttributes {
  id: number;
  codigoExterno?: string;
  clienteId?: number;
  userId: number;

  nomeCliente: string;
  telefoneCliente: string;

  rua: string;
  numero: string;
  bairro: string;
  cidade? : string;
  estado?: string;
  cep?: string;
  complemento?: string;
  latitude?: number;
  longitude?: number;

  prioridade: Prioridade;
  status: StatusEntrega;

  dataAgendada?: Date;
  inicioJanelaEntrega?: Date;
  fimJanelaEntrega?: Date;

  distanciaEstimadaKm?: number;
  duracaoEstimadaMinutos?: number;
  distanciaRealKm?: number;
  duracaoRealMinutos?: number;

  atribuidoEm?: Date;
  saiuParaEntregaEm?: Date;
  entregueEm?: Date;
  canceladoEm?: Date;

  motivoFalha?: string;
  observacao?: string;
}

interface EntregaCreationAttributes
  extends Optional<EntregaAttributes, "id" | "prioridade" | "status"> {}

export class Entrega
  extends Model<EntregaAttributes, EntregaCreationAttributes>
  implements EntregaAttributes
{
  declare id: number;
  declare codigoExterno: string;
  declare clienteId: number;
  declare userId: number;

  declare nomeCliente: string;
  declare telefoneCliente: string;

  declare rua: string;
  declare numero: string;
  declare bairro: string;
  declare cidade: string;
  declare estado: string;
  declare cep: string;
  declare complemento: string;
  declare latitude: number;
  declare longitude: number;

  declare prioridade: Prioridade;
  declare status: StatusEntrega;

  declare dataAgendada: Date;
  declare inicioJanelaEntrega: Date;
  declare fimJanelaEntrega: Date;

  declare distanciaEstimadaKm: number;
  declare duracaoEstimadaMinutos: number;
  declare distanciaRealKm: number;
  declare duracaoRealMinutos: number;

  declare atribuidoEm: Date;
  declare saiuParaEntregaEm: Date;
  declare entregueEm: Date;
  declare canceladoEm: Date;

  declare motivoFalha: string;
  declare observacao: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Entrega.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigoExterno: { type: DataTypes.STRING(50), allowNull: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },

    nomeCliente: { type: DataTypes.STRING(150), allowNull: false },
    telefoneCliente: { type: DataTypes.STRING(20), allowNull: true },

    rua: { type: DataTypes.STRING(150), allowNull: false },
    numero: { type: DataTypes.STRING(20), allowNull: true },
    bairro: { type: DataTypes.STRING(100), allowNull: true },
    cidade: { type: DataTypes.STRING(100), allowNull: true },
    estado: { type: DataTypes.STRING(2), allowNull: true },
    cep: { type: DataTypes.STRING(9), allowNull: true },
    complemento: { type: DataTypes.STRING(150), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

    prioridade: {
      type: DataTypes.ENUM("BAIXA", "NORMAL", "ALTA", "URGENTE"),
      allowNull: false,
      defaultValue: "NORMAL",
    },
    status: {
      type: DataTypes.ENUM(
        "PENDENTE",
        "ATRIBUIDA",
        "EM_ROTA",
        "ENTREGUE",
        "FALHOU",
        "REAGENDADA",
        "CANCELADA"
      ),
      allowNull: false,
      defaultValue: "PENDENTE",
    },

    dataAgendada: { type: DataTypes.DATEONLY, allowNull: true },
    inicioJanelaEntrega: { type: DataTypes.DATE, allowNull: true },
    fimJanelaEntrega: { type: DataTypes.DATE, allowNull: true },

    distanciaEstimadaKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    duracaoEstimadaMinutos: { type: DataTypes.INTEGER, allowNull: true },
    distanciaRealKm: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    duracaoRealMinutos: { type: DataTypes.INTEGER, allowNull: true },

    atribuidoEm: { type: DataTypes.DATE, allowNull: true },
    saiuParaEntregaEm: { type: DataTypes.DATE, allowNull: true },
    entregueEm: { type: DataTypes.DATE, allowNull: true },
    canceladoEm: { type: DataTypes.DATE, allowNull: true },

    motivoFalha: { type: DataTypes.STRING(255), allowNull: true },
    observacao: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Entrega",
    tableName: "entregas",
    timestamps: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["dataAgendada"] },
      { fields: ["bairro"] },
      { fields: ["clienteId"] },
    ],
  }
);

export default Entrega;