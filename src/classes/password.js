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
        let passwordData = await dbQuery.findPasswordByPassword(inData.password)
            .then(res => res)
            .catch(() => false);

        console.log("passwordData", passwordData);
        console.log(typeof passwordData !== "undefined" || passwordData === false);

        if (typeof passwordData !== "undefined" || passwordData === false) return response(false, errorConfig.PASSWORD_USED);

        await connection.query("INSERT INTO `passwords` SET ?", newPassword, (err, results, fields) => {
            if (err) return response(false, errorConfig.PASSWORD_NOT_CREATED);
        })

        return response(true, null, "Password has been created");
    },
    activate: async (inData) => {
        if (!inData) return response(false, errorConfig.DATA_EMPTY);
        if (!inData.password || !inData.address) return response(false, errorConfig.NOT_ALL_DATA);

        // Check address 
        let accountData = await dbQuery
            .findAccountByAddress(inData.address)
            .then(res => res)
            .catch(() => false);

        // Check password
        let passwordData = await dbQuery
            .findPasswordByPassword(inData.password)
            .then(res => res)
            .catch((err) => err);

        if (accountData && passwordData) {
            if (passwordData.isActivate) return response(false, errorConfig.PASSWORD_ACTIVATED);

            await dbQuery
                .updatePassword([{
                        activatorId: accountData.id,
                        isActivate: 1
                    },
                    passwordData.id
                ])
                .catch(() => response(false, errorConfig.PASSWORD_NOT_UPDATED));

            let isFinished = await dbQuery
                .insertPasswordOwner({
                    accountId: accountData.id,
                    passwordId: passwordData.id
                })
                .then(() => true)
                .catch(() => response(false, errorConfig.PASSWORD_OWNER_NOT_INSERTED));

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
        if (typeof data.address === "undefined" || typeof data.tableCount === "undefined" || typeof data.refCount === "undefined") return response(false, errorConfig.NOT_ALL_DATA);
        // Check address 
        let accountData = await dbQuery.findAccountByAddress(data.address)
            .then(res => res)
            .catch(() => false);

        // CheckPass
        if (accountData) {
            let nowDate = Math.floor(new Date().getTime() / 1000);
            let oldDate = accountData.date
            let timeDiff = Math.abs(oldDate - nowDate);
            let diffDays = Math.ceil(timeDiff / (3600 * 24));
            let passwordCount = accountData.passwordCount;

            if (diffDays > 1 && data.refCount >= 5) passwordCount += 1

            passwordCount += data.refCount;
            passwordCount += data.tableCount;

            let qData = [{
                date: nowDate,
                passwordCount: passwordCount
            }, accountData.id];

            let isFinished = await dbQuery.updatePasswordCount(qData).then(() => true)
            if (isFinished) {
                let passes = await dbQuery.generateHash(passwordCount - accountData.passwordCount, 8);
                let pushPasses = true;
                if (passes.length) pushPasses = await dbQuery.createPassword(passes, accountData.id)
                if (pushPasses) return response(true, null, `Password count was updated`);
            } else return response(false, errorConfig.PASSWORD_COUNT_NOT_UPDATED);
        } else return response(false, errorConfig.ACCOUNT_NOT_FOUND);
    },

    // CheckCount
    checkPassword: async (data) => {
        if (!data) return response(false, errorConfig.DATA_EMPTY);

        // Check usage pass
        let usedPass = await dbQuery
            .findPasswordByPassword(data.password)
            .then((res) => res)
            .catch(() => false);

        if (!usedPass) return response(false, errorConfig.PASSWORD_NOT_FOUND);
        if (usedPass.isActivate !== 0) return response(false, errorConfig.PASSWORD_USED);

        return response(true, {
            password: data.password
        }, "Password is successfully");
    },
}

export default Password;