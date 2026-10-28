# Project Rules
This document contains strict coding and formatting rules that any AI Agent MUST follow during development. These rules are mandatory to prevent common AI mistakes and ensure scalable architecture.

## 1. Modular Architecture & File Size Limits
* **Strict Structural Organization:** Work must follow the existing folder structures strictly (Client and Server). Everything must be appropriately categorized (e.g., proper routes, proper models, proper controllers).
* **Frontend Components:** Always split frontend code into proper, reusable React components. Never write massive components or files containing 1200-1300 lines of code. Every distinct UI part should be its own component.
* **Server File Organization:** Backend logic must be properly divided into specific files. As a general rule, a single server file **should not exceed 120 lines**. Only exceed this limit if absolutely necessary and unavoidable.

## 2. Fully Functional & Secure Implementations
* **No Dummy Code:** Everything you implement must be **properly functional**. Do not use dummy data, placeholder functions, or fake UI elements.
* **Security & Stability:** Ensure that there are absolutely no security vulnerabilities or logical issues in the code. Code must be safe and production-ready to prevent future breaks.

## 3. Clean Code Requirements
* **No Comments:** Absolutely **no comments** should be written in the generated code.

## 4. UI & Design Standards
* **Professional Icons:** Do not use generic icons that look "AI-generated" or amateurish. Ensure all icons and UI aesthetics feel professional and premium.
* **No Generic AI Icon Containers / Boxes:** Never create generic AI/SaaS-style rounded icon boxes or badges (such as `size-10 rounded-xl bg-muted/60`, `size-12 rounded-2xl bg-...`, or generic icon containers with Lucide icons like Gem, Sparkles, ShieldCheck, TrendingUp) across the entire project. For luxury jewellery aesthetics, use authentic assay hallmark stamps (e.g. `AU · 999.0`, `AU · 916.6`), clean typography, fine borders, or elegant whitespace.

## 5. Proactive Suggestions & Issue Reporting
* **End of Task Reports:** After finishing any task, the Agent MUST suggest related new features or improvements in Roman Urdu.
* **Troubleshooting Suggestions:** If the Agent spots a potential issue in the codebase or a flaw that could cause problems in the future, it MUST report it and suggest how to fix it immediately in the standard format (Pehley Problem, Phir Us Ka Hal).

## 6. Dependencies & Installations
* **Latest Versions Only:** Every package, library, or framework installed (such as React, Node.js, Express.js, Tailwind CSS, etc.) MUST ALWAYS be downloaded/installed in its latest available stable version. This applies strictly to all future dependencies and installations as well.

## 7. Interaction Standards
* **No Native Alerts:** Never use native browser `alert()` or `confirm()` dialogs. Always implement professional, theme-aware **Custom Modals** or **Alert Dialogs** for user confirmations and warnings.

## 8. Technology Stack Constraints
* **JavaScript / JSX Only:** The entire project must be developed exclusively in JavaScript (`.js` and `.jsx`). TypeScript is strictly prohibited.

## 9. Communication & Language Standards
* **Roman Urdu Mandatory:** All responses, status reports, and feature suggestions to the user must be delivered exclusively in **Roman Urdu**.
* **Problem-Solution Format:** Suggestions must follow a concise format: pehley problem, phir uska hal.

## 10. Task Execution & Focus Discipline
* **Strict Task Scope:** Implement only what is specifically requested. Do not touch, alter, or break unrelated features or existing code. Analyze thoroughly before execution to ensure zero errors.

## 11. UI Content Language Standard
* **English Only in UI/Code:** Across the entire project codebase, user interface, labels, headings, buttons, and content, absolutely NO Urdu, Roman Urdu, or Hindi is allowed. All customer-facing and admin UI copy must be in clean, professional basic English only.
