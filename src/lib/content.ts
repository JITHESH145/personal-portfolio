// Everything on the site is rendered from this file, and everything in this
// file comes from the resume. Do not add employers, metrics, technologies or
// claims that the resume does not support.

export const person = {
  name: "Jithesh Shaju P",
  nameLines: ["Jithesh", "Shaju P"],
  role: "Data Science & Machine Learning Specialist",
  summary:
    "Building intelligent systems with Machine Learning, Generative AI, Computer Vision, NLP, and data-driven engineering.",
  email: "jitheshps559@gmail.com",
  phone: "+91-9778557529",
  phoneHref: "tel:+919778557529",
  github: "https://github.com/JITHESH145",
  githubHandle: "JITHESH145",
  linkedin: "https://linkedin.com/in/jithesh-shaju-p",
  linkedinHandle: "jithesh-shaju-p",
} as const;

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

// Labels tracked on the output layer of the hero system, top to bottom.
export const systemOutputs = [
  "Predictive Modeling",
  "NLP",
  "Computer Vision",
  "Generative AI",
  "Time-Series Analysis",
] as const;

export const about = {
  lead: "I work in data science and machine learning, on a foundation of Python, SQL, machine learning, and statistical analysis, applied to data-driven problem solving.",
  body: "That foundation carries into predictive modeling, regression, classification, clustering, and time-series analysis, and further into NLP, computer vision, Generative AI, and deep learning.",
  foundation: ["Python", "SQL", "Machine learning", "Statistical analysis"],
  practice: [
    "Predictive modeling",
    "Regression",
    "Classification",
    "Clustering",
    "Time-series analysis",
    "NLP",
    "Computer vision",
    "Generative AI",
    "Deep learning",
  ],
} as const;

/* ---------- Skills ---------- */

export type SkillGroupId = "frameworks" | "ml" | "viz";

export const skillGroups: { id: SkillGroupId; label: string }[] = [
  { id: "frameworks", label: "Programming & ML Frameworks" },
  { id: "ml", label: "AI & Machine Learning" },
  { id: "viz", label: "Visualization & BI" },
];

export interface Skill {
  id: string;
  label: string;
  group: SkillGroupId;
  // Position in the 1200 x 660 graph, and which side the label sits on.
  x: number;
  y: number;
  side?: "left" | "right" | "top" | "bottom";
}

export const skills: Skill[] = [
  { id: "python", label: "Python", group: "frameworks", x: 250, y: 320, side: "bottom" },
  { id: "numpy", label: "NumPy", group: "frameworks", x: 120, y: 170, side: "left" },
  { id: "pandas", label: "Pandas", group: "frameworks", x: 300, y: 150, side: "top" },
  { id: "sklearn", label: "Scikit-learn", group: "frameworks", x: 420, y: 270, side: "bottom" },
  { id: "tensorflow", label: "TensorFlow", group: "frameworks", x: 410, y: 400, side: "bottom" },
  { id: "pytorch", label: "PyTorch", group: "frameworks", x: 330, y: 500, side: "bottom" },
  { id: "sql", label: "SQL", group: "frameworks", x: 120, y: 470, side: "left" },
  { id: "git", label: "Git", group: "frameworks", x: 90, y: 320, side: "left" },

  { id: "feature", label: "Feature Engineering", group: "ml", x: 500, y: 90, side: "top" },
  { id: "predictive", label: "Predictive Modeling", group: "ml", x: 640, y: 170, side: "bottom" },
  { id: "regression", label: "Regression", group: "ml", x: 790, y: 80, side: "top" },
  { id: "classification", label: "Classification", group: "ml", x: 920, y: 170, side: "right" },
  { id: "clustering", label: "Clustering", group: "ml", x: 790, y: 240, side: "right" },
  { id: "timeseries", label: "Time-Series Analysis", group: "ml", x: 570, y: 280, side: "bottom" },
  { id: "abtest", label: "A/B Testing", group: "ml", x: 1010, y: 70, side: "right" },
  { id: "deep", label: "Deep Learning", group: "ml", x: 640, y: 430, side: "bottom" },
  { id: "nlp", label: "NLP", group: "ml", x: 820, y: 360, side: "top" },
  { id: "cv", label: "Computer Vision", group: "ml", x: 810, y: 520, side: "bottom" },
  { id: "genai", label: "Generative AI", group: "ml", x: 970, y: 440, side: "bottom" },
  { id: "transformers", label: "Transformers", group: "ml", x: 1060, y: 330, side: "right" },
  { id: "gans", label: "GANs", group: "ml", x: 1100, y: 530, side: "right" },

  { id: "matplotlib", label: "Matplotlib", group: "viz", x: 480, y: 600, side: "bottom" },
  { id: "seaborn", label: "Seaborn", group: "viz", x: 620, y: 590, side: "right" },
  { id: "tableau", label: "Tableau", group: "viz", x: 150, y: 600, side: "bottom" },
  { id: "powerbi", label: "Power BI", group: "viz", x: 300, y: 615, side: "right" },
];

