# Use an official Node.js runtime as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Python3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment and install Python dependencies
COPY requirements.txt .
RUN . /opt/venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Set environment variable to use the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Start the application
CMD ["node", "server.js"]