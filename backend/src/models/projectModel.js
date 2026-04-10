import db from '../config/db.js';

class ProjectModel {
  static async findAll() {
    const { rows } = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(projectData) {
    const { title, description, priority, category, technologies, created_by, start_date, end_date, budget } = projectData;
    
    const query = `
      INSERT INTO projects (title, description, priority, category, technologies, created_by, start_date, end_date, budget)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [title, description, priority, category, technologies, created_by, start_date, end_date, budget];
    
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, projectData) {
    const { title, description, priority, category, technologies, start_date, end_date, budget, progress } = projectData;
    
    const query = `
      UPDATE projects 
      SET title = $1, description = $2, priority = $3, category = $4, technologies = $5, start_date = $6, end_date = $7, budget = $8, progress = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *;
    `;
    const values = [title, description, priority, category, technologies, start_date, end_date, budget, progress, id];
    
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE projects
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await db.query('DELETE FROM projects WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

export default ProjectModel;
