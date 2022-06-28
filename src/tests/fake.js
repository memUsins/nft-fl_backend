import axios from "axios"

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

const generateAccounts = (count) => {
    let accounts = [];
    for (let i = 0; i < count; i++) {
        accounts.push({
            address: generateHash(1, 50),
            password: generateHash(1, 30)
        });
    }
    return accounts;
}
const api = "http://localhost:1337";
let accounts = generateAccounts(1000);
let passes = generateHash(300, 40);
const createAccount = async () => {
    for (let i = 0; i < accounts.length; i++) {
        await axios.post(`${api}/account/create`, accounts[i]).then(() => {
            return true
        })
    }
}

const createPassword = async () => {
    for (let i = 0; i < passes.length; i++) {
        await axios
            .post(`${api}/password/create`, {
                password: passes[i]
            }).then(() => {
                return true
            }).catch(err => console.log(err))
    }
}
const activatePassword = async () => {
    for (let i = 0; i < passes.length; i++) {
        // console.log(accounts[Math.floor(Math.random() * (accounts.length - 1)) + 1])
        // console.log({
        //     password: passes[i],
        //     address: accounts[Math.floor(Math.random() * (accounts.length - 1)) + 1].address
        // })
        await axios
            .post(`${api}/password/activate`, {
                password: passes[i],
                address: accounts[Math.floor(Math.random() * (accounts.length - 1)) + 1].address
            }).then(() => {
                return true
            })
    }
}

async function main() {
    console.log(1)
    await createAccount()
    await createPassword()
    await activatePassword();
}

main()