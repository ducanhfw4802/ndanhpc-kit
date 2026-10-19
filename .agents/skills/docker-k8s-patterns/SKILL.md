---
name: docker-k8s-patterns
description: Production-grade containerization & orchestration patterns. Multi-stage Dockerfiles, distroless images, Docker Compose for local/production, Kubernetes Deployments, Services, Ingress, ConfigMaps, Secrets, HPA, and health probes.
when_to_use: "When writing Dockerfiles, designing Docker Compose stacks, architecting Kubernetes resources, configuring container health probes, or optimizing image size and security."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Docker & Kubernetes (K8s) Architecture Patterns

> Production-ready containerization guidelines, minimal image optimization, secure non-root execution, Docker Compose orchestration, and Kubernetes manifest standards.

---

## 🎯 When to Use This Skill

- Writing or optimizing **Dockerfiles** for Node.js, Go, Python, or PHP applications
- Minimizing container image size using **Multi-Stage Builds** and **Distroless/Alpine** bases
- Enforcing container security (Non-root user, dropped capabilities, no leaked secrets)
- Structuring **Docker Compose** setups with healthchecks, resource limits, and network isolation
- Authoring production **Kubernetes (K8s)** manifests (Deployments, Services, Ingress, HPA)
- Configuring **Liveness, Readiness, and Startup Probes** to prevent downtime during rolling updates

---

## 🐳 1. Multi-Stage Dockerfile Standards

### 1.1 Gold Standard Rules
1. **Never run as root**: Always create and switch to a non-privileged user (`USER 10001:10001`).
2. **Order layers by change frequency**: Dependencies first (`package.json`, `go.mod`), source code last.
3. **Pin image tags**: Use specific versions (e.g., `node:22-alpine` or `golang:1.22-bookworm`), never `latest`.
4. **Always include a `.dockerignore`**: Exclude `.git`, `node_modules`, `.env`, tests, and local builds.

### 1.2 Example: Multi-Stage Go Binary
```dockerfile
# Stage 1: Build binary
FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o /server ./cmd/server

# Stage 2: Minimal Distroless runtime
FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /
COPY --from=builder /server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/server"]
```

### 1.3 Example: Node.js Multi-Stage
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=appuser:nodejs . .

USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🐙 2. Production Docker Compose Patterns

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 1024M
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

---

## ☸️ 3. Kubernetes (K8s) Production Manifests

### 3.1 Hardened Deployment Standard
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  labels:
    app.kubernetes.io/name: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: api-service
  template:
    metadata:
      labels:
        app.kubernetes.io/name: api-service
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
        - name: app
          image: ghcr.io/org/api-service:v1.2.0
          imagePullPolicy: IfNotPresent
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          ports:
            - containerPort: 8080
          startupProbe:
            httpGet:
              path: /health/startup
              port: 8080
            failureThreshold: 30
            periodSeconds: 2
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 20
```

---

## 🛡️ 4. Container & Cluster Hardening Checklist

- [ ] Image uses explicit version tag (No `:latest`)
- [ ] Root privileges dropped via `USER nonroot`
- [ ] Read-only root filesystem enabled where applicable
- [ ] All Linux capabilities dropped (`drop: ["ALL"]`)
- [ ] Liveness and Readiness probes configured
- [ ] CPU & Memory requests/limits defined to prevent OOM cascade
- [ ] No plaintext secrets in environment variables (Use K8s Secrets / HashiCorp Vault)
