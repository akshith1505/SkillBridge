/**
 * Test Suite: AI Situation Analyzer & Career Guidance System
 */

import { analyzeStudentSituation } from "./backend/services/aiSituationService.js";

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

async function runTests() {
  console.log("\n=========================================================");
  console.log("🤖 TESTING SKILLBRIDGE AI SITUATION ANALYZER & GUIDANCE");
  console.log("=========================================================\n");

  // Test 1: User's exact scenario (Graduation 2028, CGPA 6.1, Docker, no certs)
  try {
    const context1 = {
      situationText: "I'm in 2nd year CSE, my CGPA is 6.1. I only know basic Docker, have no certifications, and I don't know what career to aim for or what to do.",
      academicContext: {
        degree: "B.Tech",
        department: "Computer Science & Engineering",
        graduationYear: "2028",
        cgpa: "6.1"
      },
      currentSkills: ["Docker"],
      certifications: "nothing"
    };

    const res1 = await analyzeStudentSituation(context1);

    assert(res1.success === true, "Analysis success response", `Engine: ${res1.engine}`);
    assert(res1.diagnostic.runwayYears >= 2, "Graduation runway calculation", `Runway: ${res1.diagnostic.runwayLabel}`);
    assert(res1.diagnostic.cgpaStanding === "Needs Strategic Compensation", "CGPA compensation diagnosis", `CGPA: 6.1 -> ${res1.diagnostic.cgpaStanding}`);
    assert(!!res1.diagnostic.cgpaStrategy, "CGPA recovery strategy generated", res1.diagnostic.cgpaStrategy.slice(0, 70) + "...");
    assert(!!res1.recommendation.primaryRole, "Primary role recommended", `Role: ${res1.recommendation.primaryRole} (${res1.recommendation.primaryIndustry})`);
    assert(!!res1.recommendation.alternativeRole, "Alternative role recommended", `Role: ${res1.recommendation.alternativeRole}`);
    assert(Array.isArray(res1.requirements.mustHaveSkills) && res1.requirements.mustHaveSkills.length > 0, "Must-have skills list", `Skills: ${res1.requirements.mustHaveSkills.join(", ")}`);
    assert(Array.isArray(res1.requirements.projectIdeas) && res1.requirements.projectIdeas.length >= 2, "Project blueprints generated", `Count: ${res1.requirements.projectIdeas.length}`);
    assert(Array.isArray(res1.actionPlan) && res1.actionPlan.length === 4, "4-Phase Guidance Roadmap", `Phases: ${res1.actionPlan.map(p => p.name).join(" | ")}`);
    assert(Array.isArray(res1.quickStartTasks) && res1.quickStartTasks.length === 3, "3 Actionable quickstart tasks", res1.quickStartTasks[0]);
  } catch (err) {
    assert(false, "Test 1 Error", err.message);
  }

  // Test 2: Pre-final year student with web dev & high CGPA
  try {
    const context2 = {
      situationText: "I am graduating in 2026 with 8.5 CGPA. I know JavaScript and React. What is my next milestone?",
      academicContext: {
        degree: "B.Tech",
        department: "Information Technology",
        graduationYear: "2026",
        cgpa: "8.5"
      },
      currentSkills: ["JavaScript", "React", "HTML/CSS"],
      certifications: ""
    };

    const res2 = await analyzeStudentSituation(context2);
    assert(res2.recommendation.primaryRole === "Full Stack Developer", "Web skillset maps to Full Stack Developer", `Role: ${res2.recommendation.primaryRole}`);
    assert(res2.diagnostic.cgpaStanding === "Strong Academic Standing", "High CGPA classified correctly", `CGPA: 8.5`);
  } catch (err) {
    assert(false, "Test 2 Error", err.message);
  }

  // Test 3: Complete beginner with zero input
  try {
    const context3 = {
      situationText: "",
      academicContext: {},
      currentSkills: [],
      certifications: ""
    };

    const res3 = await analyzeStudentSituation(context3);
    assert(res3.success === true, "Graceful handling of empty input", `Default role: ${res3.recommendation.primaryRole}`);
    assert(res3.actionPlan.length === 4, "Complete 4-phase plan for beginner", `Phase 1: ${res3.actionPlan[0].name}`);
  } catch (err) {
    assert(false, "Test 3 Error", err.message);
  }

  // Test 4: User's exact prompt "i need to learn react"
  try {
    const context4 = {
      situationText: "i need to learn react",
      academicContext: {
        degree: "B.Tech",
        department: "Computer Science & Engineering",
        graduationYear: "2026",
        cgpa: ""
      },
      currentSkills: [],
      certifications: ""
    };

    const res4 = await analyzeStudentSituation(context4);
    assert(res4.success === true, "React analysis response successful", `Role: ${res4.recommendation.primaryRole}`);
    assert(res4.recommendation.primaryRole === "Frontend Developer", "React query maps to Frontend Developer", `Primary: ${res4.recommendation.primaryRole}`);
    assert(res4.recommendation.primaryIndustry === "Software / IT", "Industry is Software / IT", `Industry: ${res4.recommendation.primaryIndustry}`);
    assert(res4.diagnostic.headline.includes("React"), "Diagnostic headline highlights React", res4.diagnostic.headline);
    assert(res4.diagnostic.cgpaStanding === "Unspecified / Skills-First", "Unspecified CGPA does not show false warning", res4.diagnostic.cgpaStanding);
    assert(res4.requirements.mustHaveSkills.includes("React"), "Must-have skills include React", res4.requirements.mustHaveSkills.join(", "));
    assert(res4.actionPlan[1].name.includes("React Core"), "Phase 2 focuses on React Core", res4.actionPlan[1].name);
    assert(res4.requirements.projectIdeas.some(p => p.toLowerCase().includes("react")), "Project blueprints include React projects", res4.requirements.projectIdeas[0]);
    assert(res4.quickStartTasks.some(t => t.includes("React") || t.includes("ES6+")), "Quick start tasks guide React preparation", res4.quickStartTasks[0]);
  } catch (err) {
    assert(false, "Test 4 Error", err.message);
  }

  // Test 5: Data Science / Predictive modeling query
  try {
    const context5 = {
      situationText: "I want to become a data scientist and work on predictive machine learning models.",
      academicContext: {
        degree: "B.Tech",
        department: "Data Science",
        graduationYear: "2027",
        cgpa: "7.8"
      },
      currentSkills: ["Python", "SQL"],
      certifications: ""
    };

    const res5 = await analyzeStudentSituation(context5);
    assert(res5.recommendation.primaryRole === "Data Scientist" || res5.recommendation.primaryRole === "AI / ML Engineer", "Data science query maps to Data Scientist / AI ML", res5.recommendation.primaryRole);
    assert(res5.diagnostic.cgpaStanding === "Strong Academic Standing", "7.8 CGPA classified as Strong Academic Standing", res5.diagnostic.cgpaStanding);
  } catch (err) {
    assert(false, "Test 5 Error", err.message);
  }

  console.log("\n=========================================================");
  console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
  console.log("=========================================================\n");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
