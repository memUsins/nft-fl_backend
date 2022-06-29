import Fastify from 'fastify';
import mainRoutes from "./views/index.js";
import accountRoutes from "./views/account.js";
import passwordRoutes from "./views/password.js";
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from "@fastify/cors";

// Init fastify driver
const fastify = Fastify();

export default {

    // Server start
    init: (port, url) => {
        return new Promise((resolve, reject) => {
            try {

                fastify.register(fastifyMultipart);
                fastify.register(fastifyCors)

                // Registration routes
                fastify.register(mainRoutes);
                fastify.register(accountRoutes, {
                    prefix: '/account'
                });
                fastify.register(passwordRoutes, {
                    prefix: '/password'
                });

                // Start
                fastify.listen(port, url)

                resolve({
                    status: true,
                    message: "Server is started"
                });
            } catch (error) {
                fastify.log.error(error)

                reject({
                    status: false,
                    message: error
                });
                process.exit(1)
            }
        })
    }
}