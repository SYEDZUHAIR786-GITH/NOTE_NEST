import { db } from '../db/index.js';

export async function collegeRoutes(fastify, options) {
  // GET /colleges
  fastify.get('/colleges', async (request, reply) => {
    const colleges = db.prepare('SELECT * FROM colleges ORDER BY name ASC').all();
    return {
      status: 'success',
      colleges
    };
  });

  // GET /departments/:collegeId
  fastify.get('/departments/:collegeId', async (request, reply) => {
    const { collegeId } = request.params;
    const departments = db
      .prepare('SELECT * FROM departments WHERE college_id = ? ORDER BY name ASC')
      .all(collegeId);

    return {
      status: 'success',
      collegeId,
      departments
    };
  });

  // GET /subjects/:deptId
  fastify.get('/subjects/:deptId', async (request, reply) => {
    const { deptId } = request.params;
    const subjects = db
      .prepare('SELECT * FROM subjects WHERE dept_id = ? ORDER BY subject_code ASC')
      .all(deptId);

    return {
      status: 'success',
      deptId,
      subjects
    };
  });
}
