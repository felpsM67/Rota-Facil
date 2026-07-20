import sequelize from "./index";
import { registrarAssociacoes } from "../models/associations";

import "../models/User";
import "../models/Cliente";
import "../models/Entregador";
import "../models/Veiculo";
import "../models/Entrega";
import "../models/Rota";
import "../models/ParadaRota";
import "../models/HistoricoStatusEntrega";
import "../models/TentativaEntrega";
import "../models/DespesaRota";

async function sincronizar() {
  try {
    registrarAssociacoes();
    await sequelize.sync({ alter: true });
    console.log("Tabelas sincronizadas com sucesso.");
  } catch (error) {
    console.error("Erro ao sincronizar:", error);
  } finally {
    await sequelize.close();
  }
}

sincronizar();