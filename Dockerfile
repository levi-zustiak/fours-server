#############
# Development
#############

FROM node:19-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install app deps
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image
USER node
