import User from "./User";
import Cliente from "./Cliente";
import Entregador from "./Entregador";
import Veiculo from "./Veiculo";
import Entrega from "./Entrega";
import Rota from "./Rota";
import ParadaRota from "./ParadaRota";
import HistoricoStatusEntrega from "./HistoricoStatusEntrega";
import TentativaEntrega from "./TentativaEntrega";
import DespesaRota from "./DespesaRota";

export function registrarAssociacoes() {
  // User <-> Cliente
  User.hasMany(Cliente, { foreignKey: "userId" });
  Cliente.belongsTo(User, { foreignKey: "userId" });

  // User <-> Entregador
  User.hasMany(Entregador, { foreignKey: "userId" });
  Entregador.belongsTo(User, { foreignKey: "userId" });

  // User <-> Veiculo
  User.hasMany(Veiculo, { foreignKey: "userId" });
  Veiculo.belongsTo(User, { foreignKey: "userId" });

  // User <-> Entrega
  User.hasMany(Entrega, { foreignKey: "userId" });
  Entrega.belongsTo(User, { foreignKey: "userId" });

  // User <-> Rota
  User.hasMany(Rota, { foreignKey: "userId" });
  Rota.belongsTo(User, { foreignKey: "userId" });

  // Cliente <-> Entrega
  Cliente.hasMany(Entrega, { foreignKey: "clienteId" });
  Entrega.belongsTo(Cliente, { foreignKey: "clienteId" });

  // Entregador <-> Veiculo
  Entregador.hasMany(Veiculo, { foreignKey: "entregadorId" });
  Veiculo.belongsTo(Entregador, { foreignKey: "entregadorId" });

  // Entregador <-> Rota
  Entregador.hasMany(Rota, { foreignKey: "entregadorId" });
  Rota.belongsTo(Entregador, { foreignKey: "entregadorId" });

  // Veiculo <-> Rota
  Veiculo.hasMany(Rota, { foreignKey: "veiculoId" });
  Rota.belongsTo(Veiculo, { foreignKey: "veiculoId" });

  // Rota <-> ParadaRota
  Rota.hasMany(ParadaRota, { foreignKey: "rotaId" });
  ParadaRota.belongsTo(Rota, { foreignKey: "rotaId" });

  // Entrega <-> ParadaRota
  Entrega.hasMany(ParadaRota, { foreignKey: "entregaId" });
  ParadaRota.belongsTo(Entrega, { foreignKey: "entregaId" });

  // Entrega <-> HistoricoStatusEntrega
  Entrega.hasMany(HistoricoStatusEntrega, { foreignKey: "entregaId" });
  HistoricoStatusEntrega.belongsTo(Entrega, { foreignKey: "entregaId" });

  // Entrega <-> TentativaEntrega
  Entrega.hasMany(TentativaEntrega, { foreignKey: "entregaId" });
  TentativaEntrega.belongsTo(Entrega, { foreignKey: "entregaId" });

  // Entregador <-> TentativaEntrega
  Entregador.hasMany(TentativaEntrega, { foreignKey: "entregadorId" });
  TentativaEntrega.belongsTo(Entregador, { foreignKey: "entregadorId" });

  // ParadaRota <-> TentativaEntrega
  ParadaRota.hasMany(TentativaEntrega, { foreignKey: "paradaRotaId" });
  TentativaEntrega.belongsTo(ParadaRota, { foreignKey: "paradaRotaId" });

  // Rota <-> DespesaRota
  Rota.hasMany(DespesaRota, { foreignKey: "rotaId" });
  DespesaRota.belongsTo(Rota, { foreignKey: "rotaId" });
}