import axios from "axios"
const api = "https://nftfl-backend.herokuapp.com";

/**
 * Generate rand string
 * 
 * @param {Number} count count strings 
 * @param {Number} len count word in string
 * @returns {Array}
 */
const generateHash = (count, len) => {
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
}

/**
 * Generate accounts
 * 
 * @param {Number} count account count
 * @returns Array
 */
const generateAccounts = (count) => {
    let accounts = [];

    for (let i = 0; i < count; i++) {
        accounts.push({
            address: generateHash(1, 8),
            password: generateHash(1, 8)
        });
    }

    return accounts;
}

/**
 * Insert generated accounts
 * 
 * @param {Array} accounts 
 */
const createAccount = async (accounts) => {
    for (let i = 0; i < accounts.length; i++) {
        await axios.post(`${api}/account/create`, accounts[i])
            .then(() => console.log(`Account number ${i + 1} has been created`))
    }
}

/**
 * Created passwords
 * 
 * @param {Array} passes 
 */
const createPassword = async (passes) => {
    for (let i = 0; i < passes.length; i++) {
        await axios
            .post(`${api}/password/create`, {
                password: passes[i]
            })
            .then(() => console.log(`Password number ${i + 1} has been created`))
    }
}

/**
 * Activate created passwords
 * 
 * @param {Array} passes 
 * @param {Array} accounts 
 */
const activatePassword = async (passes, accounts) => {
    for (let i = 0; i < passes.length; i++) {
        await axios
            .post(`${api}/password/activate`, {
                password: passes[i],
                address: accounts[Math.floor(Math.random() * (accounts.length - 1)) + 1].address
            }).then(() => console.log(`Password number ${i + 1} has been activated`))
    }
}

// Main function
async function main() {
    let accounts = generateAccounts(10);
    let passes = generateHash(20, 8);

    await createAccount(accounts)
    await createPassword(passes)
    await activatePassword(passes, accounts);
}

main()