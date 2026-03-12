# Privacy Policy — Ladder Pick

**Last updated: March 2, 2026**

## Overview

Ladder Pick ("the App") is a ChatGPT App that provides random 1:1 matching (ladder game) functionality directly within ChatGPT. It is designed for entertainment purposes only.

## Data We Process

Ladder Pick processes only the data you explicitly provide during a session. No data is collected, stored to disk, or transmitted to external systems.

| Data | Purpose | Returned to model | Retention |
|---|---|---|---|
| Player labels you enter | Generate a matching result | Yes — echoed in tool responses for widget rendering | In-memory only; discarded on server restart |
| Item labels you enter | Generate a matching result | Yes — echoed in tool responses for widget rendering | In-memory only; discarded on server restart |
| Random seed value | Enable reproducible results | Yes — included in tool responses | In-memory only; discarded on server restart |
| Game ID (random UUID) | Identify the game session for follow-up actions (reshuffle, reveal, export) | Yes — included in tool responses | In-memory only; discarded on server restart |
| Reveal mode selection | Control how results are displayed | Yes — included in tool responses | In-memory only; discarded on server restart |
| Player-to-item mapping | The randomized matching result | Yes — included in tool responses | In-memory only; discarded on server restart |

## Sensitive Data Restrictions

Ladder Pick is designed for entertainment use with non-sensitive labels (nicknames, team names, prize labels, etc.). **Users must not enter any of the following as player labels or items:**

- Real personal names or personally identifiable information (PII)
- Health or medical information
- Biometric data
- Social security numbers, national ID numbers, or government identifiers
- Payment card numbers or financial account information
- Passwords, credentials, or authentication tokens

The App does not validate, filter, or store these data types. If a user inadvertently enters sensitive data, it is held only in process memory for the duration of the session and is never persisted or transmitted to third parties.

## What We Do NOT Collect

- Usernames, email addresses, or any account information
- Location data
- Device identifiers or IP addresses
- Cookies or tracking pixels
- Timestamps or telemetry about user activity
- Any data from third-party services

## Data Sharing

We do not share, sell, or transfer any data to third parties. No data leaves the App's in-memory state during a session.

## Data Retention

All game state is held in process memory only. No data is written to disk or a database. All state is lost when the server process restarts.

## Children's Privacy

Ladder Pick does not knowingly collect information from children under 13.

## Contact

For privacy-related questions, please contact: **[tedkim.developer@gmail.com]**

---

*This policy applies solely to the Ladder Pick ChatGPT App and its MCP server.*
