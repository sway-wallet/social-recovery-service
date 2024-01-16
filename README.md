# Secure Social Recovery service
This GitHub repository is a monorepo structured to support a Social Recovery Service using the Bun runtime, with Docker compose for easy setup. Inside, you'll find:

It consists of the following packages:

| package                 | description                                                                           | 📕                          |
| ----------------------- | ------------------------------------------------------------------------------------- | --------------------------- |
| `@sway-wallet/apps`       | Contains the UI built with Next.js, offering a modern web interface.                                                 | [📖](./apps/README.md)       |
| `@sway-wallet/guardian-service` | A NestJS backend service providing core functionality for the guardian aspect of the recovery process.                                                                  | [📖](./packages/guardian-service/README.md) |
| `@sway-wallet/social-recovery-service`   | Another NestJS backend, dedicated to the social recovery mechanism, enabling users to recover access through trusted social connections.contracts                               | [📖](./packages/social-recovery-service/README.md)       |
| `@sway-wallet/zkapp`      | Social Recovery Mina contracts | [📖](./packages/zkapp/README.md)      |


This setup provides a comprehensive framework for implementing a social recovery system in web applications.

## Development
To install dependencies:

```bash
bun install
```

To run with docker compose:

```bash
bun docker
```

## Clean up

To clean up docker compose:

```bash
bun docker:clean
```

To clean bun:
```bash
bun clean
```

