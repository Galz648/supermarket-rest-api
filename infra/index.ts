import * as kubernetes from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

// Enable some configurable parameters.
const config = new pulumi.Config();
const appReplicaCount = config.getNumber("appReplicaCount") || 1;

// Create a Kubernetes provider that uses the current context
const provider = new kubernetes.Provider("k8s", {});
const external_supermarket_service_domain = "http://erlichsefi.ddns.net:8080/service_health";
const AUTH_TOKEN = config.requireSecret("authToken");

const api_name = "supermarket-api-backend";
const api_version = "v1.0.3";
const api_image_tag = `${api_name}:${api_version}`;
const apiLabels = { "name": api_name, "version": api_version, "internal_port": "3000" };

const monitoringNamespace = new kubernetes.core.v1.Namespace("monitoring", {
    metadata: {
        name: "monitoring",
    },
}, { provider });

// // Install nginx-ingress controller
// const nginxIngress = new kubernetes.helm.v3.Release("nginx-ingress", {
//     chart: "ingress-nginx",
//     namespace: "ingress-nginx",
//     createNamespace: true,
//     repositoryOpts: {
//         repo: "https://kubernetes.github.io/ingress-nginx",
//     },
//     values: {
//         controller: {
//             admissionWebhooks: {
//                 enabled: false,
//               },
//             service: {
//                 type: "LoadBalancer",
//             },
//         },
//     },
// }, { provider });

// Get the ingress controller service created by Helm
// const ingressService = kubernetes.core.v1.Service.get("ingress-nginx-controller", pulumi.interpolate`${nginxIngress.namespace}/ingress-nginx-controller`, { provider });

// Install kube-prometheus-stack
const prometheusStack = new kubernetes.helm.v3.Release("kube-prometheus-stack", {
    chart: "kube-prometheus-stack",
    namespace: monitoringNamespace.metadata.name,
    repositoryOpts: {
        repo: "https://prometheus-community.github.io/helm-charts",
    },
    values: {
        grafana: {
            enabled: true,
            adminPassword: "admin", // TODO: You should change this in production
        },
        prometheus: {
            prometheusSpec: {
                retention: "15d",
                resources: {
                    requests: {
                        memory: "256Mi",
                        cpu: "100m",
                    },
                    limits: {
                        memory: "512Mi",
                        cpu: "500m",
                    },
                },
            },
        },
    },
}, { provider });

// Install blackbox-exporter
const blackboxExporter = new kubernetes.helm.v3.Release("blackbox-exporter", {
    chart: "prometheus-blackbox-exporter",
    namespace: monitoringNamespace.metadata.name,
    repositoryOpts: {
        repo: "https://prometheus-community.github.io/helm-charts",
    },
    values: {
        config: {
            modules: {
                http_2xx: {
                    prober: "http",
                    timeout: "5s",
                    http: {
                        method: "GET",
                        preferred_ip_protocol: "ip4",
                        headers: {
                            "Authorization": pulumi.interpolate`Bearer ${AUTH_TOKEN}`
                        }
                    },
                },
                http_post_2xx: {
                    prober: "http",
                    timeout: "5s",
                    http: {
                        method: "POST",
                        preferred_ip_protocol: "ip4",
                        headers: {
                            "Authorization": pulumi.interpolate`Bearer ${AUTH_TOKEN}`
                        }
                    },
                },
            },
        },
    },
}, { provider });

const apiDeployment = new kubernetes.apps.v1.Deployment("api-dep", {
    spec: {
        selector: { matchLabels: apiLabels },
        replicas: 1,
        template: {
            metadata: { labels: apiLabels },
            spec: {
                containers: [{
                    imagePullPolicy: "IfNotPresent",
                    name: apiLabels.name,
                    image: api_image_tag,
                    ports: [{ containerPort: parseInt(apiLabels.internal_port) }],
                }],
            },
        },
    },
}, { provider });

// const apiService = new kubernetes.core.v1.Service("api-svc", {
//     spec: {
//         type: "ClusterIP", // Changed to ClusterIP since we'll use ingress
//         selector: apiLabels,
//         ports: [{ port: parseInt(apiLabels.internal_port), targetPort: parseInt(apiLabels.internal_port) }],
//     },
// }, { provider });

// Create an Ingress resource for the API
// const apiIngress = new kubernetes.networking.v1.Ingress("api-ingress", {
//     metadata: {
//         annotations: {
//             "nginx.ingress.kubernetes.io/rewrite-target": "/",
//         },
//     },
//     spec: {
//         ingressClassName: "nginx",
//         rules: [{
//             http: {
//                 paths: [{
//                     path: "/api",
//                     pathType: "Prefix",
//                     backend: {
//                         service: {
//                             name: apiService.metadata.name,
//                             port: {
//                                 number: parseInt(apiLabels.internal_port),
//                             },
//                         },
//                     },
//                 }],
//             },
//         }],
//     },
// }, { provider });

// Create a ServiceMonitor for blackbox exporter
const blackboxServiceMonitor = new kubernetes.apiextensions.CustomResource("blackbox-monitor", {
    apiVersion: "monitoring.coreos.com/v1",
    kind: "ServiceMonitor",
    metadata: {
        name: "blackbox-monitor",
        namespace: monitoringNamespace.metadata.name,
        labels: {
            release: prometheusStack.name,
        },
    },
    spec: {
        endpoints: [
            {
                port: "http",
                interval: "5s",
                path: "/probe",
                params: {
                    module: ["http_2xx"],
                    target: [external_supermarket_service_domain],
                },
            },
            // {
            //     port: "http",
            //     interval: "30s",
            //     path: "/probe",
            //     params: {
            //         module: ["http_2xx"],
            //         target: [`http://${apiService.status.loadBalancer.ingress[0].ip}/api`],
            //     },
            // },
        ],
        selector: {
            matchLabels: {
                "app.kubernetes.io/name": "prometheus-blackbox-exporter",
            },
        },
    },
}, { provider });

// export const apiServiceIp = apiService.status.loadBalancer.ingress[0].ip;
// export const ingressIp = ingressService.status.loadBalancer.ingress[0].ip;
