# Roadmap

## POC Version 1

1. [ ] 🚀 **User-Oriented E2E Tests**
   - Develop end-to-end tests focusing on user interactions to ensure the application behaves as expected from a user's perspective.

2. [ ] 🔧 **Admin Endpoint**
   - Create an admin endpoint to allow for the creation and updating of resources that are not available through the user endpoint.

3. [ ] ** E2E Tests for Admin Endpoint**
   - Create end-to-end tests for the admin endpoint to ensure it behaves as expected (create, update, delete, get), and that the data is persisted in the database.

4. [ ] 🔄 **CI for Pydantic Model Generation**
   - Create a continuous integration pipeline to automatically generate Pydantic models from the OpenAPI specification generated from the DTOs.

5. [ ] 📦 **Deployment**
   - Set up the deployment process for the application to ensure it can be easily deployed to a production environment.

6. [ ] 📤 **Upload Data to MongoDB Atlas**
   - Implement functionality to upload necessary data to the MongoDB database hosted on Atlas.

7. [ ] 🔗 **Connect Backend to Data Ingestion Pipeline**
   - Design and implement the connection between the backend service and the data ingestion pipeline, using the database as a mediator.

## Version 2

1. [ ] ☁️ **Move to a Self-Hosted Instance Using Kubernetes (K8s)**
   - Transition the application to a self-hosted environment using Kubernetes for better scalability and control. 
