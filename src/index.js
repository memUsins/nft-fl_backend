import config from "./utils/config.js";
import server from "./server.js";
console.log(config.PORT, process.env.PORT)
server.init(config.PORT, config.MONGO_URL)
    .then(res => console.log(res))
    .catch(err => console.log(err));