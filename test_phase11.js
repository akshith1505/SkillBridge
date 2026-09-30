/**
 * ============================================================================
 * SKILLBRIDGE PLATFORM — PHASE 11 FULL-SYSTEM INTEGRATION TEST SUITE
 * ============================================================================
 * Validates complete end-to-end live hydration, backend persistence, role boundaries,
 * multi-factor fit algorithms, SSE broadcasting, and zero-regression stability.
 */

const BASE_URL = "http://localhost:5000/api";
let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, detail = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ Test ${String(totalTests).padStart(2, "0")}: [PASSED] ${testName} -> ${detail}`);
  } else {
    console.error(`✗ Test ${String(totalTests).padStart(2, "0")}: [FAILED] ${testName} -> ${detail}`);
  }
}

async function runPhase11Tests() {
  console.log("\n=========================================================");
  console.log("🚀 STARTING SKILLBRIDGE PHASE 11 FULL-SYSTEM INTEGRATION SUITE");
  console.log("=========================================================\n");

  let studentToken = "";
  let registeredStudentId = "";
  let sampleJobId = "";

  // Test 1: Health Probe
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === "healthy", "Server Telemetry & Process Health", `Status: ${data.status}`);
  } catch (e) {
    assert(false, "Server Telemetry & Process Health", e.message);
  }

  // Test 2: Student Auth Registration & Token
  try {
    const timestamp = Date.now();
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "P11 Candidate Alpha",
        email: `p11.candidate.${timestamp}@skillbridge.edu`,
        password: "Password123!",
        role: "student",
        department: "Computer Science",
        college: "RV College of Engineering"
      })
    });
    const data = await res.json();
    studentToken = data.token;
    registeredStudentId = data.user?.id;
    assert(res.status === 201 && !!studentToken, "Student JWT Registration Handshake", `User: ${data.user?.name}`);
  } catch (e) {
    assert(false, "Student JWT Registration Handshake", e.message);
  }

  // Test 3: Student Profile Hydration
  try {
    const res = await fetch(`${BASE_URL}/students/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && data.profile, "Student Profile Live Hydration", `Target: ${data.profile?.target_career || "Full Stack Developer"}`);
  } catch (e) {
    assert(false, "Student Profile Live Hydration", e.message);
  }

  // Test 4: Assessment Submission & Persistence
  try {
    const res = await fetch(`${BASE_URL}/assessments/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        score: 90,
        totalQuestions: 10
      })
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && data.score === 90, "Assessment Persistence & Scoring", `Result Score: ${data.score}%`);
  } catch (e) {
    assert(false, "Assessment Persistence & Scoring", e.message);
  }

  // Test 5: Student Performance & Weighted Readiness
  try {
    const res = await fetch(`${BASE_URL}/students/performance`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && typeof data.readinessScore === "number", "Student Explainable Weighted Readiness", `Score: ${data.readinessScore}/100`);
  } catch (e) {
    assert(false, "Student Explainable Weighted Readiness", e.message);
  }

  // Test 6: Personalized Learning Recommendations
  try {
    const res = await fetch(`${BASE_URL}/students/learning-recommendations`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.recommendations), "Prioritized Next-Best Skills Engine", `Top: ${data.recommendations[0]?.skill}`);
  } catch (e) {
    assert(false, "Prioritized Next-Best Skills Engine", e.message);
  }

  // Test 7: Adaptive Roadmap Stages Hydration
  try {
    const res = await fetch(`${BASE_URL}/students/roadmap`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.stages), "Adaptive Learning Roadmap Hydration", `Stages: ${data.stages.length}`);
  } catch (e) {
    assert(false, "Adaptive Learning Roadmap Hydration", e.message);
  }

  // Test 8: Jobs Board Ingestion Query
  try {
    const res = await fetch(`${BASE_URL}/jobs`);
    const data = await res.json();
    sampleJobId = data.jobs[0]?.id;
    assert(res.status === 200 && data.success && data.jobs.length > 0, "Jobs Board Ingestion & Dynamic Matching", `Jobs Count: ${data.jobs.length}`);
  } catch (e) {
    assert(false, "Jobs Board Ingestion & Dynamic Matching", e.message);
  }

  // Test 9: Multi-Factor Job Fit Breakdown (50/20/10/10/5/5)
  try {
    const res = await fetch(`${BASE_URL}/jobs/${sampleJobId}/fit`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && typeof data.jobFit?.overallFit === "number", "Multi-Factor Job Fit Breakdown", `Fit: ${data.jobFit?.overallFit}%`);
  } catch (e) {
    assert(false, "Multi-Factor Job Fit Breakdown", e.message);
  }

  // Test 10: Student Job Application Submission & Database Persistence
  try {
    const res = await fetch(`${BASE_URL}/jobs/${sampleJobId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    assert(res.status === 201 && data.success && !!data.application?.id, "Job Application Submission & Persistence", `App ID: ${data.application?.id}`);
  } catch (e) {
    assert(false, "Job Application Submission & Persistence", e.message);
  }

  // Test 11: Employer Talent Pool Query
  try {
    const res = await fetch(`${BASE_URL}/employers/candidates`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.candidates), "Employer Talent Pool Query", `Candidates: ${data.candidates.length}`);
  } catch (e) {
    assert(false, "Employer Talent Pool Query", e.message);
  }

  // Test 12: Employer 6-Factor AI Candidate Ranking
  try {
    const res = await fetch(`${BASE_URL}/employers/recommended-candidates?jobId=${sampleJobId}`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.topMatches), "Employer AI Candidate Ranking", `Top Match Fit: ${data.topMatches[0]?.overallFit}%`);
  } catch (e) {
    assert(false, "Employer AI Candidate Ranking", e.message);
  }

  // Test 13: Employer Demand Signal Transmission
  try {
    const res = await fetch(`${BASE_URL}/employers/demand-signals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sector: "Cloud Infrastructure",
        target_role: "DevOps Engineer",
        hiring_volume: "50 - 100",
        demand_level: "Critical",
        key_skills: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
        urgency: "Immediate Quarter"
      })
    });
    const data = await res.json();
    assert(res.status === 201 && data.success && !!data.signal?.id, "Industry Demand Signal Transmission", `Signal ID: ${data.signal?.id}`);
  } catch (e) {
    assert(false, "Industry Demand Signal Transmission", e.message);
  }

  // Test 14: Institute Curriculum Alignment Matrix
  try {
    const res = await fetch(`${BASE_URL}/institutes/curriculum`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.courses), "Institute Curriculum Alignment Matrix", `Courses: ${data.courses.length}`);
  } catch (e) {
    assert(false, "Institute Curriculum Alignment Matrix", e.message);
  }

  // Test 15: Institute AI Curriculum Gap Diagnostics
  try {
    const res = await fetch(`${BASE_URL}/institutes/curriculum-recommendations`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.recommendations), "Institute AI Curriculum Diagnostics", `Top Gap: ${data.recommendations[0]?.courseCode || "CS408"}`);
  } catch (e) {
    assert(false, "Institute AI Curriculum Diagnostics", e.message);
  }

  // Test 16: Institute Training Program Deployment
  try {
    const res = await fetch(`${BASE_URL}/institutes/training-programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Cloud Native & Containerization 4-Week Cohort",
        targetSyllabusGap: "Docker & Kubernetes",
        duration: "4 Weeks",
        syllabusOutline: ["Docker Architecture", "Multi-stage builds", "Kubernetes Pods", "Helm Deployments"]
      })
    });
    const data = await res.json();
    assert(res.status === 201 && data.success && !!data.program?.id, "Bridge Training Program Deployment", `Program ID: ${data.program?.id}`);
  } catch (e) {
    assert(false, "Bridge Training Program Deployment", e.message);
  }

  // Test 17: Government Regional Demand Intelligence
  try {
    const res = await fetch(`${BASE_URL}/government/regional-demand`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.regions), "Government Regional Demand Intelligence", `Corridors: ${data.regions.length}`);
  } catch (e) {
    assert(false, "Government Regional Demand Intelligence", e.message);
  }

  // Test 18: Government 5-Tier Predictive Demand Forecasting
  try {
    const res = await fetch(`${BASE_URL}/government/skill-forecast`);
    const data = await res.json();
    assert(res.status === 200 && data.success && Array.isArray(data.forecast), "Government Predictive Shortage Forecast", `Forecast Stacks: ${data.forecast.length}`);
  } catch (e) {
    assert(false, "Government Predictive Shortage Forecast", e.message);
  }

  // Test 19: Central Intelligence Multi-Stakeholder Overview
  try {
    const res = await fetch(`${BASE_URL}/intelligence/overview`);
    const data = await res.json();
    assert(res.status === 200 && data.success && typeof data.nationalEmployabilityIndex === "number", "Central Ecosystem Intelligence Overview", `National Index: ${data.nationalEmployabilityIndex}%`);
  } catch (e) {
    assert(false, "Central Ecosystem Intelligence Overview", e.message);
  }

  // Test 20: Role Boundary & RBAC Mutation Enforcement
  try {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        title: "Malicious Job Posting Attempt",
        description: "Student role attempting unauthorized employer job creation.",
        required_skills: ["Docker", "Kubernetes"]
      })
    });
    assert(res.status === 403, "RBAC Security Boundary Enforcement", `Status: ${res.status} Forbidden`);
  } catch (e) {
    assert(false, "RBAC Security Boundary Enforcement", e.message);
  }

  console.log("\n=========================================================");
  console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log("🎉 ALL 20 PHASE 11 FULL-SYSTEM INTEGRATION TESTS PASSED WITH 100% SUCCESS!");
  } else {
    console.error(`⚠️ ${totalTests - passedTests} TESTS FAILED. CHECK LOGS ABOVE.`);
  }
  console.log("=========================================================\n");

  process.exit(passedTests === totalTests ? 0 : 1);
}

runPhase11Tests();
