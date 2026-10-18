---
name: golang-patterns
description: Master modern Go (1.22+) development. High-concurrency patterns, goroutines, channels, context propagation, clean architecture, net/http, Chi, Gin, Fiber, gRPC, pgx, and sqlc.
when_to_use: "When writing Go code, building high-concurrency microservices, managing goroutines and channels, designing Go APIs, or working with go.mod."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
---

# Go (Golang) Patterns & Best Practices

> Production-ready principles, concurrency patterns, and architectural decision-making for modern Go (1.22+).
> **Learn to think idiomatic Go: simple, explicit, concurrent, and robust.**

---

## 1. Framework & HTTP Router Selection

```
What is your Go service workload?
│
├── Lightweight REST / Microservices / Standard Library First (Go 1.22+)
│   └── net/http (Method routing "GET /users/{id}" built-in, zero external dependencies)
│
├── Idiomatic REST with composable middleware
│   └── Chi (100% net/http compatible, lightweight, excellent context integration)
│
├── Feature-rich / Team Familiarity / Rapid Prototyping
│   └── Gin (Fast, built-in validation, large middleware ecosystem)
│
├── Extreme Raw Throughput / High-Frequency Trading / Micro-benchmarks
│   └── Fiber (FastHTTP-based; warning: incompatible with standard net/http handlers)
│
└── Internal High-Speed Microservices
    └── gRPC (Multiplexed HTTP/2, Protobuf, code-generated type safety)
```

### Framework Comparison

| Factor | net/http (Go 1.22+) | Chi | Gin | Fiber |
|--------|---------------------|-----|-----|-------|
| **Best For** | Clean microservices | Idiomatic REST APIs | Large web apps | Ultra-high throughput |
| **net/http standard** | 100% Native | 100% Compatible | Wraps `http.Handler` | Non-standard (fasthttp) |
| **Path params** | `r.PathValue("id")` | `chi.URLParam(r, "id")` | `c.Param("id")` | `c.Params("id")` |
| **Middlewares** | Standard chaining | Rich ecosystem | Built-in | FastHTTP ecosystem |
| **Memory Footprint**| Lowest | Ultra-low | Low | Low (zero-alloc focus) |

---

## 2. Concurrency Mastery & Goroutine Safety

### 2.1 The Golden Rules of Go Concurrency
1. **Never start a goroutine without knowing how and when it will stop.** (Prevents memory leaks).
2. **Context is mandatory**: Always pass `ctx context.Context` as the very first parameter to I/O functions.
3. **Prefer channels to share memory**, but don't fear `sync.Mutex` when protecting simple shared structs.

### 2.2 Coordinated Goroutines with `errgroup`

```go
package service

import (
    "context"
    "golang.org/x/sync/errgroup"
)

func (s *DashboardService) FetchDashboardData(ctx context.Context, userID string) (*Dashboard, error) {
    g, ctx := errgroup.WithContext(ctx)

    var (
        userProfile *Profile
        orders      []Order
        metrics     *UserMetrics
    )

    // Task 1: Fetch Profile
    g.Go(func() error {
        var err error
        userProfile, err = s.userRepo.GetByID(ctx, userID)
        return err // If any task returns error, context cancels other running tasks!
    })

    // Task 2: Fetch Orders
    g.Go(func() error {
        var err error
        orders, err = s.orderRepo.ListByUserID(ctx, userID)
        return err
    })

    // Task 3: Fetch Metrics
    g.Go(func() error {
        var err error
        metrics, err = s.analyticsClient.GetMetrics(ctx, userID)
        return err
    })

    // Wait for all to complete or first error
    if err := g.Wait(); err != nil {
        return nil, err
    }

    return &Dashboard{
        Profile: userProfile,
        Orders:  orders,
        Metrics: metrics,
    }, nil
}
```

### 2.3 Safe Worker Pool Pattern (Backpressure Control)

```go
func RunWorkerPool(ctx context.Context, jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-jobs:
                    if !ok {
                        return
                    }
                    results <- processJob(job)
                }
            }
        }()
    }
    wg.Wait()
    close(results)
}
```

---

## 3. Project Architecture (Standard Go Layout)

Follow clean separation of concerns:

```
my-go-service/
├── cmd/
│   └── api/
│       └── main.go           # Application entrypoint & dependency injection wiring
├── internal/                 # Private code, prevents external package imports
│   ├── domain/               # Pure business entities & interface contracts (No external deps)
│   │   ├── user.go
│   │   └── errors.go
│   ├── service/              # Use cases & business logic orchestrators
│   │   └── user_service.go
│   ├── repository/           # Persistence layer (Postgres / Redis / DynamoDB)
│   │   └── postgres_user.go
│   └── handler/              # HTTP / gRPC transport handlers
│       ├── http_user.go
│       └── routes.go
├── pkg/                      # Public reusable utilities (optional)
├── go.mod
└── go.sum
```

---

## 4. Error Handling & Idiomatic Go

### 4.1 Wrapping and Inspecting Errors
```go
// 1. Wrap with context using %w
if err != nil {
    return fmt.Errorf("failed to load user %s: %w", userID, err)
}

// 2. Check sentinel errors with errors.Is
if errors.Is(err, sql.ErrNoRows) {
    return nil, domain.ErrNotFound
}

// 3. Extract custom error types with errors.As
var valErr *domain.ValidationError
if errors.As(err, &valErr) {
    // Handle validation specifics
}
```

### 4.2 Never Panic in Production Handlers
- Don't call `panic()` for expected runtime errors.
- Always install an `http.Recovery` or middleware recoverer at the router root.

---

## 5. Database & Data Persistence

### 5.1 Recommendations
- **PostgreSQL**: Prefer **`jackc/pgx/v5`** over generic `database/sql` for native Postgres features (COPY protocol, binary formats, batch queries, connection pooling).
- **Queries & ORM**:
  - Prefer **`sqlc`**: Write raw SQL, compiles into 100% type-safe Go code with zero reflection and zero runtime overhead.
  - Or **`sqlx`**: Lightweight extensions to `database/sql`.
  - Avoid heavy ORMs (like GORM) on high-throughput microservices unless rapid prototyping is paramount.

---

## 6. Testing & Benchmarking

```bash
# Run unit tests with Race Detector enabled (MANDATORY in CI)
go test -race -v ./...

# Run benchmarks with memory allocations
go test -bench=. -benchmem ./internal/...
```

---

## 7. Common Anti-Patterns to Avoid

- ❌ **Goroutine Leaks**: Launching goroutines with unbuffered channels without cancellation triggers.
- ❌ **Shadowing Variables with `:=`**: Accidental variable shadowing inside `if err != nil` blocks.
- ❌ **Ignoring Errors with `_ = ...`**: Silently dropping errors on I/O or JSON encode calls.
- ❌ **String Concatenation in SQL**: Always use `$1, $2` or `?` placeholders.
- ❌ **Neglecting `resp.Body.Close()`**: Always `defer resp.Body.Close()` immediately after checking `err == nil`.
