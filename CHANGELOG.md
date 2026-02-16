# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-12

### Added
- Initial release of SaaS Core Dashboard.
- User authentication with NextAuth v5.
- Role-based access control (Admin/User).
- AI Summarizer using Google Gemini and `youtube-transcript-plus`.
- Glassmorphism UI design with dark mode.
- Billing and Admin management pages.

## [1.1.0] - 2026-02-16

### Added
- **Document Intelligence**: Upload and chat with PDF/Text documents using AI.
- **Dynamic Dashboard**: Live KPI cards, monthly growth charts, and recent activity feed connected to real database data.

### Fixed
- Stabilized PDF parsing by switching to `pdf-parse` v1.1.1 and bypassing entry point bugs.
- Resolved "Duplicate Key" React crash in the Document QA interface.
- Fixed Next.js 1MB body size limit for document uploads.

