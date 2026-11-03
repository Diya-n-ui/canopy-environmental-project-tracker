import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Project from '../models/Project.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', async (_req, res, next) => {
  try {
    const projects = await Project.find().select('status treesPlanted targetTrees type createdAt startDate');
    const totalProjects = projects.length;
    const treesPlanted = projects.reduce((sum, p) => sum + p.treesPlanted, 0);
    const targetTrees = projects.reduce((sum, p) => sum + p.targetTrees, 0);
    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const byStatus = ['Planned', 'In Progress', 'Completed', 'On Hold'].map(status => ({
      name: status, value: projects.filter(p => p.status === status).length
    }));
    const byType = [...new Set(projects.map(p => p.type))].map(type => ({
      name: type, value: projects.filter(p => p.type === type).length
    }));
    const monthly = {};
    projects.forEach(p => {
      const key = new Date(p.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthly[key] = (monthly[key] || 0) + p.treesPlanted;
    });
    const treeTrend = Object.entries(monthly).map(([month, trees]) => ({ month, trees })).slice(-6);
    res.json({ summary: { totalProjects, treesPlanted, targetTrees, activeProjects, completedProjects, completionRate: totalProjects ? Math.round(completedProjects / totalProjects * 100) : 0 }, byStatus, byType, treeTrend });
  } catch (err) { next(err); }
});

export default router;
