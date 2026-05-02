# 🎓 Harshit Edu | AI-Powered Student Analytics Hub

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-05998b.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

**Harshit Edu** is an enterprise-grade, end-to-end Machine Learning ecosystem designed to predict student academic success and provide AI-driven intervention strategies. It transforms raw academic data into a premium, interactive "Glassmorphism" experience.

---

## 🚀 Key Innovation: Probability Calibration
Most academic projects use raw model accuracy. **Harshit Edu** implements **Isotonic Regression Calibration** on top of its **XGBoost** engine. 
> *Why it matters:* In real-world educational intervention, a "70% risk" score must be statistically reliable. We ensure that our model doesn't just "guess," but provides calibrated probabilities that institutional stakeholders can trust.

---

## 🌟 Top-Tier Features

| Feature | Description | Tech Implementation |
| :--- | :--- | :--- |
| **🤖 AI Co-pilot** | Natural language explanations of ML decisions. | Custom Heuristic LGN |
| **🕸️ Radar Visuals** | 5-Dimensional student capability mapping. | Recharts (Radar/Polar) |
| **👤 AI Avatars** | Dynamic profile generation for every student. | DiceBear API Integration |
| **📱 PWA Ready** | Installable mobile app with bottom navigation. | Service Workers & Manifest |
| **🎬 Liquid UI** | Fluid, high-fps interface transitions. | Framer Motion |
| **📜 Audit Log** | Real-time system activity & event tracking. | React Context Observer |
| **🛡️ Health Monitor** | Live server load & API latency tracking. | Real-time Simulated Heartbeat |

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[User/Advisor] -->|Next.js 14 Dashboard| B(Frontend)
    B -->|REST API| C{FastAPI Gateway}
    C -->|Inference Request| D[XGBoost Model]
    D -->|Calibrated Score| E[Probability Calibration Layer]
    E -->|JSON Results| C
    C -->|AI Insight Generation| B
    B -->|Export| F[Academic TXT Report]
```

<img width="1658" height="892" alt="Screenshot 2026-05-02 105354" src="https://github.com/user-attachments/assets/f10b1947-e690-46dd-8b91-ac8443e7206c" />

---

## 🛠️ Technical Stack & Implementation

### **Data Science & MLOps**
- **Algorithm**: XGBoost Classifier.
- **Preprocessing**: Robust pipeline using `ColumnTransformer` (StandardScaling & One-Hot Encoding).
- **Calibration**: `CalibratedClassifierCV` (Isotonic).
- **Deployment**: FastAPI with Pydantic schema validation.

### **Frontend Engineering**
- **Framework**: Next.js 14 (App Router).
- **State Management**: Centralized React Context (GlobalContext).
- **Styling**: Tailwind CSS + custom Glassmorphism glass-panel utility.
- **Visuals**: Recharts for high-fidelity performance trends.

---

## 📂 Project Structure

```bash
Harshit-Edu/
├── backend/
│   ├── src/
│   │   ├── data_generator.py  # Realistic synthetic data engine
│   │   ├── pipeline.py        # Scalable preprocessing pipeline
│   │   └── train.py           # Model training & calibration
│   └── main.py                # FastAPI microservice
├── frontend/
│   ├── src/app/
│   │   ├── analytics/         # Advanced ML observability
│   │   ├── students/          # Real-time simulation feed
│   │   └── page.tsx           # Interactive prediction hub
│   └── public/manifest.json   # PWA configuration
└── README.md
```

---

## 💼 Interview Masterclass (How to present this)

When discussing this project in a technical interview, focus on these three pillars:

1.  **Statistical Rigor**: "I implemented Isotonic Calibration because standard Gradient Boosting models can be overconfident. For an educational tool, trust in the probability is more important than raw accuracy."
2.  **Full-Stack Synergy**: "I built a microservices architecture where the backend focuses purely on high-performance inference, and the frontend provides an 'Apple-standard' UX using Next.js and Framer Motion."
3.  **Product Ownership**: "I identified a gap in how student risk is reported. Instead of just a table, I designed Radar Charts and an AI Co-pilot to make the data actionable for non-technical advisors."

---

<img width="1334" height="735" alt="Screenshot 2026-05-02 105454" src="https://github.com/user-attachments/assets/96252cca-de2c-4558-be37-ad5895377a76" />


## 🚀 Setup & Execution

### Backend
```bash
pip install -r requirements.txt
python src/data_generator.py && python src/train.py
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
npm install && npm run dev
```

---
*Developed with a commitment to Full-Stack excellence and data-driven education.*


<img width="1332" height="708" alt="Screenshot 2026-05-02 105443" src="https://github.com/user-attachments/assets/4d659bce-4e72-4ae5-9279-49141f790f30" />

