import { Router } from 'express';
import auth from '../middleware/auth.js';
import Match from '../models/Match.js';

const router = Router();
router.use(auth);

function startFor(period) {
  const now = new Date();
  if (period === 'week') { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
}

router.get('/summary', async (req, res, next) => {
  try {
    const start = startFor(req.query.period || 'all');
    const query = { manager: req.userId, ...(start ? { createdAt: { $gte: start } } : {}) };
    const matches = await Match.find(query).lean();
    const totalKills = matches.reduce((sum, m) => sum + m.players.reduce((s, p) => s + p.kills, 0), 0);
    const placements = matches.map(m => m.position);
    const placementAvg = placements.length ? placements.reduce((a,b) => a+b, 0) / placements.length : 0;
    const wins = matches.filter(m => m.position === 1).length;
    const topFive = matches.filter(m => m.position <= 5).length;
    const podiums = matches.filter(m => m.position <= 3).length;
    const chart = matches.slice().reverse().map((m, i) => ({
      match: `Match ${i + 1}`, kills: m.players.reduce((s,p) => s + p.kills, 0), placement: m.position,
      topFive: m.position <= 5 ? 1 : 0, win: m.position === 1 ? 1 : 0,
      date: m.createdAt
    }));
    res.json({ matches: matches.length, kills: totalKills, avgKills: matches.length ? totalKills / matches.length : 0,
      avgPlacement: placementAvg, wins, topFive, podiums,
      winRate: matches.length ? wins / matches.length * 100 : 0, chart });
  } catch (e) { next(e); }
});

router.get('/player-history', async (req, res, next) => {
  try {
    const playerName = String(req.query.player || '').trim();
    if (!playerName) return res.status(400).json({ message: 'Player name is required.' });
    const start = startFor(req.query.period || 'all');
    const matches = await Match.find({
      manager: req.userId,
      ...(start ? { createdAt: { $gte: start } } : {}),
      'players.name': playerName
    }).sort({ createdAt: 1 }).lean();

    const history = matches.map((match, index) => {
      const player = match.players.find(p => p.name === playerName);
      return {
        match: `Match ${index + 1}`,
        kills: player?.kills || 0,
        placement: match.position,
        matchType: match.matchType,
        map: match.map,
        date: match.createdAt
      };
    });
    res.json({ player: playerName, history });
  } catch (e) { next(e); }
});

router.get('/players', async (req, res, next) => {
  try {
    const start = startFor(req.query.period || 'all');
    const matches = await Match.find({ manager: req.userId, ...(start ? { createdAt: { $gte: start } } : {}) }).lean();
    const byPlayer = new Map();
    matches.forEach(match => match.players.forEach(player => {
      const current = byPlayer.get(player.name) || { name: player.name, kills: 0, matches: 0 };
      current.kills += player.kills; current.matches += 1; byPlayer.set(player.name, current);
    }));
    const players = [...byPlayer.values()].map(p => ({ ...p, avgKills: p.matches ? p.kills / p.matches : 0 }))
      .sort((a,b) => b.kills - a.kills);
    res.json({ players });
  } catch (e) { next(e); }
});

export default router;
