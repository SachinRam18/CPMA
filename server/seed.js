require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");
const Company = require("./models/Company");
const Job = require("./models/Job");
const Application = require("./models/Application");
const InterviewRound = require("./models/InterviewRound");
const Offer = require("./models/Offer");
const Assessment = require("./models/Assessment");
const Notification = require("./models/Notification");
const PlacementDrive = require("./models/PlacementDrive");
const ActivityLog = require("./models/ActivityLog");

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "CSBS", "AIDS"];

const SKILLS_BY_DEPT = {
  CSE: ["Java", "Python", "React", "Node.js", "SQL", "DSA", "Machine Learning", "C++", "MongoDB", "Git"],
  IT: ["Python", "JavaScript", "React", "AWS", "Docker", "SQL", "Node.js", "TypeScript", "Linux", "Git"],
  ECE: ["MATLAB", "Embedded C", "VHDL", "Arduino", "PCB Design", "Signal Processing", "IoT", "Python"],
  EEE: ["MATLAB", "Power Systems", "PLC", "AutoCAD", "Control Systems", "Python", "Embedded C"],
  MECH: ["AutoCAD", "SolidWorks", "CATIA", "MATLAB", "Ansys", "3D Printing", "Python", "CNC"],
  CIVIL: ["AutoCAD", "STAAD Pro", "Revit", "Primavera", "MATLAB", "GIS", "Python"],
  CSBS: ["Python", "SQL", "Power BI", "Tableau", "Excel", "Statistics", "R", "Machine Learning"],
  AIDS: ["Python", "TensorFlow", "R", "SQL", "Deep Learning", "NLP", "Computer Vision", "Pandas", "Scikit-learn"],
};

const STUDENT_NAMES = [
  "Arun Kumar S", "Priya Dharshini M", "Karthik Raja V", "Swetha Lakshmi R",
  "Vishnu Priya K", "Ranjith Kumar P", "Divya Sri N", "Sathish Kumar G",
  "Nithya Shree B", "Harish Ragav T", "Deepika Sundaram A", "Vignesh Waran R",
  "Kavitha Devi S", "Mohan Raj D", "Lakshmi Priya J", "Surya Prakash M",
  "Anitha Kumari L", "Praveen Kumar S", "Janani Priya K", "Gowtham Raj B",
  "Madhumitha R", "Aravind Kumar S", "Sowmya Lakshmi P", "Balaji Krishnan T",
  "Pooja Srinivasan V",
];

