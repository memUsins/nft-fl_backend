import response from "./../utils/response.js";
import connection from "./../utils/mysqlConnect.js";
import dbQuery from "../utils/dbQuery.js";
import errorConfig from "./../utils/errorConfig.js";

let getAccountsQuery = "SELECT accounts.id, accounts.address, accounts.referalId, accounts.passwordCount, accounts.date, passwords.password, passwords.activatorId FROM `accounts` INNER JOIN `passwords` ON accounts.id = passwords.activatorId"
// let getAccountsQuery = "SELECT * FROM `accounts` INNER JOIN `passwords` ON accounts.id = passwords.activatorId"

const Account = {
    create: async (inData) => {
        if (!inData) return response(false, errorConfig.NOT_ALL_DATA);
        if (!inData.address || !inData.password) return response(false, errorConfig.NOT_ALL_DATA);

        // Account info
        let newAccount = {
            address: inData.address,
            referalId: inData.referalId || 0,
            passwordCount: 1,
            date: Math.floor(new Date().getTime() / 1000),
        };

        // Check usage address
        let usedAddress = await dbQuery
            .findAccountByAddress(inData.address)
            .then(() => true)
            .catch(() => false)

        if (usedAddress) return response(false, errorConfig.ADDRESS_USED);

        // Check usage pass
        let usedPass = await dbQuery
            .findPasswordByPassword(inData.password)
            .then((res) => res)
            .catch(() => false);

        // Create account
        if (!usedPass) return response(false, errorConfig.PASSWORD_NOT_FOUND);
        if (usedPass.isActivate === 0) {
            await dbQuery
                .createAccount(newAccount)
                .then(res => newAccount.id = res)
                .catch(() => response(false, errorConfig.ACCOUNT_NOT_CREATED));
        } else return response(false, errorConfig.PASSWORD_USED);

        // Check created
        if (typeof newAccount.id !== "undefined") {
            // Updated data
            let password = [{
                    isActivate: 1,
                    activatorId: newAccount.id,
                },
                usedPass.id,
            ];

            // Update
            await dbQuery
                .updatePassword(password)
                .then(() => true)
                .catch(() => response(false, errorConfig.PASSWORD_NOT_UPDATED))

            // Check finished process and insert pass data
            let isFinished = await dbQuery
                .insertPasswordOwner({
                    passwordId: usedPass.id,
                    accountId: newAccount.id,
                })
                .then(() => true)
                .catch(() => response(false, errorConfig.PASSWORD_OWNER_NOT_INSERTED));

            // Resolve
            if (isFinished) {
                return response(true, {
                    ...newAccount,
                    password: password.password
                }, "Account has been created");

            }
        } else return response(false, errorConfig.ACCOUNT_NOT_CREATED);
    },

    // GetAll
    getAll: () => {
        return new Promise((resolve, reject) => {
            connection.query(getAccountsQuery, (err, accResults, fields) => {
                if (err || accResults.length == 0) reject(response(false, errorConfig.ACCOUNTS_NOT_FOUND));

                let data = []

                for (let i = 0; i < accResults.length; i++) {
                    let tempPassword = [];
                    let tempRefers = [];

                    accResults.forEach(el => {
                        if (el.activatorId === accResults[i].id) tempPassword.push(el.password)
                        if (el.referalId === accResults[i].id) tempRefers.push(el.id)
                    })

                    data.push({
                        ...accResults[i],
                        password: tempPassword,
                        referalCount: tempRefers.length || 0,
                        referals: tempRefers || []
                    })
                }

                const res = data.reduce((o, i) => {
                    if (!o.find(v => v.id == i.id)) o.push(i);
                    return o;
                }, []);

                resolve(response(true, res, `${res.length} accounts found`));
            });
        });
    },

    // GetByAddress
    getOneByAddress: (inData) => {
        return new Promise((resolve, reject) => {
            connection.query(getAccountsQuery, (err, accResults, fields) => {
                if (err || accResults.length == 0) reject(response(false, errorConfig.ACCOUNT_NOT_FOUND));

                let data = []

                for (let i = 0; i < accResults.length; i++) {
                    let tempPassword = [];
                    let tempRefers = [];

                    accResults.forEach(el => {
                        if (el.activatorId === accResults[i].id) tempPassword.push(el.password)
                        if (el.referalId === accResults[i].id) tempRefers.push(el.id)
                    })

                    data.push({
                        ...accResults[i],
                        password: tempPassword,
                        referalCount: tempRefers.length || 0,
                        referals: tempRefers || []
                    })
                }

                let res = data.reduce((o, i) => {
                    if (!o.find(v => v.id == i.id)) o.push(i);
                    return o;
                }, []);

                res = res.find(el => el.address === inData.address)

                resolve(response(true, res, `Account found`));
            });
        });
    },
};

export default Account;