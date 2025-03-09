# Supermarket REST API Project Roadmap

This roadmap outlines the development plan for the entire repository, including all services and components.

## Current Components

- **Backend**: NestJS API for supermarket data
- **Infrastructure**: Pulumi-based infrastructure as code

## Overall Project Goals

1. Create a comprehensive supermarket price comparison platform
2. Implement robust data ingestion and processing pipelines
3. Deploy a scalable, maintainable Kubernetes-based infrastructure
4. Provide valuable insights to users through data analytics

## Phase 1: Foundation (Current)

### Backend Service
- [x] Set up NestJS framework with MongoDB
- [x] Implement basic CRUD operations for supermarket data
- [x] Create initial API endpoints
- [ ] Complete user authentication system
- [WIP] Implement admin endpoints for resource management
- [WIP] Set up comprehensive E2E testing

### Infrastructure
- [x] Set up Pulumi for infrastructure as code
- [ ] Complete Kubernetes cluster configuration
- [ ] Implement CI/CD pipelines
- [ ] Set up monitoring and logging

### Data Pipeline
- [ ] Set up scheduled data fetching
- [ ] Create data ingestion services
- [ ] Implement ETL processes
- [ ] Add data validation and cleaning

### n8n Workflow Integration
- [ ] Set up n8n instance in Kubernetes cluster
- [ ] Create workflows for data processing
- [ ] Implement automated alerts and notifications
- [ ] Connect n8n with external data sources
- [ ] Develop custom n8n nodes for specific requirements
