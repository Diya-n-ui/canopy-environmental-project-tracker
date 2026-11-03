const allowedTypes = ['Afforestation', 'Restoration', 'Conservation', 'Waste Management', 'Renewable Energy', 'Other'];
const allowedStatuses = ['Planned', 'In Progress', 'Completed', 'On Hold'];

export function validateProject(input) {
  const errors = [];
  const name = String(input.name ?? '').trim();
  const type = String(input.type ?? '');
  const location = String(input.location ?? '').trim();
  const status = String(input.status ?? 'Planned');
  const treesPlanted = Number(input.treesPlanted);
  const targetTrees = Number(input.targetTrees);
  const startDate = input.startDate ? new Date(input.startDate) : null;
  const endDate = input.endDate ? new Date(input.endDate) : null;

  if (name.length < 2 || name.length > 120) errors.push('Project name must be 2–120 characters.');
  if (!allowedTypes.includes(type)) errors.push('Choose a valid project type.');
  if (location.length < 2 || location.length > 160) errors.push('Location must be 2–160 characters.');
  if (!allowedStatuses.includes(status)) errors.push('Choose a valid project status.');
  if (!Number.isFinite(treesPlanted) || treesPlanted < 0) errors.push('Trees planted must be a non-negative number.');
  if (!Number.isFinite(targetTrees) || targetTrees < 0) errors.push('Target trees must be a non-negative number.');
  if (Number.isFinite(treesPlanted) && Number.isFinite(targetTrees) && treesPlanted > targetTrees && targetTrees > 0) {
    errors.push('Trees planted cannot exceed target trees.');
  }
  if (!startDate || Number.isNaN(startDate.getTime())) errors.push('A valid start date is required.');
  if (endDate && Number.isNaN(endDate.getTime())) errors.push('End date must be valid.');
  if (startDate && endDate && endDate < startDate) errors.push('End date must be on or after start date.');
  if (String(input.description ?? '').length > 1000) errors.push('Description must be 1000 characters or fewer.');

  return {
    errors,
    value: { name, type, location, status, treesPlanted, targetTrees, startDate, endDate, description: String(input.description ?? '').trim() }
  };
}
