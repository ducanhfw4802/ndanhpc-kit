# API Style Selection

> REST vs GraphQL vs tRPC - which one, when?

## Decision Tree

```
Who are the API consumers?
│
├── Public API / Multiple platforms
│   └── REST + OpenAPI (widest compatibility)
│
├── Complex data needs / Multiple frontends
│   └── GraphQL (flexible queries)
│
├── TypeScript frontend + backend (monorepo)
│   └── tRPC (end-to-end type safety)
│
├── Real-time / Event-driven
│   └── WebSocket / SSE or Message Broker (Kafka / RabbitMQ / Cloud PubSub)
│
└── Internal microservices
    └── gRPC (multiplexed HTTP/2, Protobuf) or REST (simplicity)
```

## Comparison

| Factor | REST | GraphQL | tRPC | gRPC |
|--------|------|---------|------|------|
| **Best for** | Public APIs | Complex web apps | TS monorepos | Internal microservices |
| **Transport** | HTTP/1.1, HTTP/2 | HTTP POST | HTTP | HTTP/2 Multiplexed |
| **Serialization** | JSON | JSON | JSON / Superjson | Binary Protobuf |
| **Learning curve** | Low | Medium | Low (if TS) | Medium |
| **Over/under fetching** | Common | Solved | Solved | Strictly defined |
| **Type safety** | Manual (OpenAPI) | Schema-based | Automatic (Inferred) | Code-gen (Protobuf) |
| **Streaming** | Limited (SSE) | Subscriptions | Subscriptions | Native Bidirectional |
| **Caching** | HTTP native | Complex | Client-based | Service-level / Redis |

## Selection Questions

1. Who are the API consumers?
2. Is the frontend TypeScript?
3. How complex are the data relationships?
4. Is caching critical?
5. Public or internal API?
