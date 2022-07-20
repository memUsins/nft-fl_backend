import Password from "./../classes/password.js";

export default async (fastify, options) => {
    fastify.get('/', async (req, reply) => {
        await Password.getAll()
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.get('/:password', async (req, reply) => {
        await Password.getOneByAddress(req.params)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.get('/check/:password', async (req, reply) => {
        await Password.checkPassword(req.params)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.post('/create', async (req, reply) => {
        await Password.create(req.body)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.post('/activate', async (req, reply) => {
        await Password.activate(req.body)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.post('/checkCount', async (req, reply) => {
        await Password.checkCount(req.body)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

}