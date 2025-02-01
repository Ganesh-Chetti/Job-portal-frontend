const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require("./routes/applicationRoutes")
const { errorHandler } = require('./middlewares/errorHandler');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

connectDB();

app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/admin', adminRoutes);
app.use('/company', companyRoutes);
app.use("/application",applicationRoutes)

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
