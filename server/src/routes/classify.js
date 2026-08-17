import { classifyNoteStub } from '../classification/index.js';

export async function classifyRoutes(fastify, options) {
  // POST /notes/classify
  fastify.post('/notes/classify', async (request, reply) => {
    const { filename, fileContent, subjectHint } = request.body || {};

    const classificationResult = await classifyNoteStub({
      filename: filename || 'document.pdf',
      fileContent: fileContent || '',
      subjectHint: subjectHint || null
    });

    return reply.send(classificationResult);
  });
}
