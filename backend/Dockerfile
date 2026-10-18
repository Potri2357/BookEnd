FROM python:3.12-slim

WORKDIR /app

# Install system utilities for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app ./app
COPY tests ./tests


# Environment settings
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8008 \
    HOST=0.0.0.0

EXPOSE 8008

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8008/health || exit 1

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8008"]
