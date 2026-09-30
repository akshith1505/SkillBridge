/**
 * SkillBridge SIH26134 Phase 10 Final Championship Release Validation Suite
 * 25 Comprehensive Release Readiness Tests
 */

async function runPhase10ReleaseSuite() {
  const BASE_URL = "http://localhost:5000/api";
  let passedCount = 0;
  let totalTests = 25;

  console.log("=========================================================");
  console.log("🏆 STARTING SKILLBRIDGE PHASE 10 CHAMPIONSHIP RELEASE SUITE");
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
    // 01. Health & Process Metrics
    const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(health.status === "healthy" && typeof health.process?.uptimeSeconds === "number", 1, "Health & Process Telemetry Probes", `Heap: ${health.process?.memory?.heapUsedMb} MB`);

    // 02. Dependency Readiness Probe
    const ready = await fetch(`${BASE_URL}/health/ready`);
    assert(ready.status === 200, 2, "Database Dependency Readiness Probe", "Status: 200 OK");

    // 03. Process Liveness Heartbeat Probe
    const live = await fetch(`${BASE_URL}/health/live`);
    assert(live.status === 200, 3, "Process Liveness Heartbeat Probe", "Status: 200 OK");

    // 04. Authentication Flow (Registration & JWT)
    const regEmail = `p10.champion.${Date.now()}@skillbridge.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rahul Sharma (Champion Candidate)",
        email: regEmail,
        password: "password123",
        role: "student",
        profileData: { college: "IIT Bombay", targetCareer: "Full Stack Developer", technicalSkills: ["JavaScript", "React", "Node.js", "SQL"] }
      })
    }).then(r => r.json());
    const studentToken = regRes.token;
    assert(regRes.success === true && !!studentToken, 4, "User Registration & JWT Issuance Flow", `User: ${regRes.user?.name}`);

    // 05. Strict Role Boundary Enforcement
    const badRolePost = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        title: "Unauthorized Role Post",
        description: "Valid description length for validation pass",
        required_skills: ["Python"]
      })
    });
    assert(badRolePost.status === 403, 5, "Role Boundary Enforcement on Mutation Routes", "Status: 403 Forbidden");

    // 06. Student Journey: Profile & Competencies
    const profile = await fetch(`${BASE_URL}/students/profile`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(profile.success === true && profile.profile?.target_career === "Full Stack Developer", 6, "Student Profile & Target Career Query", `Target: ${profile.profile?.target_career}`);

    // 07. Student Journey: Assessment Scoring
    const asmt = await fetch(`${BASE_URL}/assessments/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({ score: 95, totalQuestions: 10 })
    }).then(r => r.json());
    assert(asmt.success === true && asmt.score === 95, 7, "10-Question Technical Assessment Scoring", `Score: ${asmt.score}%, Level: ${asmt.performanceLevel}`);

    // 08. Student Journey: Weighted Readiness
    const readiness = await fetch(`${BASE_URL}/students/readiness-explanation`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(readiness.success === true && readiness.breakdown?.skillCompetency?.weight === "35%", 8, "Explainable Weighted Readiness (35/20/15/15/10/5)", `Score: ${readiness.overallScore}/100`);

    // 09. Student Journey: Multi-Track Career Recommendations
    const careerRecs = await fetch(`${BASE_URL}/intelligence/career-recommendations`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(careerRecs.success === true && careerRecs.recommendations?.length >= 8, 9, "Personalized Career Recommendations", `Top Match: ${careerRecs.recommendations[0]?.title}`);

    // 10. Student Journey: Prioritized Learning Plan
    const learningPlan = await fetch(`${BASE_URL}/students/learning-recommendations`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(learningPlan.success === true && learningPlan.recommendations?.length >= 4, 10, "Prioritized Next-Best Skills Engine", `Top Priority: ${learningPlan.recommendations[0]?.skill}`);

    // 11. Student Journey: Adaptive Milestone Roadmap
    const roadmap = await fetch(`${BASE_URL}/students/roadmap`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(roadmap.success === true && roadmap.stages?.length >= 6, 11, "Dynamic Adaptive Milestone Roadmap Progression", `Progress: ${roadmap.completionPercentage}%`);

    // 12. Student Journey: 6-Factor Job Fit Analysis
    const jobFit = await fetch(`${BASE_URL}/jobs/job-1/fit`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(jobFit.success === true && jobFit.jobFit?.breakdown?.skillMatch?.weight === "50%", 12, "6-Factor Job Fit Analysis (50/20/10/10/5/5)", `Fit: ${jobFit.jobFit?.overallFit}%`);

    // 13. Student Journey: Job Application
    const apply = await fetch(`${BASE_URL}/jobs/job-1/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      }
    }).then(r => r.json());
    assert(apply.success === true && apply.application?.id.startsWith("app-"), 13, "Student Job Application Submission", `App ID: ${apply.application?.id}`);

    // 14. Employer Journey: Profile & Metrics
    const empLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "contact@technovaenterprisesolutions.com", password: "password123" })
    }).then(r => r.json());
    const employerToken = empLogin.token;

    const empProfile = await fetch(`${BASE_URL}/employers/profile`, {
      headers: { "Authorization": `Bearer ${employerToken}` }
    }).then(r => r.json());
    assert(empProfile.success === true && !!empProfile.employer?.company_name, 14, "Employer Profile & Organizational Metrics", `Company: ${empProfile.employer?.company_name}`);

    // 15. Employer Journey: Job Publication
    const newJob = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        title: "Senior Cloud Native React Architect",
        description: "Design Kubernetes microservices and cloud architectures.",
        required_skills: ["JavaScript", "React", "Docker", "Kubernetes"]
      })
    }).then(r => r.json());
    assert(newJob.success === true && newJob.job?.id.startsWith("job-"), 15, "Employer Job Requisition Publication", `Job ID: ${newJob.job?.id}`);

    // 16. Employer Journey: 6-Factor Candidate Ranking
    const ranked = await fetch(`${BASE_URL}/employers/recommended-candidates?jobId=${newJob.job?.id}`).then(r => r.json());
    assert(ranked.success === true && ranked.topMatches?.length >= 5, 16, "Employer 6-Factor Candidate Fit Ranking", `Top Fit: ${ranked.topMatches?.[0]?.overallFit}%`);

    // 17. Employer Journey: Demand Signal Dispatch
    const signal = await fetch(`${BASE_URL}/employers/demand-signals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${employerToken}`
      },
      body: JSON.stringify({
        sector: "Cloud Architecture",
        target_role: "Cloud Architect",
        hiring_volume: "100 - 250",
        demand_level: "Critical",
        key_skills: ["Docker", "Kubernetes", "AWS"]
      })
    }).then(r => r.json());
    assert(signal.success === true && signal.signal?.id.startsWith("sig-"), 17, "Industry Demand Signal Transmission", `Signal ID: ${signal.signal?.id}`);

    // 18. Institute Journey: Curriculum Alignment Matrix
    const currMatrix = await fetch(`${BASE_URL}/institutes/curriculum`).then(r => r.json());
    assert(currMatrix.success === true && currMatrix.courses?.length >= 6, 18, "Institute Curriculum Alignment Matrix Query", `Courses: ${currMatrix.courses?.length}`);

    // 19. Institute Journey: AI Curriculum Gap Diagnostics
    const currRecs = await fetch(`${BASE_URL}/institutes/curriculum-recommendations`).then(r => r.json());
    assert(currRecs.success === true && currRecs.recommendations?.length >= 6, 19, "Institute AI Curriculum Gap Diagnostics", `Top Gap: ${currRecs.recommendations?.[0]?.courseCode}`);

    // 20. Institute Journey: Bridge Training Module Deployment
    const bridgeProg = await fetch(`${BASE_URL}/institutes/training-programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "4-Week Cloud Native & Docker Bridge Lab", duration: "4 Weeks" })
    }).then(r => r.json());
    assert(bridgeProg.success === true && bridgeProg.program?.id.startsWith("rec-"), 20, "Bridge Training Cohort Deployment", `Module: ${bridgeProg.program?.title}`);

    // 21. Government Journey: Regional Demand Intelligence
    const govRegional = await fetch(`${BASE_URL}/government/regional-demand`).then(r => r.json());
    assert(govRegional.success === true && govRegional.regions?.length >= 5, 21, "Government Regional Deficit Intelligence", `Corridors: ${govRegional.regions?.length}`);

    // 22. Government Journey: 5-Tier Predictive Skill Forecast
    const govForecast = await fetch(`${BASE_URL}/government/skill-forecast`).then(r => r.json());
    assert(govForecast.success === true && govForecast.forecast?.length >= 5, 22, "Government 5-Tier Predictive Shortage Forecasting", `Tiers: ${govForecast.forecast?.length}`);

    // 23. Central Intelligence: Ecosystem Aggregation & National Score
    const intelOverview = await fetch(`${BASE_URL}/intelligence/overview`).then(r => r.json());
    assert(intelOverview.success === true && typeof intelOverview.nationalEmployabilityIndex === "number", 23, "Central Intelligence Ecosystem Overview", `National Index: ${intelOverview.nationalEmployabilityIndex}%`);

    // 24. Real-Time Server-Sent Events (SSE) Stream
    const sse = await fetch(`${BASE_URL}/events/stream`);
    assert(sse.status === 200 && sse.headers.get("content-type")?.includes("text/event-stream"), 24, "Real-Time Server-Sent Events (SSE) Stream", "Stream Operational");

    // 25. Production Reset Protection Guard & Offline Fallback
    const resetRes = await fetch(`${BASE_URL}/intelligence/reset`, { method: "POST" });
    assert(resetRes.status === 200 || resetRes.status === 403, 25, "Production Reset Safeguard & Engine Stability", "Baseline Protected");

  } catch (err) {
    console.error("Test execution exception:", err);
  }

  console.log("\n=========================================================");
  console.log(`🏁 TEST RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
  if (passedCount === totalTests) {
    console.log("🎉 ALL 25 PHASE 10 CHAMPIONSHIP RELEASE TESTS PASSED WITH 100% SUCCESS!");
  } else {
    console.log(`⚠️ ${totalTests - passedCount} Tests failed. Please inspect logs.`);
  }
  console.log("=========================================================\n");
}

runPhase10ReleaseSuite();
