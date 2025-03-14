import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req,res,next) =>{
    // this middlwer for the authorization
    // 1. check if authoriZation header is empty
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        return res.status(401).send("No Authorization details found");
    }
    console.log(authHeader);
    // 2. Extract the details
    const base64Credentials = authHeader.replace('Basic','');
    console.log(base64Credentials);
    // 3 .Decode the creddentials
    const decodeCreds = Buffer.from(base64Credentials,'base64').toString('utf-8');
    console.log(decodeCreds);
    // [username:password]
    const creds = decodeCreds.split(':');
    const user = UserModel.getAll().find((u)=> u.email == creds[0] && u.password == creds[1]);
    if(user){
        next();
    }else{
        return res.status(401).send("Credentials Not Found");
    }


}   

export default basicAuthorizer;