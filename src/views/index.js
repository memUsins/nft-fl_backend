import response from "./../utils/response.js";
import errorConfig from "./../utils/errorConfig.js";
import Server from "./../classes/server.js";

export default async (fastify, options) => {
    fastify.get('/', async (request, reply) => {
        reply.send(response(false, errorConfig.METHOD_NOT_SELECTED), 500);
    });

    fastify.get('/status', async (request, reply) => {
        await Server.getStatus()
            .then(res => {
                if (res.status) reply.code(200).send(res);
                else reply.code(500).send(res);
            })
            .catch(err => reply.code(500).send(err));
    });
}