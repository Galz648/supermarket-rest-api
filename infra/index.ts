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
    metadata: {
        name: "api-dep",
        namespace: monitoringNamespace.metadata.name // Add the deployment to the right namespace
    },
    spec: {
        replicas: 1,
        selector: { matchLabels: apiLabels },
        template: {
            metadata: { labels: apiLabels },
            spec: {
                containers: [
                    {
                        name: apiLabels.name,
                        image: api_image_tag,
                        imagePullPolicy: "IfNotPresent",
                        ports: [{ containerPort: parseInt(apiLabels.internal_port) }],
                        volumeMounts: [{
                            name: "shared-logs",
                            mountPath: "/app/logs"
                        }],
                        env: [
                            { name: "LOG_PATH", value: "/app/logs/output.log" } // optional: your app should log to this
                        ]
                    },
                    {
                        name: "fluent-bit",
                        image: "fluent/fluent-bit:latest",
                        volumeMounts: [{
                            name: "shared-logs",
                            mountPath: "/app/logs"
                        },
                        {
                            name: "config",
                            mountPath: "/fluent-bit/etc"
                        }],
                        args: ["-c", "/fluent-bit/etc/fluent-bit.conf"]
                    }
                ],
                volumes: [
                    {
                        name: "shared-logs",
                        emptyDir: {}
                    },
                    {
                        name: "config",
                        configMap: {
                            name: "fluent-bit-config"
                        }
                    }
                ]
            }
        }
    }
}, { provider });

import * as k8s from "@pulumi/kubernetes";

const fluentBitConfig = new k8s.core.v1.ConfigMap("fluent-bit-config", {
    metadata: { name: "fluent-bit-config", namespace: monitoringNamespace.metadata.name }, // or your namespace
    data: {
        "fluent-bit.conf": `
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    info
    Parsers_File parsers.conf

[INPUT]
    Name    tail
    Path    /app/logs/*.log
    Parser  docker
    Tag     app.logs

[OUTPUT]
    Name   stdout
    Match  *
`,
        "parsers.conf": `
[PARSER]
    Name        docker
    Format      json
    Time_Key    time
    Time_Format %Y-%m-%dT%H:%M:%S.%L
    Time_Keep   On
`
    }
});

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

// // Install Loki for log aggregation
// const loki = new kubernetes.helm.v3.Release("loki", {
//     chart: "loki",
//     namespace: monitoringNamespace.metadata.name,
//     version: "3.4.0",
//     repositoryOpts: {
//         repo: "https://grafana.github.io/helm-charts",
//     },
//     // values: {
//     //     persistence: {
//     //         enabled: true,
//     //         size: "1Gi",
//     //     },
//     // },
// }, { provider });

// Install Fluent Bit for log collection

// const fluentBitConfig = `
// [SERVICE]
//     Flush        1
//     Log_Level    info
//     Daemon       off
//     Parsers_File parsers.conf
//     HTTP_Server  On
//     HTTP_Listen  0.0.0.0
//     HTTP_Port    2020

// [INPUT]
//     Name              tail
//     Tag               kube.*
//     Path              /var/log/containers/*.log
//     Parser            docker
//     DB                /var/log/flb_kube.db
//     Mem_Buf_Limit     5MB
//     Skip_Long_Lines   On
//     Refresh_Interval  10

// [OUTPUT]
//     Name        stdout
//     Match       *
// export const apiServiceIp = apiService.status.loadBalancer.ingress[0].ip;
// export const ingressIp = ingressService.status.loadBalancer.ingress[0].ip;
