# Supermarket REST API Infrastructure

This directory contains the Pulumi infrastructure as code for deploying the Supermarket REST API to DigitalOcean.

## Infrastructure Components

- **DigitalOcean Container Registry**: Stores the Docker images for the API
- **Kubernetes Cluster**: Runs the containerized application

## Prerequisites

1. [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
2. [DigitalOcean API Token](https://cloud.digitalocean.com/account/api/tokens)
3. [Docker](https://docs.docker.com/get-docker/) (for building and pushing images)
4. [doctl](https://github.com/digitalocean/doctl) (DigitalOcean CLI)

## Setup

1. Set your DigitalOcean API token as an environment variable:

```bash
export DO_TOKEN=your_digitalocean_api_token
```

2. Login to Pulumi:

```bash
pulumi login
```

3. Create a new stack (if you haven't already):

```bash
pulumi stack init dev
```
## Deploy the Infrastructure

1. Build and push your Docker image to the container registry (first deployment only):

```bash
# Navigate to backend directory
cd ../backend

# Build the Docker image
docker build -t registry.digitalocean.com/supermarket-registry/backend:latest .

# Login to DigitalOcean Container Registry
doctl registry login

# Push the image
docker push registry.digitalocean.com/supermarket-registry/backend:latest
```

2. Deploy the infrastructure:

```bash
cd ../infra
pulumi up
```

3. Once deployed, you can access your API at the droplet's IP address:

```bash
pulumi stack output dropletIp
```

## Update the Application

To update your application:

1. Build and push a new Docker image

```bash
docker pull registry.digitalocean.com/supermarket-registry/backend:latest
docker stop supermarket-api
docker rm supermarket-api
docker run -d -p 80:3000 --restart always --name supermarket-api -e NODE_ENV=production registry.digitalocean.com/supermarket-registry/backend:latest
```

## Clean Up

To destroy the infrastructure:

```bash
pulumi destroy
```

## Notes

- The default configuration uses the smallest droplet size (`s-1vcpu-1gb`). Adjust as needed.
- Be sure to update environment variables in the container as required by your application.
- Consider setting up a CI/CD pipeline to automate deployments. 
