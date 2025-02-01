// Middleware to authenticate the token
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Authorization" header
  if (!token) {
    console.error('Token not provided');
    return res.status(401).send({ error: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    req.user = decoded; // Attach user info to the request object
    console.log('Authenticated User:', req.user);
    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(403).send({ error: 'Invalid token' });
  }
};


// Middleware to authorize roles
exports.authorizeRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    console.error(`Unauthorized role: Expected ${role}, but got ${req.user?.role || 'undefined'}`);
    return res.status(403).send({ error: 'Access denied. Unauthorized role' });
  }
  // console.log(`Authorized Role: ${role}`);
  next();
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
};

exports.isCompany = async(req,res,next)=>{
  if(req.user.role !== "company"){
      return res.status(403).json({
         success:false,
         message:"Access denied! company rigts"          
      })             
  }
  next()
}

exports.isUser = async(req,res,next)=>{
  if(req.user.role !== "user"){
      return res.status(403).json({
         success:false,
         message:"Access denied! user rigts"          
      })             
  }
  next()
}