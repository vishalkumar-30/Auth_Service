const UserRepository = require('../repository/user-repository');
const jwt = require('jsonwebtoken'); 
const {JWT_KEY} = require('../config/serverConfig');
const bcrypt = require('bcrypt');
const AppErrors = require("../utils/error-handler");

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            if (error == 'ValidationError') {
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(email, plainPassword){
        try {
            //step1: fetch user using its email
            const user = await this.userRepository.getByEmail(email);
            //step2: compare incoming plain password with stores encrypted password
            const passwordMatch = this.checkPassword(plainPassword, user.password);
            if(!passwordMatch){
                console.log("Password dosen't match");
                throw({error: 'Incorrect password'});
            }
            //step3: if passwords match then create a token and send it to the user
            const newJWT = this.createToken({email:user.email, id:user.id});
            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

     async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if(!response) {
                throw {error: 'Invalid token'}
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: 'No user with the corresponding token exists'};
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auth process");
            throw error;
        }
    }

    createToken(user) {
        try {
            const result = jwt.sign(user, JWT_KEY, {expiresIn:'1h'});
            return result;
        } catch (error) {
            console.log("Somthing went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Somthing went wrong in token verification", error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Somthing went wrong in check password", error);
            throw error;
        }
    }

    isAdmin(userId) {
        try{
            return this.userRepository.isAdmin(userId);
        }
        catch{
            console.log("Something went wrong in admin service check");
            throw error;
        }
    }
}

module.exports = UserService;