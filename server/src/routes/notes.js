import { db } from '../db/index.js';

export async function noteRoutes(fastify, options) {
  // POST /notes/upload
  fastify.post('/notes/upload', async (request, reply) => {
    let noteData = {};

    // Check if multipart upload or JSON body
    if (request.isMultipart()) {
      const data = await request.file();
      const fields = {};
      for (const key in data.fields) {
        fields[key] = data.fields[key].value;
      }
      noteData = {
        userId: fields.userId || 'usr-demo',
        subjectId: fields.subjectId || 'sub-mit-cs201',
        filename: data.filename || 'uploaded_note.pdf',
        originalName: data.filename || 'uploaded_note.pdf',
        classificationMethod: fields.classificationMethod || 'manual-tag',
        summary: fields.summary || 'Uploaded study note.',
        tags: fields.tags || 'notes,study'
      };
    } else {
      const body = request.body || {};
      noteData = {
        userId: body.userId || 'usr-demo',
        subjectId: body.subjectId || 'sub-mit-cs201',
        filename: body.filename || 'sample_note.pdf',
        originalName: body.originalName || body.filename || 'sample_note.pdf',
        classificationMethod: body.classificationMethod || 'manual-tag',
        summary: body.summary || 'Uploaded study note.',
        tags: body.tags || 'notes'
      };
    }

    const noteId = 'note-' + Date.now();
    const uploadDate = new Date().toISOString();

    db.prepare(`
      INSERT INTO notes (id, user_id, subject_id, filename, original_name, upload_date, classification_method, summary, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      noteId,
      noteData.userId,
      noteData.subjectId,
      noteData.filename,
      noteData.originalName,
      uploadDate,
      noteData.classificationMethod,
      noteData.summary,
      noteData.tags
    );

    const createdNote = db.prepare(`
      SELECT n.*, s.name as subject_name, s.subject_code, u.name as uploader_name
      FROM notes n
      LEFT JOIN subjects s ON n.subject_id = s.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = ?
    `).get(noteId);

    return reply.status(201).send({
      status: 'success',
      message: 'Note uploaded successfully',
      note: createdNote
    });
  });

  // GET /notes (all notes)
  fastify.get('/notes', async (request, reply) => {
    const notes = db.prepare(`
      SELECT n.*, s.name as subject_name, s.subject_code, u.name as uploader_name
      FROM notes n
      LEFT JOIN subjects s ON n.subject_id = s.id
      LEFT JOIN users u ON n.user_id = u.id
      ORDER BY n.upload_date DESC
    `).all();

    return {
      status: 'success',
      count: notes.length,
      notes
    };
  });

  // GET /notes/:subjectId
  fastify.get('/notes/:subjectId', async (request, reply) => {
    const { subjectId } = request.params;

    const notes = db.prepare(`
      SELECT n.*, s.name as subject_name, s.subject_code, u.name as uploader_name
      FROM notes n
      LEFT JOIN subjects s ON n.subject_id = s.id
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.subject_id = ?
      ORDER BY n.upload_date DESC
    `).all(subjectId);

    return {
      status: 'success',
      subjectId,
      notes
    };
  });
}
