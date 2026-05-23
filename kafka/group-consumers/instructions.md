<!-- to view it in a better way , use (ctrl+shift+v) -->

# Consumer Group Demo

## Files

- `producer.ts` - creates the orders topic and sends 8 messages with a 2 second gap
- `consumer.ts` - consumer that accepts a name argument and joins grp1

## Prerequisites

Kafka running via Docker:

```bash
docker-compose up -d
```

## Steps

### 1. Delete any existing orders topic

```bash
docker-compose down -v
```

### 2. Start the producer

The producer creates the topic and waits 10 seconds before sending messages. Use that window to start the consumers.

```bash
bun producer.ts
```

### 3. Start all 3 consumers in separate terminals during the 10 second wait

```bash
bun consumer-group.ts C1
bun consumer-group.ts C2
bun consumer-group.ts C3
```

Wait for all 3 to print "joined group" before the producer starts sending.

### 4. Observe

Each consumer prints only the messages from its assigned partition. The assignment looks like:
(Expected)

```
C1 -> Partition 1
C2 -> Partition 2
C3 -> Partition 0
```

### 5. Kill one consumer

Press Ctrl+C on any consumer terminal. The remaining two will rebalance and absorb the dead consumer's partition automatically.

## What Changes With Number of Consumers

| Consumers | Partition Assignment |
|---|---|
| 1 | gets all 3 partitions |
| 2 | splits partitions between them |
| 3 | one partition each |
| 4 | one consumer sits idle, no partition available |