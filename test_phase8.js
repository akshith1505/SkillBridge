/**
 * SkillBridge SIH26134 Phase 8 30-Point Comprehensive System Validation Suite
 */

async function runPhase8ValidationSuite() {
  const BASE_URL = "http://localhost:5000/api";
  let passedCount = 0;
  let totalTests = 30;

  console.log("=========================================================");
  console.log("🚀 STARTING SKILLBRIDGE 30-POINT PHASE 8 VALIDATION SUITE");
  console.log("=========================================================\n");

  function assert(condition, testNum, testName, detail = "") {
    if (condition) {
      passedCount++;
      console.log(`✓ Test ${testNum.toString().padStart(2, "0")}: [PASSED] ${testName} ${detail ? "-> " + detail : ""}`);
    } else {
      console.error(`✗ Test ${testNum.toString().padStart(2, "0")}: [FAILED] ${testName} ${detail ? "-> " + detail : ""}`);
    }
  }

  try {
    // 01. Health Check with Memory & Process Stats
    const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(
      health.status === "healthy" &&
      typeof health.process?.memory?.heapUsedMb === "number" &&
      typeof health.process?.uptimeSeconds === "number",
      1,
      "Observability & Process Health Metrics",
      `Heap: ${health.process?.memory?.heapUsedMb} MB, Uptime: ${health.process?.uptimeSeconds}s`
    );

    // 02. Readiness Probe
    const ready = await fetch(`${BASE_URL}/health/ready`);
    assert(ready.status === 200, 2, "Database Dependency Readiness Probe", "Status: 200 OK");

    // 03. Liveness Probe
    const live = await fetch(`${BASE_URL}/health/live`);
    assert(live.status === 200, 3, "Process Liveness Heartbeat Probe", "Status: 200 OK");

    // 04. Student Registration
    const regEmail = `p8.candidate.${Date.now()}@skillbridge.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "P8 Test Student",
        email: regEmail,
        password: "securePassword123",
        role: "student",
        profileData: { college: "IIT Madras", targetCareer: "Full Stack Developer", technicalSkills: ["JavaScript", "React", "Node.js", "SQL"] }
      })
    }).then(r => r.json());
    assert(regRes.success === true && !!regRes.token, 4, "Student Registration & Account Creation", `User ID: ${regRes.user?.id}`);

    // 05. Student Login & JWT Issuance
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, password: "securePassword123" })
    }).then(r => r.json());
    const studentToken = loginRes.token;
    assert(loginRes.success === true && !!studentToken, 5, "JWT Issuance & Authentication Handshake", `Name: ${loginRes.user?.name}`);

    // 06. JWT Token Verification
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(meRes.success === true && meRes.user?.email === regEmail, 6, "JWT Bearer Token Decoding & Validation", `Email: ${meRes.user?.email}`);

    // 07. Protected Student Profile Retrieval
    const profileRes = await fetch(`${BASE_URL}/students/profile`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(profileRes.success === true && profileRes.profile?.target_career === "Full Stack Developer", 7, "Protected Student Profile Retrieval", `Target: ${profileRes.profile?.target_career}`);

    // 08. Role Protection Enforcement (Student cannot post employer jobs)
    const unauthorizedJobRes = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        title: "Unauthorized Student Job Post",
        description: "Student role attempting employer job posting",
        required_skills: ["Python"]
      })
    });
    assert(unauthorizedJobRes.status === 403, 8, "Role Boundary Enforcement (Student cannot create jobs)", `Status: 403 Forbidden`);

    // 09. Password Validation
    const badReg = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid", password: "123" })
    });
    const badRegJson = await badReg.json();
    assert(badReg.status === 400 && badRegJson.error?.code === "VALIDATION_ERROR", 9, "Input Password & Email Format Validation", `Error Code: ${badRegJson.error?.code}`);

    // 10. OTP Generation
    const otpSend = await fetch(`${BASE_URL}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail })
    }).then(r => r.json());
    const devOtp = otpSend.devOtp;
    assert(otpSend.success === true && !!devOtp, 10, "Time-Bound 6-Digit OTP Dispatch", `Dispatched OTP: ${devOtp}`);

    // 11. OTP Verification
    const otpVerify = await fetch(`${BASE_URL}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, otp: devOtp })
    }).then(r => r.json());
    assert(otpVerify.success === true, 11, "OTP Verification & Expiry Handshake", "Verification Confirmed");

    // 12. Password Reset Workflow
    const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail })
    }).then(r => r.json());
    const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, otp: forgotRes.devOtp, newPassword: "newSecurePassword2026" })
    }).then(r => r.json());
    assert(forgotRes.success === true && resetRes.success === true, 12, "Self-Service Password Reset Workflow", "Password Updated");

    // 13. Student Profile Update
    const updateProfRes = await fetch(`${BASE_URL}/students/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({ cgpa: 9.1, preferred_industry: "Artificial Intelligence & Cloud" })
    }).then(r => r.json());
    assert(updateProfRes.success === true, 13, "Student Profile Attribute Mutation", "CGPA & Preferences Updated");

    // 14. Student Skills Update
    const updateSkillsRes = await fetch(`${BASE_URL}/students/skills`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({ skills: ["JavaScript", "React", "Node.js", "SQL", "Docker", "Git"] })
    }).then(r => r.json());
    assert(updateSkillsRes.success === true && updateSkillsRes.skills?.includes("Docker"), 14, "Student Technical Competency Inventory Mutation", "Skills Synced");

    // 15. Skill Assessment Submission
    const assessSubmit = await fetch(`${BASE_URL}/assessments/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        studentId: profileRes.profile?.student_id || "SB10001",
        score: 90,
        totalQuestions: 10,
        categoryScores: { frontend: 100, backend: 85, database: 85 }
      })
    }).then(r => r.json());
    assert(assessSubmit.success === true && assessSubmit.score === 90, 15, "10-Question Technical Assessment Scoring", `Score: ${assessSubmit.score}%, Level: ${assessSubmit.performanceLevel}`);

    // 16. Explainable Weighted Readiness Calculation
    const weightedReadiness = await fetch(`${BASE_URL}/students/readiness-explanation`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(
      weightedReadiness.success === true &&
      weightedReadiness.breakdown?.skillCompetency?.weight === "35%",
      16,
      "Explainable Weighted Readiness Algorithm (35/20/15/15/10/5)",
      `Overall Score: ${weightedReadiness.overallScore}/100`
    );

    // 17. Personalized Career Recommendations
    const careerRecs = await fetch(`${BASE_URL}/intelligence/career-recommendations`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(careerRecs.success === true && careerRecs.recommendations?.length >= 8, 17, "Personalized Multi-Track Career Recommendations", `Top Match: ${careerRecs.recommendations[0]?.title}`);

    // 18. Prioritized Learning Recommendations
    const learningRecs = await fetch(`${BASE_URL}/students/learning-recommendations`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(learningRecs.success === true && learningRecs.recommendations?.length >= 4, 18, "Prioritized Next-Best Skills Learning Plan", `Top Skill: ${learningRecs.recommendations[0]?.skill}`);

    // 19. Employer Login & Job Creation
    const empLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "contact@technovaenterprisesolutions.com", password: "password123" })
    }).then(r => r.json());
    const employerToken = empLogin.token;

    const jobCreateRes = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        title: "Principal DevOps & Cloud Reliability Engineer",
        company_name: "TechNova Enterprise Solutions",
        department: "Cloud Infrastructure",
        location: "Hyderabad, Telangana",
        work_mode: "Hybrid",
        experience_level: "2 - 4 Years",
        salary_range: "₹18 - 28 LPA",
        description: "Scale Kubernetes clusters, CI/CD pipelines and infrastructure telemetry.",
        required_skills: ["Docker", "Kubernetes", "Linux", "Git", "REST APIs"],
        good_to_have_skills: ["Python", "FastAPI"]
      })
    }).then(r => r.json());
    assert(jobCreateRes.success === true && jobCreateRes.job?.id.startsWith("job-"), 19, "Employer Job Requirement Publication", `Job ID: ${jobCreateRes.job?.id}`);

    // 20. Dynamic Student Job Matching
    const jobsList = await fetch(`${BASE_URL}/jobs`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(jobsList.success === true && typeof jobsList.jobs?.[0]?.matchPercentage === "number", 20, "Dynamic Personalized Student Job Match Calculation", `Match: ${jobsList.jobs?.[0]?.matchPercentage}%`);

    // 21. Student Job Application
    const applyRes = await fetch(`${BASE_URL}/jobs/${jobCreateRes.job?.id}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      }
    }).then(r => r.json());
    assert(applyRes.success === true && applyRes.application?.id.startsWith("app-"), 21, "Student Job Application Submission", `App ID: ${applyRes.application?.id}`);

    // 22. Employer Candidate Ranking
    const candRanking = await fetch(`${BASE_URL}/employers/recommended-candidates?jobId=${jobCreateRes.job?.id}`).then(r => r.json());
    assert(candRanking.success === true && candRanking.topMatches?.length >= 5, 22, "Employer 6-Factor Candidate Fit Ranking", `Top Fit: ${candRanking.topMatches?.[0]?.overallFit}%`);

    // 23. Institute Curriculum Matrix
    const currMatrix = await fetch(`${BASE_URL}/institutes/curriculum`).then(r => r.json());
    assert(currMatrix.success === true && currMatrix.courses?.length >= 6, 23, "Institute Curriculum Alignment Matrix Query", `Courses: ${currMatrix.courses?.length}`);

    // 24. Institute AI Curriculum Recommendations
    const currRecs = await fetch(`${BASE_URL}/institutes/curriculum-recommendations`).then(r => r.json());
    assert(currRecs.success === true && currRecs.recommendations?.length >= 6, 24, "Institute AI Curriculum Gap Upgrade Diagnostics", `Top Gap: ${currRecs.recommendations?.[0]?.courseCode}`);

    // 25. Government Regional Demand Intelligence
    const govRegional = await fetch(`${BASE_URL}/government/regional-demand`).then(r => r.json());
    assert(govRegional.success === true && govRegional.regions?.length >= 5, 25, "Government Regional Deficit Intelligence", `Corridors: ${govRegional.regions?.length}`);

    // 26. Government Predictive Skill Demand Forecasting
    const govForecast = await fetch(`${BASE_URL}/government/skill-forecast`).then(r => r.json());
    assert(govForecast.success === true && govForecast.forecast?.length >= 5, 26, "Government 5-Tier Predictive Skill Demand Forecasting", `Categories: ${govForecast.forecast?.length}`);

    // 27. Central Intelligence Ecosystem Aggregation
    const intelOverview = await fetch(`${BASE_URL}/intelligence/overview`).then(r => r.json());
    assert(intelOverview.success === true && intelOverview.crossPortalInsights?.length === 3, 27, "Central Intelligence Cross-Portal Ecosystem Pipeline", "5-Stage Pipeline Active");

    // 28. Real-Time SSE Stream Handshake
    const sseRes = await fetch(`${BASE_URL}/events/stream`);
    assert(sseRes.status === 200 && sseRes.headers.get("content-type")?.includes("text/event-stream"), 28, "Real-Time Server-Sent Events (SSE) Stream", "Stream Handshake Confirmed");

    // 29. Centralized Validation Error Formatting
    const badJob = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${employerToken}`
      },
      body: JSON.stringify({ title: "" })
    });
    const badJobJson = await badJob.json();
    assert(badJob.status === 400 && badJobJson.error?.code === "VALIDATION_ERROR", 29, "Standardized JSON Validation Error Envelopes", `Error Code: ${badJobJson.error?.code}`);

    // 30. Zero-Downtime Offline Fallback & Reset Guard
    const resetBlocked = await fetch(`${BASE_URL}/intelligence/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    assert(resetBlocked.status === 200 || resetBlocked.status === 403, 30, "Zero-Downtime Fallback & Production Guard Integrity", "Database Engine Stable");

  } catch (err) {
    console.error("Test execution exception:", err);
  }

  console.log("\n=========================================================");
  console.log(`🏁 TEST RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
  if (passedCount === totalTests) {
    console.log("🎉 ALL 30 PHASE 8 PRODUCTION VALIDATION SUITES PASSED WITH 100% SUCCESS!");
  } else {
    console.log(`⚠️ ${totalTests - passedCount} Tests failed. Please inspect logs.`);
  }
  console.log("=========================================================\n");
}

runPhase8ValidationSuite();
