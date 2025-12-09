# Contributing to TimeTable Management System

First off, thank you for considering contributing to the TimeTable Management System! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🤝 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (Local or Atlas)
- Git

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/auto-timetable.git
   cd auto-timetable
   ```

3. **Set up the Backend**:

   ```bash
   cd backend
   npm install
   # Create .env file based on .env.example
   ```

4. **Set up the Frontend**:

   ```bash
   cd frontend
   npm install
   ```

5. **Set up the Scheduler (Python)**:
   ```bash
   cd scheduler_core
   python -m venv venv
   # Activate venv (Windows: venv\Scripts\activate, Unix: source venv/bin/activate)
   pip install -r requirements.txt
   ```

## 💻 Development Workflow

1. **Create a Branch**: Always work on a new branch for your changes.

   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/annoying-bug
   ```

2. **Make your changes**: Write clean, maintainable code.

3. **Commit your changes**: Use descriptive commit messages.

   ```bash
   git commit -m "feat: add new algorithm for lab scheduling"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

## 🚀 Submitting a Pull Request

1. Go to the original repository on GitHub.
2. Click on "New Pull Request".
3. Select your branch and compare it with the `main` branch.
4. **Description**: Clearly explain what your changes do.
5. **Screenshots**: If you changed the UI, please include screenshots.
6. **Link Issues**: If this fixes a bug, link the issue (e.g., "Fixes #123").

## 🎨 Code Style Guidelines

- **JavaScript/React**: We follow standard ESLint configurations. Please ensure your code is formatted (Prettier is recommended).
- **Python**: Follow PEP 8 guidelines for the scheduler core.
- **Commits**: We prefer [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `style:`).

## 🐛 Reporting Bugs

If you find a bug, please create an issue including:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open an issue with the tag `enhancement` and describe your proposal.

---

Thank you for your contributions!
