import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateProject } from '../utils/projectValidation.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status && ['Planned', 'In Progress', 'Completed', 'On Hold'].includes(req.query.status)) query.status = req.query.status;
    if (req.query.search) {
      const safe = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [{ name: new RegExp(safe, 'i') }, { location: new RegExp(safe, 'i') }, { type: new RegExp(safe, 'i') }];
    }
    const projects = await Project.find(query).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { errors, value } = validateProject(req.body);
    if (errors.length) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    const project = await Project.create({ ...value, createdBy: req.user._id });
    res.status(201).json({ project });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
    const { errors, value } = validateProject(req.body);
    if (errors.length) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    const project = await Project.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;
