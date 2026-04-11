import { check, param, validationResult } from 'express-validator';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateProjectId = [
  param('id').isInt({ min: 1 }).withMessage('ID de projet invalide. Doit être un entier positif.'),
  validateResult
];

export const validateProjectCreation = [
  check('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 100 }).escape(),
  check('description').trim().notEmpty().withMessage('La description est requise').escape(),
  check('created_by').trim().notEmpty().withMessage('Le créateur est requis').isLength({ max: 50 }).escape(),
  check('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Priorité invalide'),
  check('status').optional().isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).withMessage('Statut invalide'),
  check('category').optional({ nullable: true }).trim().escape(),
  check('technologies').optional({ nullable: true }).trim().escape(),
  check('start_date').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Format de date de début invalide'),
  check('end_date').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Format de date de fin invalide'),
  check('budget').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Le budget doit être un nombre positif'),
  validateResult
];

export const validateProjectUpdate = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  check('title').optional().trim().notEmpty().withMessage('Le titre ne peut pas être vide').isLength({ max: 100 }).escape(),
  check('description').optional().trim().notEmpty().escape(),
  check('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Priorité invalide'),
  check('category').optional({ nullable: true }).trim().escape(),
  check('technologies').optional({ nullable: true }).trim().escape(),
  check('start_date').optional({ checkFalsy: true }).isISO8601().toDate(),
  check('end_date').optional({ checkFalsy: true }).isISO8601().toDate(),
  check('budget').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  check('progress').optional({ checkFalsy: true }).isInt({ min: 0, max: 100 }).withMessage('La progression doit être entre 0 et 100'),
  validateResult
];

export const validateProjectStatus = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  check('status').isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).withMessage('Statut invalide'),
  validateResult
];
