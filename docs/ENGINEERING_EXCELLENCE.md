## Table of Contents

- [Ownership](#ownership)
- [Documentation](#documentation)
- [Observability](#observability)
- [Tests](#tests)

# Engineering Excellence Principles

These are my core philosophies for excelling as a software engineer—practices that consistently lead to high-quality, maintainable, and resilient systems. They focus on four pillars: Ownership, Documentation, Observability, and Testing.

## Ownership

Take full responsibility for what we build - its quality, performance, and long-term health. Without ownership, nothing else matters.

## Documentation

Communicate intent and decisions clearly so anyone can understand, debug, or extend our work - even years later.

### Product Requirements (Why)

- Define what we’re building and why it matters
- Capture business goals, user needs, and success criteria
- Help align engineering with product vision

### Technical Design (How)

- Explain how the system works or will be built
- Include major components, data flows, tradeoffs, and rationale
- Guide implementation and support code reviews

### Architecture Diagrams (When)

- Visualize system components and their relationships
- Clarify infrastructure, dependencies, and integration points
- Help onboard new engineers and debug system issues

## Observability

Make our systems transparent, so we can see how they behave in real time and respond quickly when things go wrong.

### Alerts (Highest Priority)

- Monitor SLO & SLAs
- User Experience Health
- Service Health

### Traces (Request-Centric Visibility)

- Full request lifecycle: frontend → backend → DB
- Find slow spans, errors, retries
- Understand user impact
- Map service dependencies

### RUM (Real User Monitoring)

- Core Web Vitals
- JS exceptions
- API error rates
- User flow timing

### APM (Application Performance Metrics)

- Request rate, latency, error rate
- DB/query metrics
- Queue lengths
- Cache hit/miss

## Tests

Write meaningful tests to prevent regressions, support refactoring, and ensure the system does what it’s supposed to do.

### Unit Tests (Logic Correctness)

- Fast, isolated, run on every commit
- Cover core business logic and edge cases
- Focused on functions, classes, and small modules

### Component Tests (Realistic Units)

- Test meaningful parts in near-real environments
- For front-end: components with DOM interactions
- For back-end: services with in-memory/mocked dependencies

### End-to-End Tests (User Flow Confidence)

- Simulate full user journeys
- Cover high-value flows like auth, onboarding, checkout
- Catch regressions across the entire system
