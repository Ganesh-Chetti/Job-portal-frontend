// jobController.js

const Job = require('../models/jobModel');
const Company = require("../models/companyModel");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      qualification,
      salary,
      location,
      employementType,
      category,
      experience,
      position,
    } = req.body;

    console.log(skills)

    const companyId = req.user.id


    // Validate required fields
    if (
      !title || !description || !skills || !qualification ||
      !salary || !location || !employementType || !category || !experience ||
      !position 
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false
      });
    }

    // Ensure requirements and qualification are arrays
    // Format skills and qualification as arrays
    const formattedSkills = Array.isArray(skills)
      ? skills.map((item) => item.trim())
      : skills.split(",").map((item) => item.trim());

    const formattedQualification = Array.isArray(qualification)
      ? qualification
      : qualification.split(",").map((item) => item.trim());

    const companyDetails = await Company.findById(companyId).select("-companyEmail -companyRegistrationNumber -password");

    if (!companyDetails) {
      return res.status(404).json({
        message: "Company not found.",
        success: false
      });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      skills: formattedSkills,
      qualification: formattedQualification,
      salary: Number(salary),
      location,
      employementType,
      category,
      experienceLevel: experience,
      position,
      company: companyDetails
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred.",
      error: err.message,
      success: false
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ]
    };
    const jobs = await Job.find(query).populate({
      path: "company",
      select: "-companyEmail -companyRegistrationNumber -password"
    }).sort({ createdAt: -1 }).select("-__v");
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      })
    };
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const matchCondition = category ? { category } : {};

    const result = await Job.aggregate([
      {
        // Stage 1: Match jobs based on category (optional)
        $match: matchCondition
      },
      {
        // Stage 2: Lookup company details
        $lookup: {
          from: "companies", // Collection name of companies
          localField: "company", // Field in Job schema referencing the Company
          foreignField: "_id", // Field in Company schema used for joining
          as: "companyDetails" // Output field for joined data
        }
      },
      {
        // Stage 3: Project only necessary job and company details
        $project: {
          title: 1,
          description: 1,
          skills: 1,
          qualification: 1,
          salary: 1,
          experienceLevel: 1,
          location: 1,
          category: 1,
          employementType: 1,
          position: 1,
          company: {
            companyName: { $arrayElemAt: ["$companyDetails.companyName", 0] }, 
            establishedDate: { $arrayElemAt: ["$companyDetails.companyEstablishedDate", 0] }, 
            websiteLink: { $arrayElemAt: ["$companyDetails.companyWebsiteLink", 0] }, 
            aboutCompany: { $arrayElemAt: ["$companyDetails.aboutCompany", 0] }, 
            location: { $arrayElemAt: ["$companyDetails.location", 0] } 
          }
        }
      },
      {
        // Stage 4: Group by category and collect jobs
        $group: {
          _id: "$category", 
          count: { $sum: 1 }, 
          jobs: {
            $push: {
              _id:"$_id",
              title: "$title",
              description: "$description",
              skills: "$skills",
              qualification: "$qualification",
              salary: "$salary",
              experienceLevel: "$experienceLevel",
              location: "$location",
              category: "$category",
              employementType: "$employementType",
              position: "$position",
              company: "$company" 
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getJobsByCompany = async (req, res) => {
  try {
    const companyId  = req.user.id 
    console.log(companyId,"comp-id")

    const result = await Job.find({ company: companyId }) 
      .select(
        "title description skills qualification salary experienceLevel location category employementType position"
      ) 
      .exec();

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for this company"
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job by ID and populate the company, selecting specific fields
    const job = await Job.findById(jobId).populate({
      path: "company",
      select: "_id companyName companyWebsiteLink companyEstablishedDate" 
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    res.send(job);
  } catch (err) {
    res.status(400).send(err);
  }
};