import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  matchType: { type: String, required: true, trim: true },
  map: { type: String, required: true, trim: true },
  totalTeams: { type: Number, required: true, min: 1 },
  position: { type: Number, required: true, min: 1 },
  players: [{
    name: { type: String, required: true },
    kills: { type: Number, required: true, min: 0, default: 0 }
  }],
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
