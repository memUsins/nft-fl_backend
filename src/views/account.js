import Account from "./../classes/account.js";

export default async (fastify, options) => {
    fastify.get('/', async (req, reply) => {
        await Account.getAll()
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.get('/:address', async (req, reply) => {
        await Account.getOneByAddress(req.params)
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });

    fastify.post('/create', async (req, reply) => {
        await Account.create(req.body)
            .then(res => {
                console.log(res);
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });
}