// How the tools and methods relate to one another. Not a ranking.
export const skillLinks: [string, string][] = [
  ["python", "numpy"],
  ["python", "pandas"],
  ["python", "sklearn"],
  ["python", "tensorflow"],
  ["python", "pytorch"],
  ["python", "git"],
  ["python", "matplotlib"],
  ["numpy", "pandas"],
  ["sql", "pandas"],
  ["sql", "tableau"],
  ["sql", "powerbi"],
  ["matplotlib", "seaborn"],
  ["pandas", "feature"],
  ["pandas", "timeseries"],
  ["feature", "predictive"],
  ["sklearn", "predictive"],
  ["sklearn", "clustering"],
  ["predictive", "regression"],
  ["predictive", "classification"],
  ["predictive", "timeseries"],
  ["regression", "abtest"],
  ["classification", "abtest"],
  ["tensorflow", "deep"],
  ["pytorch", "deep"],
  ["deep", "nlp"],
  ["deep", "cv"],
  ["deep", "genai"],
  ["genai", "gans"],
  ["genai", "transformers"],
  ["transformers", "nlp"],
];

/* ---------- Pipelines ---------- */

export interface Stage {
  name: string;
  detail: string;
}

/* ---------- Experience ---------- */

export interface Role {
  title: string;
  org: string;
  place: string;
  period: string;
  points: string[];
  stack?: string[];
  pipeline?: { caption: string; run: string; stages: Stage[] };
  impact?: string[];
}

export const roles: Role[] = [
  {
    title: "AI Trainer and Developer",
    org: "Young Indian Scientist",
    place: "Thrissur, Kerala",
    period: "October 2025 – Current",
    points: [
      "Built a full-stack AI evaluation system with Streamlit and FastAPI, using LLaMA 3.5 and ChromaDB vector search.",
      "Runs adaptive assessments from JSON datasets, with automated scoring, LLM-generated explanations, and Excel reporting.",
      "Developed a Generative AI curriculum with structured learning materials and evaluation workflows.",
    ],
    pipeline: {
      caption: "The evaluation system, stage by stage",
      run: "Trace an assessment",
      stages: [
        { name: "Data", detail: "JSON datasets" },
        { name: "Evaluation", detail: "Adaptive assessments" },
        { name: "LLM", detail: "LLaMA 3.5" },
        { name: "Vector search", detail: "ChromaDB" },
        { name: "Scoring", detail: "Automated, with LLM-generated explanations" },
        { name: "Reporting", detail: "Excel reports" },
      ],
    },
  },
  {
    title: "Data Science Intern",
    org: "IroHub Infotech",
    place: "Cochin, Kerala",
    period: "November 2024 – June 2025",
    points: [
      "Worked on machine learning and deep learning across fraud detection, forecasting, ALPR, and NLP stock prediction.",
      "Optimized models and delivered them production-ready.",
    ],
    stack: ["Python", "TensorFlow/Keras", "Scikit-learn", "OpenCV"],
    impact: [
      "Reduced high-risk transactions by 50%.",
      "Improved forecasting and segmentation effectiveness.",
    ],
  },
];

/* ---------- Projects ---------- */

export type FigureKind = "retrieval" | "detection" | "backtest";

export interface Project {
  id: string;
  title: string;
  domain: string;
  summary: string;
  stack: string[];
  figure: FigureKind;
  figureNote: string;
  github?: string;
  run: string;
  stages: Stage[];
  implementation: string[];
  outcome: string;
  notice?: string;
}

