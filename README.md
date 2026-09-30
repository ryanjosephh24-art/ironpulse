# IronPulse — All-in-One Gym Member & Operations Hub

IronPulse is a high-performance, mobile-first companion web application engineered to eliminate the fragmentation common in fitness software. It bridges member experience directly with facility operations—combining encrypted rotating QR passes, progressive overload logging, real-time caloric telemetry, and simulated edge vision scanning into a cohesive, production-grade interface.

🌐 **Live Application:** [ironpulse-pi.vercel.app](https://ironpulse-pi.vercel.app)  
📂 **Source Code:** [github.com/ryanjosephh24-art/ironpulse](https://github.com/ryanjosephh24-art/ironpulse)

---

## Architecture & Core Modules

### 1. Dynamic Access Pass & Facility Telemetry
- **Tokenized QR Rotation:** High-contrast member pass with dynamic countdown intervals and real-time scanner readiness states.
- **Membership Operations:** Active tier monitoring (`Gold All-Access`), automated countdown badges, and rate-lock renewal alerts.

### 2. Edge Vision Scanner (Simulated)
- **Computer Vision Overlay:** Viewfinder targeting grid with animated telemetry line and responsive capture triggers.
- **Equipment & Biomechanics Recognition:** Identifies facility machines (e.g., *Hack Squat Machine*), isolates target muscle groups, and outputs real-time form cues.
- **Nutritional Inference:** Instant macro and caloric breakdown estimations for scanned meals.

### 3. Progressive Overload Engine
- **Session Telemetry:** Active routine logger featuring previous-session benchmarks (`Last: 32kg x 10`), interactive set completion states, and integrated rest timers.
- **Automated Load Optimization:** Evaluates session volume and generates progressive overload recommendations based on consecutive target reps.

### 4. Caloric Telemetry & Macro Visualization
- Circular target deficit rings paired with multi-channel macronutrient tracking (Protein, Carbohydrates, Fats).

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS |
| **Component Primitives** | shadcn/ui, Radix UI |
| **Icons** | Lucide React |
| **Deployment** | Vercel (Production Edge Network) |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm / npm / yarn

### Installation & Local Run

```bash
# Clone the repository
git clone [https://github.com/ryanjosephh24-art/ironpulse.git](https://github.com/ryanjosephh24-art/ironpulse.git)

# Navigate to project directory
cd ironpulse

# Install dependencies
pnpm install

# Start development server
pnpm dev

---

## Author & Engineering Profile

**Ryan Joseph**  
*Second-Year Information Technology Undergraduate | Web Systems & Product Builder*  
*Mumbai, India*

- **Focus:** Engineering high-density developer interfaces, responsive SaaS applications, and modern web architectures.
- **Projects:** [Pulse Telemetry Console](https://github.com/ryanjosephh24-art/pulse), [IronPulse](https://github.com/ryanjosephh24-art/ironpulse)
- **GitHub:** [@ryanjosephh24-art](https://github.com/ryanjosephh24-art)
- **Connect:** Available for software engineering internships, technical collaborations, and product discussions.
