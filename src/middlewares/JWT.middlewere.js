import jwt from "jsonwebtoken";

const jwtAuth = (req,res,next) => {
    // 1 Read the token
    const token = req.headers["authorization"];

    // 2. no token received throw error
    if(!token){
        return res.status(401).send('Unauthorized');
    }

   // 3. if token received check is it valid
    try{
        const payload = jwt.verify(token, "GnRVSIBFPF2R4ezZWivNZV85qEB0yVfn");
        req.userID = payload.userID;
        console.log(payload);
    } catch (err) {
        return res.status(401).send('Unauthorized');
    }
    
    // 4 . call next

    next();
    // 5 . retrun error if there is error in the token



}


export default jwtAuth;