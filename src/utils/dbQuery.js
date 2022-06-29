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
                if (err || res.length == 0) reject(false);
                resolve(res[0]);
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

    getAccounts: (data) => {
        let arr = [];

        let newData = data.filter((item, index) => {
            let itemData = [];

            for (let i = 0; i < data.length; i++) {
                // console.log(data[i].id);
                if (data[i].id === item.id) {
                    // console.log("yes", i, data[i].id, item.id);
                    itemData.push(data[i]);
                };
                // if (data[i].id === item.id) 
            }
            arr.push(itemData);
        })
        // console.log(arr);
    }
};