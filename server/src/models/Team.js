import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  ownerName: { type: String, trim: true, default: '' },
  managerName: { type: String, trim: true, default: '' },
  logo: { type: String, default: '' },
  players: {
    type: [{ type: String, trim: true }],
    validate: [arr => arr.length <= 6, 'A team can have at most 6 players']
  }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
