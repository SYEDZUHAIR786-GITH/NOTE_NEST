import { db } from '../db/index.js';

export async function authRoutes(fastify, options) {
  // POST /auth/google
  fastify.post('/auth/google', async (request, reply) => {
    const { googleToken, email, name, collegeId, deptId } = request.body || {};

    // Mock Google Authentication / User Lookup & Create
    const userEmail = email || 'student@notenest.edu';
    const userName = name || 'Alex Rivera';

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail);

    if (!user) {
      const userId = 'usr-' + Date.now();
      const googleId = 'g-' + Math.floor(Math.random() * 1000000000);
      db.prepare(
        'INSERT INTO users (id, google_id, email, name, college_id, dept_id) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(userId, googleId, userEmail, userName, collegeId || 'col-mit', deptId || 'dept-mit-cs');

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    } else if (collegeId || deptId) {
      // Update college/dept if provided during onboarding
      db.prepare(
        'UPDATE users SET college_id = COALESCE(?, college_id), dept_id = COALESCE(?, dept_id) WHERE id = ?'
      ).run(collegeId, deptId, user.id);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    }

    return {
      status: 'success',
      token: 'mock-jwt-token-' + user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        collegeId: user.college_id,
        deptId: user.dept_id
      }
    };
  });
}
