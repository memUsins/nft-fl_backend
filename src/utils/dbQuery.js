import connection from "./mysqlConnect.js";
export default {
    /**
     * findPasswordByPassword
     *
     * @param {Number} data passwordId
     *
     * @returns {object}
     */
    findPasswordByPassword: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `passwords` WHERE password = ?", data, (err, res) => {
                if (err || typeof res === "undefined") reject(false);
                else resolve(res[0]);
            });
        });
    },
    /**
     * findPasswords
     *
     * @returns {object}
     */
    findPasswords: () => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `passwords`", (err, res) => {
                if (err || typeof res === "undefined") reject(false);
                else resolve(res);
            });
        });
    },
    /**
     * findAccountByAddress
     *
     * @param {string} data address
     *
     * @returns {object}
     */
    findAccountByAddress: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `accounts` WHERE address = ?", data, (err, res) => {
                if (err || res.length == 0) reject(false);
                else resolve(res[0]);

                console.log(err)
                console.log(res)
            });
        });
    },
    /**
     * findAccounts
     *
     * @returns {object}
     */
    findAccounts: () => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM `accounts`", (err, res) => {
                if (err || res.length == 0) reject(false);
                else resolve(res);
            });
        });
    },

    /**
     * createAccount
     *
     * @param {object} data account info
     *
     * @returns {Number}
     */
    createAccount: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO `accounts` SET ?", data, (err, res) => {
                if (err) reject(false);
                resolve(res.insertId);
            });
        });
    },

    /**
     * updatePassword
     *
     * @param {Array} data password info and password id
     *
     * @returns {Boolean}
     */
    updatePassword: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE `passwords` SET ? WHERE id = ?", data, (err, res) => {
                if (err) reject(false);
                resolve(true);
            });
        });
    },

    /**
     * updatePasswordCount
     *
     * @param {Array} data password count and account id
     *
     * @returns {Boolean}
     */
    updatePasswordCount: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE `accounts` SET ? WHERE id = ?", data, (err, res) => {
                if (err) reject(false);
                resolve(true);
            });
        });
    },

    /**
     * insertNewPassword
     *
     * @param {object} data password info
     *
     * @returns {Number}
     */
    insertNewPassword: (data) => {
        return new Promise((resolve, reject) => {
            // Insert new pass
            connection.query("INSERT INTO `passwords` SET ?", data, (err, res) => {
                console.log(err);
                if (err) reject(false);
                resolve(res.insertId);
            });
        });
    },

    /**
     * insertNewPassword
     *
     * @param {object} data passwordId and accountId
     *
     * @returns {Boolean}
     */
    insertPasswordOwner: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO `account_password` SET ?", data, (err) => {
                if (err) reject(false);
                resolve(true);
            });
        });
    },
    /**
     * Generate rand string
     * 
     * @param {Number} count count strings 
     * @param {Number} len count word in string
     * @returns {Array}
     */
    generateHash: (count, len) => {
        const word = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let res = [];

        for (let i = 0; i < count; i++) {
            let temp = []
            for (let j = 0; j < len; j++) {
                let w = Math.floor(Math.random() * (word.length - 1)) + 1;
                temp.push(word[w]);
            }
            res.push(temp.join(''));
        }

        return res;
    },

    /**
     * Created passwords
     * 
     * @param {Array} passes 
     * @param {Number} ownerId 
     */
    createPassword: async function (passes, ownerId) {
        for (let i = 0; i < passes.length; i++) {
            let passwordId = await this.insertNewPassword({
                ownerId,
                activatorId: 0,
                isActivate: 0,
                password: passes[i],
            })
            let passOwner = await this.insertPasswordOwner({
                passwordId,
                accountId: ownerId
            });
            if (!passOwner) return false;
            if (i === passes.length - 1 && passOwner) return true;
        }
    },

};