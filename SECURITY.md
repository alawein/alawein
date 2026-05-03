---
type: canonical
source: none
sync: none
sla: none
title: Security Policy
description: Security vulnerability reporting and disclosure procedures
last_updated: 2026-05-03
category: governance
audience: all
status: active
author: Kohyr Inc.
version: 1.0.0
tags: [governance, security, vulnerability, disclosure]
---

# Security Policy

## Reporting Security Vulnerabilities

Please report security vulnerabilities to `security@kohyr.com`.

Include the repository name, a clear description of the issue, reproduction steps (if available), and the expected impact.

If you discover exposed credentials (tokens, keys) in config or logs, rotate them immediately and see [Credential hygiene](docs/governance/credential-hygiene.md) and [Full environment audit](docs/archive/audits-2026-03/full-environment-audit-2026-03-16.md) for remediation.

## Supported Versions

This repository contains organizational documentation and templates. The `main` branch is the only supported line.

| Branch/Version | Supported |
| -------------- | --------- |
| `main`         | Yes       |
| other          | No        |
