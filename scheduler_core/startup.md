# Scheduler Core Startup Guide

This guide provides instructions on how to set up and run the `scheduler_core` service, which is the Python-based scheduling engine for the Auto-Timetable application.

## Prerequisites

- Python 3.8 or higher installed on your system.
- Git installed.

## 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone <repository_url>
cd auto-timetable
```

*(Replace `<repository_url>` with the actual URL of your Git repository)*

## 2. Navigate to the Scheduler Core Directory

Move into the `scheduler_core` folder:

```bash
cd scheduler_core
```

## 3. Set Up a Virtual Environment (Recommended)

It is best practice to use a virtual environment to manage dependencies.

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

## 4. Install Dependencies

Install the required Python packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

This will install:
- `fastapi`: The web framework.
- `uvicorn`: The ASGI server.
- `ortools`: Google's Operations Research tools for the scheduling logic.

## 5. Run the Application

Start the FastAPI server using Uvicorn with hot-reloading enabled (useful for development):

```bash
uvicorn main:app --reload
```

- `main`: Refers to the `main.py` file.
- `app`: Refers to the `FastAPI` instance created inside `main.py`.
- `--reload`: Makes the server restart automatically when code changes.

## 6. Verify Installation

Once the server is running, you should see output indicating it is listening, typically on `http://127.0.0.1:8000`.

You can access the interactive API documentation (Swagger UI) by opening your browser and navigating to:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Troubleshooting

- **'uvicorn' is not recognized**: Ensure you have activated the virtual environment where `uvicorn` was installed.
- **Module not found errors**: Run `pip install -r requirements.txt` again to ensure all dependencies are installed.
