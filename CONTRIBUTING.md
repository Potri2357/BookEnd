# Contributing to Postern

Thank you for your interest in contributing to Postern, the enterprise cryptographic patch assurance engine!

---

## 🛠️ Development Setup

### Prerequisites
- **Python 3.11+** (Tested up to Python 3.14)
- **Node.js 20+** and **npm**
- **Git**

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Potri2357/Postern.git
cd Postern

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install pytest httpx

# Start the development server
python main.py
# Server binds to http://localhost:8008
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Vite runs at http://localhost:5173
```

---

## 🧪 Testing Guidelines

Before opening a pull request, ensure all backend and frontend test suites pass:

```bash
# Run backend pytest suite (engine, scenarios, security, enterprise features)
pytest backend/tests

# Run frontend test suite
cd frontend
npm test
npm run build
```

---

## 📐 Coding Conventions

- **Python**: Follow PEP 8 guidelines. Maintain explicit typing with Pydantic schemas. Preserve docstrings and comments.
- **Cryptography**: Never hardcode private keys. Proof pack serialization MUST use `canonical_json_bytes` (RFC 8785).
- **Frontend**: Vanilla CSS with curated dark/light palettes. Ensure high color contrast, keyboard accessibility, and ARIA labels.

---

## 🔀 Pull Request Process

1. Fork the repository and create your feature branch:
   `git checkout -b feature/your-feature-name`
2. Commit changes with clear, descriptive messages.
3. Verify all tests pass locally.
4. Submit your PR against the `main` branch.
