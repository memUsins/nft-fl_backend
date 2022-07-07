import response from "./../utils/response.js";
import connection from "./../utils/mysqlConnect.js";
import dbQuery from "../utils/dbQuery.js";
import errorConfig from "./../utils/errorConfig.js";

let getAccountsQuery = "SELECT accounts.id, accounts.address, accounts.referalId, accounts.passwordCount, accounts.date, passwords.password, passwords.ownerId, passwords.isActivate FROM `accounts` INNER JOIN `passwords` ON accounts.id = passwords.ownerId;"
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
    getAll: async () => {
        let accountData = await dbQuery.findAccounts();
        let passwordData = await dbQuery.findPasswords();

        if (accountData && passwordData) {
            let responseData = []

            for (let i = 0; i < accountData.length; i++) {
                let tempPassword = [];
                let tempRefers = [];

                passwordData.forEach(el => {
                    if (el.isActivate === 0) {
                        if (el.ownerId === accountData[i].id) tempPassword.push(el.password)
                    }
                })

                accountData.forEach(el => {
                    if (el.referalId === accountData[i].id) tempRefers.push(el.id)
                })

                responseData.push({
                    ...accountData[i],
                    password: tempPassword,
                    referalCount: tempRefers.length || 0,
                    referals: tempRefers || []
                })
            }

            if (responseData) return response(true, responseData, `${responseData.length} accounts found`);
            else response(false, errorConfig.ACCOUNT_NOT_FOUND);
        } else return reject(response(false, errorConfig.ACCOUNT_NOT_FOUND))
    },

    // GetByAddress
    getOneByAddress: async (data) => {
        let accountData = await dbQuery.findAccounts();
        let passwordData = await dbQuery.findPasswords();

        if (accountData && passwordData) {
            let responseData = []

            for (let i = 0; i < accountData.length; i++) {
                let tempPassword = [];
                let tempRefers = [];

                passwordData.forEach(el => {
                    if (el.isActivate === 0) {
                        if (el.ownerId === accountData[i].id) tempPassword.push(el.password)
                    }
                })

                accountData.forEach(el => {
                    if (el.referalId === accountData[i].id) tempRefers.push(el.id)
                })

                responseData.push({
                    ...accountData[i],
                    password: tempPassword,
                    referalCount: tempRefers.length || 0,
                    referals: tempRefers || []
                })
            }
            let res = responseData.find(el => el.address === data.address)

            if (res) return response(true, res, `Account found`);
            else return response(false, errorConfig.ACCOUNT_NOT_FOUND);
        } else return response(false, errorConfig.ACCOUNT_NOT_FOUND)
    },
};

export default Account;