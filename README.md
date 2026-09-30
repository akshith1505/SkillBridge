# SkillBridge — AI-Powered Industry Skill Demand & Training Alignment Platform
**SIH26134 Smart India Hackathon Production Platform**

SkillBridge bridges the systemic gap between academic engineering curricula, student competencies, real-time employer hiring demand, and national labour policy using an explainable AI and predictive intelligence engine.

---

## 1. System Architecture

```
                          ┌───────────────────────────────────────────────┐
                          │         SkillBridge React 19 Frontend         │
                          │   Vite • React Router 7 • SSE Sync • Canvas   │
                          └──────────────────────┬────────────────────────┘
                                                 │ HTTP REST + Bearer JWT + SSE
                                                 ▼
                          ┌───────────────────────────────────────────────┐
                          │         Express.js Production Backend         │
                          │      Helmet • Rate Limit • Input Sanitizer    │
                          └──────────────┬────────────────┬───────────────┘
                                         │                │
                 ┌───────────────────────┴─┐            ┌─┴────────────────────────┐
                 ▼                         ▼            ▼                          ▼
       [ AI Intelligence Pipeline ]  [ Real-Time SSE ]  [ PostgreSQL Database ]  [ Embedded Store ]
       • Multi-Factor Readiness      Live cross-tab     14 Normalized Tables &   Zero-downtime offline
       • Multi-Factor Job Fit        event bus          Versioned Migrations     fallback mode
       • Priority Learning Engine
       • Predictive Demand Forecast
```

---

## 2. Key Modules & Capabilities

### 🎓 1. Student Career & Skill Assessment Hub
- **Explainable Weighted Readiness Score**:
  $$\text{Readiness} = 35\% \cdot \text{Skills} + 20\% \cdot \text{Assessment} + 15\% \cdot \text{Career Fit} + 15\% \cdot \text{Market Demand} + 10\% \cdot \text{Projects} + 5\% \cdot \text{Soft Skills}$$
- **Interactive Coding Practice Sheet (NeetCode & LeetCode Style)**:
  - High-density, compact practice table categorized across **SQL**, **Data Structures & Algorithms**, **Python**, **JavaScript**, **React**, and **Docker**.
  - **Instant Search & Status Filters**: Filter by problem name, algorithmic pattern, or target hiring company (*Amazon, Google, Meta*), plus status toggles (`[All]`, `[⏳ Unsolved]`, `[✅ Solved]`).
  - **1-Click Checkbox**: Instant `[ ]` ➔ `[✓]` solve toggle that recalculates student readiness and animates completion diagrams.
  - **Interactive Problem Workspace Modal**: Clicking any problem row opens a modal with full problem statement, algorithmic pattern intuition, pre-loaded code blueprint (SQL, Python, JS, Docker) with copy action, and direct external links (`Open on LeetCode / HackerRank ↗`).
- **Prominent Visual Completion Diagrams**:
  - **Circular SVG Donut Gauge**: Real-time solved vs remaining ratio (`X of Y Done`, `Z% Solved`), animated progress ring, and difficulty tier counts (Easy / Medium / Hard).
  - **Skill Mastery 2-Segment Bars**: Visual green (solved) vs gray (remaining) distribution per skill with past baseline vs current proficiency comparison (`60% ➔ 76%`).
- **Distributed Systems Logic & Architecture Puzzles**:
  - Interactive production scenarios: Distributed Cache Stampede, JS Event Loop & Microtasks, Relational DB Deadlocks, Token Bucket Rate Limiting, and High-Throughput Notification Dispatching.
- **Diagnostic Technical Skill Benchmark**:
  - 10-question evaluation benchmark with immediate feedback, strength/weakness categorization, and verified skill credits.
- **Dynamic Adaptive Roadmap**: Automatically tracks completed milestones and schedules next-best skills based on the Priority Formula:
  $$\text{Priority Score} = \text{Gap} \times \text{Industry Demand} \times \text{Career Importance}$$

---

### 🏫 2. Training Institute Alignment & Intelligence Portal
- **Cohort Placement Readiness Donut Chart**:
  - Multi-segment circular SVG donut displaying:
    - 🟢 **Placement Ready**: $58\%$ (842 graduating students)
    - 🔵 **Almost Ready (Bridge Needed)**: $28\%$ (406 students requiring short bridge modules)
    - 🟠 **Needs Lab Training**: $14\%$ (202 students with critical technical gaps)
  - Centered metric: `71% Average Cohort Readiness`.
  - Enrolled Batch Comparison tracks (CSE-A at $78\%$, CSE-B at $74\%$, IT-A at $65\%$, AI-DS at $69\%$).
- **Curriculum Alignment vs Industry Demand Deficit Visualizer**:
  - **Dual-Segment Proportional Progress Tracks**: Visualizes **Current Syllabus Coverage %** (Green) against **Industry Gap Deficit %** (Red/Amber) for every academic course.
  - **Live Hiring Demand Signals**: Displays employer market demand index (e.g. $96\%$ for AI/ML, $94\%$ for Cloud Computing, $92\%$ for Full Stack).
  - **Gap Severity Badges**: `Critical Urgent`, `High Priority`, `Medium`, and `Low`.
  - **Missing Tech Stacks**: Identifies exact missing stacks (e.g. *Docker, Kubernetes, PyTorch, CI/CD, Redis*).
  - **Interactive Filters**: `[All Courses]`, `[⚠️ Critical Gaps Only]`, `[🔥 High Demand]`.
  - **Course Audit & Bridge Module Deployment**: One-click cohort deployment of 4-week industry bridge labs directly to student batches.

