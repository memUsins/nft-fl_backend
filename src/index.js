import config from "./utils/config.js";
import server from "./server.js";

server.init(config.PORT, config.MONGO_URL)
    .then(res => console.log(res))
    .catch(err => console.log(err));