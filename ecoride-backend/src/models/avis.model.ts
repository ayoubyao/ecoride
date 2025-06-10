import mongoose from "mongoose";

const avisSchema = new mongoose.Schema({
  utilisateur_id: { type: Number, required: true },
  covoiturage_id: { type: Number, required: true },
  note: { type: Number, required: true },
  commentaire: { type: String },
  date: { type: Date, default: Date.now },
  statut: { type: String, default: "en_attente" },
});

export default mongoose.model("Avis", avisSchema);
