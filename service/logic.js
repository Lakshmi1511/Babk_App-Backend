// const { User } = require("./service/db")

//import db.js file
const db = require('./db')

//import jwt
const jwt = require('jsonwebtoken')

//create a fun for register logic
register = (acno, uname, psw) => {
    // collection key:arg value
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: "user already exists",
                status: false,
                statusCode: 404
            }

        }
        else {
            //creating an object for new user
            newuser = new db.User({
                acno: acno,
                uname: uname,
                psw: psw,
                balance: 0,
                transaction: []
            })
            //save new object to reflect the change in db
            newuser.save()
            return {
                message: "registered succesfully",
                status: true,
                statusCode: 200
            }
        }
    })

}

//login logic

login = (acno, psw) => {
    return db.User.findOne({ acno, psw }).then(user => {
        if (user) {
            //token grneration
            const token = jwt.sign({ currentAcno: acno }, "secret123")
            return {
                message: "Login succesfully",
                status: true,
                statusCode: 200,
                currentUser: user.uname,
                currentAcno: user.acno,
                //send to client
                token
            }
        }
        else {
            return {
                message: "Incorrect acno or password",
                status: false,
                statusCode: 401
            }
        }
    })
}

getBalance = acno => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.balance,
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "Incorrect acno",
                status: false,
                statusCode: 401
            }
        }
    })
}

getUser = acno => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user,
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "Incorrect acno",
                status: false,
                statusCode: 401
            }
        }
    })
}

fundTransfer = (toAcno, fromAcno, amount, psw, date) => {
    let amnt = parseInt(amount)
    return db.User.findOne({ acno: fromAcno, psw }).then(result => {
        if (result) {
            return db.User.findOne({ acno: toAcno }).then(data => {
                if (data) {
                    if (amnt > result.balance) {
                        return {

                            message: "insufficient balance",
                            status: false,
                            statusCode: 404

                        }
                    }
                    else {
                        result.balance -= amnt
                        result.transactions.push(
                            {
                                type: "DEBIT",
                                amount: amnt,
                                date
                            }
                        )
                        result.save()

                        data.balance += amnt
                        data.transactions.push(
                            {
                                type: "CREDIT",
                                amount: amnt,
                                date
                            }
                        )
                        data.save()

                        return {

                            message: 'transaction success',
                            status: true,
                            statusCode: 200,
                            balance: result.balance

                        }


                    }

                }
                else {
                    return {
                        message: "invalid credit credentials",
                        status: false,
                        statusCode: 404
                    }
                }
            })

        }
        else {
            return {
                message: "invalid debit credential",
                status: false,
                statusCode: 404
            }
        }
    })

}

getTransaction = (acno) => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.transactions,
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "invalid user",
                status: false,
                statusCode: 404
            }
        }
    })
}

deleteAc = (acno) => {
    return db.User.deleteOne({ acno }).then(deleteCount => {
        if (deleteCount) {
            return {
                message: "user deleted",
                status: true,
                statusCode: 200
            }
        }
        else {
            return {
                message: "invalid user",
                status: false,
                statusCode: 404
            }
        }
    })
}

//export 
module.exports = {
    register, login, getBalance, getUser, fundTransfer, getTransaction, deleteAc
}