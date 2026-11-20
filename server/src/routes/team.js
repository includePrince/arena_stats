import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import Team from '../models/Team.js';

const router = Router();
router.use(auth);
const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype))
});
const cleanPlayers = (players) => Array.isArray(players) ? players.map(p => String(p).trim()).filter(Boolean) : [];

router.get('/', async (req, res, next) => {
  try { res.json(await Team.findOne({ manager: req.userId })); } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    if (await Team.exists({ manager: req.userId })) return res.status(409).json({ message: 'You already have a team.' });
    const players = cleanPlayers(req.body.players);
    if (!req.body.name?.trim()) return res.status(400).json({ message: 'Team name is required.' });
    if (!players.length || players.length > 6) return res.status(400).json({ message: 'Add between 1 and 6 players.' });
    const team = await Team.create({ ...req.body, players, manager: req.userId });
    res.status(201).json(team);
  } catch (e) { next(e); }
});

router.put('/', async (req, res, next) => {
  try {
    const players = cleanPlayers(req.body.players);
    if (!req.body.name?.trim() || !players.length || players.length > 6)
      return res.status(400).json({ message: 'Enter a team name and between 1 and 6 players.' });
    const team = await Team.findOneAndUpdate({ manager: req.userId }, {
      name: req.body.name, ownerName: req.body.ownerName || '',
      managerName: req.body.managerName || '', players
    }, { new: true, runValidators: true });
    if (!team) return res.status(404).json({ message: 'Create your team first.' });
    res.json(team);
  } catch (e) { next(e); }
});

router.post('/logo', upload.single('logo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose a PNG, JPG or WEBP image (max 3 MB).' });
    const team = await Team.findOneAndUpdate({ manager: req.userId }, { logo: `/uploads/${req.file.filename}` }, { new: true });
    if (!team) return res.status(404).json({ message: 'Create your team first.' });
    res.json(team);
  } catch (e) { next(e); }
});

export default router;
