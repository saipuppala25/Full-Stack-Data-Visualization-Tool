FROM node:18.9.0

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy src files
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]