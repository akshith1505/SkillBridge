/**
 * SkillBridge SIH26134 Phase 7 Automated AI Intelligence & Predictive Analytics Test Suite
 */

async function runPhase7TestSuite() {
  const BASE_URL = "http://localhost:5000/api";
  let passedCount = 0;
  let totalTests = 15;

  console.log("=========================================================");
  console.log("🧠 STARTING SKILLBRIDGE PHASE 7 AI INTELLIGENCE TEST SUITE");
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
    // 1. Central Intelligence Overview with AI Provider & National Employability
    const overview = await fetch(`${BASE_URL}/intelligence/overview`).then(r => r.json());
    assert(
      overview.success === true &&
      overview.nationalEmployabilityIndex >= 60 &&
      overview.aiProvider.includes("Explainable"),
      1,
      "Ecosystem Intelligence with National Employability Index",
      `Score: ${overview.nationalEmployabilityIndex}%, Provider: ${overview.aiProvider}`
    );

    // 2. Personalized Career Recommendations
    const careerRecs = await fetch(`${BASE_URL}/intelligence/career-recommendations`).then(r => r.json());
    assert(
      careerRecs.success === true &&
      careerRecs.recommendations.length >= 8 &&
      typeof careerRecs.recommendations[0].matchPercentage === "number",
      2,
      "Personalized Career Recommendations",
      `Top: ${careerRecs.recommendations[0]?.title} (${careerRecs.recommendations[0]?.matchPercentage}%, ${careerRecs.recommendations[0]?.confidence})`
    );

    // 3. Predictive Skill Demand Forecast
    const forecast = await fetch(`${BASE_URL}/intelligence/skill-forecast`).then(r => r.json());
    assert(
      forecast.success === true &&
      forecast.forecast.some(f => f.category === "Critical Shortage"),
      3,
      "Predictive Skill Demand Forecasting",
      `Critical Count: ${forecast.forecast.filter(f => f.category === "Critical Shortage").length}`
    );

    // 4. Weighted Explainable Readiness Diagnostic
    const readiness = await fetch(`${BASE_URL}/students/readiness-explanation`).then(r => r.json());
    assert(
      readiness.success === true &&
      readiness.overallScore >= 70 &&
      readiness.breakdown?.skillCompetency?.weight === "35%",
      4,
      "Explainable Weighted Readiness Algorithm (35/20/15/15/10/5)",
      `Overall Score: ${readiness.overallScore}/100`
    );

    // 5. Explainability Text Verification
    assert(
      readiness.explanation.includes("Your Overall Readiness Score") &&
      !readiness.explanation.includes("Black-box AI"),
      5,
      "Transparent Natural Language Explainability",
      `Snippet: "${readiness.explanation.slice(0, 65)}..."`
    );

    // 6. Prioritized Learning Recommendations (Gap x Demand x Importance)
    const learningPlan = await fetch(`${BASE_URL}/students/learning-recommendations`).then(r => r.json());
    assert(
      learningPlan.success === true &&
      learningPlan.recommendations.length >= 4 &&
      typeof learningPlan.recommendations[0].priorityScore === "number",
      6,
      "Prioritized Personalized Learning Engine",
      `Top Priority: ${learningPlan.recommendations[0]?.skill} (Score: ${learningPlan.recommendations[0]?.priorityScore})`
    );

    // 7. Dynamic Adaptive Learning Roadmap
    const roadmap = await fetch(`${BASE_URL}/students/roadmap`).then(r => r.json());
    assert(
      roadmap.success === true &&
      typeof roadmap.completionPercentage === "number" &&
      roadmap.stages.length >= 6,
      7,
      "Dynamic Adaptive Roadmap Sequencing",
      `Progress: ${roadmap.completionPercentage}%, Estimated Time: ${roadmap.estimatedTimeToJobReadiness}`
    );

    // 8. Multi-Factor Job Fit Breakdown (50/20/10/10/5/5)
    const jobFit = await fetch(`${BASE_URL}/jobs/job-1/fit`).then(r => r.json());
    assert(
      jobFit.success === true &&
      jobFit.jobFit?.breakdown?.skillMatch?.weight === "50%" &&
      typeof jobFit.jobFit?.overallFit === "number",
      8,
      "Multi-Factor Job Fit Calculation",
      `Fit: ${jobFit.jobFit?.overallFit}%, Tier: ${jobFit.jobFit?.recommendationTier}`
    );

    // 9. Employer Recommended Candidate Ranking
    const rankedCandidates = await fetch(`${BASE_URL}/employers/recommended-candidates`).then(r => r.json());
    assert(
      rankedCandidates.success === true &&
      rankedCandidates.topMatches.length >= 5 &&
      rankedCandidates.topMatches[0].overallFit >= rankedCandidates.topMatches[1].overallFit,
      9,
      "Employer Multi-Factor Candidate Ranking",
      `Rank 1: ${rankedCandidates.topMatches[0]?.name} (${rankedCandidates.topMatches[0]?.overallFit}% Fit)`
    );

    // 10. Institute AI Curriculum Gap Diagnostics
    const currRecs = await fetch(`${BASE_URL}/institutes/curriculum-recommendations`).then(r => r.json());
    assert(
      currRecs.success === true &&
      currRecs.recommendations.length >= 6 &&
      currRecs.recommendations[0].gapPercentage > 0,
      10,
      "Institute AI Curriculum Upgrade Diagnostics",
      `Top Course Gap: ${currRecs.recommendations[0]?.courseCode} (${currRecs.recommendations[0]?.gapPercentage}% Gap)`
    );

    // 11. Government Regional Demand & Skill Shortages
    const govForecast = await fetch(`${BASE_URL}/government/skill-forecast`).then(r => r.json());
    assert(
      govForecast.success === true &&
      govForecast.forecast.some(f => f.policyIntervention.length > 10),
      11,
      "Government Policy Recommendations & Interventions",
      `Intervention: "${govForecast.forecast[0]?.policyIntervention.slice(0, 50)}..."`
    );

    // 12. Authentication & Authorization Guard
    const studentLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student@skillbridge.com", password: "password123" })
    }).then(r => r.json());
    const studentToken = studentLogin.token;

    const authCareerRecs = await fetch(`${BASE_URL}/intelligence/career-recommendations`, {
      headers: { "Authorization": `Bearer ${studentToken}` }
    }).then(r => r.json());
    assert(
      authCareerRecs.success === true && authCareerRecs.recommendations.length >= 8,
      12,
      "Authenticated Personalized Recommendations Query",
      "Token Accepted & Processed"
    );

    // 13. Role Boundary Enforcement
    const studentJobPost = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        title: "Unauthorized Student Job",
        description: "Student trying to post job directly",
        required_skills: ["JavaScript", "React"]
      })
    });
    assert(studentJobPost.status === 403, 13, "Role Boundary Enforcement on Mutation Routes", "Status: 403 Forbidden");

    // 14. Real-Time SSE Stream Handshake
    const sseRes = await fetch(`${BASE_URL}/events/stream`);
    assert(
      sseRes.status === 200 && sseRes.headers.get("content-type")?.includes("text/event-stream"),
      14,
      "Real-Time Intelligence Event Stream (SSE)",
      "Stream Connection Established"
    );

    // 15. Demo State Reset Integration
    const resetRes = await fetch(`${BASE_URL}/intelligence/reset`, { method: "POST" }).then(r => r.json());
    assert(resetRes.success === true, 15, "Full Ecosystem State Reset & Re-seeding", "Clean Baseline Re-established");

  } catch (err) {
    console.error("Test execution exception:", err);
  }

  console.log("\n=========================================================");
  console.log(`🏁 TEST RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
  if (passedCount === totalTests) {
    console.log("🎉 ALL PHASE 7 AI INTELLIGENCE SUITES PASSED WITH 100% SUCCESS!");
  } else {
    console.log(`⚠️ ${totalTests - passedCount} Tests failed. Please inspect logs.`);
  }
  console.log("=========================================================\n");
}

runPhase7TestSuite();
