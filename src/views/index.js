import response from "./../utils/response.js";
import errorConfig from "./../utils/errorConfig.js";

export default async (fastify, options) => {
    fastify.get('/', async (request, reply) => {
        reply.send(response(false, errorConfig.METHOD_NOT_SELECTED), 500);
    })
}