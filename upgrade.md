# WinBid AI – Upgrade Roadmap (UPGRADE.md)

## Versioning Strategy
- **Semantic Versioning**: `MAJOR.MINOR.PATCH`
  - **MAJOR** – Breaking architectural changes (e.g., migration to Kubernetes, new data store).
  - **MINOR** – New features, UI enhancements, or additional integrations that are backward‑compatible.
  - **PATCH** – Bug fixes, performance improvements, dependency updates.
- Each release will be tagged in Git with the version number (e.g., `v1.2.0`).
- Release notes are generated from this file’s **Product Features** section.

## Upcoming Product Features (Future MINOR releases)
| Feature | Target Release | Description |
|---|---|---|
| **Dynamic Proposal Scoring Dashboard** | v1.1.0 | Visual UI for scoring trends, risk heat‑maps, and go/no‑go status across multiple RFPs. |
| **CRM / Deal Sync Integration** | v1.1.0 | Bi‑directional sync with Salesforce/HubSpot/Dynamics to pull opportunity data and push final proposals. |
| **Versioned Proposal History** | v1.2.0 | Store each generated section version, enable rollback and audit trail. |
| **Multi‑Language / Localization** | v1.2.0 | Auto‑detect language, translate RFPs, and generate responses in the target locale. |
| **AI Explainability Panel** | v1.3.0 | Show source passages that contributed to each answer for compliance transparency. |
| **Customizable Scoring Rules Engine** | v1.3.0 | Admin UI to weight evaluation pillars per market or client. |
| **Bulk RFP Import & Batch Processing** | v1.4.0 | Zip upload endpoint and background worker for processing many RFPs at once. |
| **Export to Multiple Formats** (Word, PDF, HTML, Markdown) | v1.4.0 | One‑click export of the final proposal in various client‑required formats. |
| **Chat‑Assist “Ask the Expert” Bot** | v1.5.0 | Real‑time ad‑hoc Q&A without re‑running the full pipeline. |
| **Real‑Time Collaboration (Live Editing)** | v1.5.0 | Multiple users edit a proposal simultaneously using WebSocket sync. |
| **Dark‑Mode & Themed UI** | v1.6.0 | Modern dark theme with glass‑morphism styling and user toggle. |
| **CI/CD Pipeline (GitHub Actions)** | v1.6.0 | Automated linting, testing, container builds, and release tagging. |
| **Kubernetes/Helm Deployment** | v1.7.0 | Helm charts for scalable production deployments. |
| **Prometheus + Grafana Monitoring** | v1.7.0 | Export metrics for latency, token cost, and system health. |
| **Secrets Management via Azure Key Vault** | v1.8.0 | Secure handling of API keys and DB passwords. |
| **Automated Backup & Restore** | v1.8.0 | Scheduled snapshots for PostgreSQL and Qdrant. |
| **Compliance & Audit Trail UI** | v1.9.0 | Detailed logs of who edited which section and when; downloadable source‑passage CSV. |

## How to Contribute
1. Fork the repository.
2. Create a branch named `feature/<feature-name>`.
3. Implement the feature following the **Tech Stack** guidelines.
4. Update this `UPGRADE.md` with the actual version number once merged.
5. Open a Pull Request; CI will run tests and automatically tag the release.

*Keep this file up‑to‑date as new features are planned or released.*
