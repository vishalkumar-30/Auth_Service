const UserRepository = require('../repository/user-repository');
const jwt = require('jsonwebtoken'); 
const {JWT_KEY} = require('../config/serverConfig');

class UserService {
    constructor() {
        this.UserRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.UserRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    createToken(user) {
        try {
            const result =- jwt.sign()
        } catch (error) {
            console.log("Somthing went wrong in user-service");
            throw error;
        }
    }
}

module.exports = UserService;