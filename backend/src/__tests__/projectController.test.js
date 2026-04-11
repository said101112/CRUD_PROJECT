import request from 'supertest';
import { jest } from '@jest/globals';

// Configuration du mock complet du modèle AVANT l'importation de l'application
jest.unstable_mockModule('../models/projectModel.js', () => ({
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn()
  }
}));

// Import asynchrone indispensable pour s'assurer que les mocks prennent le pas avant le chargement des routes
const { default: app } = await import('../app.js');
const { default: ProjectModel } = await import('../models/projectModel.js');

describe('Projet API Endpoints (Tests exhaustifs C.R.U.D)', () => {

  const mockProject = {
    id: 1,
    title: 'Test Complet',
    description: 'Une description complète détaillée',
    status: 'TODO',
    priority: 'HIGH',
    category: 'Backend',
    technologies: 'Node, Jest',
    created_by: 'QA Ninja'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/projects - Récupération générale', () => {
    it('doit récupérer avec succès tous les projets (200)', async () => {
      ProjectModel.findAll.mockResolvedValue([mockProject]);
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Test Complet');
    });

    it('doit retourner une erreur serveur (500) quand la BDD plante', async () => {
      ProjectModel.findAll.mockRejectedValue(new Error('Erreur base de données mockée'));
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBe('Server error retrieving projects');
    });
  });

  describe('GET /api/projects/:id - Récupération par ID', () => {
    it('doit récupérer un projet existant (200)', async () => {
      ProjectModel.findById.mockResolvedValue(mockProject);
      const res = await request(app).get('/api/projects/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(1);
    });

    it('doit renvoyer 404 si le projet n\'existe pas', async () => {
      ProjectModel.findById.mockResolvedValue(null);
      const res = await request(app).get('/api/projects/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBe('Project not found');
    });

    it('doit renvoyer 400 (Bad Request) si l\'ID n\'est pas un nombre', async () => {
      const res = await request(app).get('/api/projects/invalid-id');
      expect(res.statusCode).toEqual(400); // Protégé par valiateProjectId
      expect(res.body.errors[0].msg).toBe('ID de projet invalide. Doit être un entier positif.');
    });
  });

  describe('POST /api/projects - Création', () => {
    it('doit créer un nouveau projet avec des données valides (201)', async () => {
      ProjectModel.create.mockResolvedValue(mockProject);
      const res = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Complet',
          description: 'Une description complète détaillée',
          priority: 'HIGH',
          created_by: 'QA Ninja'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(ProjectModel.create).toHaveBeenCalled();
      expect(res.body.title).toBe('Test Complet');
    });

    it('doit rejeter la création si le titre est vide (400) - Test de validation', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          description: 'Sans titre',
          created_by: 'QA'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'title' })
        ])
      );
    });
  });

  describe('PUT /api/projects/:id - Mise à jour complète', () => {
    it('doit mettre à jour un projet existant totalement (200)', async () => {
      ProjectModel.update.mockResolvedValue({ ...mockProject, title: 'Projet mis à jour' });
      const res = await request(app)
        .put('/api/projects/1')
        .send({
          title: 'Projet mis à jour',
          description: 'Suite a modification',
          priority: 'CRITICAL'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(ProjectModel.update).toHaveBeenCalled();
      expect(res.body.title).toBe('Projet mis à jour');
    });

    it('doit renvoyer 404 si on tente de mettre à jour un ID inexistant', async () => {
      ProjectModel.update.mockResolvedValue(null);
      const res = await request(app)
        .put('/api/projects/999')
        .send({ title: 'Test 404', description: 'desc' });
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PATCH /api/projects/:id/status - Validation spécifique du Statut', () => {
    it('doit changer le statut d\'un projet en "DONE" (200)', async () => {
      ProjectModel.updateStatus.mockResolvedValue({ ...mockProject, status: 'DONE' });
      const res = await request(app)
        .patch('/api/projects/1/status')
        .send({ status: 'DONE' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('DONE');
    });

    it('doit bloquer avec 400 si le statut fourni est introuvable/non-permis', async () => {
      const res = await request(app)
        .patch('/api/projects/1/status')
        .send({ status: 'FAUX_STATUT' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toBe('Statut invalide');
    });
  });

  describe('DELETE /api/projects/:id - Suppression', () => {
    it('doit supprimer un projet valablement (204)', async () => {
      ProjectModel.delete.mockResolvedValue(true);
      const res = await request(app).delete('/api/projects/1');
      expect(res.statusCode).toEqual(204);
    });

    it('doit renvoyer 404 lors de la tentative de suppression dun projet inexistant', async () => {
      ProjectModel.delete.mockResolvedValue(false);
      const res = await request(app).delete('/api/projects/999');
      expect(res.statusCode).toEqual(404);
    });
  });
});

