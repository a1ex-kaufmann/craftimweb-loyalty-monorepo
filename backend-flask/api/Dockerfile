FROM python:3.8-slim

# Install gcc and required build tools
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /

# python api/run.py
CMD [ "python", "api/run.py" ]
