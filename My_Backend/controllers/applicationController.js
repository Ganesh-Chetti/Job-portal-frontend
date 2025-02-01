
const Application = require("../models/applicationModel.js")
const Job = require("../models/jobModel.js")

exports.applyJob = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
exports.getAppliedJobs = async (req,res) => {
    try {
        const userId = req.user.id;
        console.log("applicant",userId)
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                select: "-companyEmail -companyRegistrationNumber -password",
                options:{sort:{createdAt:-1}},
            }
        }).select("-__v");
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getApplicants = async (req,res) => {
    try {
        // const jobId = req.params.id;
        const job = await Job.find().populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
exports.updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

exports.getApplicationByCompany = async (req, res) => {
    try {
      const  companyId  = req.user.id; 
  
      // Step 1: Find all jobs belonging to the company
      const jobs = await Job.find({ company: companyId }).select("_id");
  
      if (!jobs.length) {
        return res.status(404).json({
          success: false,
          message: "No jobs found for this company"
        });
      }
  
      // Step 2: Find all applications linked to the retrieved jobs
      const jobIds = jobs.map((job) => job._id); // Extract job IDs
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate("job", "title") // Populate job title
        .populate("applicant", "fullname email mobilenumber") // Populate applicant details (if applicable)
        .exec();
  
      if (!applications.length) {
        return res.status(404).json({
          success: false,
          message: "No applications found for jobs under this company"
        });
      }
  
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  