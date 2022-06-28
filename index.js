import config from "./src/utils/config.js";
import server from "./src/server.js";

server.init(config.PORT, config.MONGO_URL)
    .then(res => console.log(res))
    .catch(err => console.log(err));