---

### 🏛️ 3. National Labour Policy & Intelligence Portal
- **Visual Skill Demand & Supply Deficit Diagrams**:
  - Metallic rank badges (`#1`, `#2`, `#3`), tech icons, and gradient visual bars.
  - **Dual-Mode Visualizer**:
    1. *Top In-Demand Industry Skills*: Proportional employer hiring volume distribution ($96\%$, $94\%$, $87\%$, $82\%$, $75\%$).
    2. *Demand vs Supply Comparison*: Compares graduate supply against industry target demand to highlight regional and national skill deficit gaps.
- **Predictive Skill Demand Forecasting**:
  - Categorizes market skills into *Critical Shortage, High Growth, Emerging, Stable Core, Declining* with automated state policy interventions.
- **National Employability Score**:
  - Real-time multi-factor benchmark ($76.4\%$) calculated across all participating academic cohorts.
- **5-Step Cross-Portal Alignment Pipeline**:
  $$\text{Employer Demand} \longrightarrow \text{Student Gap} \longrightarrow \text{Institute Coverage} \longrightarrow \text{Government Policy} \longrightarrow \text{Employability}$$

---

### 🏢 4. Employer Talent & Hiring Portal
- **AI Candidate Ranking**: Multi-factor candidate ranking for specific job requisitions ($50\%$ Skills, $20\%$ Career, $10\%$ Experience, $10\%$ Location, $5\%$ Work Mode, $5\%$ Salary) with instant interview recommendations.
- **Live Ingested Demand Signals**: Broadcast hiring volume forecasts directly into national labour intelligence.
- **Automated Shortlisting & Verification**: Verified competency checks based on completed LeetCode challenges, scenario puzzles, and diagnostic quizzes.

---

## 3. Platform Architecture & Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend UI** | React 19, Vite, React Router 7, Pure SVG Data Visualization, CSS3 Modern Flex/Grid |
| **Backend API** | Node.js, Express.js (ES Modules), Helmet, Express Rate Limit, CORS |
| **Database** | PostgreSQL 14+ with 14 Normalized Relational Tables + Embedded Zero-Config Fallback Store |
| **Real-Time Sync** | Server-Sent Events (SSE) Cross-Portal Broadcast Bus |
| **Security** | JWT Authentication, BCrypt Password Hashing, Role-Based Access Control (RBAC) |
| **Code Quality** | Oxlint (0 errors, 0 warnings), Vite Build Pipeline (<600ms build time) |

---

## 4. Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm 9+
- Optional: PostgreSQL 14+ (Automatically falls back to embedded high-performance engine if PostgreSQL is not active)

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/Rohithsai-oops/industry-skill-alignment-platform.git
cd industry-skill-alignment-platform

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Execute database migrations & seed initial dataset
npm run db:migrate
npm run db:seed

# 4. Start backend server (Port 5000)
npm run server

# 5. In a new terminal, start frontend (Port 5174)
npm run dev
```

---

## 5. Docker Deployment

Orchestrate the entire platform (PostgreSQL, Backend API, and Frontend) in one command:

```bash
# Start all services with persistent database storage
docker-compose up --build -d

# View container logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- **Frontend App**: `http://localhost:5174` (or `http://localhost:5000` in production bundle)
- **Backend API**: `http://localhost:5000/api`
- **Health Endpoint**: `http://localhost:5000/api/health`
- **PostgreSQL Database**: `localhost:5432` (`skillbridge_db`)

---

## 6. SIH Demo Credentials

| Portal / Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@skillbridge.com` | `password123` / `123456` | Rahul Sharma (B.Tech CSE, 78% Readiness) |
| **🏢 Employer** | `contact@technovaenterprisesolutions.com` | `password123` | TechNova Enterprise Solutions |
| **🏫 Training Institute** | `dean.placement@apexinstitute.edu` | `password123` | Apex Institute of Technology |
| **🏛️ Government / Admin** | `admin@skillbridge.gov.in` | `password123` | National Labour Market Authority |

---

## 7. Automated Testing & Verification

Execute all validation suites (130 Automated Tests):
```bash
node test_phase10.js         # 25/25 Phase 10 Championship Release tests pass
node test_phase9.js          # 40/40 Phase 9 System Validation tests pass
node test_phase8.js          # 30/30 Phase 8 Production tests pass
node test_phase7.js          # 15/15 Phase 7 AI Intelligence tests pass
node test_production.js      # 20/20 Phase 6 Production regression tests pass
node test_load_performance.js # Safe load stress test (<2ms latency, memory <15MB)
npm run lint                 # oxlint: 0 errors, 0 warnings
npm run build                # vite build: clean production bundle (549ms)
```

---

## 8. Documentation Links

- 📖 **REST API & SSE Specification**: [`docs/API.md`](docs/API.md)
- 🎯 **Judge-Ready 8-10 Minute Presentation Guide**: [`docs/SIH_DEMO.md`](docs/SIH_DEMO.md)
