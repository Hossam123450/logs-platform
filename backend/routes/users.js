// backend/routes/users.js
import UserService from '../services/userService.js';
import { userSchema } from '../schemas/userSchema.js';

export default async function userRoutes(fastify) {
  // GET /users → liste des utilisateurs
  fastify.get('/users', async (request, reply) => {
    const users = await UserService.getUsers();
    return users;
  });

  // GET /users/:id → un utilisateur
  fastify.get('/users/:id', async (request, reply) => {
    const user = await UserService.getUserById(request.params.id);
    if (!user) return reply.code(404).send({ message: 'User not found' });
    return user;
  });

  // POST /users → créer un utilisateur
  fastify.post(
    '/users',
    { schema: userSchema },
    async (request, reply) => {
      const user = await UserService.createUser(request.body);
      return reply.code(201).send(user);
    }
  );

  // PUT /users/:id → mettre à jour un utilisateur
  fastify.put(
    '/users/:id',
    { schema: userSchema },
    async (request, reply) => {
      const updatedUser = await UserService.updateUser(
        request.params.id,
        request.body
      );
      if (!updatedUser)
        return reply.code(404).send({ message: 'User not found' });
      return updatedUser;
    }
  );

  // DELETE /users/:id → supprimer un utilisateur
  fastify.delete('/users/:id', async (request, reply) => {
    const deleted = await UserService.deleteUser(request.params.id);
    if (!deleted) return reply.code(404).send({ message: 'User not found' });
    return reply.code(204).send();
  });
}
