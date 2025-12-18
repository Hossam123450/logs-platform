// backend/routes/alerts.js
import AlertService from '../services/alertService.js';
import { alertSchema } from '../schemas/alertSchema.js';

export default async function alertRoutes(fastify) {
  // GET /alerts → liste des alertes
  fastify.get('/alerts', async (request, reply) => {
    const filters = request.query || {};
    const alerts = await AlertService.getAlerts(filters);
    return alerts;
  });

  // GET /alerts/:id → une alerte
  fastify.get('/alerts/:id', async (request, reply) => {
    const alert = await AlertService.getAlertById(request.params.id);
    if (!alert) return reply.code(404).send({ message: 'Alert not found' });
    return alert;
  });

  // POST /alerts → créer une alerte
  fastify.post(
    '/alerts',
    { schema: alertSchema },
    async (request, reply) => {
      const alert = await AlertService.createAlert(request.body);
      return reply.code(201).send(alert);
    }
  );

  // PUT /alerts/:id → mettre à jour une alerte
  fastify.put(
    '/alerts/:id',
    { schema: alertSchema },
    async (request, reply) => {
      const updatedAlert = await AlertService.updateAlert(
        request.params.id,
        request.body
      );
      if (!updatedAlert)
        return reply.code(404).send({ message: 'Alert not found' });
      return updatedAlert;
    }
  );

  // DELETE /alerts/:id → supprimer une alerte
  fastify.delete('/alerts/:id', async (request, reply) => {
    const deleted = await AlertService.deleteAlert(request.params.id);
    if (!deleted)
      return reply.code(404).send({ message: 'Alert not found' });
    return reply.code(204).send();
  });
}