export const projects: Project[] = [
  {
    id: "smart-city-assistant",
    title: "Smart City Information Assistant",
    domain: "Retrieval-augmented generation",
    summary:
      "A full-stack RAG assistant that answers city-related queries from a structured knowledge base.",
    stack: ["Python", "Streamlit", "FastAPI", "Llama2", "ChromaDB"],
    figure: "retrieval",
    figureNote:
      "Illustration of retrieval: a query vector and its nearest knowledge-base entries. Not project data.",
    github: "https://github.com/JITHESH145/Smart-City-Assistant",
    run: "Trace a query",
    stages: [
      { name: "User", detail: "Asks a city-related question in the Streamlit interface." },
      { name: "Query", detail: "The question goes to the FastAPI backend." },
      { name: "Embedding", detail: "The query is turned into a vector." },
      { name: "Vector search", detail: "The closest entries are found by similarity." },
      { name: "ChromaDB", detail: "Holds the embedded, structured city knowledge base." },
      { name: "LLM", detail: "Llama2, served through Ollama, writes the answer from what was retrieved." },
      { name: "Answer", detail: "Returned to the user in the interface." },
    ],
    implementation: [
      "Streamlit for the interface and FastAPI for the service behind it.",
      "ChromaDB stores and retrieves the knowledge base as vectors.",
      "Llama2 runs through Ollama to generate the answer.",
    ],
    outcome:
      "An assistant that answers city-related queries from a structured knowledge base.",
  },
  {
    id: "vehicle-crash-detection",
    title: "Vehicle Crash Detection",
    domain: "Computer vision",
    summary:
      "A real-time crash detection system built with Python and YOLOv8, trained on video input.",
    stack: ["Python", "YOLOv8"],
    figure: "detection",
    figureNote: "Illustrative frame drawn for this page. Not model output.",
    github:
      "https://github.com/JITHESH145/vehicle-crash-detection-using-python-and-yoloV8",
    run: "Trace a frame",
    stages: [
      { name: "Video input", detail: "Video footage is the input." },
      { name: "YOLOv8", detail: "The model is trained on that video input." },
      { name: "Detection", detail: "Crashes are detected in real time." },
    ],
    implementation: [
      "Written in Python around a YOLOv8 model.",
      "Trained on video input.",
    ],
    outcome: "Crash detection that runs in real time on video.",
  },
  {
    id: "nifty-options-backtesting",
    title: "NIFTY Options Data Engineering & Backtesting System",
    domain: "Data engineering",
    summary:
      "A high-frequency market-data pipeline and a backtesting framework for simulating options strategies.",
    stack: [
      "Python",
      "Pandas",
      "NumPy",
      "BreezeConnect API",
      "Selenium",
      "Pandas-TA",
    ],
    figure: "backtest",
    figureNote:
      "Synthetic series drawn for this page. Not market data, and not financial advice.",
    run: "Trace a backtest",
    stages: [
      { name: "Data collection", detail: "Market data is gathered through a high-frequency pipeline." },
      { name: "Preprocessing", detail: "Raw data is cleaned and shaped for analysis." },
      { name: "Call / put processing", detail: "Call and put options are processed separately." },
      { name: "Strike detection", detail: "The relevant strikes are identified." },
      { name: "Strategy simulation", detail: "Supertrend signals with hedged positions." },
      { name: "Backtesting", detail: "Strategies are run against real market data." },
    ],
    implementation: [
      "Data collection, preprocessing, and call/put option processing in Python with Pandas and NumPy.",
      "Strike detection feeding a high-frequency pipeline.",
      "Strategy simulation using Supertrend with hedged positions, then backtesting.",
    ],
    outcome:
      "The framework helped a client validate strategies using real market data and reduce capital-risk exposure by nearly 50%.",
    notice:
      "Presented as an engineering project. Nothing here is a recommendation to trade.",
  },
];

/* ---------- Education ---------- */

export const education = {
  degree: "B.Tech. Artificial Intelligence and Data Science",
  school: "Dhanalakshmi Srinivasan College of Engineering, Coimbatore",
  year: "Graduated 2024",
  score: "CGPA 7.0 / 10",
} as const;

export const certifications = [
  {
    title: "Oracle AI Foundations Certificate",
    issuer: "Oracle University",
    date: "2025",
  },
  {
    title: "Oracle Data Science Professional Certificate",
    issuer: "Oracle University",
    date: "2025",
  },
  {
    title: "Data Science & Machine Learning using Gen-AI",
    issuer: "TCR Innovation, Mumbai",
    date: "16 Jun 2024 – 16 Sep 2024",
  },
  {
    title: "Data Science with Machine Learning & Python",
    issuer: "TCR Innovation, Mumbai",
    date: "23 Dec 2022 – 1 Feb 2023",
  },
  {
    title: "Machine Learning with Python Internship",
    issuer: "TCR Innovation, Mumbai",
    date: "12 Oct 2021 – 1 Dec 2021",
  },
] as const;
