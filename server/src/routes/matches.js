import { Router } from 'express';
import auth from '../middleware/auth.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try { res.json(await Match.find({ manager: req.userId }).sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const team = await Team.findOne({ manager: req.userId });
    if (!team) return res.status(400).json({ message: 'Create your team before adding matches.' });
    const { matchType, map, totalTeams, position, kills } = req.body;
    const total = Number(totalTeams), place = Number(position);
    if (!matchType?.trim() || !map?.trim() || !Number.isInteger(total) || total < 1 ||
        !Number.isInteger(place) || place < 1 || place > total)
      return res.status(400).json({ message: 'Enter a match type, map, valid team count and placement.' });
    if (!Array.isArray(kills) || kills.length !== team.players.length ||
        kills.some(k => !Number.isInteger(Number(k)) || Number(k) < 0))
      return res.status(400).json({ message: 'Enter a non-negative kill count for every player in the current roster.' });
    const match = await Match.create({
      manager: req.userId, matchType, map, totalTeams: total, position: place,
      players: team.players.map((name, i) => ({ name, kills: Number(kills[i]) }))
    });
    res.status(201).json(match);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Match.findOneAndDelete({ _id: req.params.id, manager: req.userId });
    if (!result) return res.status(404).json({ message: 'Match not found.' });
    res.json({ message: 'Match deleted.' });
  } catch (e) { next(e); }
});

export default router;
