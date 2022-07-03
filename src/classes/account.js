import response from "./../utils/response.js";
import connection from "./../utils/mysqlConnect.js";
import dbQuery from "../utils/dbQuery.js";
import errorConfig from "./../utils/errorConfig.js";

let getAccountsQuery = "SELECT accounts.id, accounts.address, accounts.referalId, accounts.passwordCount, accounts.date, passwords.password, passwords.activatorId FROM `accounts` INNER JOIN `passwords` ON accounts.id = passwords.activatorId"
// let getAccountsQuery = "SELECT * FROM `accounts` INNER JOIN `passwords` ON accounts.id = passwords.activatorId"

const Account = {
    create: async (inData) => {
        if (!inData || !inData.address || !inData.password) return response(false, errorConfig.NOT_ALL_DATA);

        // Account info
        let newAccount = {
            address: inData.address,
            referalId: inData.referalId || 0,
            passwordCount: 1,
            date: Math.floor(new Date().getTime() / 1000),
        };

        // Pass info
        let newPassword = {
            isActivate: 1,
        };

        // Check usage address
        let usedAddress = false;
        await dbQuery.findAccountByAddress(inData.address)
            .then((res) => usedAddress = res.length !== 0 ? true : false)
            .catch((err) => usedAddress = err == false ? false : true)

        console.log(usedAddress)
        // reject
        if (usedAddress) return response(false, errorConfig.ADDRESS_USED);

        // Check usage pass
        let usedPass = false;
        await dbQuery.findPasswordByPassword(inData.password).then((res) => usedPass = res).catch(err => usedPass = err);
        // Create account
        let isCreated = false;
        if (!usedPass) {
            await dbQuery
                .createAccount(newAccount)
                .then((res) => {
                    isCreated = true;
                    newAccount.id = res;
                })
                .catch(() => {
                    return response(false, errorConfig.ACCOUNT_NOT_CREATED);
                });
        } else return response(false, errorConfig.PASSWORD_USED);
        // Check created
        if (isCreated) {
            // If used pass — update owner
            // Else — create new
            if (usedPass.isActivate == 0) {
                // Updated data
                newPassword = [{
                        ...newPassword,
                        activatorId: newAccount.id,
                    },
                    usedPass.id,
                ];

                // Update
                await dbQuery.updatePassword(newPassword).then((res) => {
                    if (!res) return response(false, errorConfig.PASSWORD_NOT_UPDATED);
                    newPassword.id = usedPass.id;
                });
            } else if (usedPass && usedPass.isActivate == 1) {
                return response(false, errorConfig.PASSWORD_USED)
            } else {
                // new data
                newPassword = {
                    ...newPassword,
                    password: inData.password,
                    ownerId: newAccount.id,
                    activatorId: newAccount.id,
                };

                // Insert
                await dbQuery.insertNewPassword(newPassword).then((res) => {
                    if (!res) return response(false, errorConfig.PASSWORD_NOT_CREATED);
                    newPassword.id = res;
                });
            }

            // Check finished process and insert pass data
            let isFinished = false;
            dbQuery
                .insertPasswordOwner({
                    passwordId: newPassword.id,
                    accountId: newAccount.id,
                })
                .then((isFinished = true))
                .catch(() => {
                    return response(false, errorConfig.PASSWORD_OWNER_NOT_INSERTED);
                });

            // Resolve
            if (isFinished) {
                return response(true, {
                    ...newAccount,
                    password: newPassword.password
                }, "Account has been created");

            }
        } else {
            // Reject
            return response(false, errorConfig.ACCOUNT_NOT_CREATED);
        }
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
    getOneByAddress: (data) => {
        return new Promise((resolve, reject) => {
            connection.query(getAccountsQuery + " WHERE address = ? ", data.address, (err, accResults, fields) => {
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
                const res = data.reduce((o, i) => {
                    if (!o.find(v => v.id == i.id)) o.push(i);
                    return o;
                }, []);
                resolve(response(true, res[0], `Account found`));
            });
        });
    },
};

export default Account;