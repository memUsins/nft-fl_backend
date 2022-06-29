import connection from "./../utils/mysqlConnect.js";
import dbQuery from "../utils/dbQuery.js";
import response from "./../utils/response.js";
import errorConfig from "./../utils/errorConfig.js";

const Password = {
    create: async (inData) => {
        if (!inData) return response(false, errorConfig.DATA_EMPTY);
        if (!inData.password) return response(false, errorConfig.NOT_ALL_DATA);

        // Password info
        let newPassword = {
            password: inData.password,
            ownerId: inData.ownerId || 0,
            activatorId: 0,
            isActivate: 0
        };

        // Check password
        let passwordData = false;
        await dbQuery.findPasswordByPassword(inData.password)
            .then(res => passwordData = res)
            .catch((err) => passwordData = err ? true : false);

        if (passwordData) return response(false, errorConfig.PASSWORD_USED);

        await connection.query("INSERT INTO `passwords` SET ?", newPassword, (err, results, fields) => {
            if (err) return response(false, errorConfig.PASSWORD_NOT_CREATED);
        })

        return response(true, null, "Password has been created");
    },
    activate: async (inData) => {
        if (!inData) return response(false, errorConfig.DATA_EMPTY);
        if (!inData.password || !inData.address) return response(false, errorConfig.NOT_ALL_DATA);

        // Check address 
        let accountData = false;
        await dbQuery.findAccountByAddress(inData.address)
            .then(res => accountData = res)
            .catch((err) => {
                if (!err) {
                    accountData = true;
                }
            });

        // Check password
        let passwordData = false;
        await dbQuery.findPasswordByPassword(inData.password)
            .then(res => passwordData = res)
            .catch((err) => passwordData = err);
        if (accountData && passwordData) {
            if (passwordData.isActivate) return response(false, errorConfig.PASSWORD_ACTIVATED);

            await dbQuery.updatePassword([{
                    activatorId: accountData.id,
                    isActivate: 1
                },
                passwordData.id
            ]).then((res) => {
                if (!res) return response(false, errorConfig.PASSWORD_NOT_UPDATED);
            });

            let isFinished = false;
            await dbQuery.insertPasswordOwner({
                    accountId: accountData.id,
                    passwordId: passwordData.id
                })
                .then((isFinished = true))
                .catch(() => {
                    return response(false, errorConfig.PASSWORD_OWNER_NOT_INSERTED);
                });

            if (isFinished) return response(true, null, "Password has been activated");
        } else return response(false, errorConfig.PASSWORD_NOT_ACTIVATED);


    },
    // GetAll
    getAll: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `passwords`', (err, results, fields) => {
                if (err || results.length == 0) reject(response(false, errorConfig.PASSWORD_NOT_FOUND));
                else resolve(response(true, results, `${results.length} passwords found`));
            });
        })
    },

    // GetByAddress
    getOneByAddress: (data) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM \`passwords\` WHERE password="${data.password}"`, (err, results, fields) => {
                if (err || results.length == 0) reject(response(false, errorConfig.PASSWORD_NOT_FOUND));
                else resolve(response(true, results[0], `Password found`));
            });
        })
    },

    // CheckCount
    checkCount: async (data) => {
        if (!data) return response(false, errorConfig.DATA_EMPTY);

        // Check address 
        let accountData = false;
        await dbQuery.findAccountByAddress(data.address)
            .then(res => accountData = res)
            .catch((err) => {
                if (!err) {
                    accountData = true;
                }
            });

        // CheckPass
        if (accountData) {
            let nowDate = Math.floor(new Date().getTime() / 1000);
            let oldDate = accountData.date
            let timeDiff = Math.abs(oldDate - nowDate);
            let diffDays = Math.ceil(timeDiff / (3600 * 24));

            if (diffDays > 1) {
                let qData = [{
                    passwordCount: accountData.passwordCount + 1
                }, accountData.id];

                let isFinished = false;
                await dbQuery.updatePasswordCount(qData).then(() => isFinished = true)
                if (isFinished) return response(true, null, `Password count was updated`);
                else return response(false, errorConfig.PASSWORD_COUNT_NOT_UPDATED);
            } else return response(false, errorConfig.PASSWORD_COUNT_TIME);
        } else return response(false, errorConfig.ACCOUNTS_NOT_FOUND);
    },
}

export default Password;