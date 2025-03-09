import * as k8s from "@pulumi/kubernetes";

// Create a dedicated namespace
const namespace = new k8s.core.v1.Namespace("supermarket-etl", {
    metadata: { name: "supermarket-etl" }
});


// const backendLabels = { app: "backend" };
// const backendDeployment = new k8s.apps.v1.Deployment("backend", {
//     metadata: { namespace: namespace.metadata.name },
//     spec: {
//         selector: { matchLabels: backendLabels },
//         replicas: 1,
//         template: {
//             metadata: { labels: backendLabels },
//             spec: { containers: [{ name: "backend", image: "backend" }] }
//         }
//     }
// });

// const backendService = new k8s.core.v1.Service("backend", {
//     metadata: { namespace: namespace.metadata.name },
//     spec: {
//         type: "NodePort",
//         selector: backendLabels,
//         ports: [{ port: 3000, targetPort: 3000, nodePort: 30000 }]
//     }
// });

// MongoDB Deployment
const mongoLabels = { app: "mongodb" };
const mongoDeployment = new k8s.apps.v1.Deployment("mongodb", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        selector: { matchLabels: mongoLabels },
        replicas: 1,
        template: {
            metadata: { labels: mongoLabels },
            spec: { containers: [{ name: "mongodb", image: "mongo:latest" }] }
        }
    }
});

const mongoService = new k8s.core.v1.Service("mongodb", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        type: "NodePort",
        selector: mongoLabels,
        ports: [{ port: 27017, targetPort: 27017, nodePort: 30002 }]
    }
});

// Redis Message Queue Deployment
const redisLabels = { app: "redis" };
const redisDeployment = new k8s.apps.v1.Deployment("redis", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        selector: { matchLabels: redisLabels },
        replicas: 1,
        template: {
            metadata: { labels: redisLabels },
            spec: {
                containers: [{
                    name: "redis",
                    image: "redis:latest",
                    ports: [{ containerPort: 6379 }],
                    resources: {
                        requests: {
                            cpu: "100m",
                            memory: "128Mi"
                        },
                        limits: {
                            cpu: "200m",
                            memory: "256Mi"
                        }
                    }
                }]
            }
        }
    }
});

const redisService = new k8s.core.v1.Service("redis", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        type: "ClusterIP",
        selector: redisLabels,
        ports: [{ port: 6379, targetPort: 6379 }]
    }
});

// Message Queue Consumer Deployment
const consumerLabels = { app: "message-queue-consumer" };
const consumerDeployment = new k8s.apps.v1.Deployment("message-queue-consumer", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        selector: { matchLabels: consumerLabels },
        replicas: 1,
        template: {
            metadata: { labels: consumerLabels },
            spec: {
                containers: [{
                    name: "message-queue-consumer",
                    image: "message-queue-consumer:latest",
                    env: [
                        { name: "REDIS_HOST", value: "redis" },
                        { name: "REDIS_PORT", value: "6379" },
                        { name: "API_ENDPOINT", value: "http://backend:3000" }
                    ],
                    resources: {
                        requests: {
                            cpu: "100m",
                            memory: "128Mi"
                        },
                        limits: {
                            cpu: "200m",
                            memory: "256Mi"
                        }
                    }
                }]
            }
        }
    }
});