async function seed() {
  await connectDB();
  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    User.deleteMany({}), StudentProfile.deleteMany({}), Company.deleteMany({}),
    Job.deleteMany({}), Application.deleteMany({}), InterviewRound.deleteMany({}),
    Offer.deleteMany({}), Assessment.deleteMany({}), Notification.deleteMany({}),
    PlacementDrive.deleteMany({}), ActivityLog.deleteMany({}),
  ]);

  // ========== ADMIN ==========
  console.log("👤 Creating admin...");
  const admin = await User.create({
    name: "Dr. Rajesh Placement Officer",
    email: "admin@psgitar.edu",
    password: "password123",
    role: "admin",
  });

  // ========== RECRUITERS & COMPANIES ==========
  console.log("🏢 Creating recruiters and companies...");
  const recruitersData = [
    { name: "Anjali Mehta", email: "recruiter@tcs.com", companyName: "Tata Consultancy Services", industry: "IT Services", size: "enterprise", city: "Chennai", website: "https://www.tcs.com" },
    { name: "Vikram Singh", email: "recruiter@infosys.com", companyName: "Infosys Limited", industry: "IT Services", size: "enterprise", city: "Bangalore", website: "https://www.infosys.com" },
    { name: "Sarah Chen", email: "recruiter@google.com", companyName: "Google India", industry: "Technology", size: "enterprise", city: "Hyderabad", website: "https://careers.google.com" },
    { name: "Rahul Sharma", email: "recruiter@wipro.com", companyName: "Wipro Technologies", industry: "IT Services", size: "enterprise", city: "Bangalore", website: "https://www.wipro.com" },
    { name: "Meena Krishnan", email: "recruiter@zoho.com", companyName: "Zoho Corporation", industry: "Software Products", size: "large", city: "Chennai", website: "https://www.zoho.com" },
  ];

  const recruiters = [];
  const companies = [];
  for (const rd of recruitersData) {
    const rUser = await User.create({ name: rd.name, email: rd.email, password: "password123", role: "recruiter" });
    const comp = await Company.create({
      name: rd.companyName, industry: rd.industry, size: rd.size,
      website: rd.website, city: rd.city,
      contactPerson: rd.name, contactEmail: rd.email,
      description: `${rd.companyName} is a leading company in the ${rd.industry} sector.`,
      recruiter: rUser._id, isActive: true,
    });
    recruiters.push(rUser);
    companies.push(comp);
  }

  // ========== STUDENTS ==========
  console.log("🎓 Creating 25 students...");
  const students = [];
  const profiles = [];
  for (let i = 0; i < STUDENT_NAMES.length; i++) {
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const cgpa = parseFloat((6.5 + Math.random() * 3.2).toFixed(2));
    const backlogs = cgpa > 8 ? 0 : Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
    const skills = SKILLS_BY_DEPT[dept].slice(0, 3 + Math.floor(Math.random() * 4));
    const hasResume = Math.random() > 0.2;
    const hasProjects = Math.random() > 0.15;
    const hasCerts = Math.random() > 0.3;

    const sUser = await User.create({
      name: STUDENT_NAMES[i],
      email: `student${i + 1}@psgitar.edu`,
      password: "password123",
      role: "student",
    });

    const profileData = {
      user: sUser._id,
      department: dept,
      cgpa,
      backlogs,
      skills,
      graduationYear: 2026,
      phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      gender: i % 3 === 0 ? "male" : i % 3 === 1 ? "female" : "male",
      city: ["Coimbatore", "Chennai", "Madurai", "Salem", "Trichy"][i % 5],
      tenthPercentage: parseFloat((75 + Math.random() * 20).toFixed(1)),
      twelfthPercentage: parseFloat((70 + Math.random() * 25).toFixed(1)),
      resume: hasResume ? `https://drive.google.com/resume_${i + 1}.pdf` : "",
      placementStatus: "not-placed",
      preferredRoles: dept === "CSE" || dept === "IT" ? ["Software Developer", "Full Stack Developer"] :
                      dept === "ECE" || dept === "EEE" ? ["Embedded Engineer", "Hardware Engineer"] :
                      dept === "MECH" ? ["Design Engineer", "Production Engineer"] :
                      dept === "AIDS" ? ["Data Scientist", "ML Engineer"] :
                      dept === "CSBS" ? ["Business Analyst", "Data Analyst"] :
                      ["Site Engineer", "Project Engineer"],
      preferredLocations: ["Chennai", "Bangalore", "Hyderabad"].slice(0, 1 + Math.floor(Math.random() * 2)),
      salaryExpectation: { min: 400000, max: 1200000 },
      performanceScores: {
        aptitude: Math.floor(40 + Math.random() * 55),
        coding: dept === "CSE" || dept === "IT" || dept === "AIDS" ? Math.floor(45 + Math.random() * 50) : Math.floor(20 + Math.random() * 50),
        communication: Math.floor(50 + Math.random() * 45),
        technical: Math.floor(40 + Math.random() * 55),
      },
      profileVerified: Math.random() > 0.2,
      projects: hasProjects ? [
        {
          title: dept === "CSE" ? "E-Commerce Web Application" : dept === "IT" ? "Cloud Monitoring Dashboard" :
                 dept === "ECE" ? "IoT Smart Home System" : dept === "MECH" ? "Robotic Arm Design" :
                 dept === "AIDS" ? "Sentiment Analysis Tool" : "Student Management Portal",
          description: "A comprehensive project demonstrating practical application of learned skills.",
          techStack: skills.slice(0, 3),
          link: "https://github.com/student/project",
        }
      ] : [],
      certifications: hasCerts ? [
        {
          name: dept === "CSE" || dept === "IT" ? "AWS Cloud Practitioner" :
                dept === "AIDS" ? "Google Data Analytics" : "NPTEL Certification",
          issuer: dept === "CSE" || dept === "IT" ? "Amazon" : dept === "AIDS" ? "Google" : "NPTEL",
          date: new Date("2025-06-15"),
        }
      ] : [],
    };

    const profile = await StudentProfile.create(profileData);
    students.push(sUser);
    profiles.push(profile);
  }

  // ========== JOBS ==========
  console.log("💼 Creating jobs...");
  const jobsData = [
    {
      title: "Software Developer", companyIdx: 0, ctcMin: 700000, ctcMax: 900000,
      location: "Chennai", depts: ["CSE", "IT", "AIDS"], minCGPA: 7.0, skills: ["Java", "SQL"],
      rounds: [{ round: 1, type: "aptitude", name: "Online Aptitude Test" }, { round: 2, type: "coding", name: "Coding Round" }, { round: 3, type: "technical", name: "Technical Interview" }, { round: 4, type: "hr", name: "HR Interview" }],
    },
    {
      title: "Systems Engineer", companyIdx: 1, ctcMin: 650000, ctcMax: 800000,
      location: "Bangalore", depts: ["CSE", "IT", "ECE", "EEE"], minCGPA: 6.5, skills: ["Python"],
      rounds: [{ round: 1, type: "aptitude", name: "Aptitude + Verbal" }, { round: 2, type: "technical", name: "Technical Interview" }, { round: 3, type: "hr", name: "HR Round" }],
    },
    {
      title: "Software Engineer (SDE-1)", companyIdx: 2, ctcMin: 1800000, ctcMax: 2500000,
      location: "Hyderabad", depts: ["CSE", "IT", "AIDS"], minCGPA: 8.0, skills: ["DSA", "Python", "C++"],
      rounds: [{ round: 1, type: "coding", name: "Online Coding Test" }, { round: 2, type: "technical", name: "Technical Round 1" }, { round: 3, type: "technical", name: "Technical Round 2" }, { round: 4, type: "hr", name: "HR + Culture Fit" }],
    },
    {
      title: "Project Engineer", companyIdx: 3, ctcMin: 600000, ctcMax: 750000,
      location: "Bangalore", depts: ["CSE", "IT", "ECE", "MECH"], minCGPA: 6.0, skills: [],
      rounds: [{ round: 1, type: "aptitude", name: "Written Test" }, { round: 2, type: "technical", name: "Technical Interview" }, { round: 3, type: "hr", name: "HR Interview" }],
    },
    {
      title: "Software Developer (Full Stack)", companyIdx: 4, ctcMin: 800000, ctcMax: 1200000,
      location: "Chennai", depts: ["CSE", "IT"], minCGPA: 7.5, skills: ["JavaScript", "React"],
      rounds: [{ round: 1, type: "coding", name: "Coding Challenge" }, { round: 2, type: "technical", name: "System Design + DSA" }, { round: 3, type: "hr", name: "HR Discussion" }],
    },
    {
      title: "Graduate Engineer Trainee", companyIdx: 0, ctcMin: 350000, ctcMax: 500000,
      location: "Multiple", depts: ["MECH", "CIVIL", "EEE", "ECE"], minCGPA: 6.0, skills: [],
      rounds: [{ round: 1, type: "aptitude", name: "Aptitude Test" }, { round: 2, type: "technical", name: "Domain Interview" }, { round: 3, type: "hr", name: "HR Interview" }],
    },
    {
      title: "Data Analyst", companyIdx: 1, ctcMin: 700000, ctcMax: 900000,
      location: "Hyderabad", depts: ["CSE", "IT", "AIDS", "CSBS"], minCGPA: 7.0, skills: ["Python", "SQL"],
      rounds: [{ round: 1, type: "aptitude", name: "Analytical Test" }, { round: 2, type: "coding", name: "SQL + Python Test" }, { round: 3, type: "technical", name: "Case Study Round" }, { round: 4, type: "hr", name: "HR Interview" }],
    },
    {
      title: "Embedded Software Engineer", companyIdx: 3, ctcMin: 550000, ctcMax: 700000,
      location: "Chennai", depts: ["ECE", "EEE"], minCGPA: 7.0, skills: ["Embedded C", "MATLAB"],
      rounds: [{ round: 1, type: "aptitude", name: "Technical Aptitude" }, { round: 2, type: "technical", name: "Hardware Interview" }, { round: 3, type: "hr", name: "HR Interview" }],
    },
  ];

  const jobs = [];
  for (const jd of jobsData) {
    const job = await Job.create({
      title: jd.title,
      company: companies[jd.companyIdx]._id,
      companyName: companies[jd.companyIdx].name,
      description: `We are looking for talented ${jd.title}s to join our team. This role involves working on cutting-edge technologies and solving complex problems.`,
      location: jd.location,
      jobType: "full-time",
      ctcMin: jd.ctcMin,
      ctcMax: jd.ctcMax,
      rolesCount: 3 + Math.floor(Math.random() * 10),
      eligibilityCriteria: {
        minCGPA: jd.minCGPA,
        maxBacklogs: 0,
        requiredSkills: jd.skills,
        departments: jd.depts,
        batch: 2026,
      },
      hiringProcess: jd.rounds,
      deadline: new Date(Date.now() + (10 + Math.floor(Math.random() * 30)) * 86400000),
      status: "open",
      postedBy: recruiters[jd.companyIdx]._id,
    });
    jobs.push(job);
  }

  // ========== PLACEMENT DRIVES ==========
  console.log("📋 Creating placement drives...");
  for (let i = 0; i < jobs.length; i++) {
    const j = jobsData[i];
    const isCompleted = i < 3;
    await PlacementDrive.create({
      title: `${companies[j.companyIdx].name} - ${jobs[i].title} Drive`,
      description: `Campus recruitment drive by ${companies[j.companyIdx].name}`,
      company: companies[j.companyIdx]._id,
      job: jobs[i]._id,
      status: isCompleted ? "completed" : i < 6 ? "active" : "upcoming",
      eligibility: {
        minCGPA: j.minCGPA,
        maxBacklogs: 0,
        departments: j.depts,
        batch: 2026,
        skills: j.skills,
      },
      schedule: {
        registrationStart: new Date(Date.now() - 20 * 86400000),
        registrationEnd: new Date(Date.now() + (isCompleted ? -5 : 10) * 86400000),
        driveDate: new Date(Date.now() + (isCompleted ? -2 : 15 + i * 3) * 86400000),
      },
      rounds: j.rounds.map((r, idx) => ({
        name: r.name,
        type: r.type,
        date: new Date(Date.now() + (isCompleted ? -2 + idx : 15 + i * 3 + idx) * 86400000),
        venue: `Block ${String.fromCharCode(65 + idx)} - Room ${101 + idx}`,
        status: isCompleted ? "completed" : "upcoming",
      })),
      totalPositions: jobs[i].rolesCount,
      ctcOffered: `${(j.ctcMin / 100000).toFixed(1)} - ${(j.ctcMax / 100000).toFixed(1)} LPA`,
      createdBy: admin._id,
    });
  }

  // ========== APPLICATIONS ==========
  console.log("📝 Creating applications...");
  const applications = [];
  const statuses = ["applied", "screening", "shortlisted", "test", "technical", "hr", "selected", "offered", "rejected"];

  for (let i = 0; i < students.length; i++) {
    const profile = profiles[i];
    const dept = profile.department;

    for (let j = 0; j < jobs.length; j++) {
      const job = jobs[j];
      const jobData = jobsData[j];

      if (!jobData.depts.includes(dept)) continue;
      if (profile.cgpa < jobData.minCGPA) continue;
      if (Math.random() > 0.6) continue;

      const statusIdx = Math.floor(Math.random() * statuses.length);
      const status = statuses[statusIdx];
      const totalRounds = jobData.rounds.length;
      const currentRound = status === "rejected" ? Math.floor(Math.random() * totalRounds) + 1 :
                           status === "selected" || status === "offered" ? totalRounds :
                           Math.min(statusIdx, totalRounds);

      const app = await Application.create({
        student: students[i]._id,
        job: jobs[j]._id,
        status,
        currentRound,
        totalRounds,
        adminVerified: Math.random() > 0.15,
        recruiterRemarks: status === "rejected" ? "Did not meet technical requirements" : "",
      });
      applications.push({ app, studentIdx: i, jobIdx: j, status });
    }
  }

  // ========== INTERVIEW ROUNDS ==========
  console.log("🎯 Creating interview rounds...");
  for (const { app, jobIdx, status } of applications) {
    const jd = jobsData[jobIdx];
    const maxRound = app.currentRound;

    for (let r = 0; r < Math.min(maxRound, jd.rounds.length); r++) {
      const roundDef = jd.rounds[r];
      const isPassed = r < maxRound - 1 || (status !== "rejected");
      const isFailed = r === maxRound - 1 && status === "rejected";

      await InterviewRound.create({
        application: app._id,
        roundNumber: r + 1,
        roundType: roundDef.type,
        status: isFailed ? "failed" : isPassed ? "passed" : "completed",
        score: Math.floor(30 + Math.random() * 65),
        maxScore: 100,
        feedback: isPassed ? "Good performance" : "Needs improvement in core concepts",
        date: new Date(Date.now() - (10 - r) * 86400000),
        venue: `Block A - Room ${101 + r}`,
      });
    }
  }

  // ========== OFFERS ==========
  console.log("🎉 Creating offers...");
  const selectedApps = applications.filter(a => a.status === "selected" || a.status === "offered");
  let placedCount = 0;
  for (const { app, studentIdx, jobIdx } of selectedApps) {
    const jd = jobsData[jobIdx];
    const isAccepted = Math.random() > 0.3;

    await Offer.create({
      student: students[studentIdx]._id,
      job: jobs[jobIdx]._id,
      company: companies[jd.companyIdx]._id,
      application: app._id,
      ctc: jd.ctcMin + Math.floor(Math.random() * (jd.ctcMax - jd.ctcMin)),
      role: jobs[jobIdx].title,
      location: jd.location,
      joiningDate: new Date("2026-07-01"),
      status: isAccepted ? "accepted" : "released",
      releasedAt: new Date(Date.now() - 5 * 86400000),
      respondedAt: isAccepted ? new Date(Date.now() - 2 * 86400000) : null,
    });

    if (isAccepted) {
      await StudentProfile.findOneAndUpdate(
        { user: students[studentIdx]._id },
        { placementStatus: "placed" }
      );
      placedCount++;
    }
  }

  // ========== ASSESSMENTS ==========
  console.log("📊 Creating assessments...");
  for (let i = 0; i < students.length; i++) {
    const types = ["aptitude", "coding", "mock-interview", "communication"];
    for (const type of types) {
      if (Math.random() > 0.3) {
        await Assessment.create({
          student: students[i]._id,
          type,
          score: Math.floor(30 + Math.random() * 65),
          maxScore: 100,
          percentile: Math.floor(20 + Math.random() * 75),
          date: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
          remarks: type === "aptitude" ? "Quantitative section needs improvement" :
                   type === "coding" ? "Good logical thinking, work on optimization" :
                   type === "mock-interview" ? "Improve confidence and technical depth" : "Good communication skills",
        });
      }
    }
  }

  // ========== NOTIFICATIONS ==========
  console.log("🔔 Creating notifications...");
  const notifTypes = ["job-alert", "status-update", "deadline", "announcement", "interview"];
  for (let i = 0; i < students.length; i++) {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let n = 0; n < count; n++) {
      const nt = notifTypes[Math.floor(Math.random() * notifTypes.length)];
      const msgs = {
        "job-alert": `New job posted: ${jobs[Math.floor(Math.random() * jobs.length)].title} at ${companies[Math.floor(Math.random() * companies.length)].name}`,
        "status-update": `Your application status has been updated to shortlisted`,
        "deadline": `Deadline approaching for ${jobs[Math.floor(Math.random() * jobs.length)].title} - apply before it closes`,
        "announcement": `Placement cell announcement: Training session on aptitude skills scheduled for next week`,
        "interview": `Interview scheduled for ${jobs[Math.floor(Math.random() * jobs.length)].title} on ${new Date(Date.now() + 5 * 86400000).toLocaleDateString()}`,
      };
      await Notification.create({
        user: students[i]._id,
        message: msgs[nt],
        type: nt,
        read: Math.random() > 0.5,
        priority: nt === "interview" ? "high" : nt === "deadline" ? "medium" : "low",
      });
    }
  }

  // Admin notifications
  await Notification.create({ user: admin._id, message: "5 new student registrations pending verification", type: "announcement", priority: "high" });
  await Notification.create({ user: admin._id, message: "Google India drive scheduled for next week", type: "announcement", priority: "high" });
  await Notification.create({ user: admin._id, message: "32 students have incomplete profiles", type: "announcement", priority: "medium" });

  // ========== ACTIVITY LOGS ==========
  console.log("📋 Creating activity logs...");
  await ActivityLog.create({ user: admin._id, action: "Created placement drive", entityType: "PlacementDrive", details: "TCS Software Developer Drive" });
  await ActivityLog.create({ user: admin._id, action: "Verified student profiles", entityType: "StudentProfile", details: "Batch verification of 15 profiles" });
  await ActivityLog.create({ user: recruiters[0]._id, action: "Posted new job", entityType: "Job", details: "Software Developer at TCS" });
  await ActivityLog.create({ user: recruiters[2]._id, action: "Shortlisted candidates", entityType: "Application", details: "5 candidates shortlisted for SDE-1" });

  // ========== SUMMARY ==========
  console.log("\n✅ Seed completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`👤 Admin: admin@psgitar.edu / password123`);
  console.log(`🏢 Recruiters: recruiter@tcs.com, recruiter@infosys.com, recruiter@google.com, recruiter@wipro.com, recruiter@zoho.com / password123`);
  console.log(`🎓 Students: student1@psgitar.edu to student25@psgitar.edu / password123`);
  console.log(`📊 ${students.length} students, ${companies.length} companies, ${jobs.length} jobs, ${applications.length} applications`);
  console.log(`🎉 ${placedCount} students placed`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
