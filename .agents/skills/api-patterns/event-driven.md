# Event-Driven Architecture & Message Queue Patterns

> Asynchronous messaging, event streaming, and distributed data consistency patterns for resilient backends.

---

## 1. Broker Selection Matrix

```
What is your messaging workload?
│
├── High Throughput Event Log / Replayability / Big Data Streams
│   └── Apache Kafka (Distributed commit log, partition ordering, persistent retention)
│
├── Complex Routing / Task Queues / Priority / AMQP
│   └── RabbitMQ (Flexible exchanges, direct/topic/fanout routing, ack-based delivery)
│
├── Lightweight / In-memory / Real-time PubSub / Low Ops
│   └── Redis Streams / BullMQ (Fast, simple, suitable for monolithic to medium microservices)
│
└── Cloud-Managed / Serverless / Zero Infrastructure Ops
    └── AWS SQS & SNS / Google Cloud Pub/Sub (Auto-scaling, pay-per-use, managed DLQs)
```

| Factor | Apache Kafka | RabbitMQ | Redis Streams | Cloud Pub/Sub |
|--------|--------------|----------|---------------|---------------|
| **Core Model** | Distributed Log | Smart Broker, Dumb Consumer | In-Memory Log with AOF | Cloud Managed Topic |
| **Ordering** | Per-partition guarantee | Per-queue FIFO | Stream sequence ID | Optional ordering key |
| **Event Replay** | Native (Offset rewind) | No (Consumed items deleted) | Supported (Read from ID) | Limited retention |
| **Routing Complexity** | Basic (Topic-based) | High (Direct, Topic, Fanout, Headers) | Basic | Attribute filter |
| **Operational Overhead** | High | Medium | Low | Zero |

---

## 2. Event Payload Standards (CloudEvents Format)

Always wrap event payloads in a standard envelope like **CloudEvents (v1.0)**:

```json
{
  "specversion": "1.0",
  "id": "evt_9f82c471-a831-4e89-a29e-108b3fa72340",
  "source": "/services/billing-service",
  "type": "com.company.billing.invoice.paid",
  "datacontenttype": "application/json",
  "time": "2026-10-19T00:03:00Z",
  "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "data": {
    "invoice_id": "inv_12345",
    "customer_id": "cust_8891",
    "amount_cents": 15000,
    "currency": "USD",
    "paid_at": "2026-10-19T00:02:58Z"
  }
}
```

### Event Naming Conventions
Use past tense for domain events:
- ✅ `order.created`, `user.registered`, `payment.completed`
- ❌ `create_order` (this is a command, not an event!)

---

## 3. Critical Distributed Consistency Patterns

### 3.1 The Dual-Write Problem
> ⚠️ **Anti-Pattern**: Writing to database THEN publishing to message queue in two uncoordinated steps. If the app crashes after database commit but before message publish, the system enters an inconsistent state.

### 3.2 Transactional Outbox Pattern (MANDATORY Solution)

Store outgoing events in an `outbox` table within the **SAME local database transaction** as the business mutation:

```sql
BEGIN;

-- 1. Mutate business state
INSERT INTO orders (id, user_id, status, total_cents)
VALUES ('ord_101', 'usr_42', 'CONFIRMED', 4900);

-- 2. Insert event in outbox table in the exact same transaction
INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status, created_at)
VALUES (
  'evt_501', 
  'Order', 
  'ord_101', 
  'order.confirmed', 
  '{"order_id": "ord_101", "total_cents": 4900}', 
  'PENDING', 
  NOW()
);

COMMIT;
```

A separate publisher process (e.g. Debezium CDC or a polling worker with `SELECT ... FOR UPDATE SKIP LOCKED`) reads `PENDING` outbox records, publishes them to Kafka/RabbitMQ, and marks them `PUBLISHED`.

---

## 4. Idempotent Consumer Pattern

Distributed networks deliver messages **at-least-once**. Consumers WILL receive duplicates during network hiccups, consumer restarts, or broker rebalances.

### Deduplication Strategy:
1. Every event must carry a unique `id` or business `idempotency_key`.
2. Consumer keeps an `idempotency_keys` or `processed_events` table:
```sql
BEGIN;

-- Attempt to insert unique event ID
INSERT INTO processed_events (event_id, consumer_name, processed_at)
VALUES ('evt_9f82c471', 'inventory-deduction-worker', NOW())
ON CONFLICT (event_id, consumer_name) DO NOTHING;

-- If insert was skipped (0 rows affected), ACK the message and exit early!
-- If insert succeeded, execute business logic:
UPDATE product_stock SET quantity = quantity - 1 WHERE product_id = 'prod_77';

COMMIT;
```

---

## 5. Resilience: Retries, Backoff & Dead Letter Queues (DLQ)

```
Incoming Message
      │
      ▼
   Process
   ├── Success ──► ACK message
   └── Error
         │
         ▼
     Is Transient? (e.g. Database lock, network timeout)
     ├── YES ──► Exponential Backoff Retry (e.g. 1s, 2s, 4s, 8s with Jitter)
     └── NO / Exceeded Max Retries (e.g. 5 attempts)
               │
               ▼
           Send to Dead Letter Queue (DLQ)
               │
               ▼
           Alert Engineering & Save for Manual Inspection
```

- **Dead Letter Queue (DLQ)**: Isolates poison pills and bad data without blocking the entire queue partition for healthy traffic.
- **Circuit Breaker**: Temporarily pauses consumer processing when downstream dependent services (e.g. Payment Gateway) are completely offline.
