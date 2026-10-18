# gRPC & Protocol Buffers Patterns

> High-performance, type-safe RPC framework for internal microservices and low-latency communication.

---

## 1. When to Choose gRPC

```
Are you communicating across services?
│
├── Public Web Browser → Backend
│   └── REST or GraphQL (Browsers lack native HTTP/2 framing without gRPC-Web proxy)
│
├── Internal Microservice → Microservice (Polyglot / High Throughput)
│   └── gRPC (Multiplexed HTTP/2, binary Protobuf serialization, strict contract)
│
├── TypeScript Monorepo (Web + Node Backend)
│   └── tRPC (Zero build step, direct TypeScript inference)
│
└── Streaming / Real-time Telemetry (High Frequency)
    └── gRPC Streaming (Client / Server / Bidirectional streams)
```

---

## 2. Protocol Buffers (proto3) Design Principles

### 2.1 Clean Schema Definition

```protobuf
syntax = "proto3";

package order.v1;

option go_package = "github.com/example/order/gen/v1;orderv1";

import "google/protobuf/timestamp.proto";

// Service contract
service OrderService {
  rpc CreateOrder (CreateOrderRequest) returns (CreateOrderResponse);
  rpc GetOrder (GetOrderRequest) returns (Order);
  rpc StreamOrderUpdates (StreamOrderUpdatesRequest) returns (stream OrderStatusUpdate);
}

// Request and Response Envelopes
message CreateOrderRequest {
  string user_id = 1;
  repeated OrderItem items = 2;
  PaymentMethod payment_method = 3;
  string idempotency_key = 4; // Crucial for non-idempotent mutations
}

message CreateOrderResponse {
  Order order = 1;
  string tracking_id = 2;
}

message OrderItem {
  string product_id = 1;
  int32 quantity = 2;
  int64 price_cents = 3; // Use integer cents to avoid floating-point errors
}

enum PaymentMethod {
  PAYMENT_METHOD_UNSPECIFIED = 0; // Protobuf enum default must be 0
  PAYMENT_METHOD_CREDIT_CARD = 1;
  PAYMENT_METHOD_BANK_TRANSFER = 2;
  PAYMENT_METHOD_WALLET = 3;
}

message Order {
  string id = 1;
  string user_id = 2;
  OrderStatus status = 3;
  int64 total_cents = 4;
  google.protobuf.Timestamp created_at = 5;
}

enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;
  ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_PAID = 2;
  ORDER_STATUS_SHIPPED = 3;
  ORDER_STATUS_CANCELLED = 4;
}
```

### 2.2 Golden Rules of Protobuf Evolution

- **NEVER change field tag numbers**: Changing tag numbers (`= 1`, `= 2`) breaks backwards compatibility for existing deployed services.
- **NEVER reuse deleted field numbers**: Use the `reserved` keyword:
  ```protobuf
  message UserProfile {
    reserved 4, 8 to 12;
    reserved "legacy_token", "old_ssn";
  }
  ```
- **Enum zero value must always be UNSPECIFIED**: Protobuf uses default values when fields are missing. `0` must represent an uninitialized or unknown state.

---

## 3. Communication Patterns

| Pattern | Description | Best For |
|---------|-------------|----------|
| **Unary RPC** | 1 request → 1 response | Standard CRUD, service-to-service queries |
| **Server Streaming** | 1 request → Stream of responses | Order tracking, notification feeds, log exports |
| **Client Streaming** | Stream of requests → 1 response | File upload chunks, IoT sensor telemetry ingestion |
| **Bidirectional Streaming** | Stream of requests ⇄ Stream of responses | Interactive chat, multiplayer sync, realtime trading |

---

## 4. Error Handling & Status Codes

Never return generic errors. Map internal domain errors to canonical gRPC status codes:

| gRPC Status Code | HTTP Equivalent | When to Use |
|------------------|-----------------|-------------|
| `OK` (0) | 200 OK | Successful execution |
| `INVALID_ARGUMENT` (3) | 400 Bad Request | Validation failed on input field |
| `NOT_FOUND` (5) | 404 Not Found | Resource ID does not exist |
| `ALREADY_EXISTS` (6) | 409 Conflict | Unique constraint violation |
| `PERMISSION_DENIED` (7) | 403 Forbidden | User lacks role or tenant permissions |
| `UNAUTHENTICATED` (16) | 401 Unauthorized | Missing or invalid token |
| `DEADLINE_EXCEEDED` (4) | 504 Gateway Timeout | Downstream query took longer than context deadline |
| `UNAVAILABLE` (14) | 503 Service Unavailable | Dependent service temporarily down (transient, retryable) |

### Rich Error Details
Use `google.rpc.Status` with `google.rpc.BadRequest.FieldViolation` to return exact field-level validation errors to clients.

---

## 5. Interceptors & Production Middleware

Implement cross-cutting concerns using interceptor chains:

1. **Context Deadline / Timeout Propagation**: Every incoming RPC must respect `ctx.Done()`. Always set outgoing timeouts.
2. **Correlation ID & Tracing**: Propagate `x-request-id` or OpenTelemetry trace contexts across metadata headers.
3. **Authentication Interceptor**: Extract Bearer token from incoming metadata (`metadata.FromIncomingContext(ctx)`).
4. **Panic Recovery Interceptor**: Catch unhandled panics and convert to `codes.Internal` to prevent server termination.
5. **Rate Limiting & Circuit Breaking**: Protect downstream dependencies using client-side connection pooling.

---

## 6. Tooling: Buf vs protoc

Use modern **Buf** (`buf.yaml`, `buf.gen.yaml`) instead of messy `protoc` bash scripts:
- **Linting**: Enforce naming conventions, backward compatibility breaking checks (`buf breaking --against ...`).
- **Code Generation**: Clean plugins configuration without managing local binary installations.
