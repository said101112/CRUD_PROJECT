import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

// On force PostgreSQL à pointer vers une BDD de test indépendante
// ASSUREZ-VOUS DE CRÉER CETTE BDD AVANT DE LANCER LES TESTS (CREATE DATABASE project_management_test;)
process.env.DB_NAME = 'project_management_test';

const { default: app } = await import('../app.js');
const { default: db } = await import('../config/db.js');

describe('Integration Tests - Véritable API & Base de données PostgreSQL', () => {

  // Hook d'initialisation : créer la table si elle n'existe pas
  beforeAll(async () => {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id            SERIAL PRIMARY KEY,
          title         VARCHAR(100) NOT NULL,
          description   TEXT NOT NULL,
          status        VARCHAR(20) DEFAULT 'TODO',
          priority      VARCHAR(10) DEFAULT 'MEDIUM',
          category      VARCHAR(50),
          technologies  TEXT,
          created_by    VARCHAR(50) NOT NULL,
          start_date    DATE,
          end_date      DATE,
          budget        DECIMAL(10,2),
          progress      INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
          created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.error("Impossible de se connecter ou de créer la table de test. Avez-vous créé 'project_management_test' ?");
      throw err;
    }
  });

  // Nettoyer physiquement la BDD des tests avant chaque exécution pour être dans un état isolé 100% propre
  beforeEach(async () => {
    await db.query('TRUNCATE projects RESTART IDENTITY CASCADE;');
  });

  describe('Cycle de vie complet C.R.U.D de Bout-en-Bout', () => {
    
    it('1. POST /api/projects - Devrait insérer un projet réel dans PostgreSQL', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          title: 'Intégration BDD',
          description: 'Véritable persistance',
          priority: 'CRITICAL',
          created_by: 'QA Auto'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Intégration BDD');
      const createdProjectId = res.body.id;
      
      // Vérification physique indépendante dans la BDD
      const dbCheck = await db.query('SELECT * FROM projects WHERE id = $1', [createdProjectId]);
      expect(dbCheck.rows[0].title).toBe('Intégration BDD');
    });

    it('2. GET /api/projects - Devrait récupérer la donnée persistée', async () => {
      await request(app).post('/api/projects').send({ title: 'GET Test', description: 'Desc', created_by: 'QA' });
      
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toBe('GET Test');
    });

    it('3. PUT /api/projects/:id - Devrait mettre à jour physiquement la ligne SQL', async () => {
      const init = await request(app).post('/api/projects').send({ title: 'Old Title', description: 'Old', created_by: 'QA' });
      const id = init.body.id;

      const res = await request(app)
        .put(`/api/projects/${id}`)
        .send({
          title: 'New Title',
          description: 'New Desc'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe('New Title');

      // Vérifier au format GET
      const dbCheck = await request(app).get(`/api/projects/${id}`);
      expect(dbCheck.body.title).toBe('New Title');
    });

    it('4. PATCH /api/projects/:id/status - Devrait isoler la modification de status SQL', async () => {
      const init = await request(app).post('/api/projects').send({ title: 'Status Switch', description: 'D', created_by: 'QA' });
      const id = init.body.id;

      const res = await request(app).patch(`/api/projects/${id}/status`).send({ status: 'DONE' });
      expect(res.statusCode).toEqual(200);

      const dbCheck = await db.query('SELECT status FROM projects WHERE id = $1', [id]);
      expect(dbCheck.rows[0].status).toBe('DONE');
    });

    it('5. DELETE /api/projects/:id - Devrait retirer indéfiniment la ligne PostgreSQL', async () => {
      const init = await request(app).post('/api/projects').send({ title: 'To Del', description: 'D', created_by: 'QA' });
      const id = init.body.id;

      expect((await request(app).get(`/api/projects/${id}`)).statusCode).toBe(200);

      // Exécuter SUPPRESSION REAL BDD
      const res = await request(app).delete(`/api/projects/${id}`);
      expect(res.statusCode).toEqual(204);

      // Valider via Route
      const fetchAfter = await request(app).get(`/api/projects/${id}`);
      expect(fetchAfter.statusCode).toBe(404);

      // Valider via Driver BDD
      const dbCheck = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
      expect(dbCheck.rows.length).toBe(0);
    });

  });
});
