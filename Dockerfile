# Use the official Node 20 image 
FROM node:20 

# Set the working directory inside the container 
WORKDIR /app 

# Copy dependency files and install 
COPY package*.json ./ 
RUN npm install 

# Copy the rest of your source code 
COPY . . 

# Compile the TypeScript code 
RUN npm run build 

# EXTREMELY IMPORTANT: Hugging Face requires port 7860 
ENV PORT=7860 
EXPOSE 7860 

# Start the compiled server 
CMD ["node", "dist/server.js"]
