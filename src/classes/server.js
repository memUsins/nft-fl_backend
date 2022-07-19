import response from "./../utils/response.js";
import connection from "./../utils/mysqlConnect.js";
import dbQuery from "../utils/dbQuery.js";
import errorConfig from "./../utils/errorConfig.js";

const Server = {
    getStatus: async () => {
        return response(true, {
            dbStatus: true,
            serverStatus: true
        }, "All is good");
    }
};

export default Server;