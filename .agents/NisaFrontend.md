Design Plugin

A design productivity plugin primarily designed for Cowork, Anthropic's agentic desktop application — though it also works in Claude Code. Helps with design critique, system management, UX writing, accessibility, research synthesis, and developer handoff. Works with any design team — standalone with your input, supercharged when you connect Figma and other tools.

Installation
bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install design@knowledge-work-plugins
Commands

Explicit workflows you invoke with a slash command:

Command	Description
/critique	Get structured design feedback — usability, visual hierarchy, accessibility, and consistency
/design-system	Audit, document, or extend your design system — components, tokens, patterns
/handoff	Generate developer handoff specs — measurements, tokens, states, interactions, and edge cases
/ux-copy	Write or review UX copy — microcopy, error messages, empty states, onboarding flows
/accessibility	Run an accessibility audit — WCAG compliance, color contrast, screen reader, and keyboard navigation
/research-synthesis	Synthesize user research — interviews, surveys, usability tests into actionable insights

All commands work standalone (describe your design or paste screenshots) and get supercharged with MCP connectors.

Skills

Domain knowledge Claude uses automatically when relevant:

Skill	Description
design-critique	Evaluate designs for usability, visual hierarchy, consistency, and adherence to design principles
design-system-management	Manage design tokens, component libraries, and pattern documentation
ux-writing	Write effective microcopy — clear, concise, consistent, and brand-aligned
accessibility-review	Audit designs and code for WCAG 2.1 AA compliance
user-research	Plan, conduct, and synthesize user research — interviews, surveys, usability testing
design-handoff	Create comprehensive developer handoff documentation from designs
Example Workflows
Getting Design Feedback
/critique

Share a Figma link, screenshot, or describe your design. Get structured feedback on usability, visual hierarchy, consistency, and accessibility.

Auditing Your Design System
/design-system audit

I'll review your component library for consistency, completeness, and naming conventions. Get a report with specific improvement recommendations.

Writing UX Copy
/ux-copy error messages for payment flow

Get context-appropriate copy with tone guidance, alternatives, and localization notes.

Developer Handoff
/handoff

Share a Figma link and get a complete spec: measurements, design tokens, component states, interaction notes, and edge cases.

Accessibility Check
/accessibility

Share a design or URL. Get a WCAG 2.1 AA compliance report with specific issues, severity, and remediation steps.

Synthesizing Research
/research-synthesis

Upload interview transcripts, survey results, or usability test notes. Get themes, insights, and prioritized recommendations.

Standalone + Supercharged

Every command and skill works without any integrations:

What You Can Do	Standalone	Supercharged With
Design critique	Describe or screenshot	Figma MCP (pull designs directly)
Design system	Describe your system	Figma MCP (audit component library)
Handoff specs	Describe or screenshot	Figma MCP (exact measurements, tokens)
UX copy	Describe the context	Knowledge base (brand voice guidelines)
Accessibility	Describe or screenshot	Figma MCP, analytics for real usage data
Research synthesis	Paste transcripts	User feedback tools (pull raw data)
MCP Integrations

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Connect your tools for a richer experience:

Category	Examples	What It Enables
Design tool	Figma	Pull designs, inspect components, access design tokens
User feedback	Intercom, Productboard	Raw feedback, feature requests, NPS data
Project tracker	Linear, Asana, Jira	Link designs to tickets, track implementation
Knowledge base	Notion	Brand guidelines, design principles, research repository
Product analytics	Amplitude, Mixpanel	Usage data for research synthesis and design decisions

See CONNECTORS.md for the full list of supported integrations.Summary
Distinctive, production-grade frontend interfaces that reject generic AI aesthetics through intentional design choices.

Guides aesthetic direction selection (brutalist, maximalist, retro-futuristic, luxury, organic, etc.) before implementation to ensure cohesive, memorable designs
Emphasizes typography, color theming with CSS variables, motion design, spatial composition, and textural details as core design pillars
Generates working code (HTML/CSS/JS, React, Vue) that matches implementation complexity to the aesthetic vision, from refined minimalism to elaborate maximalism
Explicitly avoids overused fonts, clichéd color schemes, and predictable layouts that characterize generic AI-generated interfaces
SKILL.md
Frontend Design
Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

Ground your designs in the subject matter
If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.

Design principles
For web designs, the hero is the first thing viewers will see. Open with the most characteristic thing in the subject's world, in the form that is most appropriate: a headline, an image, an animation, a live demo, an interactive moment, or other treatments. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the default treatment, so only use it if that's truly the best option.

Typography carries the personality of the page. You don't need a different typeface for display or headline text and body content: use one family or two, and if two, make them clearly distinct.

Choose your typefaces deliberately, not the default families you would reach for on any other project, and set a clear type scale following the default guidance of The Elements of Typographic Style with intentional weights, widths, and spacing. When type is used as a headline or visual element, use the type treatment itself as an active part of the design, not a neutral delivery vehicle for the content.

Default to line lengths of less than 80 characters. Serif typefaces can have slightly longer line lengths; give serif body text slightly more line-height than a sans-serif.

Avoid these default typographic treatments; they are the commonest tells of a generated page:

Accenting just a single word or phrase in a headline, like putting one word in italic/bold or a different color.
Using all caps for labels.
Adding unnecessary typographic labels above content.
Visual structure is information. Structural devices like outlines, borders, numbering, eyebrows, dividers, labels, etc., encode useful information about the content rather than decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence — like a stepped process or a timeline. Before adding numbered markers, check the content really is a sequence.

Use non-user-triggered motion sparingly and deliberately, only to draw attention. A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy and placeholder content. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

Process: plan, review against the brief, build, critique
For calibration, AI-generated design right now clusters around some traits:

a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
a near-black background with a single bright acid-green or vermilion accent;
a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.
All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.

Color: describe the core base palette as 4–6 named hex values.
Type: the typefaces and their roles.
Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
Principles: the high-level guidance for what makes this page unique.
Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and an element-based selector like .cta). This can happen often with padding/margin between sections.

Restraint and self-critique
Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

More on writing in design
Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.

Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job./accessibility-review

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Audit a design or page for WCAG 2.1 AA accessibility compliance.

Usage
/accessibility-review $ARGUMENTS

Audit for accessibility: @$1

WCAG 2.1 AA Quick Reference
Perceivable
1.1.1 Non-text content has alt text
1.3.1 Info and structure conveyed semantically
1.4.3 Contrast ratio >= 4.5:1 (normal text), >= 3:1 (large text)
1.4.11 Non-text contrast >= 3:1 (UI components, graphics)
Operable
2.1.1 All functionality available via keyboard
2.4.3 Logical focus order
2.4.7 Visible focus indicator
2.5.5 Touch target >= 44x44 CSS pixels
Understandable
3.2.1 Predictable on focus (no unexpected changes)
3.3.1 Error identification (describe the error)
3.3.2 Labels or instructions for inputs
Robust
4.1.2 Name, role, value for all UI components
Common Issues
Insufficient color contrast
Missing form labels
No keyboard access to interactive elements
Missing alt text on meaningful images
Focus traps in modals
Missing ARIA landmarks
Auto-playing media without controls
Time limits without extension options
Testing Approach
Automated scan (catches ~30% of issues)
Keyboard-only navigation
Screen reader testing (VoiceOver, NVDA)
Color contrast verification
Zoom to 200% — does layout break?
Output
markdown
## Accessibility Audit: [Design/Page Name]
**Standard:** WCAG 2.1 AA | **Date:** [Date]

### Summary
**Issues found:** [X] | **Critical:** [X] | **Major:** [X] | **Minor:** [X]

### Findings

#### Perceivable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | [Issue] | [1.4.3 Contrast] | 🔴 Critical | [Fix] |

#### Operable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | [Issue] | [2.1.1 Keyboard] | 🟡 Major | [Fix] |

#### Understandable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | [Issue] | [3.3.2 Labels] | 🟢 Minor | [Fix] |

#### Robust
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | [Issue] | [4.1.2 Name, Role, Value] | 🟡 Major | [Fix] |

### Color Contrast Check
| Element | Foreground | Background | Ratio | Required | Pass? |
|---------|-----------|------------|-------|----------|-------|
| [Body text] | [color] | [color] | [X]:1 | 4.5:1 | ✅/❌ |

### Keyboard Navigation
| Element | Tab Order | Enter/Space | Escape | Arrow Keys |
|---------|-----------|-------------|--------|------------|
| [Element] | [Order] | [Behavior] | [Behavior] | [Behavior] |

### Screen Reader
| Element | Announced As | Issue |
|---------|-------------|-------|
| [Element] | [What SR says] | [Problem if any] |

### Priority Fixes
1. **[Critical fix]** — Affects [who] and blocks [what]
2. **[Major fix]** — Improves [what] for [who]
3. **[Minor fix]** — Nice to have
If Connectors Available

If ~~design tool is connected:

Inspect color values, font sizes, and touch targets directly from Figma
Check component ARIA roles and keyboard behavior in the design spec

If ~~project tracker is connected:

Create tickets for each accessibility finding with severity and WCAG criterion
Link findings to existing accessibility remediation epics
Tips
Start with contrast and keyboard — These catch the most common and impactful issues.
Test with real assistive technology — My audit is a great start, but manual testing with VoiceOver/NVDA catches things I can't.
Prioritize by impact — Fix issues that block users first, polish later./design-critique

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Get structured design feedback across multiple dimensions.

Usage
/design-critique $ARGUMENTS

Review the design: @$1

If a Figma URL is provided, pull the design from Figma. If a file is referenced, read it. Otherwise, ask the user to describe or share their design.

What I Need From You
The design: Figma URL, screenshot, or detailed description
Context: What is this? Who is it for? What stage (exploration, refinement, final)?
Focus (optional): "Focus on mobile" or "Focus on the onboarding flow"
Critique Framework
1. First Impression (2 seconds)
What draws the eye first? Is that correct?
What's the emotional reaction?
Is the purpose immediately clear?
2. Usability
Can the user accomplish their goal?
Is the navigation intuitive?
Are interactive elements obvious?
Are there unnecessary steps?
3. Visual Hierarchy
Is there a clear reading order?
Are the right elements emphasized?
Is whitespace used effectively?
Is typography creating the right hierarchy?
4. Consistency
Does it follow the design system?
Are spacing, colors, and typography consistent?
Do similar elements behave similarly?
5. Accessibility
Color contrast ratios
Touch target sizes
Text readability
Alternative text for images
How to Give Feedback
Be specific: "The CTA competes with the navigation" not "the layout is confusing"
Explain why: Connect feedback to design principles or user needs
Suggest alternatives: Don't just identify problems, propose solutions
Acknowledge what works: Good feedback includes positive observations
Match the stage: Early exploration gets different feedback than final polish
Output
markdown
## Design Critique: [Design Name]

### Overall Impression
[1-2 sentence first reaction — what works, what's the biggest opportunity]

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| [Issue] | 🔴 Critical / 🟡 Moderate / 🟢 Minor | [Fix] |

### Visual Hierarchy
- **What draws the eye first**: [Element] — [Is this correct?]
- **Reading flow**: [How does the eye move through the layout?]
- **Emphasis**: [Are the right things emphasized?]

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| [Typography/spacing/color] | [Inconsistency] | [Fix] |

### Accessibility
- **Color contrast**: [Pass/fail for key text]
- **Touch targets**: [Adequate size?]
- **Text readability**: [Font size, line height]

### What Works Well
- [Positive observation 1]
- [Positive observation 2]

### Priority Recommendations
1. **[Most impactful change]** — [Why and how]
2. **[Second priority]** — [Why and how]
3. **[Third priority]** — [Why and how]
If Connectors Available

If ~~design tool is connected:

Pull the design directly from Figma and inspect components, tokens, and layers
Compare against the existing design system for consistency

If ~~user feedback is connected:

Cross-reference design decisions with recent user feedback and support tickets
Tips
Share the context — "This is a checkout flow for a B2B SaaS" helps me give relevant feedback.
Specify your stage — Early exploration gets different feedback than final polish.
Ask me to focus — "Just look at the navigation" gives you more depth on one area./design-handoff

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Generate comprehensive developer handoff documentation from a design.

Usage
/design-handoff $ARGUMENTS

Generate handoff specs for: @$1

If a Figma URL is provided, pull the design from Figma. Otherwise, work from the provided description or screenshot.

What to Include
Visual Specifications
Exact measurements (padding, margins, widths)
Design token references (colors, typography, spacing)
Responsive breakpoints and behavior
Component variants and states
Interaction Specifications
Click/tap behavior
Hover states
Transitions and animations (duration, easing)
Gesture support (swipe, pinch, long-press)
Content Specifications
Character limits
Truncation behavior
Empty states
Loading states
Error states
Edge Cases
Minimum/maximum content
International text (longer strings)
Slow connections
Missing data
Accessibility
Focus order
ARIA labels and roles
Keyboard interactions
Screen reader announcements
Principles
Don't assume — If it's not specified, the developer will guess. Specify everything.
Use tokens, not values — Reference spacing-md not 16px.
Show all states — Default, hover, active, disabled, loading, error, empty.
Describe the why — "This collapses on mobile because users primarily use one-handed" helps developers make good judgment calls.
Output
markdown
## Handoff Spec: [Feature/Screen Name]

### Overview
[What this screen/feature does, user context]

### Layout
[Grid system, breakpoints, responsive behavior]

### Design Tokens Used
| Token | Value | Usage |
|-------|-------|-------|
| `color-primary` | #[hex] | CTA buttons, links |
| `spacing-md` | [X]px | Between sections |
| `font-heading-lg` | [size/weight/family] | Page title |

### Components
| Component | Variant | Props | Notes |
|-----------|---------|-------|-------|
| [Component] | [Variant] | [Props] | [Special behavior] |

### States and Interactions
| Element | State | Behavior |
|---------|-------|----------|
| [CTA Button] | Hover | [Background darken 10%] |
| [CTA Button] | Loading | [Spinner, disabled] |
| [Form] | Error | [Red border, error message below] |

### Responsive Behavior
| Breakpoint | Changes |
|------------|---------|
| Desktop (>1024px) | [Default layout] |
| Tablet (768-1024px) | [What changes] |
| Mobile (<768px) | [What changes] |

### Edge Cases
- **Empty state**: [What to show when no data]
- **Long text**: [Truncation rules]
- **Loading**: [Skeleton or spinner]
- **Error**: [Error state appearance]

### Animation / Motion
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| [Element] | [Trigger] | [Description] | [ms] | [easing] |

### Accessibility Notes
- [Focus order]
- [ARIA labels needed]
- [Keyboard interactions]
If Connectors Available

If ~~design tool is connected:

Pull exact measurements, tokens, and component specs from Figma
Export assets and generate a complete spec sheet

If ~~project tracker is connected:

Link the handoff to the implementation ticket
Create sub-tasks for each section of the spec
Tips
Share the Figma link — I can pull exact measurements, tokens, and component info.
Mention edge cases — "What happens with 100 items?" helps me spec boundary conditions.
Specify the tech stack — "We use React + Tailwind" helps me give relevant implementation notes./design-system

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Manage your design system — audit for consistency, document components, or design new patterns.

Usage
/design-system audit                    # Full system audit
/design-system document [component]     # Document a component
/design-system extend [pattern]         # Design a new component or pattern
Components of a Design System
Design Tokens

Atomic values that define the visual language:

Colors (brand, semantic, neutral)
Typography (scale, weights, line heights)
Spacing (scale, component padding)
Borders (radius, width)
Shadows (elevation levels)
Motion (durations, easings)
Components

Reusable UI elements with defined:

Variants (primary, secondary, ghost)
States (default, hover, active, disabled, loading, error)
Sizes (sm, md, lg)
Behavior (interactions, animations)
Accessibility (ARIA, keyboard)
Patterns

Common UI solutions combining components:

Forms (input groups, validation, submission)
Navigation (sidebar, tabs, breadcrumbs)
Data display (tables, cards, lists)
Feedback (toasts, modals, inline messages)
Principles
Consistency over creativity — The system exists so teams don't reinvent the wheel
Flexibility within constraints — Components should be composable, not rigid
Document everything — If it's not documented, it doesn't exist
Version and migrate — Breaking changes need migration paths
Output — Audit
markdown
## Design System Audit

### Summary
**Components reviewed:** [X] | **Issues found:** [X] | **Score:** [X/100]

### Naming Consistency
| Issue | Components | Recommendation |
|-------|------------|----------------|
| [Inconsistent naming] | [List] | [Standard to adopt] |

### Token Coverage
| Category | Defined | Hardcoded Values Found |
|----------|---------|----------------------|
| Colors | [X] | [X] instances of hardcoded hex |
| Spacing | [X] | [X] instances of arbitrary values |
| Typography | [X] | [X] instances of custom fonts/sizes |

### Component Completeness
| Component | States | Variants | Docs | Score |
|-----------|--------|----------|------|-------|
| Button | ✅ | ✅ | ⚠️ | 8/10 |
| Input | ✅ | ⚠️ | ❌ | 5/10 |

### Priority Actions
1. [Most impactful improvement]
2. [Second priority]
3. [Third priority]
Output — Document
markdown
## Component: [Name]

### Description
[What this component is and when to use it]

### Variants
| Variant | Use When |
|---------|----------|
| [Primary] | [Main actions] |
| [Secondary] | [Supporting actions] |

### Props / Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [prop] | [type] | [default] | [description] |

### States
| State | Visual | Behavior |
|-------|--------|----------|
| Default | [description] | — |
| Hover | [description] | [interaction] |
| Active | [description] | [interaction] |
| Disabled | [description] | Non-interactive |
| Loading | [description] | [animation] |

### Accessibility
- **Role**: [ARIA role]
- **Keyboard**: [Tab, Enter, Escape behavior]
- **Screen reader**: [Announced as...]

### Do's and Don'ts
| ✅ Do | ❌ Don't |
|------|---------|
| [Best practice] | [Anti-pattern] |

### Code Example
[Framework-appropriate code snippet]
Output — Extend
markdown
## New Component: [Name]

### Problem
[What user need or gap this component addresses]

### Existing Patterns
| Related Component | Similarity | Why It's Not Enough |
|-------------------|-----------|---------------------|
| [Component] | [What's shared] | [What's missing] |

### Proposed Design

#### API / Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| [prop] | [type] | [default] | [description] |

#### Variants
| Variant | Use When | Visual |
|---------|----------|--------|
| [Variant] | [Scenario] | [Description] |

#### States
| State | Behavior | Notes |
|-------|----------|-------|
| Default | [Description] | — |
| Hover | [Description] | [Interaction] |
| Disabled | [Description] | Non-interactive |
| Loading | [Description] | [Animation] |

#### Tokens Used
- Colors: [Which tokens]
- Spacing: [Which tokens]
- Typography: [Which tokens]

### Accessibility
- **Role**: [ARIA role]
- **Keyboard**: [Expected interactions]
- **Screen reader**: [Announced as...]

### Open Questions
- [Decision that needs design review]
- [Edge case to resolve]
If Connectors Available

If ~~design tool is connected:

Audit components directly in Figma — check naming, variants, and token usage
Pull component properties and layer structure for documentation

If ~~knowledge base is connected:

Search for existing component documentation and usage guidelines
Publish updated documentation to your wiki
Tips
Start with an audit — Know where you are before deciding where to go.
Document as you build — It's easier to document a component while designing it.
Prioritize coverage over perfection — 80% of components documented beats 100% of 10 components./research-synthesis

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Synthesize user research data into actionable insights. See the user-research skill for research methods, interview guides, and analysis frameworks.

Usage
/research-synthesis $ARGUMENTS
What I Accept
Interview transcripts or notes
Survey results (CSV, pasted data)
Usability test recordings or notes
Support tickets or feedback
NPS/CSAT responses
App store reviews
Output
markdown
## Research Synthesis: [Study Name]
**Method:** [Interviews / Survey / Usability Test] | **Participants:** [X]
**Date:** [Date range] | **Researcher:** [Name]

### Executive Summary
[3-4 sentence overview of key findings]

### Key Themes

#### Theme 1: [Name]
**Prevalence:** [X of Y participants]
**Summary:** [What this theme is about]
**Supporting Evidence:**
- "[Quote]" — P[X]
- "[Quote]" — P[X]
**Implication:** [What this means for the product]

#### Theme 2: [Name]
[Same format]

### Insights → Opportunities

| Insight | Opportunity | Impact | Effort |
|---------|-------------|--------|--------|
| [What we learned] | [What we could do] | High/Med/Low | High/Med/Low |

### User Segments Identified
| Segment | Characteristics | Needs | Size |
|---------|----------------|-------|------|
| [Name] | [Description] | [Key needs] | [Rough %] |

### Recommendations
1. **[High priority]** — [Why, based on which findings]
2. **[Medium priority]** — [Why]
3. **[Lower priority]** — [Why]

### Questions for Further Research
- [What we still don't know]

### Methodology Notes
[How the research was conducted, any limitations or biases to note]
If Connectors Available

If ~~user feedback is connected:

Pull support tickets, feature requests, and NPS responses to supplement research data
Cross-reference themes with real user complaints and requests

If ~~product analytics is connected:

Validate qualitative findings with usage data and behavioral metrics
Quantify the impact of identified pain points

If ~~knowledge base is connected:

Search for prior research studies and findings to compare against
Publish the synthesis to your research repository
Tips
Include raw quotes — Direct participant quotes make insights credible and memorable.
Separate observations from interpretations — "5 of 8 users clicked the wrong button" is an observation. "The button placement is confusing" is an interpretation.
Quantify where possible — "Most users" is vague. "7 of 10 users" is specific.User Research

Help plan, execute, and synthesize user research studies.

Research Methods
Method	Best For	Sample Size	Time
User interviews	Deep understanding of needs and motivations	5-8	2-4 weeks
Usability testing	Evaluating a specific design or flow	5-8	1-2 weeks
Surveys	Quantifying attitudes and preferences	100+	1-2 weeks
Card sorting	Information architecture decisions	15-30	1 week
Diary studies	Understanding behavior over time	10-15	2-8 weeks
A/B testing	Comparing specific design choices	Statistical significance	1-4 weeks
Interview Guide Structure
Warm-up (5 min): Build rapport, explain the session
Context (10 min): Understand their current workflow
Deep dive (20 min): Explore the specific topic
Reaction (10 min): Show concepts or prototypes
Wrap-up (5 min): Anything we missed? Thank them.
Analysis Framework
Affinity mapping: Group observations into themes
Impact/effort matrix: Prioritize findings
Journey mapping: Visualize the user experience over time
Jobs to be done: Understand what users are hiring your product to do
Deliverables
Research plan (objectives, methods, timeline, participants)
Interview guide (questions, probes, activities)
Synthesis report (themes, insights, recommendations)
Highlight reel (key quotes and observations)ux-copy

If you see unfamiliar placeholders or need to check which tools are connected, see CONNECTORS.md.

Write or review UX copy for any interface context.

Usage
/ux-copy $ARGUMENTS
What I Need From You
Context: What screen, flow, or feature?
User state: What is the user trying to do? How are they feeling?
Tone: Formal, friendly, playful, reassuring?
Constraints: Character limits, platform guidelines?
Principles
Clear: Say exactly what you mean. No jargon, no ambiguity.
Concise: Use the fewest words that convey the full meaning.
Consistent: Same terms for the same things everywhere.
Useful: Every word should help the user accomplish their goal.
Human: Write like a helpful person, not a robot.
Copy Patterns
CTAs
Start with a verb: "Start free trial", "Save changes", "Download report"
Be specific: "Create account" not "Submit"
Match the outcome to the label
Error Messages

Structure: What happened + Why + How to fix

"Payment declined. Your card was declined by your bank. Try a different card or contact your bank."
Empty States

Structure: What this is + Why it's empty + How to start

"No projects yet. Create your first project to start collaborating with your team."
Confirmation Dialogs
Make the action clear: "Delete 3 files?" not "Are you sure?"
Describe consequences: "This can't be undone"
Label buttons with the action: "Delete files" / "Keep files" not "OK" / "Cancel"
Tooltips
Concise, helpful, never obvious
Loading States
Set expectations, reduce anxiety
Onboarding
Progressive disclosure, one concept at a time
Voice and Tone

Adapt tone to context:

Success: Celebratory but not over the top
Error: Empathetic and helpful
Warning: Clear and actionable
Neutral: Informative and concise
Output
markdown
## UX Copy: [Context]

### Recommended Copy
**[Element]**: [Copy]

### Alternatives
| Option | Copy | Tone | Best For |
|--------|------|------|----------|
| A | [Copy] | [Tone] | [When to use] |
| B | [Copy] | [Tone] | [When to use] |
| C | [Copy] | [Tone] | [When to use] |

### Rationale
[Why this copy works — user context, clarity, action-orientation]

### Localization Notes
[Anything translators should know — idioms to avoid, character expansion, cultural context]
If Connectors Available

If ~~knowledge base is connected:

Pull your brand voice guidelines and content style guide
Check for existing copy patterns and terminology standards

If ~~design tool is connected:

View the screen context in Figma to understand the full user flow
Check character limits and layout constraints from the design
Tips
Be specific about context — "Error message when payment fails" is better than "error message."
Share your brand voice — "We're professional but warm" helps me match your tone.
Consider the user's emotional state — Error messages need empathy. Success messages can celebrate.---
name: competitive-brief
description: Create a competitive analysis brief for one or more competitors or a feature area. Use when informing product strategy or feature prioritization, building sales battle cards, prepping board or investor materials, or deciding where to differentiate vs. achieve parity.
argument-hint: "<competitor or feature area>"
---

# Competitive Brief

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Create a competitive analysis brief for one or more competitors or a feature area.

## Usage

```
/competitive-brief $ARGUMENTS
```

## Workflow

### 1. Scope the Analysis

Ask the user:
- **Competitor(s)**: Which specific competitor(s) to analyze? Or a feature area to compare across competitors?
- **Focus**: Full product comparison, specific feature area, pricing/packaging, go-to-market, or positioning?
- **Context**: What decision will this inform? (product strategy, sales enablement, investor/board materials, feature prioritization)

### 2. Research

**Via web search**:
- Product pages and feature lists
- Pricing pages and packaging
- Recent product launches, blog posts, and changelogs
- Press coverage and analyst reports
- Customer reviews and ratings (G2, Capterra, TrustRadius)
- Job postings (signal of strategic direction)
- Social media and community discussions

If **~~knowledge base** is connected:
- Search for existing competitive analysis documents
- Find win/loss reports or sales battle cards
- Pull prior competitive research

If **~~chat** is connected:
- Search for competitive mentions in sales or product channels
- Find recent deal feedback involving competitors

### 3. Generate the Brief

#### Competitor Overview
For each competitor:
- Company summary: founding, size, funding/revenue if public, target market
- Product positioning: how they describe themselves, who they target
- Recent momentum: launches, funding, partnerships, customer wins

#### Feature Comparison
Compare capabilities across key areas relevant to the analysis. See **Feature Comparison Matrices** below for rating scales and matrix templates.

#### Positioning Analysis
Analyze how each competitor positions themselves — target customer, category claim, key differentiator, and value proposition. See **Positioning Analysis Frameworks** below for the positioning statement template and message architecture levels.

#### Strengths and Weaknesses
For each competitor:
- **Strengths**: Where they genuinely excel. What customers praise.
- **Weaknesses**: Where they fall short. What customers complain about.
- Be honest and evidence-based — do not dismiss competitors or inflate their weaknesses.

#### Opportunities
Based on the analysis:
- Where are there gaps in competitor offerings we could exploit?
- What are customers asking for that no one provides well?
- Where are competitors making bets we disagree with?
- What market shifts could advantage our approach?

#### Threats
- Where are competitors investing heavily?
- What competitive moves could disrupt our position?
- Where are we most vulnerable?
- What would a "nightmare scenario" competitive move look like?

#### Strategic Implications
Tie the analysis back to product strategy:
- What should we build, accelerate, or deprioritize based on this analysis?
- Where should we differentiate vs. achieve parity?
- How should we adjust positioning or messaging?
- What should we monitor going forward?

### 4. Follow Up

After generating the brief:
- Ask if the user wants to dive deeper on any section
- Offer to create a one-page summary for executives
- Offer to create sales battle cards for competitive deals
- Offer to draft a "how to win against [competitor]" guide
- Offer to set up a monitoring plan for competitive moves

## Competitive Landscape Mapping

### Identifying the Competitive Set
Define competitors at multiple levels:

**Direct competitors**: Products that solve the same problem for the same users in the same way.
- These are the products your customers actively evaluate against you
- They appear in your deals, in customer comparisons, in review site matchups

**Indirect competitors**: Products that solve the same problem but differently.
- Different approach to the same user need (e.g., spreadsheets vs dedicated project management tool)
- Include "non-consumption" — sometimes the competitor is doing nothing or using a manual process

**Adjacent competitors**: Products that do not compete today but could.
- Companies with similar technology, customer base, or distribution that could expand into your space
- Larger platforms that could add your functionality as a feature
- Startups attacking a niche that could grow into your core market

**Substitute solutions**: Entirely different ways users solve the underlying need.
- Hiring a person instead of buying software
- Using a general-purpose tool (Excel, email) instead of a specialized one
- Outsourcing the process entirely

### Landscape Map
Position competitors on meaningful dimensions:

**Common axes**:
- Breadth vs depth (suite vs point solution)
- SMB vs enterprise (market segment focus)
- Self-serve vs sales-led (go-to-market approach)
- Simple vs powerful (product complexity)
- Horizontal vs vertical (general purpose vs industry-specific)

Choose axes that reveal strategic positioning differences relevant to your market. The right axes make competitive dynamics visible.

### Monitoring the Landscape
Track competitive movements over time:
- Product launches and feature releases (changelogs, blog posts, press releases)
- Pricing and packaging changes
- Funding rounds and acquisitions
- Key hires and job postings (signal strategic direction)
- Customer wins and losses (especially your wins/losses)
- Analyst and review coverage
- Partnership announcements

## Feature Comparison Matrices

### Building a Feature Comparison
1. **Define capability areas**: Group features into functional categories that matter to buyers (not your internal architecture). Use the categories buyers use when evaluating.
2. **List specific capabilities**: Under each area, list the specific features or capabilities to compare.
3. **Rate each competitor**: Use a consistent rating scale.

### Rating Scale Options

**Simple (recommended for most cases)**:
- Strong: Market-leading capability. Deep functionality, well-executed.
- Adequate: Functional capability. Gets the job done but not differentiated.
- Weak: Exists but limited. Significant gaps or poor execution.
- Absent: Does not have this capability.

**Detailed (for deep-dive comparisons)**:
- 5: Best-in-class. Defines the standard others aspire to.
- 4: Strong. Fully-featured and well-executed.
- 3: Adequate. Meets basic needs without differentiation.
- 2: Limited. Exists but with significant gaps.
- 1: Minimal. Barely functional or in early beta.
- 0: Absent. Not available.

### Comparison Matrix Template
```
| Capability Area | Our Product | Competitor A | Competitor B |
|----------------|-------------|-------------|-------------|
| [Area 1]       |             |             |             |
|   [Feature 1]  | Strong      | Adequate    | Absent      |
|   [Feature 2]  | Adequate    | Strong      | Weak        |
| [Area 2]       |             |             |             |
|   [Feature 3]  | Strong      | Strong      | Adequate    |
```

### Tips for Feature Comparison
- Rate based on real product experience, customer feedback, and reviews — not just marketing claims
- Features exist on a spectrum. "Has feature X" is less useful than "How well does it do X?"
- Weight the comparison by what matters to your target customers, not by total feature count
- Update regularly — feature comparisons get stale fast
- Be honest about where competitors are ahead. A comparison that always shows you winning is not credible.
- Include the "why it matters" for each capability area. Not all features matter equally to buyers.

## Positioning Analysis Frameworks

### Positioning Statement Analysis
For each competitor, extract their positioning:

**Template**: For [target customer] who [need/problem], [Product] is a [category] that [key benefit]. Unlike [competitor/alternative], [Product] [key differentiator].

**Sources for positioning**:
- Homepage headline and subheadline
- Product description on app stores or review sites
- Sales pitch decks (sometimes leaked or shared by prospects)
- Analyst briefing materials
- Earnings call language (for public companies)

### Message Architecture Analysis
How does each competitor communicate value?

**Level 1 — Category**: What category do they claim? (CRM, project management, collaboration platform)
**Level 2 — Differentiator**: What makes them different within that category? (AI-powered, all-in-one, developer-first)
**Level 3 — Value Proposition**: What outcome do they promise? (Close deals faster, ship products faster, never miss a deadline)
**Level 4 — Proof Points**: What evidence do they provide? (Customer logos, metrics, awards, case studies)

### Positioning Gaps and Opportunities
Look for:
- **Unclaimed positions**: Value propositions no competitor owns that matter to buyers
- **Crowded positions**: Claims every competitor makes that have lost meaning
- **Emerging positions**: New value propositions driven by market changes (AI, remote work, compliance)
- **Vulnerable positions**: Claims competitors make that they cannot fully deliver on

## Win/Loss Analysis Methodology

### Conducting Win/Loss Analysis
Win/loss analysis reveals why you actually win and lose deals. It is the most actionable competitive intelligence.

**Data sources**:
- CRM notes from sales team (available immediately, but biased)
- Customer interviews shortly after decision (most valuable, least biased)
- Churned customer surveys or exit interviews
- Prospect surveys (for lost deals)

### Win/Loss Interview Questions
For wins:
- What problem were you trying to solve?
- What alternatives did you evaluate? (Reveals competitive set)
- Why did you choose us over alternatives?
- What almost made you choose someone else?
- What would we need to lose for you to reconsider?

For losses:
- What problem were you trying to solve?
- What did you end up choosing? Why?
- Where did our product fall short?
- What could we have done differently?
- Would you reconsider us in the future? Under what conditions?

### Analyzing Win/Loss Data
- Track win/loss reasons over time. Are patterns changing?
- Segment by deal type: enterprise vs SMB, new vs expansion, industry vertical
- Identify the top 3-5 reasons for wins and losses
- Distinguish between product reasons (features, quality) and non-product reasons (pricing, brand, relationship, timing)
- Calculate competitive win rates by competitor: what % of deals involving each competitor do you win?

### Common Win/Loss Patterns
- **Feature gap**: Competitor has a specific capability you lack that is a dealbreaker
- **Integration advantage**: Competitor integrates with tools the buyer already uses
- **Pricing structure**: Not always cheaper — sometimes different pricing model (per-seat vs usage-based) fits better
- **Incumbent advantage**: Buyer sticks with what they have because switching cost is too high
- **Sales execution**: Better demo, faster response, more relevant case studies
- **Brand/trust**: Buyer chooses the safer or more well-known option

## Market Trend Identification

### Sources for Trend Identification
- **Industry analyst reports**: Gartner, Forrester, IDC for market sizing and trends
- **Venture capital**: What are VCs funding? Investment themes signal where smart money sees opportunity.
- **Conference themes**: What are industry events focusing on? What topics draw the biggest audiences?
- **Technology shifts**: New platforms, APIs, or capabilities that enable new product categories
- **Regulatory changes**: New regulations that create requirements or opportunities
- **Customer behavior changes**: How are user expectations evolving? (e.g., mobile-first, AI-assisted, privacy-conscious)
- **Talent movement**: Where are top people going? What skills are in demand?

### Trend Analysis Framework
For each trend identified:

1. **What is changing?**: Describe the trend clearly and specifically
2. **Why now?**: What is driving this change? (Technology, regulation, behavior, economics)
3. **Who is affected?**: Which customer segments or market categories?
4. **What is the timeline?**: Is this happening now, in 1-2 years, or 3-5 years?
5. **What is the implication for us?**: How should this influence our product strategy?
6. **What are competitors doing?**: How are competitors responding to this trend?

### Separating Signal from Noise
- **Signals**: Trends backed by behavioral data, growing investment, regulatory action, or customer demand
- **Noise**: Trends backed only by media hype, conference buzz, or competitor announcements without customer traction
- Test trends against your own customer data: are YOUR customers asking for this or experiencing this change?
- Be wary of "trend of the year" hype cycles. Many trends that dominate industry conversation do not materially affect your customers for years.

### Strategic Response Options
For each significant trend:
- **Lead**: Invest early and try to define the category or approach. High risk, high reward.
- **Fast follow**: Wait for early signals of customer demand, then move quickly. Lower risk but harder to differentiate.
- **Monitor**: Track the trend but do not invest yet. Set triggers for when to act.
- **Ignore**: Explicitly decide this trend is not relevant to your strategy. Document why.

The right response depends on: your competitive position, your customer base, your resources, and how fast the trend is moving.

## Output Format

Use tables for feature comparisons. Use clear headers for each section. Keep the strategic implications section concise and actionable — this is where the value is for the reader.

## Tips

- Be honest about competitor strengths. Dismissing competitors makes the analysis useless.
- Focus on what matters to customers, not what matters to product teams. Customers do not care about architecture elegance.
- Pricing is hard to compare fairly. Note the caveats (different packaging, usage-based vs seat-based, enterprise custom pricing).
- Job postings are underrated competitive intelligence. A competitor hiring ML engineers signals a strategic direction.
- Customer reviews are gold. They reveal what real users love and hate, unfiltered by marketing.
- The most valuable part of competitive analysis is the "so what" — the strategic implications. Do not skip this.
- Competitive analysis has a shelf life. Note the date and flag areas that change quickly.
---
name: metrics-review
description: Review and analyze product metrics with trend analysis and actionable insights. Use when running a weekly, monthly, or quarterly metrics review, investigating a sudden spike or drop, comparing performance against targets, or turning raw numbers into a scorecard with recommended actions.
argument-hint: "<time period or metric focus>"
---

# Metrics Review

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Review and analyze product metrics, identify trends, and surface actionable insights.

## Usage

```
/metrics-review $ARGUMENTS
```

## Workflow

### 1. Gather Metrics Data

If **~~product analytics** is connected:
- Pull key product metrics for the relevant time period
- Get comparison data (previous period, same period last year, targets)
- Pull segment breakdowns if available

If no analytics tool is connected, ask the user to provide:
- The metrics and their values (paste a table, screenshot, or describe)
- Comparison data (previous period, targets)
- Any context on recent changes (launches, incidents, seasonality)

Ask the user:
- What time period to review? (last week, last month, last quarter)
- What metrics to focus on? Or should we review the full product metrics suite?
- Are there specific targets or goals to compare against?
- Any known events that might explain changes (launches, outages, marketing campaigns, seasonality)?

### 2. Organize the Metrics

Structure the review using a metrics hierarchy: North Star metric at the top, L1 health indicators (acquisition, activation, engagement, retention, revenue, satisfaction), and L2 diagnostic metrics for drill-down. See **Product Metrics Hierarchy** below for full definitions.

If the user has not defined their metrics hierarchy, help them identify their North Star and key L1 metrics before proceeding.

### 3. Analyze Trends

For each key metric:
- **Current value**: What is the metric today?
- **Trend**: Up, down, or flat compared to previous period? Over what timeframe?
- **vs Target**: How does it compare to the goal or target?
- **Rate of change**: Is the trend accelerating or decelerating?
- **Anomalies**: Any sudden changes, spikes, or drops?

Identify correlations:
- Do changes in one metric correlate with changes in another?
- Are there leading indicators that predict lagging metric changes?
- Do segment breakdowns reveal that an aggregate trend is driven by a specific cohort?

### 4. Generate the Review

#### Summary
2-3 sentences: overall product health, most notable changes, key callout.

#### Metric Scorecard
Table format for quick scanning:

| Metric | Current | Previous | Change | Target | Status |
|--------|---------|----------|--------|--------|--------|
| [Metric] | [Value] | [Value] | [+/- %] | [Target] | [On track / At risk / Miss] |

#### Trend Analysis
For each metric worth discussing:
- What happened and how significant is the change
- Why it likely happened (attribution based on known events, correlated metrics, segment analysis)
- Whether this is a one-time event or a sustained trend

#### Bright Spots
What is going well:
- Metrics beating targets
- Positive trends to sustain
- Segments or features showing strong performance

#### Areas of Concern
What needs attention:
- Metrics missing targets or trending negatively
- Early warning signals before they become problems
- Metrics where we lack visibility or understanding

#### Recommended Actions
Specific next steps based on the analysis:
- Investigations to run (dig deeper into a concerning trend)
- Experiments to launch (test hypotheses about what could improve a metric)
- Investments to make (double down on what is working)
- Alerts to set (monitor a metric more closely)

#### Context and Caveats
- Known data quality issues
- Events that affect comparability (outages, holidays, launches)
- Metrics we should be tracking but are not yet

### 5. Follow Up

After generating the review:
- Ask if any metric needs deeper investigation
- Offer to create a dashboard spec for ongoing monitoring
- Offer to draft experiment proposals for areas of concern
- Offer to set up a metrics review template for recurring use

## Product Metrics Hierarchy

### North Star Metric
The single metric that best captures the core value your product delivers to users. It should be:

- **Value-aligned**: Moves when users get more value from the product
- **Leading**: Predicts long-term business success (revenue, retention)
- **Actionable**: The product team can influence it through their work
- **Understandable**: Everyone in the company can understand what it means and why it matters

**Examples by product type**:
- Collaboration tool: Weekly active teams with 3+ members contributing
- Marketplace: Weekly transactions completed
- SaaS platform: Weekly active users completing core workflow
- Content platform: Weekly engaged reading/viewing time
- Developer tool: Weekly deployments using the tool

### L1 Metrics (Health Indicators)
The 5-7 metrics that together paint a complete picture of product health. These map to the key stages of the user lifecycle:

**Acquisition**: Are new users finding the product?
- New signups or trial starts (volume and trend)
- Signup conversion rate (visitors to signups)
- Channel mix (where are new users coming from)
- Cost per acquisition (for paid channels)

**Activation**: Are new users reaching the value moment?
- Activation rate: % of new users who complete the key action that predicts retention
- Time to activate: how long from signup to activation
- Setup completion rate: % who complete onboarding steps
- First value moment: when users first experience the core product value

**Engagement**: Are active users getting value?
- DAU / WAU / MAU: active users at different timeframes
- DAU/MAU ratio (stickiness): what fraction of monthly users come back daily
- Core action frequency: how often users do the thing that matters most
- Session depth: how much users do per session
- Feature adoption: % of users using key features

**Retention**: Are users coming back?
- D1, D7, D30 retention: % of users who return after 1 day, 7 days, 30 days
- Cohort retention curves: how retention evolves for each signup cohort
- Churn rate: % of users or revenue lost per period
- Resurrection rate: % of churned users who come back

**Monetization**: Is value translating to revenue?
- Conversion rate: free to paid (for freemium)
- MRR / ARR: monthly or annual recurring revenue
- ARPU / ARPA: average revenue per user or account
- Expansion revenue: revenue growth from existing customers
- Net revenue retention: revenue retention including expansion and contraction

**Satisfaction**: How do users feel about the product?
- NPS: Net Promoter Score
- CSAT: Customer Satisfaction Score
- Support ticket volume and resolution time
- App store ratings and review sentiment

### L2 Metrics (Diagnostic)
Detailed metrics used to investigate changes in L1 metrics:

- Funnel conversion at each step
- Feature-level usage and adoption
- Segment-specific breakdowns (by plan, company size, geography, user role)
- Performance metrics (page load time, error rate, API latency)
- Content-specific engagement (which features, pages, or content types drive engagement)

## Common Product Metrics

### DAU / WAU / MAU
**What they measure**: Unique users who perform a qualifying action in a day, week, or month.

**Key decisions**:
- What counts as "active"? A login? A page view? A core action? Define this carefully — different definitions tell different stories.
- Which timeframe matters most? DAU for daily-use products (messaging, email). WAU for weekly-use products (project management). MAU for less frequent products (tax software, travel booking).

**How to use them**:
- DAU/MAU ratio (stickiness): values above 0.5 indicate a daily habit. Below 0.2 suggests infrequent usage.
- Trend matters more than absolute number. Is active usage growing, flat, or declining?
- Segment by user type. Power users and casual users behave very differently.

### Retention
**What it measures**: Of users who started in period X, what % are still active in period Y?

**Common retention timeframes**:
- D1 (next day): Was the first experience good enough to come back?
- D7 (one week): Did the user establish a habit?
- D30 (one month): Is the user retained long-term?
- D90 (three months): Is this a durable user?

**How to use retention**:
- Plot retention curves by cohort. Look for: initial drop-off (activation problem), steady decline (engagement problem), or flattening (good — you have a stable retained base).
- Compare cohorts over time. Are newer cohorts retaining better than older ones? That means product improvements are working.
- Segment retention by activation behavior. Users who completed onboarding vs those who did not. Users who used feature X vs those who did not.

### Conversion
**What it measures**: % of users who move from one stage to the next.

**Common conversion funnels**:
- Visitor to signup
- Signup to activation (key value moment)
- Free to paid (trial conversion)
- Trial to paid subscription
- Monthly to annual plan

**How to use conversion**:
- Map the full funnel and measure conversion at each step
- Identify the biggest drop-off points — these are your highest-leverage improvement opportunities
- Segment conversion by source, plan, user type. Different segments convert very differently.
- Track conversion over time. Is it improving as you iterate on the experience?

### Activation
**What it measures**: % of new users who reach the moment where they first experience the product's core value.

**Defining activation**:
- Look at retained users vs churned users. What actions did retained users take that churned users did not?
- The activation event should be strongly predictive of long-term retention
- It should be achievable within the first session or first few days
- Examples: created first project, invited a teammate, completed first workflow, connected an integration

**How to use activation**:
- Track activation rate for every signup cohort
- Measure time to activate — faster is almost always better
- Build onboarding flows that guide users to the activation moment
- A/B test activation flows and measure impact on retention, not just activation rate

## Goal Setting Frameworks

### OKRs (Objectives and Key Results)

**Objectives**: Qualitative, aspirational goals that describe what you want to achieve.
- Inspiring and memorable
- Time-bound (quarterly or annually)
- Directional, not metric-specific

**Key Results**: Quantitative measures that tell you if you achieved the objective.
- Specific and measurable
- Time-bound with a clear target
- Outcome-based, not output-based
- 2-4 Key Results per Objective

**Example**:
```
Objective: Make our product indispensable for daily workflows

Key Results:
- Increase DAU/MAU ratio from 0.35 to 0.50
- Increase D30 retention for new users from 40% to 55%
- 3 core workflows with >80% task completion rate
```

### OKR Best Practices
- Set OKRs that are ambitious but achievable. 70% completion is the target for stretch OKRs.
- Key Results should measure outcomes (user behavior, business results), not outputs (features shipped, tasks completed).
- Do not have too many OKRs. 2-3 objectives with 2-4 KRs each is plenty.
- OKRs should be uncomfortable. If you are confident you will hit all of them, they are not ambitious enough.
- Review OKRs at mid-period. Adjust effort allocation if some KRs are clearly off track.
- Grade OKRs honestly at end of period. 0.0-0.3 = missed, 0.4-0.6 = progress, 0.7-1.0 = achieved.

### Setting Metric Targets
- **Baseline**: What is the current value? You need a reliable baseline before setting a target.
- **Benchmark**: What do comparable products achieve? Industry benchmarks provide context.
- **Trajectory**: What is the current trend? If the metric is already improving at 5% per month, a 6% target is not ambitious.
- **Effort**: How much investment are you putting behind this? Bigger bets warrant more ambitious targets.
- **Confidence**: How confident are you in hitting the target? Set a "commit" (high confidence) and a "stretch" (ambitious).

## Metric Review Cadences

### Weekly Metrics Check
**Purpose**: Catch issues quickly, monitor experiments, stay in touch with product health.
**Duration**: 15-30 minutes.
**Attendees**: Product manager, maybe engineering lead.

**What to review**:
- North Star metric: current value, week-over-week change
- Key L1 metrics: any notable movements
- Active experiments: results and statistical significance
- Anomalies: any unexpected spikes or drops
- Alerts: anything that triggered a monitoring alert

**Action**: If something looks off, investigate. Otherwise, note it and move on.

### Monthly Metrics Review
**Purpose**: Deeper analysis of trends, progress against goals, strategic implications.
**Duration**: 30-60 minutes.
**Attendees**: Product team, key stakeholders.

**What to review**:
- Full L1 metric scorecard with month-over-month trends
- Progress against quarterly OKR targets
- Cohort analysis: are newer cohorts performing better?
- Feature adoption: how are recent launches performing?
- Segment analysis: any divergence between user segments?

**Action**: Identify 1-3 areas to investigate or invest in. Update priorities if metrics reveal new information.

### Quarterly Business Review
**Purpose**: Strategic assessment of product performance, goal-setting for next quarter.
**Duration**: 60-90 minutes.
**Attendees**: Product, engineering, design, leadership.

**What to review**:
- OKR scoring for the quarter
- Trend analysis for all L1 metrics over the quarter
- Year-over-year comparisons
- Competitive context: market changes and competitor movements
- What worked and what did not

**Action**: Set OKRs for next quarter. Adjust product strategy based on what the data shows.

## Dashboard Design Principles

### Effective Product Dashboards
A good dashboard answers the question "How is the product doing?" at a glance.

**Principles**:

1. **Start with the question, not the data**. What decisions does this dashboard support? Design backwards from the decision.

2. **Hierarchy of information**. The most important metric should be the most visually prominent. North Star at the top, L1 metrics next, L2 metrics available on drill-down.

3. **Context over numbers**. A number without context is meaningless. Always show: current value, comparison (previous period, target, benchmark), trend direction.

4. **Fewer metrics, more insight**. A dashboard with 50 metrics helps no one. Focus on 5-10 that matter. Put everything else in a detailed report.

5. **Consistent time periods**. Use the same time period for all metrics on a dashboard. Mixing daily and monthly metrics creates confusion.

6. **Visual status indicators**. Use color to indicate health at a glance:
   - Green: on track or improving
   - Yellow: needs attention or flat
   - Red: off track or declining

7. **Actionability**. Every metric on the dashboard should be something the team can influence. If you cannot act on it, it does not belong on the product dashboard.

### Dashboard Layout

**Top row**: North Star metric with trend line and target.

**Second row**: L1 metrics scorecard — current value, change, target, status for each key metric.

**Third row**: Key funnels or conversion metrics — visual funnel showing drop-off at each stage.

**Fourth row**: Recent experiments and launches — active A/B tests, recent feature launches with early metrics.

**Bottom / drill-down**: L2 metrics, segment breakdowns, and detailed time series for investigation.

### Dashboard Anti-Patterns
- **Vanity metrics**: Metrics that always go up but do not indicate health (total signups ever, total page views)
- **Too many metrics**: Dashboards that require scrolling to see. If it does not fit on one screen, cut metrics.
- **No comparison**: Raw numbers without context (current value with no previous period or target)
- **Stale dashboards**: Metrics that have not been updated or reviewed in months
- **Output dashboards**: Measuring team activity (tickets closed, PRs merged) instead of user and business outcomes
- **One dashboard for all audiences**: Executives, PMs, and engineers need different views. One size does not fit all.

### Alerting
Set alerts for metrics that require immediate attention:

- **Threshold alerts**: Metric drops below or rises above a critical threshold (error rate > 1%, conversion < 5%)
- **Trend alerts**: Metric shows sustained decline over multiple days/weeks
- **Anomaly alerts**: Metric deviates significantly from expected range

**Alert hygiene**:
- Every alert should be actionable. If you cannot do anything about it, do not alert on it.
- Review and tune alerts regularly. Too many false positives and people ignore all alerts.
- Define an owner for each alert. Who responds when it fires?
- Set appropriate severity levels. Not everything is P0.

## Output Format

Use tables for the scorecard. Use clear status indicators. Keep the summary tight — the reader should get the essential story in 30 seconds.

## Tips

- Start with the "so what" — what is the most important thing in this metrics review? Lead with that.
- Absolute numbers without context are useless. Always show comparisons (vs previous period, vs target, vs benchmark).
- Be careful about attribution. Correlation is not causation. If a metric moved, acknowledge uncertainty about why.
- Segment analysis often reveals that an aggregate metric masks important differences. A flat overall number might hide one segment growing and another shrinking.
- Not all metric movements matter. Small fluctuations are noise. Focus attention on meaningful changes.
- If a metric is missing its target, do not just report the miss — recommend what to do about it.
- Metrics reviews should drive decisions. If the review does not lead to at least one action, it was not useful.---
name: product-brainstorming
description: Brainstorm product ideas, explore problem spaces, and challenge assumptions as a thinking partner. Use when exploring a new opportunity, generating solutions to a product problem, stress-testing an idea, or when a PM needs to think out loud with a sharp sparring partner before converging on a direction.
---

# Product Brainstorming Skill

You are a sharp product thinking partner — the kind of experienced PM or design lead who challenges assumptions, asks the hard questions, and pushes ideas further before anyone converges too early. You help product managers explore problem spaces, generate ideas, and stress-test thinking before it becomes a spec.

Your job is not to generate deliverables. Your job is to think alongside the PM. Be opinionated. Push back. Bring in unexpected angles. Help them arrive at ideas they would not have reached alone.

## Brainstorming Modes

Different situations call for different modes of thinking. Identify which mode fits the conversation and adapt. You can shift between modes as the conversation evolves.

### Problem Exploration

Use when the PM has a problem area but has not yet defined what to solve. The goal is to understand the problem space deeply before jumping to solutions.

**What to do:**
- Ask "who has this problem?" and "what are they doing about it today?" before anything else
- Map the problem ecosystem: who is involved, what triggers the problem, what are the consequences of not solving it
- Distinguish symptoms from root causes. PMs often describe symptoms. Keep asking "why" until you hit something structural.
- Surface adjacent problems the PM might not have considered
- Ask how the problem varies across user segments — it rarely affects everyone the same way

**Useful questions:**
- "What happens if we do nothing? Who suffers and how?"
- "Who has solved a version of this problem in a different context?"
- "Is this a problem of awareness, ability, or motivation?"
- "What would need to be true for this problem to not exist?"

### Solution Ideation

Use when the problem is well-defined and the PM needs to generate multiple possible solutions. The goal is divergent thinking — quantity over quality.

**What to do:**
- Generate at least 5-7 distinct approaches before evaluating any of them
- Vary the solutions along meaningful dimensions: scope (small tweak vs big bet), approach (product vs process vs policy), timing (quick win vs long-term investment)
- Include at least one "what if we did the opposite?" option
- Include at least one option that removes something rather than adding something
- Resist the urge to converge too early. If the PM latches onto the first decent idea, push them to keep going.

**Ideation techniques:**
- **Constraint removal**: "What would you build if you had no technical constraints? No budget constraints? No political constraints?" Then work backward to what is feasible.
- **Analogies**: "How does [another industry] solve this? What can we steal from that approach?"
- **Inversion**: "How would we make this problem worse? Now reverse each of those."
- **Decomposition**: Break the problem into subproblems and solve each independently. Then combine.
- **User hat-switching**: "How would a power user solve this? A brand new user? An admin? Someone who hates our product?"

### Assumption Testing

Use when the PM has an idea or direction and needs to stress-test it. The goal is to find the weak points before investing in execution.

**What to do:**
- List every assumption the idea depends on — stated and unstated
- For each assumption, ask: "How confident are we? What evidence do we have? What would disprove this?"
- Identify the riskiest assumption — the one that, if wrong, kills the idea entirely
- Suggest the cheapest way to test the riskiest assumption before building anything
- Play devil's advocate: argue the strongest possible case against the idea

**Assumption categories to probe:**
- **User assumptions**: "Users want this" — How do we know? From what evidence? How many users?
- **Problem assumptions**: "This is a real problem" — How often does it occur? How much do users care?
- **Solution assumptions**: "This solution will work" — Why this approach? What alternatives did we dismiss?
- **Business assumptions**: "This will move the metric" — Which metric? By how much? Over what timeline?
- **Feasibility assumptions**: "We can build this" — In what timeframe? With what trade-offs?
- **Adoption assumptions**: "Users will find and use this" — How? What behavior change does it require?

### Strategy Exploration

Use when the PM is thinking about direction, positioning, or big bets — not a specific feature. The goal is to explore the strategic landscape.

**What to do:**
- Map the playing field: what are the possible strategic moves, not just the obvious one
- Think in terms of bets: what are we betting on, what are the odds, what is the payoff
- Consider second-order effects: "If we do X, what does that enable or foreclose?"
- Bring in competitive dynamics: "If we do this, how do competitors respond?"
- Think in timeframes: "What is the right move for 3 months vs 12 months vs 3 years?"

## Brainstorming Frameworks

Use frameworks as thinking tools, not templates to fill in. Pull in a framework when it helps move the conversation forward. Do not force every conversation through every framework.

### How Might We (HMW)

Reframe problems as opportunities. Turn a pain point into an actionable question.

**Structure**: "How might we [desired outcome] for [user] without [constraint]?"

**Tips:**
- Too broad: "How might we improve onboarding?" — could mean anything
- Too narrow: "How might we add a tooltip to step 3?" — that is a solution, not a question
- Right level: "How might we help new users reach their first success within 10 minutes?"
- Generate 5-10 HMW questions from a single problem statement. Each reframing opens different solution spaces.

### Jobs-to-be-Done (JTBD)

Think from the user's job, not from features or demographics.

**Structure**: "When [situation], I want to [motivation] so I can [expected outcome]."

**Tips:**
- The job is stable even when solutions change. People have been "hiring" solutions to share updates with colleagues for decades — memos, email, Slack, shared docs.
- Functional jobs (get something done) are easier to identify. Emotional jobs (feel confident, look competent) and social jobs (be seen as a leader) are often more powerful.
- Ask "What did they fire to hire your product?" — this reveals the real competitive set.

### Opportunity Solution Trees

Map the path from outcome to experiment.

```
Desired Outcome
├── Opportunity A (user need / pain point)
│   ├── Solution A1
│   │   ├── Experiment: ...
│   │   └── Experiment: ...
│   └── Solution A2
│       └── Experiment: ...
├── Opportunity B
│   ├── Solution B1
│   └── Solution B2
└── Opportunity C
    └── Solution C1
```

**Tips:**
- Opportunities come from research, not imagination. Every opportunity should trace back to evidence.
- Multiple solutions per opportunity. If you only have one solution, you have not explored enough.
- Multiple experiments per solution. Find the cheapest way to test before building.
- The tree is a living artifact. Update it as you learn.

### First Principles Decomposition

Break a complex problem down to its fundamental truths and rebuild.

1. **State the problem or assumption** you want to examine
2. **Break it down**: What are the fundamental components or constraints?
3. **Question each component**: Why does this have to be this way? Is this a law of physics or a convention?
4. **Rebuild from the ground up**: Given only the fundamental truths, what solutions are possible?

**When to use**: When the team is stuck in incremental thinking. When everyone says "that is just how it works." When the category has not been reimagined in years.

### SCAMPER

Systematic ideation using seven lenses on an existing product or process:

- **Substitute**: What component could be replaced? What if a different user did this step?
- **Combine**: What if we merged two features? Two workflows? Two user roles?
- **Adapt**: What idea from another product or industry could we borrow?
- **Modify**: What if we made this 10x bigger? 10x smaller? 10x faster?
- **Put to other use**: Could this feature serve a different user or use case?
- **Eliminate**: What if we removed this entirely? Would anyone notice?
- **Reverse**: What if we did the opposite? Flipped the sequence? Inverted the default?

### OODA Loop (Observe–Orient–Decide–Act)

A decision-tempo framework from military strategy that excels in fast-moving, competitive product environments. The power of OODA is not in the steps — it is in cycling through them faster than the competition.

1. **Observe**: Gather raw signals — usage data, customer feedback, competitive moves, market shifts, support tickets. Do not filter yet. Cast wide.
2. **Orient**: Make sense of what you observed. This is the critical step. Orient through the lens of your mental models, prior experience, and cultural context. Challenge your own orientation — are you seeing what is actually there, or what you expect to see?
3. **Decide**: Choose a direction. Not a final commitment — a hypothesis to test. The decision should be proportional to what you know. Small bets when uncertain, bigger moves when the signal is clear.
4. **Act**: Execute the decision. Ship something. Run the experiment. Make the change. Then immediately return to Observe with new data.

**When to use in brainstorming:**
- When the team is over-deliberating and needs to move. OODA favors tempo over perfection.
- When competitive dynamics matter — a competitor just shipped something, a market window is closing, a customer is about to churn.
- When the brainstorm keeps circling without converging. OODA forces a decision and reframes it as reversible: act, observe new data, re-orient.
- When exploring strategy: "Given what we are observing in the market, how should we re-orient our product thinking?"

**The OODA advantage in product:** Most product teams get stuck in Orient — endlessly analyzing, debating frameworks, waiting for more data. OODA says: orient with what you have, decide, act, and let the next observation cycle correct your course. The team that cycles fastest learns fastest.

### Reverse Brainstorming

When stuck on how to solve a problem, brainstorm how to make it worse.

1. **Invert the problem**: "How could we make onboarding as confusing as possible?"
2. **Generate ideas**: List everything that would make the problem worse (more steps, jargon, hidden buttons, no feedback)
3. **Reverse each idea**: Each "make it worse" idea contains the seed of a "make it better" solution
4. **Evaluate**: Which reversed ideas are most promising?

**Why it works**: People are better at identifying what is wrong than imagining what is right. Inversion unlocks creative thinking when the team is stuck.

## Session Structure

A good brainstorming session has rhythm — it opens up before it narrows down.

### 1. Frame

Set boundaries before generating ideas. Good framing prevents wasted divergence.

- What are we exploring? (A specific problem, an opportunity area, a strategic question)
- Why now? (What triggered this brainstorm?)
- What do we already know? (Prior research, data, customer feedback)
- What are the constraints? (Timeline, technical, business, team)
- What would a great outcome from this session look like?

Spend enough time framing. A poorly framed brainstorm produces ideas that do not connect to real needs.

### 2. Diverge

Generate many ideas. No judgment. Quantity enables quality.

- Build on ideas rather than shooting them down
- Follow tangents — the best ideas often come from unexpected connections
- Push past the obvious. The first 3-5 ideas are usually the ones everyone would have thought of. Keep going.
- Ask provocative questions to unlock new directions
- Use frameworks (above) to systematically explore different angles

### 3. Provoke

Challenge and extend thinking. This is where the sparring partner role matters most.

- "What is the strongest argument against this?"
- "Who would hate this and why?"
- "What are we not seeing?"
- "What would [specific company or person] do differently?"
- "What if the opposite were true?"
- "What is the version of this that is 10x more ambitious?"

### 4. Converge

Narrow down. Evaluate ideas against what matters.

- Group related ideas into themes
- Evaluate against: user impact, feasibility, strategic alignment, evidence strength
- Do not kill ideas by committee. If one idea excites the PM, explore it — even if it is risky. The brainstorm is not the decision.
- Identify the top 2-3 ideas worth pursuing further
- For each, name the biggest unknown and the cheapest way to resolve it

### 5. Capture

Document what matters. A brainstorm with no capture is a brainstorm that never happened.

- Key ideas and why they are interesting
- Assumptions to test
- Questions to research
- Suggested next steps (research, prototype, talk to users, write a one-pager)
- What was explicitly set aside — ideas that were interesting but not for now

## Being a Good Thinking Partner

### Do

- **Be opinionated.** "I think approach B is stronger because..." is more useful than listing pros and cons.
- **Challenge constructively.** "That assumes X — are we confident?" not "That will not work."
- **Bring unexpected angles.** Cross-industry analogies, counterexamples, edge cases the PM has not considered.
- **Match energy.** If the PM is excited about an idea, explore it with them before poking holes.
- **Ask the next question.** When the PM finishes a thought, do not just agree. Push further: "And then what happens?"
- **Name the pattern.** If you recognize a common PM trap (solutioning too early, scope creep, feature parity thinking), name it directly.

### Do Not

- **Do not dump frameworks.** Use frameworks as thinking tools when they help, not as a checklist to work through.
- **Do not generate a list and hand it over.** Brainstorming is a conversation, not a deliverable.
- **Do not agree with everything.** A thinking partner who only validates is not a thinking partner.
- **Do not optimize prematurely.** In divergent mode, do not evaluate feasibility. That kills creative thinking.
- **Do not anchor on the first idea.** If the PM leads with a solution, acknowledge it, then ask "What else could solve this?"
- **Do not confuse brainstorming with decision-making.** The brainstorm generates options. The decision comes later with more data.

## Common Brainstorming Anti-Patterns

**Solutioning before framing**: The PM jumps to "we should build X" before defining the problem. Slow them down. Ask what user problem X solves and how we know.

**The feature parity trap**: "Competitor has X, so we need X." This is not brainstorming — it is copying. Ask what user need X serves and whether there is a better way to serve it.

**Anchoring on constraints**: "We cannot do that because of technical limitation Y." In divergent mode, set constraints aside. Explore freely first, then figure out feasibility.

**The one-idea brainstorm**: The PM comes in with a solution and calls it brainstorming. Acknowledge their idea, then push for alternatives. "That is one approach. What are three others?"

**Analysis paralysis**: Too much exploration, no convergence. If the session has been divergent for a while, prompt: "If you had to pick one direction right now, which would it be and why?"

**Brainstorming when you should be researching**: Some questions cannot be brainstormed — they need data. If the brainstorm keeps circling because no one knows the answer, stop and identify what research is needed.
---
name: roadmap-update
description: Update, create, or reprioritize your product roadmap. Use when adding a new initiative and deciding what moves to make room, shifting priorities after new information comes in, moving timelines due to a dependency slip, or building a Now/Next/Later view from scratch.
argument-hint: "<update description>"
---

# Roadmap Update

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Update, create, or reprioritize a product roadmap.

## Usage

```
/roadmap-update $ARGUMENTS
```

## Workflow

### 1. Understand Current State

If **~~project tracker** is connected:
- Pull current roadmap items with their statuses, assignees, and dates
- Identify items that are overdue, at risk, or recently completed
- Surface any items without clear owners or dates

If no project management tool is connected:
- Ask the user to describe their current roadmap or paste/upload it
- Accept any format: list, table, spreadsheet, screenshot, or prose description

### 2. Determine the Operation

Ask what the user wants to do:

**Add item**: New feature, initiative, or work item to the roadmap
- Gather: name, description, priority, estimated effort, target timeframe, owner, dependencies
- Suggest where it fits based on current priorities and capacity

**Update status**: Change status of existing items
- Options: not started, in progress, at risk, blocked, completed, cut
- For "at risk" or "blocked": ask for the blocker and mitigation plan

**Reprioritize**: Change the order or priority of items
- Ask what changed (new information, strategy shift, resource change, customer feedback)
- Apply a prioritization framework if helpful — see **Prioritization Frameworks** below for RICE, MoSCoW, ICE, and value-vs-effort
- Show before/after comparison

**Move timeline**: Shift dates for items
- Ask why (scope change, dependency slip, resource constraint)
- Identify downstream impacts on dependent items
- Flag items that move past hard deadlines

**Create new roadmap**: Build a roadmap from scratch
- Ask about timeframe (quarter, half, year)
- Ask about format preference (Now/Next/Later, quarterly columns, OKR-aligned) — see **Roadmap Frameworks** below
- Gather the list of initiatives to include

### 3. Generate Roadmap Summary

Produce a roadmap view with:

#### Status Overview
Quick summary: X items in progress, Y completed this period, Z at risk.

#### Roadmap Items
For each item, show:
- Name and one-line description
- Status indicator (on track / at risk / blocked / completed / not started)
- Target timeframe or date
- Owner
- Key dependencies

Group items by:
- Timeframe (Now / Next / Later) or quarter, depending on format
- Or by theme/goal if the user prefers

#### Risks and Dependencies
- Items that are blocked or at risk, with details
- Cross-team dependencies and their status
- Items approaching hard deadlines

#### Changes This Update
If this is an update to an existing roadmap, summarize what changed:
- Items added, removed, or reprioritized
- Timeline shifts
- Status changes

### 4. Follow Up

After generating the roadmap:
- Offer to format for a specific audience (executive summary, engineering detail, customer-facing)
- Offer to draft communication about roadmap changes
- If project management tool is connected, offer to update ticket statuses

## Roadmap Frameworks

### Now / Next / Later
The simplest and often most effective roadmap format:

- **Now** (current sprint/month): Committed work. High confidence in scope and timeline. These are the things the team is actively building.
- **Next** (next 1-3 months): Planned work. Good confidence in what, less confidence in exactly when. Scoped and prioritized but not yet started.
- **Later** (3-6+ months): Directional. These are strategic bets and opportunities we intend to pursue, but scope and timing are flexible.

When to use: Most teams, most of the time. Especially good for communicating externally or to leadership because it avoids false precision on dates.

### Quarterly Themes
Organize the roadmap around 2-3 themes per quarter:

- Each theme represents a strategic area of investment (e.g., "Enterprise readiness", "Activation improvements", "Platform extensibility")
- Under each theme, list the specific initiatives planned
- Themes should map to company or team OKRs
- This format makes it easy to explain WHY you are building what you are building

When to use: When you need to show strategic alignment. Good for planning meetings and executive communication.

### OKR-Aligned Roadmap
Map roadmap items directly to Objectives and Key Results:

- Start with the team's OKRs for the period
- Under each Key Result, list the initiatives that will move that metric
- Include the expected impact of each initiative on the Key Result
- This creates clear accountability between what you build and what you measure

When to use: Organizations that run on OKRs. Good for ensuring every initiative has a clear "why" tied to measurable outcomes.

### Timeline / Gantt View
Calendar-based view with items on a timeline:

- Shows start dates, end dates, and durations
- Visualizes parallelism and sequencing
- Good for identifying resource conflicts
- Shows dependencies between items

When to use: Execution planning with engineering. Identifying scheduling conflicts. NOT good for communicating externally (creates false precision expectations).

## Prioritization Frameworks

### RICE Score
Score each initiative on four dimensions, then calculate RICE = (Reach x Impact x Confidence) / Effort

- **Reach**: How many users/customers will this affect in a given time period? Use concrete numbers (e.g., "500 users per quarter").
- **Impact**: How much will this move the needle for each person reached? Score on a scale: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal.
- **Confidence**: How confident are we in the reach and impact estimates? 100% = high confidence (backed by data), 80% = medium (some evidence), 50% = low (gut feel).
- **Effort**: How many person-months of work? Include engineering, design, and any other functions.

When to use: When you need a quantitative, defensible prioritization. Good for comparing a large backlog of initiatives. Less good for strategic bets where impact is hard to estimate.

### MoSCoW
Categorize items into Must have, Should have, Could have, Won't have:

- **Must have**: The roadmap is a failure without these. Non-negotiable commitments.
- **Should have**: Important and expected, but delivery is viable without them.
- **Could have**: Desirable but clearly lower priority. Include only if capacity allows.
- **Won't have**: Explicitly out of scope for this period. Important to list for clarity.

When to use: Scoping a release or quarter. Negotiating with stakeholders about what fits. Good for forcing prioritization conversations.

### ICE Score
Simpler than RICE. Score each item 1-10 on three dimensions:

- **Impact**: How much will this move the target metric?
- **Confidence**: How confident are we in the impact estimate?
- **Ease**: How easy is this to implement? (Inverse of effort — higher = easier)

ICE Score = Impact x Confidence x Ease

When to use: Quick prioritization of a feature backlog. Good for early-stage products or when you do not have enough data for RICE.

### Value vs Effort Matrix
Plot initiatives on a 2x2 matrix:

- **High value, Low effort** (Quick wins): Do these first.
- **High value, High effort** (Big bets): Plan these carefully. Worth the investment but need proper scoping.
- **Low value, Low effort** (Fill-ins): Do these when you have spare capacity.
- **Low value, High effort** (Money pits): Do not do these. Remove from the backlog.

When to use: Visual prioritization in team planning sessions. Good for building shared understanding of tradeoffs.

## Dependency Mapping

### Identifying Dependencies
Look for dependencies across these categories:

- **Technical dependencies**: Feature B requires infrastructure work from Feature A
- **Team dependencies**: Feature requires work from another team (design, platform, data)
- **External dependencies**: Waiting on a vendor, partner, or third-party integration
- **Knowledge dependencies**: Need research or investigation results before starting
- **Sequential dependencies**: Must ship Feature A before starting Feature B (shared code, user flow)

### Managing Dependencies
- List all dependencies explicitly in the roadmap
- Assign an owner to each dependency (who is responsible for resolving it)
- Set a "need by" date: when does the depending item need this resolved
- Build buffer around dependencies — they are the highest-risk items on any roadmap
- Flag dependencies that cross team boundaries early — these require coordination
- Have a contingency plan: what do you do if the dependency slips?

### Reducing Dependencies
- Can you build a simpler version that avoids the dependency?
- Can you parallelize by using an interface contract or mock?
- Can you sequence differently to move the dependency earlier?
- Can you absorb the work into your team to remove the cross-team coordination?

## Capacity Planning

### Estimating Capacity
- Start with the number of engineers and the time period
- Subtract known overhead: meetings, on-call rotations, interviews, holidays, PTO
- A common rule of thumb: engineers spend 60-70% of time on planned feature work
- Factor in team ramp time for new members

### Allocating Capacity
A healthy allocation for most product teams:

- **70% planned features**: Roadmap items that advance strategic goals
- **20% technical health**: Tech debt, reliability, performance, developer experience
- **10% unplanned**: Buffer for urgent issues, quick wins, and requests from other teams

Adjust ratios based on team context:
- New product: more feature work, less tech debt
- Mature product: more tech debt and reliability investment
- Post-incident: more reliability, less features
- Rapid growth: more scalability and performance

### Capacity vs Ambition
- If roadmap commitments exceed capacity, something must give
- Do not solve capacity problems by pretending people can do more — solve by cutting scope
- When adding to the roadmap, always ask: "What comes off?"
- Better to commit to fewer things and deliver reliably than to overcommit and disappoint

## Communicating Roadmap Changes

### When the Roadmap Changes
Common triggers for roadmap changes:
- New strategic priority from leadership
- Customer feedback or research that changes priorities
- Technical discovery that changes estimates
- Dependency slip from another team
- Resource change (team grows or shrinks, key person leaves)
- Competitive move that requires response

### How to Communicate Changes
1. **Acknowledge the change**: Be direct about what is changing and why
2. **Explain the reason**: What new information drove this decision?
3. **Show the tradeoff**: What was deprioritized to make room? Or what is slipping?
4. **Show the new plan**: Updated roadmap with the changes reflected
5. **Acknowledge impact**: Who is affected and how? Stakeholders who were expecting deprioritized items need to hear it directly.

### Avoiding Roadmap Whiplash
- Do not change the roadmap for every piece of new information. Have a threshold for change.
- Batch roadmap updates at natural cadences (monthly, quarterly) unless something is truly urgent.
- Distinguish between "roadmap change" (strategic reprioritization) and "scope adjustment" (normal execution refinement).
- Track how often the roadmap changes. Frequent changes may signal unclear strategy, not good responsiveness.

## Output Format

Use a clear, scannable format. Tables work well for roadmap items. Use text status labels: **Done**, **On Track**, **At Risk**, **Blocked**, **Not Started**.

## Tips

- A roadmap is a communication tool, not a project plan. Keep it at the right altitude — themes and outcomes, not tasks.
- When reprioritizing, always ask what changed. Priority shifts should be driven by new information, not whim.
- Flag capacity issues early. If the roadmap has more work than the team can handle, say so.
- Dependencies are the biggest risk to roadmaps. Surface them explicitly.
- If the user asks to add something, always ask what comes off or moves. Roadmaps are zero-sum against capacity.
---
name: sprint-planning
description: Plan a sprint — scope work, estimate capacity, set goals, and draft a sprint plan. Use when kicking off a new sprint, sizing a backlog against team availability (accounting for PTO and meetings), deciding what's P0 vs. stretch, or handling carryover from the last sprint.
argument-hint: "[sprint name or date range]"
---

# /sprint-planning

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Plan a sprint by scoping work, estimating capacity, and setting clear goals.

## Usage

```
/sprint-planning $ARGUMENTS
```

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPRINT PLANNING                                 │
├─────────────────────────────────────────────────────────────────┤
│  STANDALONE (always works)                                       │
│  ✓ Define sprint goals and success criteria                     │
│  ✓ Estimate team capacity (accounting for PTO, meetings)        │
│  ✓ Scope and prioritize backlog items                           │
│  ✓ Identify dependencies and risks                              │
│  ✓ Generate sprint plan document                                │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (when you connect your tools)                      │
│  + Project tracker: Pull backlog, create sprint, assign items   │
│  + Calendar: Account for PTO and meetings in capacity           │
│  + Chat: Share sprint plan with the team                        │
└─────────────────────────────────────────────────────────────────┘
```

## What I Need From You

- **Team**: Who's on the team and their availability this sprint?
- **Sprint length**: How many days/weeks?
- **Backlog**: What's prioritized? (Pull from tracker, paste, or describe)
- **Carryover**: Anything unfinished from last sprint?
- **Dependencies**: Anything blocked on other teams?

## Output

```markdown
## Sprint Plan: [Sprint Name]
**Dates:** [Start] — [End] | **Team:** [X] engineers
**Sprint Goal:** [One clear sentence about what success looks like]

### Capacity
| Person | Available Days | Allocation | Notes |
|--------|---------------|------------|-------|
| [Name] | [X] of [Y] | [X] points/hours | [PTO, on-call, etc.] |
| **Total** | **[X]** | **[X] points** | |

### Sprint Backlog
| Priority | Item | Estimate | Owner | Dependencies |
|----------|------|----------|-------|--------------|
| P0 | [Must ship] | [X] pts | [Person] | [None / Blocked by X] |
| P1 | [Should ship] | [X] pts | [Person] | [None] |
| P2 | [Stretch] | [X] pts | [Person] | [None] |

### Planned Capacity: [X] points | Sprint Load: [X] points ([X]% of capacity)

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [What happens] | [What to do] |

### Definition of Done
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] Documentation updated (if applicable)
- [ ] Product sign-off

### Key Dates
| Date | Event |
|------|-------|
| [Date] | Sprint start |
| [Date] | Mid-sprint check-in |
| [Date] | Sprint end / Demo |
| [Date] | Retro |
```

## Tips

1. **Leave buffer** — Plan to 70-80% capacity. You will get interrupts.
2. **One clear sprint goal** — If you can't state it in one sentence, the sprint is unfocused.
3. **Identify stretch items** — Know what to cut if things take longer than expected.
4. **Carry over honestly** — If something didn't ship, understand why before re-committing.
---
name: synthesize-research
description: Synthesize user research from interviews, surveys, and feedback into structured insights. Use when you have a pile of interview notes, survey responses, or support tickets to make sense of, need to extract themes and rank findings by frequency and impact, or want to turn raw feedback into roadmap recommendations.
argument-hint: "<research topic or question>"
---

# Synthesize Research

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Synthesize user research from multiple sources into structured insights and recommendations.

## Usage

```
/synthesize-research $ARGUMENTS
```

## Workflow

### 1. Gather Research Inputs

Accept research from any combination of:
- **Pasted text**: Interview notes, transcripts, survey responses, feedback
- **Uploaded files**: Research documents, spreadsheets, recordings summaries
- **~~knowledge base** (if connected): Search for research documents, interview notes, survey results
- **~~user feedback** (if connected): Pull recent support tickets, feature requests, bug reports
- **~~product analytics** (if connected): Pull usage data, funnel metrics, behavioral data
- **~~meeting transcription** (if connected): Pull interview recordings, meeting summaries, and discussion notes

Ask the user what they have:
- What type of research? (interviews, surveys, usability tests, analytics, support tickets, sales call notes)
- How many sources / participants?
- Is there a specific question or hypothesis they are investigating?
- What decisions will this research inform?

### 2. Process the Research

For each source, extract:
- **Key observations**: What did users say, do, or experience?
- **Quotes**: Verbatim quotes that illustrate important points
- **Behaviors**: What users actually did (vs what they said they do)
- **Pain points**: Frustrations, workarounds, and unmet needs
- **Positive signals**: What works well, moments of delight
- **Context**: User segment, use case, experience level

### 3. Identify Themes and Patterns

Apply thematic analysis — see **Research Synthesis Methodology** below for detailed guidance on thematic analysis, affinity mapping, and triangulation techniques.

Group observations into themes, count frequency across participants, and assess impact severity. Note contradictions and surprises.

Create a priority matrix:
- **High frequency + High impact**: Top priority findings
- **Low frequency + High impact**: Important for specific segments
- **High frequency + Low impact**: Quality-of-life improvements
- **Low frequency + Low impact**: Note but deprioritize

### 4. Generate the Synthesis

Produce a structured research synthesis:

#### Research Overview
- Methodology: what types of research, how many participants/sources
- Research question(s): what we set out to learn
- Timeframe: when the research was conducted

#### Key Findings
For each major finding (aim for 5-8):
- **Finding statement**: One clear sentence describing the insight
- **Evidence**: Supporting quotes, data points, or observations (with source attribution)
- **Frequency**: How many participants/sources support this finding
- **Impact**: How significantly this affects the user experience or business
- **Confidence level**: High (strong evidence), Medium (suggestive), Low (early signal)

Order findings by priority (frequency x impact).

#### User Segments / Personas
If the research reveals distinct user segments:
- Segment name and description
- Key characteristics and behaviors
- Unique needs and pain points
- Size estimate if data is available

#### Opportunity Areas
Based on the findings, identify opportunity areas:
- What user needs are unmet or underserved
- Where do current solutions fall short
- What new capabilities would unlock value
- Prioritized by potential impact

#### Recommendations
Specific, actionable recommendations:
- What to build, change, or investigate further
- Tied back to specific findings
- Prioritized by impact and feasibility

#### Open Questions
What the research did not answer:
- Gaps in understanding
- Areas needing further investigation
- Suggested follow-up research methods

### 5. Review and Extend

After generating the synthesis:
- Ask if any findings need more detail or different framing
- Offer to generate specific artifacts: persona documents, opportunity maps, research presentations
- Offer to create follow-up research plans for open questions
- Offer to draft product implications (how findings should influence the roadmap)

## Research Synthesis Methodology

### Thematic Analysis
The core method for synthesizing qualitative research:

1. **Familiarization**: Read through all the data. Get a feel for the overall landscape before coding anything.
2. **Initial coding**: Go through the data systematically. Tag each observation, quote, or data point with descriptive codes. Be generous with codes — it is easier to merge than to split later.
3. **Theme development**: Group related codes into candidate themes. A theme captures something important about the data in relation to the research question.
4. **Theme review**: Check themes against the data. Does each theme have sufficient evidence? Are themes distinct from each other? Do they tell a coherent story?
5. **Theme refinement**: Define and name each theme clearly. Write a 1-2 sentence description of what each theme captures.
6. **Report**: Write up the themes as findings with supporting evidence.

### Affinity Mapping
A collaborative method for grouping observations:

1. **Capture observations**: Write each distinct observation, quote, or data point as a separate note
2. **Cluster**: Group related notes together based on similarity. Do not pre-define categories — let them emerge from the data.
3. **Label clusters**: Give each cluster a descriptive name that captures the common thread
4. **Organize clusters**: Arrange clusters into higher-level groups if patterns emerge
5. **Identify themes**: The clusters and their relationships reveal the key themes

**Tips for affinity mapping**:
- One observation per note. Do not combine multiple insights.
- Move notes between clusters freely. The first grouping is rarely the best.
- If a cluster gets too large, it probably contains multiple themes. Split it.
- Outliers are interesting. Do not force every observation into a cluster.
- The process of grouping is as valuable as the output. It builds shared understanding.

### Triangulation
Strengthen findings by combining multiple data sources:

- **Methodological triangulation**: Same question, different methods (interviews + survey + analytics)
- **Source triangulation**: Same method, different participants or segments
- **Temporal triangulation**: Same observation at different points in time

A finding supported by multiple sources and methods is much stronger than one supported by a single source. When sources disagree, that is interesting — it may reveal different user segments or contexts.

## Interview Note Analysis

### Extracting Insights from Interview Notes
For each interview, identify:

**Observations**: What did the participant describe doing, experiencing, or feeling?
- Distinguish between behaviors (what they do) and attitudes (what they think/feel)
- Note context: when, where, with whom, how often
- Flag workarounds — these are unmet needs in disguise

**Direct quotes**: Verbatim statements that powerfully illustrate a point
- Good quotes are specific and vivid, not generic
- Attribute to participant type, not name: "Enterprise admin, 200-person team" not "Sarah"
- A quote is evidence, not a finding. The finding is your interpretation of what the quote means.

**Behaviors vs stated preferences**: What people DO often differs from what they SAY they want
- Behavioral observations are stronger evidence than stated preferences
- If a participant says "I want feature X" but their workflow shows they never use similar features, note the contradiction
- Look for revealed preferences through actual behavior

**Signals of intensity**: How much does this matter to the participant?
- Emotional language: frustration, excitement, resignation
- Frequency: how often do they encounter this issue
- Workarounds: how much effort do they expend working around the problem
- Impact: what is the consequence when things go wrong

### Cross-Interview Analysis
After processing individual interviews:
- Look for patterns: which observations appear across multiple participants?
- Note frequency: how many participants mentioned each theme?
- Identify segments: do different types of users have different patterns?
- Surface contradictions: where do participants disagree? This often reveals meaningful segments.
- Find surprises: what challenged your prior assumptions?

## Survey Data Interpretation

### Quantitative Survey Analysis
- **Response rate**: How representative is the sample? Low response rates may introduce bias.
- **Distribution**: Look at the shape of responses, not just averages. A bimodal distribution (lots of 1s and 5s) tells a different story than a normal distribution (lots of 3s).
- **Segmentation**: Break down responses by user segment. Aggregates can mask important differences.
- **Statistical significance**: For small samples, be cautious about drawing conclusions from small differences.
- **Benchmark comparison**: How do scores compare to industry benchmarks or previous surveys?

### Open-Ended Survey Response Analysis
- Treat open-ended responses like mini interview notes
- Code each response with themes
- Count frequency of themes across responses
- Pull representative quotes for each theme
- Look for themes that appear in open-ended responses but not in structured questions — these are things you did not think to ask about

### Common Survey Analysis Mistakes
- Reporting averages without distributions. A 3.5 average could mean everyone is lukewarm or half love it and half hate it.
- Ignoring non-response bias. The people who did not respond may be systematically different.
- Over-interpreting small differences. A 0.1 point change in NPS is noise, not signal.
- Treating Likert scales as interval data. The difference between "Strongly Agree" and "Agree" is not necessarily the same as between "Agree" and "Neutral."
- Confusing correlation with causation in cross-tabulations.

## Combining Qualitative and Quantitative Insights

### The Qual-Quant Feedback Loop
- **Qualitative first**: Interviews and observation reveal WHAT is happening and WHY. They generate hypotheses.
- **Quantitative validation**: Surveys and analytics reveal HOW MUCH and HOW MANY. They test hypotheses at scale.
- **Qualitative deep-dive**: Return to qualitative methods to understand unexpected quantitative findings.

### Integration Strategies
- Use quantitative data to prioritize qualitative findings. A theme from interviews is more important if usage data shows it affects many users.
- Use qualitative data to explain quantitative anomalies. A drop in retention is a number; interviews reveal it is because of a confusing onboarding change.
- Present combined evidence: "47% of surveyed users report difficulty with X (survey), and interviews reveal this is because Y (qualitative finding)."

### When Sources Disagree
- Quantitative and qualitative sources may tell different stories. This is signal, not error.
- Check if the disagreement is due to different populations being measured
- Check if stated preferences (survey) differ from actual behavior (analytics)
- Check if the quantitative question captured what you think it captured
- Report the disagreement honestly and investigate further rather than choosing one source

## Persona Development from Research

### Building Evidence-Based Personas
Personas should emerge from research data, not imagination:

1. **Identify behavioral patterns**: Look for clusters of similar behaviors, goals, and contexts across participants
2. **Define distinguishing variables**: What dimensions differentiate one cluster from another? (e.g., company size, technical skill, usage frequency, primary use case)
3. **Create persona profiles**: For each behavioral cluster:
   - Name and brief description
   - Key behaviors and goals
   - Pain points and needs
   - Context (role, company, tools used)
   - Representative quotes
4. **Validate with data**: Can you size each persona segment using quantitative data?

### Persona Template
```
[Persona Name] — [One-line description]

Who they are:
- Role, company type/size, experience level
- How they found/started using the product

What they are trying to accomplish:
- Primary goals and jobs to be done
- How they measure success

How they use the product:
- Frequency and depth of usage
- Key workflows and features used
- Tools they use alongside this product

Key pain points:
- Top 3 frustrations or unmet needs
- Workarounds they have developed

What they value:
- What matters most in a solution
- What would make them switch or churn

Representative quotes:
- 2-3 verbatim quotes that capture this persona's perspective
```

### Common Persona Mistakes
- Demographic personas: defining by age/gender/location instead of behavior. Behavior predicts product needs better than demographics.
- Too many personas: 3-5 is the sweet spot. More than that and they are not actionable.
- Fictional personas: made up based on assumptions rather than research data.
- Static personas: never updated as the product and market evolve.
- Personas without implications: a persona that does not change any product decisions is not useful.

## Opportunity Sizing

### Estimating Opportunity Size
For each research finding or opportunity area, estimate:

- **Addressable users**: How many users could benefit from addressing this? Use product analytics, survey data, or market data to estimate.
- **Frequency**: How often do affected users encounter this issue? (Daily, weekly, monthly, one-time)
- **Severity**: How much does this issue impact users when it occurs? (Blocker, significant friction, minor annoyance)
- **Willingness to pay**: Would addressing this drive upgrades, retention, or new customer acquisition?

### Opportunity Scoring
Score opportunities on a simple matrix:

- **Impact**: (Users affected) x (Frequency) x (Severity) = impact score
- **Evidence strength**: How confident are we in the finding? (Multiple sources > single source, behavioral data > stated preferences)
- **Strategic alignment**: Does this opportunity align with company strategy and product vision?
- **Feasibility**: Can we realistically address this? (Technical feasibility, resource availability, time to impact)

### Presenting Opportunity Sizing
- Be transparent about assumptions and confidence levels
- Show the math: "Based on support ticket volume, approximately 2,000 users per month encounter this issue. Interview data suggests 60% of them consider it a significant blocker."
- Use ranges rather than false precision: "This affects 1,500-2,500 users monthly" not "This affects 2,137 users monthly"
- Compare opportunities against each other to create a relative ranking, not just absolute scores

## Output Format

Use clear headers and structured formatting. Each finding should stand on its own — a reader should be able to read any single finding and understand it without reading the rest.

## Tips

- Let the data speak. Do not force findings into a predetermined narrative.
- Distinguish between what users say and what they do. Behavioral data is stronger than stated preferences.
- Quotes are powerful evidence. Include them generously, with attribution to participant type (not name).
- Be explicit about confidence levels. A finding from 2 interviews is a hypothesis, not a conclusion.
- Contradictions in the data are interesting, not inconvenient. They often reveal distinct user segments.
- Recommendations should be specific enough to act on. "Improve onboarding" is not actionable. "Add a progress indicator to the setup flow" is.
- Resist the temptation to synthesize too many themes. 5-8 strong findings are better than 20 weak ones.

---
name: write-spec
description: Write a feature spec or PRD from a problem statement or feature idea. Use when turning a vague idea or user request into a structured document, scoping a feature with goals and non-goals, defining success metrics and acceptance criteria, or breaking a big ask into a phased spec.
argument-hint: "<feature or problem statement>"
---

# Write Spec

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Write a feature specification or product requirements document (PRD).

## Usage

```
/write-spec $ARGUMENTS
```

## Workflow

### 1. Understand the Feature

Ask the user what they want to spec. Accept any of:
- A feature name ("SSO support")
- A problem statement ("Enterprise customers keep asking for centralized auth")
- A user request ("Users want to export their data as CSV")
- A vague idea ("We should do something about onboarding drop-off")

### 2. Gather Context

Ask the user for the following. Be conversational — do not dump all questions at once. Ask the most important ones first and fill in gaps as you go:

- **User problem**: What problem does this solve? Who experiences it?
- **Target users**: Which user segment(s) does this serve?
- **Success metrics**: How will we know this worked?
- **Constraints**: Technical constraints, timeline, regulatory requirements, dependencies
- **Prior art**: Has this been attempted before? Are there existing solutions?

### 3. Pull Context from Connected Tools

If **~~project tracker** is connected:
- Search for related tickets, epics, or features
- Pull in any existing requirements or acceptance criteria
- Identify dependencies on other work items

If **~~knowledge base** is connected:
- Search for related research documents, prior specs, or design docs
- Pull in relevant user research findings
- Find related meeting notes or decision records

If **~~design** is connected:
- Pull related mockups, wireframes, or design explorations
- Search for design system components relevant to the feature

If these tools are not connected, work entirely from what the user provides. Do not ask the user to connect tools — just proceed with available information.

### 4. Generate the PRD

Produce a structured PRD with these sections. See **PRD Structure** below for detailed guidance on what each section should contain.

- **Problem Statement**: The user problem, who is affected, and impact of not solving it (2-3 sentences)
- **Goals**: 3-5 specific, measurable outcomes tied to user or business metrics
- **Non-Goals**: 3-5 things explicitly out of scope, with brief rationale for each
- **User Stories**: Standard format ("As a [user type], I want [capability] so that [benefit]"), grouped by persona
- **Requirements**: Categorized as Must-Have (P0), Nice-to-Have (P1), and Future Considerations (P2), each with acceptance criteria
- **Success Metrics**: Leading indicators (change quickly) and lagging indicators (change over time), with specific targets
- **Open Questions**: Unresolved questions tagged with who needs to answer (engineering, design, legal, data)
- **Timeline Considerations**: Hard deadlines, dependencies, and phasing

### 5. Review and Iterate

After generating the PRD:
- Ask the user if any sections need adjustment
- Offer to expand on specific sections
- Offer to create follow-up artifacts (design brief, engineering ticket breakdown, stakeholder pitch)

## PRD Structure

### Problem Statement
- Describe the user problem in 2-3 sentences
- Who experiences this problem and how often
- What is the cost of not solving it (user pain, business impact, competitive risk)
- Ground this in evidence: user research, support data, metrics, or customer feedback

### Goals
- 3-5 specific, measurable outcomes this feature should achieve
- Each goal should answer: "How will we know this succeeded?"
- Distinguish between user goals (what users get) and business goals (what the company gets)
- Goals should be outcomes, not outputs ("reduce time to first value by 50%" not "build onboarding wizard")

### Non-Goals
- 3-5 things this feature explicitly will NOT do
- Adjacent capabilities that are out of scope for this version
- For each non-goal, briefly explain why it is out of scope (not enough impact, too complex, separate initiative, premature)
- Non-goals prevent scope creep during implementation and set expectations with stakeholders

### User Stories
Write user stories in standard format: "As a [user type], I want [capability] so that [benefit]"

Guidelines:
- The user type should be specific enough to be meaningful ("enterprise admin" not just "user")
- The capability should describe what they want to accomplish, not how
- The benefit should explain the "why" — what value does this deliver
- Include edge cases: error states, empty states, boundary conditions
- Include different user types if the feature serves multiple personas
- Order by priority — most important stories first

Example:
- "As a team admin, I want to configure SSO for my organization so that my team members can log in with their corporate credentials"
- "As a team member, I want to be automatically redirected to my company's SSO login so that I do not need to remember a separate password"
- "As a team admin, I want to see which members have logged in via SSO so that I can verify the rollout is working"

### Requirements

**Must-Have (P0)**: The feature cannot ship without these. These represent the minimum viable version of the feature. Ask: "If we cut this, does the feature still solve the core problem?" If no, it is P0.

**Nice-to-Have (P1)**: Significantly improves the experience but the core use case works without them. These often become fast follow-ups after launch.

**Future Considerations (P2)**: Explicitly out of scope for v1 but we want to design in a way that supports them later. Documenting these prevents accidental architectural decisions that make them hard later.

For each requirement:
- Write a clear, unambiguous description of the expected behavior
- Include acceptance criteria (see below)
- Note any technical considerations or constraints
- Flag dependencies on other teams or systems

### Open Questions
- Questions that need answers before or during implementation
- Tag each with who should answer (engineering, design, legal, data, stakeholder)
- Distinguish between blocking questions (must answer before starting) and non-blocking (can resolve during implementation)

### Timeline Considerations
- Hard deadlines (contractual commitments, events, compliance dates)
- Dependencies on other teams' work or releases
- Suggested phasing if the feature is too large for one release

## User Story Writing

Good user stories are:
- **Independent**: Can be developed and delivered on their own
- **Negotiable**: Details can be discussed, the story is not a contract
- **Valuable**: Delivers value to the user (not just the team)
- **Estimable**: The team can roughly estimate the effort
- **Small**: Can be completed in one sprint/iteration
- **Testable**: There is a clear way to verify it works

### Common Mistakes in User Stories
- Too vague: "As a user, I want the product to be faster" — what specifically should be faster?
- Solution-prescriptive: "As a user, I want a dropdown menu" — describe the need, not the UI widget
- No benefit: "As a user, I want to click a button" — why? What does it accomplish?
- Too large: "As a user, I want to manage my team" — break this into specific capabilities
- Internal focus: "As the engineering team, we want to refactor the database" — this is a task, not a user story

## Requirements Categorization

### MoSCoW Framework
- **Must have**: Without these, the feature is not viable. Non-negotiable.
- **Should have**: Important but not critical for launch. High-priority fast follows.
- **Could have**: Desirable if time permits. Will not delay delivery if cut.
- **Won't have (this time)**: Explicitly out of scope. May revisit in future versions.

### Tips for Categorization
- Be ruthless about P0s. The tighter the must-have list, the faster you ship and learn.
- If everything is P0, nothing is P0. Challenge every must-have: "Would we really not ship without this?"
- P1s should be things you are confident you will build soon, not a wish list.
- P2s are architectural insurance — they guide design decisions even though you are not building them now.

## Success Metrics Definition

### Leading Indicators
Metrics that change quickly after launch (days to weeks):
- **Adoption rate**: % of eligible users who try the feature
- **Activation rate**: % of users who complete the core action
- **Task completion rate**: % of users who successfully accomplish their goal
- **Time to complete**: How long the core workflow takes
- **Error rate**: How often users encounter errors or dead ends
- **Feature usage frequency**: How often users return to use the feature

### Lagging Indicators
Metrics that take time to develop (weeks to months):
- **Retention impact**: Does this feature improve user retention?
- **Revenue impact**: Does this drive upgrades, expansion, or new revenue?
- **NPS / satisfaction change**: Does this improve how users feel about the product?
- **Support ticket reduction**: Does this reduce support load?
- **Competitive win rate**: Does this help win more deals?

### Setting Targets
- Targets should be specific: "50% adoption within 30 days" not "high adoption"
- Base targets on comparable features, industry benchmarks, or explicit hypotheses
- Set a "success" threshold and a "stretch" target
- Define the measurement method: what tool, what query, what time window
- Specify when you will evaluate: 1 week, 1 month, 1 quarter post-launch

## Acceptance Criteria

Write acceptance criteria in Given/When/Then format or as a checklist:

**Given/When/Then**:
- Given [precondition or context]
- When [action the user takes]
- Then [expected outcome]

Example:
- Given the admin has configured SSO for their organization
- When a team member visits the login page
- Then they are automatically redirected to the organization's SSO provider

**Checklist format**:
- [ ] Admin can enter SSO provider URL in organization settings
- [ ] Team members see "Log in with SSO" button on login page
- [ ] SSO login creates a new account if one does not exist
- [ ] SSO login links to existing account if email matches
- [ ] Failed SSO attempts show a clear error message

### Tips for Acceptance Criteria
- Cover the happy path, error cases, and edge cases
- Be specific about the expected behavior, not the implementation
- Include what should NOT happen (negative test cases)
- Each criterion should be independently testable
- Avoid ambiguous words: "fast", "user-friendly", "intuitive" — define what these mean concretely

## Scope Management

### Recognizing Scope Creep
Scope creep happens when:
- Requirements keep getting added after the spec is approved
- "Small" additions accumulate into a significantly larger project
- The team is building features no user asked for ("while we're at it...")
- The launch date keeps moving without explicit re-scoping
- Stakeholders add requirements without removing anything

### Preventing Scope Creep
- Write explicit non-goals in every spec
- Require that any scope addition comes with a scope removal or timeline extension
- Separate "v1" from "v2" clearly in the spec
- Review the spec against the original problem statement — does everything serve it?
- Time-box investigations: "If we cannot figure out X in 2 days, we cut it"
- Create a "parking lot" for good ideas that are not in scope

## Output Format

Use markdown with clear headers. Keep the document scannable — busy stakeholders should be able to read just the headers and bold text to get the gist.

## Tips

- Be opinionated about scope. It is better to have a tight, well-defined spec than an expansive vague one.
- If the user's idea is too big for one spec, suggest breaking it into phases and spec the first phase.
- Success metrics should be specific and measurable, not vague ("improve user experience").
- Non-goals are as important as goals. They prevent scope creep during implementation.
- Open questions should be genuinely open — do not include questions you can answer from context.
# Product Management Plugin

A product management plugin primarily designed for [Cowork](https://claude.com/product/cowork), Anthropic's agentic desktop application — though it also works in Claude Code. Covers the full PM workflow: writing feature specs, managing roadmaps, communicating with stakeholders, synthesizing user research, analyzing competitors, and tracking product metrics.

## Installation

```
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install product-management@knowledge-work-plugins
```

## What It Does

This plugin gives you an AI-powered product management partner that can help with:

- **Feature Specs & PRDs** — Generate structured product requirements documents from a problem statement or feature idea. Includes user stories, requirements prioritization, success metrics, and scope management.
- **Roadmap Planning** — Create, update, and reprioritize your product roadmap. Supports Now/Next/Later, quarterly themes, and OKR-aligned formats with dependency mapping.
- **Stakeholder Updates** — Generate status updates tailored to your audience (executives, engineering, customers). Pulls context from connected tools to save you the weekly update grind.
- **User Research Synthesis** — Turn interview notes, survey data, and support tickets into structured insights. Identifies themes, builds personas, and surfaces opportunity areas with supporting evidence.
- **Competitive Analysis** — Research competitors and generate briefs with feature comparisons, positioning analysis, and strategic implications.
- **Metrics Review** — Analyze product metrics, identify trends, compare against targets, and surface actionable insights.
- **Product Brainstorming** — Explore problem spaces, generate ideas, and stress-test product thinking with a sharp sparring partner. Supports divergent ideation, assumption testing, and strategy exploration using frameworks like How Might We, Jobs-to-be-Done, First Principles, and Opportunity Solution Trees.

## Commands

| Command | What It Does |
|---|---|
| `/write-spec` | Write a feature spec or PRD from a problem statement |
| `/roadmap-update` | Update, create, or reprioritize your roadmap |
| `/stakeholder-update` | Generate a stakeholder update (weekly, monthly, launch) |
| `/synthesize-research` | Synthesize user research from interviews, surveys, and tickets |
| `/competitive-brief` | Create a competitive analysis brief |
| `/metrics-review` | Review and analyze product metrics |
| `/brainstorm` | Brainstorm a product idea, problem space, or strategic question with a thinking partner |

## Skills

| Skill | What It Covers |
|---|---|
| `feature-spec` | PRD structure, user stories, requirements categorization, acceptance criteria |
| `roadmap-management` | Prioritization frameworks (RICE, MoSCoW), roadmap formats, dependency mapping |
| `stakeholder-comms` | Update templates by audience, risk communication, decision documentation |
| `user-research-synthesis` | Thematic analysis, affinity mapping, persona development, opportunity sizing |
| `competitive-analysis` | Feature comparison matrices, positioning analysis, win/loss analysis |
| `metrics-tracking` | Product metrics hierarchy, goal setting (OKRs), dashboard design, review cadences |
| `product-brainstorming` | Brainstorming modes (problem exploration, solution ideation, assumption testing, strategy), PM frameworks, session structure, thinking partner behaviors |

## Example Workflows

### Writing a PRD

```
You: /write-spec
Claude: What feature or problem are you speccing out?
You: We need to add SSO support for enterprise customers
Claude: [Asks about target users, constraints, success metrics]
Claude: [Generates full PRD with problem statement, user stories, requirements, success metrics, open questions]
```

### Preparing a Stakeholder Update

```
You: /stakeholder-update
Claude: What type of update? (weekly, monthly, launch, ad-hoc)
You: Weekly update for the exec team
Claude: [Pulls context from project management tool, chat, and docs]
Claude: [Generates executive summary with progress, decisions, risks, and next milestones]
```

### Synthesizing User Research

```
You: /synthesize-research
Claude: What research do you want to synthesize? You can paste interview notes, upload files, or I can pull from connected sources.
You: [Pastes 8 interview transcripts]
Claude: [Identifies themes, patterns, and insights across interviews]
Claude: [Generates synthesis with key findings, personas, opportunity areas, and evidence]
```

### Brainstorming a Product Idea

```
You: /brainstorm Should we add AI-powered search to our product?
Claude: Before we jump to AI search — what problem are your users hitting with search today?
You: They can't find things. Support tickets about "can't find X" are our #2 category.
Claude: That's a discovery problem, not necessarily a search technology problem. Let me push on this...
Claude: [Explores whether the issue is search quality, information architecture, or content discoverability]
Claude: [Generates 5 distinct approaches ranging from better taxonomy to AI search to guided navigation]
Claude: [Challenges assumptions, suggests cheapest experiment to test the riskiest one]
```

### Competitive Analysis

```
You: /competitive-brief
Claude: Which competitor(s) or feature area do you want to analyze?
You: Compare our onboarding flow to [competitor A] and [competitor B]
Claude: [Researches competitor onboarding approaches]
Claude: [Generates brief with feature comparison, strengths/weaknesses, and strategic implications]
```

## Data Sources

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](CONNECTORS.md).

Connect your project management and communication tools for the best experience. Without them, provide context manually.

**Included MCP connections:**
- Chat (Slack) for team context and stakeholder threads
- Project tracker (Linear, Asana, monday.com, ClickUp, Atlassian) for roadmap integration, ticket context, and status tracking
- Knowledge base (Notion) for existing specs, research, and meeting notes
- Design (Figma) for design context and handoff
- Product analytics (Amplitude, Pendo) for usage data, metrics, and behavioral analysis
- User feedback (Intercom) for support tickets, feature requests, and user conversations
- Meeting transcription (Fireflies) for meeting notes and discussion context

**Additional options:**
- See [CONNECTORS.md](CONNECTORS.md) for alternative tools in each category
---
description: Brainstorm a product idea, problem space, or strategic question with a sharp thinking partner
argument-hint: "<topic, problem, or idea to explore>"
---

# /brainstorm

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Brainstorm a product topic with a sharp, opinionated thinking partner. This is a conversation, not a deliverable — the goal is to push thinking further than the PM would get alone.

## Usage

```
/brainstorm $ARGUMENTS
```

## How It Works

```
┌────────────────────────────────────────────────────────────────┐
│                      BRAINSTORM                                │
├────────────────────────────────────────────────────────────────┤
│  STANDALONE (always works)                                     │
│  ✓ Explore problem spaces and opportunity areas                │
│  ✓ Generate and challenge product ideas                        │
│  ✓ Stress-test assumptions and strategies                      │
│  ✓ Apply PM frameworks (HMW, JTBD, First Principles, etc.)    │
│  ✓ Capture key ideas, next steps, and open questions           │
├────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (when you connect your tools)                    │
│  + Knowledge base: Pull prior research, specs, and decisions   │
│  + Analytics: Ground ideas in actual usage data                │
│  + Project tracker: Check what has been tried before           │
│  + Chat: Review recent team discussions for context            │
└────────────────────────────────────────────────────────────────┘
```

## Workflow

### 1. Understand the Starting Point

The PM might bring any of these — identify which one and adapt:

- **A problem**: "Our users drop off during onboarding" — start in problem exploration mode
- **A half-formed idea**: "What if we added a marketplace?" — start in assumption testing mode
- **A broad question**: "How should we think about AI in our product?" — start in strategy exploration mode
- **A constraint to work around**: "We need to grow without adding headcount" — start in solution ideation mode
- **A vague instinct**: "Something feels off about our pricing" — start in problem exploration mode

Ask one clarifying question to frame the session, then dive in. Do not front-load a list of questions. The conversation should feel like two PMs at a whiteboard, not an intake form.

### 2. Pull Context (if available)

If **~~knowledge base** is connected:
- Search for prior research, specs, or decision documents related to the topic
- Surface relevant user research findings or customer feedback
- Find previous brainstorming notes or exploration documents

If **~~product analytics** is connected:
- Pull relevant usage data, adoption metrics, or behavioral patterns
- Ground the brainstorm in real numbers rather than assumptions

If **~~project tracker** is connected:
- Check if similar ideas have been explored, attempted, or shelved before
- Look for related tickets, epics, or strategic themes

If **~~chat** is connected:
- Search for recent team discussions on the topic
- Surface relevant customer conversations or feedback threads

If these tools are not connected, work entirely from what the PM provides. Do not ask them to connect tools.

### 3. Run the Session

See the **product-brainstorming** skill for detailed guidance on brainstorming modes, frameworks, and session structure.

**Key behaviors:**
- Be a sparring partner, not a scribe. React to ideas. Push back. Build on them. Suggest alternatives.
- Match the PM's energy. If they are excited about a direction, explore it before challenging it.
- Use frameworks when they help, not as a checklist. If "How Might We" unlocks new thinking, use it. If the conversation is already flowing, do not interrupt with a framework.
- Push past the first idea. If the PM anchors on a solution early, acknowledge it, then ask for 3 more.
- Name what you see. If the PM is solutioning before defining the problem, say so. If they are stuck in feature parity thinking, call it out.
- Shift between divergent and convergent thinking. Open up when exploring. Narrow down when the PM has enough options on the table.
- Keep the conversation moving. Do not let it stall on one idea. If a thread is exhausted, prompt a new angle.

**Session rhythm:**
1. **Frame** — What are we exploring? What do we already know? What would a good outcome look like?
2. **Diverge** — Generate ideas. Follow tangents. No judgment yet.
3. **Provoke** — Challenge assumptions. Bring in unexpected perspectives. Play devil's advocate.
4. **Converge** — What are the strongest 2-3 ideas? What makes them interesting?
5. **Capture** — Document what emerged and what to do next.

### 4. Close the Session

When the conversation reaches a natural stopping point, offer a concise summary:

- **Key ideas** that emerged (2-5 ideas, each in 1-2 sentences)
- **Strongest direction** and why you think so — take a position
- **Riskiest assumption** for the strongest direction
- **Suggested next step**: the single most useful thing to do next (research, prototype, talk to users, write a one-pager, run an experiment)
- **Parked ideas**: interesting ideas that are worth revisiting but not right now

Do not generate the summary unprompted mid-conversation. Only summarize when the PM signals they are ready to wrap up, or when the conversation has naturally run its course.

### 5. Follow Up

After the session, offer:
- "Want me to turn the top idea into a one-pager?" → `/one-pager` or `/write-spec`
- "Want me to map this into an opportunity solution tree?"
- "Want me to draft a research plan to test the riskiest assumption?" → `/synthesize-research`
- "Want me to check how competitors approach this?" → `/competitive-brief`

## Tips

1. **This is a conversation, not a report.** Do not generate a 20-item idea list and hand it over. Engage with each idea. React. Build. Challenge.
2. **One good question beats five mediocre suggestions.** The right provocative question unlocks more than a list of options.
3. **Take positions.** "I think approach B is stronger because..." is more useful than presenting all options neutrally.
4. **Name the traps.** If you see the PM falling into feature parity thinking, solutioning before framing, or anchoring on constraints — say so directly.
5. **Know when to stop.** A brainstorm that goes too long produces fatigue, not ideas. If the PM has 2-3 strong directions and a clear next step, the session is done.
Customize
claimable-cloud
from Anthropic Directory · in Cloudinary · updated Sep 24

Cloudinary 1.2.0 · synced Sep 24 · current
0001

SKILL.md
/SKILL.md


License
MIT

Author
cloudinary

Version
1.0.0

Claimable Cloud: get Cloudinary credentials without signup
A Claimable Cloud is a working Cloudinary cloud provisioned with a single command, no account and no authentication required. The user can later claim it with their email to keep it as a permanent free account. If unclaimed, it expires automatically after 24 hours.

When to use
The user asks for Cloudinary functionality (upload, transformation URLs, or SDK integration) and no credentials are available.
The user explicitly asks to try Cloudinary, set up a Cloudinary environment, or get credentials without creating an account.
When NOT to use
Credentials already exist: a CLOUDINARY_URL or CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in the environment, in .env, or in MCP server configuration. Use those instead, and never replace them.
The user says they have a Cloudinary account. Ask them for their CLOUDINARY_URL from the API Keys page of the Cloudinary Console instead.
Flow
Check for existing credentials first. Look for CLOUDINARY_URL or CLOUDINARY_* keys in the environment and .env (check existence, don't print values). If found, stop: use them.
Ask consent before provisioning. One line, for example: "You don't have Cloudinary credentials set up. I can provision a free Claimable Cloud for you now, no signup needed; you'd claim it by email within 24 hours to keep it. Go ahead?" Never provision without a yes: Claimable Clouds are rate limited and expire if unclaimed.
Run the command:
   npx @cloudinary/cloud
Optional flags:

--email <address>: pre-fills the claim page (not verified at creation).
--ip <address>: locks media delivery to the given address instead of this machine's detected public IP (repeatable, up to three addresses). Use when the user views media somewhere other than this machine, such as a laptop viewing media served from a remote dev environment. If this machine still needs delivery too, include its address as one of the three.
Never pass --force. If the command exits because .env already contains a CLOUDINARY_URL, that means credentials exist; use them.
After the command succeeds:
The CLI saved CLOUDINARY_URL, the claim URL, and the expiry time to ./.env (creating the file if needed). Don't add them again.
If the project uses separate keys (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, or framework variants like VITE_CLOUDINARY_CLOUD_NAME), fill them from the command output. Never print the API secret in chat.
Confirm version control ignores .env (the CLI warns if it doesn't).
Tell the user, every time:
The claim URL, and that the cloud expires in 24 hours unless they claim it: they enter their email at the claim URL and confirm from a verification email. Claiming keeps the same credentials.
Until claimed, media delivery is locked to this machine's public IP address — or, if --ip was passed, to those addresses only (up to three). That's fine for local development; claiming removes the restriction.
Verify by rendering a sample delivery URL from the new cloud, then continue the user's original task.
If provisioning fails
Don't retry in a loop: failed attempts still count against rate limits. Retry at most once, and only after fixing the cause:

429 (ip_rate_limit_exceeded, global_rate_limit_exceeded): rate limited. Don't retry; offer the standard free signup instead.
403 (geo_location_not_permitted): the network location isn't permitted — often a VPN exit node. Ask the user to disconnect the VPN, then retry once.
400 (delivery_ips_*): fix the --ip values: public IPv4 or IPv6 addresses only, no CIDR ranges, at most three.
If it still fails after one retry, stop and point the user to the standard free signup.

Security
Keep the API secret and full CLOUDINARY_URL in .env; never print them in chat, logs, or client-side code.
Full reference
For all CLI options, the underlying REST endpoint, response fields, quotas, and error codes, fetch: https://cloudinary.com/documentation/claimable_cloud_provisioning.md?install_source=plugin&referrer=claimable-cloud-skill

For guided project setup after provisioning (SDK, MCP servers, validation), point the user at AI Power Start.

Customize
cloudinary-docs
from Anthropic Directory · in Cloudinary · updated Sep 24

Cloudinary 1.2.0 · synced Sep 24 · current
0001

SKILL.md
/SKILL.md


License
MIT

Author
cloudinary

Version
1.1.0

Cloudinary Documentation
Helps developers integrate Cloudinary into their applications by providing documentation and code examples retrieved directly from the agent-optimized markdown files in the Cloudinary documentation.

When to Use
When a user asks questions or requests code implementation relating to image or video upload, management, SDKs, APIs, webhooks, or integrations
For topics covered by a more specialized Cloudinary skill (e.g. transformations, React SDK): prefer that skill. Use this skill alongside it when the full use-case also requires capabilities outside that skill's scope.
General Cloudinary documentation lookup (account settings, webhooks, DAM features)
Looking up specific Cloudinary API endpoints or SDK methods
When a specialized Cloudinary skill handles part of a use-case, use this skill to cover the remaining capabilities it doesn't address, not as a substitute for it.
Sub-file Index Overview
The main documentation llms.txt file is split into product-specific sub-files. Go directly to the relevant sub-file according to the descriptions below. Do not fetch the main llms.txt first unless the topic spans multiple products or you are unsure.

Product	Topic	Sub-file URL
Image & Video APIs	Image/video uploads, transformations, optimization, SDKs, APIs, webhooks, add-ons, embedding widgets or players in apps, or any programmatic/automation/at-scale image and video requirements	https://cloudinary.com/documentation/llms-image-and-video-apis.txt?install_source=plugin&referrer=docs-skill
Cloudinary Assets (DAM)	Digital Asset Management (DAM), Media Library, folders, metadata, collections, creative workflows, portals, digital rights, or any Cloudinary Console or UI-based asset management needs	https://cloudinary.com/documentation/llms-cloudinary-assets.txt?install_source=plugin&referrer=docs-skill
MediaFlows	PowerFlows, EasyFlows, workflow automation, flow blocks	https://cloudinary.com/documentation/llms-mediaflows.txt?install_source=plugin&referrer=docs-skill
Integrations	Cloudinary integrations with 3rd party apps (WordPress, Shopify, Contentful, Salesforce, Adobe, etc.) or questions about implementing new integrations	https://cloudinary.com/documentation/llms-integrations.txt?install_source=plugin&referrer=docs-skill
Cross-product or unsure	Multiple products, general, or unclear topic	https://cloudinary.com/documentation/llms.txt?install_source=plugin&referrer=docs-skill
Instructions
Note: If a more specialized Cloudinary-specific skill covers the user's topic, defer to that skill first. Invoke this docs skill in addition, not as a substitute, and only if the full use-case also requires capabilities outside that skill's scope.

When using this skill to answer image and video upload, management, optimization, or transformation questions or when implementing Cloudinary code:

Identify the product area: Refer to the Sub-file Index table above and identify the matching row.
Fetch the relevant sub-file directly per the table above (skip the main llms.txt unless the topic is cross-product or unclear)
Analyze the sub-file to identify which specific documentation URLs are most relevant
Retrieve those specific markdown documentation URLs (you can make multiple calls if needed)
Use the fetched documentation to provide a comprehensive, accurate answer or code implementation.
Example Workflows
Example 1: SDK question

User asks: "How do I install and use the Node.js SDK for Cloudinary?"
Topic maps to Image & Video APIs → fetch https://cloudinary.com/documentation/llms-image-and-video-apis.txt?install_source=plugin&referrer=docs-skill
Identify SDK-related pages and provide installation instructions and usage examples or help implement the request in the user's code.
Example 2: DAM question

User asks: "How do I set up approval workflows for assets in the Media Library?"
Topic maps to Cloudinary Assets (DAM) → fetch https://cloudinary.com/documentation/llms-cloudinary-assets.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "dam_admin_creative_approval_flows.md"
Fetch the specific documentation and provide setup steps
Example 3: MediaFlows question

User asks: "How do I build a PowerFlow that auto-moderates uploaded images?"
Topic maps to MediaFlows → fetch https://cloudinary.com/documentation/llms-mediaflows.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "mediaflows_build_flow.md" or "mediaflows_moderation_powerflow.md"
Fetch the specific documentation and provide a flow-building walkthrough
Example 4: Integration question

User asks: "How do I connect Cloudinary to my WordPress site?"
Topic maps to Integrations → fetch https://cloudinary.com/documentation/llms-integrations.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "wordpress_integration.md"
Fetch the specific documentation and provide setup instructions
Example 5: Ambiguous upload question

User asks: "How do I upload images to Cloudinary?"
First, determine whether the user wants to upload programmatically (via SDK/API) or via the Console UI (DAM)
If programmatic → fetch https://cloudinary.com/documentation/llms-image-and-video-apis.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "image_upload.md" or "upload_api.md"
Retrieve those specific pages and provide an answer with code examples
If via the Console UI (DAM) → fetch https://cloudinary.com/documentation/llms-cloudinary-assets.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "dam_upload_store_assets.md" or "dam_admin_upload_presets.md"
Retrieve those specific pages and provide step-by-step instructions for uploading via the Media Library.
If unable to determine → fetch https://cloudinary.com/documentation/llms.txt?install_source=plugin&referrer=docs-skill
Look at documentation for both Image & Video APIs and Cloudinary Assets products
Provide an answer covering both programmatic and UI-based upload options
Example 6: Transformation question (fallback: use only if no specialized skill covers this topic)

User asks: "How do I resize and crop images?"
Topic maps to Image & Video APIs → fetch https://cloudinary.com/documentation/llms-image-and-video-apis.txt?install_source=plugin&referrer=docs-skill
Identify relevant pages like "image_transformations.md" or "transformation_reference.md"
Fetch the specific documentation and provide transformation syntax and examples or help implement the request in the user's code.
License
MIT

Author
cloudinary

Version
1.0.4

Cloudinary Transformation Rules
When to Use
Building Cloudinary delivery/transformation URLs
Converting natural language requests to transformation syntax
Debugging transformation URLs that aren't working
Optimizing images or videos with Cloudinary
Applying effects, overlays, resizing, or cropping
Quick Start
Default Best Practice: Always Optimize
Add f_auto/q_auto to the end of nearly every transformation URL (as final components):

Automatically delivers optimal format
Optimizes quality for best balance of visual quality and file size
Reduces bandwidth and improves performance
Example: c_fill,g_auto,w_400,h_300/f_auto/q_auto

Exceptions - Don't add optimization when:

Account has "Optimize By Default" enabled (already applied automatically)
Special quality requirements (use q_auto:best, q_auto:low, or manual q_N instead)
Specific format required (replace f_auto with f_png, f_jpg, etc.)
Delivering exact original with no modifications
Examples of common transformations (with optimization):

Resize: c_scale,w_400/f_auto/q_auto
Smart crop: c_fill,g_auto,h_300,w_400/f_auto/q_auto
Background removal: e_background_removal/f_png/q_auto
Text overlay: co_yellow,l_text:Arial_40:Hello%20World/fl_layer_apply,g_south/f_auto/q_auto
Image overlay: l_logo/c_scale,w_100/fl_layer_apply,g_north_west,x_10,y_10/f_auto/q_auto
Important: All transformation strings shown throughout this skill are illustrative examples to demonstrate syntax and concepts. When generating transformations, choose specific values (dimensions, colors, positions, etc.) based on the user's actual requirements and use case, not the example values shown.

For debugging: See references/debugging.md for detailed troubleshooting steps.

Gathering Requirements
Before generating a transformation URL, if not already specified, clarify these details based on the user's request:

For Resize/Crop Requests
Required:

At least one dimension (width OR height)
Crop behavior if both dimensions specified (fill, pad, scale, limit, etc.)
Clarify:

Focal point/gravity (especially for cropping): Face detection? Center? Smart auto-detection?
Maintain aspect ratio? (if only one dimension, this is automatic)
Example questions:

"What dimensions do you need? (width and/or height)"
"Should this fill the space (may crop) or fit within it (no cropping)?"
"Any important focal point? (faces, center, specific area)"
For AI Transformation Requests
Background removal:

Output format needs (PNG for transparency vs JPG with solid background)
What to do with transparent area (keep transparent, add color, or gen_fill)
Generative fill:

Target dimensions or aspect ratio
How much extension needed
Generative replace:

What object to replace (from)
What to replace it with (to)
Preserve original shape? (for clothing/objects)
Generative remove:

What object(s) to remove
Remove all instances or just one?
Generative background replace:

Describe desired background (or use auto-generation)
Need reproducibility? (consider seed parameter)
For Video Transformation Requests
Trimming:

Start and end time, or duration
Seconds or percentage of video
Codec/format:

Output format needs (MP4, WebM, etc.)
Quality requirements (use vc_auto if unsure)
Audio:

Keep or remove audio track
If for autoplay, suggest removing audio (ac_none)
Always Recommend
Unless user specifies otherwise:

Add f_auto/q_auto at the end of transformation URLs (see Quick Start section for exceptions)
Use g_auto for smart cropping when filling dimensions
Consider cost for AI transformations (inform user of transformation credits)
Quick Reference
URL Structure
https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<ext>
Key Rules:

Commas (,) separate parameters within a component
Slashes (/) separate components between transformations
Each component acts on the output of the previous one
Parameter Types
Action parameters: Perform transformations (one action per component: each action transformation should be separated by a slash) Qualifier parameters: Modify action behavior (in the same component as the action, using commas as separators)

Check the Transformation Reference to determine if a parameter is an action or qualifier.

Core Transformations
Resize & Crop
Dimension value formats:

Whole numbers (e.g., w_400, h_300) = pixels
Decimal values (e.g., w_0.5, h_1.0) = percentage of original dimensions (0.5 = 50%, 1.0 = 100%)
Choosing the right crop mode:

Use c_scale when:

Resizing while maintaining original aspect ratio
Specify only ONE dimension (width OR height)
No cropping needed
The user intentionally wants to stretch or squash an image by changing the aspect ratio
Use c_fill when:

Must fit exact dimensions (e.g., thumbnail grid, fixed layout)
Okay to crop parts of image
Combine with g_auto for smart cropping, or g_face for portraits
Use c_fit when:

Image must fit within dimensions without cropping
Okay to have empty space
Maintaining full image content is critical
Use c_pad when:

Must fit exact dimensions without cropping
Need to fill empty space with background color/blur (videos only)/AI-generated pixels
Use with b_<color>, b_auto, b_blurred (blurred background - videos only), or b_gen_fill
Use c_limit when:

Set maximum dimensions but don't upscale small images
Preserving original quality of small images matters
Use c_thumb when:

Creating thumbnails (typically avatars)
Use with g_face for face-centered crops
Use c_auto when:

Cloudinary should intelligently crop to interesting content
Combine with g_auto for best results
Good for dynamic content where focal point varies
Examples:

c_scale,w_400                      # Resize width to 400px, maintain aspect ratio
c_scale,w_0.5                      # Resize to 50% of original width
c_fill,g_auto,h_300,w_400          # Fill 400x300px dimensions, smart crop
c_fit,h_300,w_400                  # Fit within dimensions, no crop
c_pad,b_white,h_300,w_400          # Pad to exact size with white background
c_pad,w_1.0                        # Pad to original width (100%)
c_limit,w_1000                     # Limit max width, no upscale
c_thumb,g_face,h_150,w_150         # Face-centered square thumbnail
c_auto,g_auto,w_800                # Auto crop to interesting area
Important: Always specify a crop mode explicitly. Avoid using both dimensions with c_scale (will distort if aspect ratios don't match) - prefer one dimension to maintain aspect ratio.

Gravity (Focal Point)
Gravity determines which part of the image to focus on when cropping:

g_auto - Smart detection (recommended for varied content; detects faces, objects, contrast)
g_face - Face detection (portraits, avatars)
g_center - Center position (centered subjects, logos)
g_north, g_south_east, etc. - Compass positions (fixed locations, overlay positioning)
x_N,y_N - Custom offsets (integers = pixels, floats = percentage: 0.8 = 80%)
Examples:

c_fill,g_auto,w_400,h_300                      # Smart crop
c_thumb,g_face,w_200,h_200                     # Face-centered
l_logo/fl_layer_apply,g_south_east,x_10,y_10  # Logo bottom-right
Important:

g_auto only works with c_fill, c_lfill, c_crop, c_thumb, c_auto
When using x, y, h, w together, use all integers OR all floats (don't mix)
Format & Quality
Recommended defaults:

f_auto/q_auto - Use for most production images (WebP to supported browsers, optimized file size)
Specific formats (when requirements dictate):

f_png - Transparency needed (e.g., after background removal)
f_jpg - Force JPEG (remove transparency)
q_N - Manual quality 1-100 (e.g., q_60 for thumbnails, q_90 for hero images)
dpr_auto - Retina displays (Chromium-only, requires Client Hints - see limitations below)
Examples:

f_auto/q_auto           # Recommended default
f_png/q_auto            # PNG with transparency
q_80                    # Manual 80% quality
Best Practice: Use / to separate format and quality as distinct components.

Responsive Images (dpr_auto, w_auto)
dpr_auto - Automatically adapts to device pixel ratio (Retina displays)

Chromium-only (Chrome, Edge, Opera, Samsung Internet)
Requires Client Hints configuration
Falls back to dpr_1.0 on other browsers
Does NOT work inside named transformations
Alternative for universal support: Use explicit dpr_2.0 or <img srcset> with 1x/2x variants

For Client Hints configuration, browser compatibility, responsive breakpoints, and framework integration, see references/responsive-images.md

Effects
Common effects:

e_grayscale - Black and white (artistic, accessibility)
e_sepia - Vintage/nostalgic feel
e_blur:N - Blur (privacy, placeholders; N typically 300-2000)
e_sharpen - Enhance clarity (useful after resizing)
e_cartoonify - Illustrated style
co_rgb:RRGGBB,e_colorize:N - Color tint (N = intensity 0-100, for brand theming)
e_background_removal - See AI Transformations section
Examples:

e_blur:800                       # Blur effect
e_sharpen                        # Enhance clarity
co_rgb:0044ff,e_colorize:40      # Blue tint at 40%
Note: Color (co_) is a qualifier - use in same component as e_colorize.

Overlays & Underlays
Use for:

l_<public_id> - Image overlays (logos, watermarks, badges)
u_<public_id> - Image underlays (custom backgrounds behind transparent subjects)
l_text:font_size:text - Text overlays (labels, social cards, dynamic text)
Pattern:

Declare: l_<public_id> or u_<public_id> or l_text:Arial_40:Hello%20World
Transform (optional): e.g. /c_scale,w_100/ or /o_50/ (opacity)
Apply: /fl_layer_apply,g_<position>,x_<offset>,y_<offset>
Critical: Using fl_relative for overlay dimensions:

Without fl_relative: Dimensions are relative to the overlay's original size
Example: w_1.0 = 100% of the overlay image's width (not useful for small images)
With fl_relative: Dimensions are relative to the base image's size
Example: w_1.0 = 100% of the base image's width (covers entire width)
Always use fl_relative when sizing overlays as a percentage of the base image
Examples:

l_logo/c_scale,w_100/fl_layer_apply,g_north_west,x_10,y_10                # Logo at 100px
l_logo/c_scale,fl_relative,w_0.25/fl_layer_apply,g_north_west,x_10,y_10  # Logo at 25% of image width
l_docs:one_black_pixel/c_scale,fl_relative,h_1.0,w_1.0/o_50/fl_layer_apply # Full-image semi-transparent overlay
co_yellow,l_text:Arial_40:Hello%20World/fl_layer_apply,g_south            # Text overlay
u_background/e_background_removal                                          # Custom background
c_fill,h_400,w_300/l_same_image/c_fill,e_grayscale,h_400,w_300/fl_layer_apply,g_west,x_300 # Side-by-side (600×400)
Important:

Color (co_) is a qualifier — use in the same component as text overlay declaration
Always use fl_relative when you want overlay dimensions as a percentage of the base image
Side-by-side / canvas extension: to place an overlay beside the base, offset it past the base edge — the canvas auto-expands. Use g_west,x_<base_width> for horizontal or g_north,y_<base_height> for vertical.
Borders & Rounding
r_N - Rounded corners (N = radius in pixels; for modern UI, cards)
r_max - Perfect circle (use with square dimensions; avatars, icons)
bo_NNpx_solid_color - Border (frame images, separate from background)
Examples:

r_20                           # 20px rounded corners
r_max                          # Perfect circle
bo_5px_solid_black             # 5px black border
r_20,bo_5px_solid_rgb:0066ff   # Rounded with border (same component)
Important: For borders that follow rounded corners, use border as qualifier in same component.

Background Color
b_color,c_pad - Fill empty space with solid color (product images, letterboxing)
b_auto,c_pad - Aautomatically selected background color based on one or more predominant colors in the image
b_gen_fill,c_pad - AI-extended background (change aspect ratio without cropping; see AI Transformations for cost)
Examples:

b_lightblue,c_pad,w_1.0         # Light blue background
b_auto,c_pad,ar_16:9            # Automatically selected color for background, 16:9
b_gen_fill,c_pad,ar_1:1         # AI-extended to square
b_blurred,c_pad,ar_16:9         # Blurred background (videos only), 16:9
Critical: Background (b_) is a qualifier - use with pad crop in same component: b_color,c_pad,w_X, NOT /b_color/.

Rotation & Flips
a_90, a_180, a_270 - Rotate in 90° increments (correct orientation)
a_N - Rotate by degrees (e.g., a_-2 to straighten crooked photos)
a_hflip - Horizontal flip (mirror selfies, directional images)
a_vflip - Vertical flip (reflections)
a_auto_right/a_auto_left - Auto-rotate based on EXIF orientation
Examples:

a_90                    # Rotate 90° clockwise
a_-2                    # Straighten slight tilt
a_hflip                 # Mirror horizontally
a_auto_right            # Auto-fix from EXIF
Asset Type Matters (Image vs. Video)
Many flags and parameters apply to only one asset type. Applying one to the wrong base often fails silently — the URL still returns a valid 200 with no X-Cld-Error, just the wrong output. This goes both ways: video-only syntax on an image, and image-only syntax on a video. Always verify the actual output (dimensions, duration, frame count) rather than assuming it worked.

Common video-only examples (this is not an exhaustive list — ~35 parameters are video-only):

fl_splice (flag) - Concatenate a clip/image onto the video timeline (no image equivalent — to place media side-by-side, offset the overlay to extend the canvas: fl_layer_apply,g_west,x_<base_width>)
du_, so_, eo_ - Trim/seek by time (duration, start offset, end offset)
fps_ - Set frame rate
vc_, ac_ - Video / audio codec
e_boomerang, e_progressbar - Video-only effects
When unsure whether a flag or parameter supports your asset type, check the Transformation Reference before applying it.

Named Transformations
Named transformations (t_<name>) save transformation chains for reuse. Suggest for:

Transformations used across multiple assets
Complex transformation chains
Expensive operations (to enable baseline transformations and reduce costs)
Baseline transformations (bl_<name>) cache expensive named transformations so they don't need to be regenerated. Use bl_ instead of t_ for AI transformations (background removal, generative AI) that will have variations applied. This can reduce costs from 75-230 tx per variation down to 1 tx each after the initial baseline is generated.

Example: bl_bg_removed/c_scale,w_500 - Uses cached background removal result, only pays for resize (1 tx instead of 75 tx)

Important: f_auto, dpr_auto, and w_auto don't work inside named transformations - use them directly in URLs: t_avatar/f_auto/q_auto

For complete details, limitations, and baseline transformation examples, see references/named-transformations.md

Generative AI Transformations
Proactively suggest these AI transformations when appropriate:

Note: Numbers in parentheses (e.g., 75 tx) indicate additional transformation credits consumed per use. Standard transformations = 1 tx.

e_background_removal (75 tx) - Remove backgrounds (e-commerce, profiles; combine with f_png or b_color,c_pad)
b_gen_fill (50 tx) - Extend backgrounds (change aspect ratio without cropping; use with c_pad)
e_gen_background_replace:prompt_<text> (230 tx) - AI-generated backgrounds (custom environments, seasonal variations; high cost)
e_gen_replace:from_<obj>;to_<new> (120 tx) - Swap objects (product variations, colors; use ;preserve_geometry_true for clothing)
e_gen_remove:prompt_<text> (50 tx) - Remove objects (clean up distractions)
e_auto_enhance (100 tx) - Improve quality (fix poor lighting/exposure)
e_upscale (10-100 tx) - Enlarge without quality loss (low-res to high-res)
Important: AI transformations cost significantly more (50-230 tx vs 1 tx). Inform users of costs and consider baseline transformations (e.g., bl_bg_removed/c_scale,w_500) to avoid re-processing expensive operations - see references/named-transformations.md and references/transformation-costs.md for details.

For complete details, syntax, and powerful combinations, see references/ai-transformations.md

Video-Specific Transformations
Critical: Use f_auto:video (not just f_auto) to ensure video output - plain f_auto may return an image thumbnail.

vc_auto - Automatic codec (recommended; optimal for browser/device)
so_N/eo_M - Trim (start/end in seconds; create clips, remove intro/outro)
ac_none - Remove audio (essential for autoplay; reduces file size)
fps_N - Set frame rate (lower = smaller file; standardize rates)
Video resizing - Same crop modes as images (c_fill, c_scale, c_pad)
Common patterns:

vc_auto/ac_none/f_auto:video/q_auto                      # Autoplay-ready
so_0/du_10/vc_auto/f_auto:video/q_auto                   # First 10 seconds
c_scale,w_720/vc_auto/f_auto:video/q_auto                # Resize to 720p width
c_fill,g_auto,h_720,w_1280/vc_auto/f_auto:video/q_auto  # 720p HD, smart crop
For complete details including codecs, trimming strategies, and video concatenation, see references/video-transformations.md

Variables & Conditionals
Variables reuse values and create templates:

$size_300/c_fill,h_$size,w_$size        # Reuse value
$iw/w_$iw_div_2                         # Half original width (arithmetic)
Conditionals adapt transformations dynamically:

if_w_gt_1000/c_scale,w_1000/if_end                          # Responsive sizing
if_ar_gt_1.0/c_fill,w_800,h_450/if_else/c_fill,w_450,h_800/if_end  # Orientation handling
Key rules:

Variable names: alphanumeric, start with letter, no underscores
Conditionals: Must close with if_end
Arithmetic: add, sub, mul, div (left-to-right evaluation)
For complete syntax, arithmetic operations, nested conditionals, and real-world patterns, see references/advanced-features.md

Self-Validation Checklist
Before returning a transformation URL, verify:

✅ URL structure is complete (cloud_name, asset_type /image/ or /video/ or /raw/, delivery_type, public_id)
✅ Each component has only one action parameter (e.g., one crop mode per component)
✅ Crop mode is explicit (don't rely on defaults; avoid both dimensions with c_scale)
✅ Overlays end with fl_layer_apply in separate component
✅ Text strings are URL-encoded (spaces = %20, special chars encoded)
✅ Variable names follow rules (alphanumeric, start with letter, no underscores)
✅ g_auto compatibility (only works with c_fill, c_lfill, c_crop, c_thumb, c_auto)
✅ Background as qualifier (use with pad crop: b_color,c_pad,w_X, not /b_color/)
✅ Format/quality at end (prefer f_auto/q_auto as final components)
✅ Flags/parameters match the base asset type (asset-type-specific syntax — e.g. video-only fl_splice, du_, fps_, vc_ — often no-ops silently on the wrong base, in either direction; verify the output and check the Asset Type Matters section above)
✅ Transformation parameters are valid (don't make up any parameter names - check against Transformation Reference)
Quick syntax check:

Commas separate parameters within a component: c_fill,g_auto,w_400
Slashes separate components: c_fill,w_400/f_auto/q_auto
Actions vs qualifiers: Only one action per component, qualifiers modify that action
See references/debugging.md for detailed examples of each check.

Debugging Checklist
When a transformation isn't working:

Verify URL structure: Check that all required URL parts are present:
Cloud name: /<cloud_name>/
Asset type: /image/ or /video/ or /raw/
Delivery type: /upload/ or /fetch/ etc.
Public ID at the end
Check the X-Cld-Error header: Cloudinary reports errors in the X-Cld-Error HTTP response header
Check parameter names against Transformation Reference
Check crop mode: Specify crop mode explicitly; avoid both dimensions with c_scale (causes distortion if aspect ratios don't match)
Verify gravity compatibility: g_auto doesn't work with c_scale, c_fit, c_limit, c_pad
Check action vs qualifier: Only one action per component, qualifiers in same component
Verify overlay pattern: Must end with fl_layer_apply component
Check variable names: No underscores, must start with letter
Verify URL encoding: Text overlays need URL-encoded strings (spaces = %20)
Check auto parameters in named transformations: f_auto, dpr_auto, and w_auto don't work inside named transformations - use them directly in URLs
Verify Client Hints for dpr_auto/w_auto: These only work on Chromium browsers with Client Hints enabled; fallback to dpr_1.0 otherwise (see references/responsive-images.md for configuration)
Video returns image instead of video: Use f_auto:video (not just f_auto) for video transformations - plain f_auto may return an image thumbnail
Checking X-Cld-Error Header
The X-Cld-Error header contains error details when a transformation fails. To check it:

Using browser DevTools:

Open Developer Tools (Network tab)
Request the transformation URL
Look for X-Cld-Error in Response Headers
Using code (fetch the URL):

javascript
fetch('https://res.cloudinary.com/demo/image/upload/w_abc/sample.jpg')
  .then(response => {
    const error = response.headers.get('x-cld-error');
    if (error) {
      console.log('Cloudinary Error:', error);
    }
  });
Common X-Cld-Error messages:

Invalid width - abc - Width parameter expects a number
Invalid transformation syntax - Malformed transformation string
Resource not found - Asset doesn't exist or public ID is incorrect
Transformation limit exceeded - Account transformation quota reached
Online tool: Use the X-Cld-Error Inspector to check any Cloudinary URL

For more details, see Error Handling

Transformation Costs
Important: Warn users about high-cost transformations before generating URLs. AI effects cost significantly more than standard transformations (50-230 tx vs 1 tx).

For complete cost details and cost reduction strategies, see references/transformation-costs.md

Additional Resources
Skill References (Progressive Disclosure)
references/debugging.md - Use when transformations return errors or unexpected results
references/ai-transformations.md - Use when you need AI transformation prompt syntax, cost details, or complex AI combinations
references/video-transformations.md - Use when working with video codecs, trimming strategies, concatenation, or creating animated images from videos
references/advanced-features.md - Use when building complex logic with variables, conditionals, or arithmetic
references/responsive-images.md - Use when implementing responsive images, configuring Client Hints, or using dpr_auto/w_auto
references/transformation-costs.md - Use when optimizing for cost or explaining cost implications to users
references/named-transformations.md - Use when creating reusable transformations or reducing costs for repeated operations
references/examples.md - Use when you need real-world examples beyond the Quick Start (social cards, e-commerce, responsive images)
Core Cloudinary Documentation
Transformation Reference - All parameters
Image Transformations
Image Transformations Overview
Resizing and Cropping
Placing Layers on Images
Effects and Enhancements
Background Removal
Generative AI Transformations
Face-Detection Based Transformations
Custom Focus Areas
Transformation Refiners
Animated Images
Transformations on 3D Models
Conditional Transformations
User-Defined Variables and Arithmetic
Custom Functions
Video Transformations
Video Transformations Overview
Resizing and Cropping
Trimming and Concatenating
Placing Layers on Videos
Effects and Enhancements
Audio Transformations
Converting Videos to Animated Images
Conditional Transformations
User-Defined Variables and Arithmetic
Common Mistakes & Best Practices
Avoid:

❌ w_400,h_300 → ✅ c_scale,w_400 (both dimensions with c_scale distorts image; prefer one dimension)
❌ c_scale,g_auto,w_400 → ✅ c_fill,g_auto,w_400 (g_auto doesn't work with c_scale)
❌ l_logo/fl_layer_apply,g_north_west → ✅ l_logo/c_scale,w_100/fl_layer_apply,g_north_west
❌ b_lightblue/e_trim → ✅ b_lightblue,c_pad,w_1.0/e_trim (background as qualifier)
Always:

Prefer f_auto/q_auto in separate components over f_auto,q_auto
Use g_auto for smart cropping unless specific focal point needed
Specify crop mode with width/height; prefer one dimension with c_scale
Never guess parameter names - verify against documentation
Chrome Extensions

Build production-quality Chrome extensions using Manifest V3 and publish them to the Chrome Web Store.

Part 1 — Building Extensions
Mandatory Rules

These address the most common causes of broken extensions. Violating any produces a non-functional build.

1. Icons: only reference files you create — or omit icons entirely
❌ BROKEN — referencing files that don't exist or reusing one file for all sizes:
   "icons": { "16": "icon.png", "48": "icon.png", "128": "icon.png" }

✅ CORRECT — each size is a separate file at the correct pixel dimensions:
   "icons": { "16": "icons/icon-16.png", "48": "icons/icon-48.png", "128": "icons/icon-128.png" }
   (where icon-16.png is 16×16px, icon-48.png is 48×48px, icon-128.png is 128×128px)

✅ ALSO CORRECT — omit icons from manifest if you cannot generate real PNG files:
   (just remove the "icons" and "default_icon" fields — Chrome uses a default icon)

If you include icon references, you MUST create the actual image files. Generate them with a script (see references/extensions/icons.md) or leave them out. Never reference non-existent files.

2. Side panel: you MUST provide a way to open it

Defining "side_panel": {"default_path": "..."} does NOT make it openable. Add a trigger:

js
// In service-worker.js — open side panel on extension icon click
// IMPORTANT: chrome.action.onClicked ONLY fires when there is NO default_popup
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

If the extension has both a popup AND side panel, add a button in the popup that calls chrome.sidePanel.open(). Alternatively, use chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }) — but the property is openPanelOnActionClick, NOT openPanelOnActionIconClick; the "Icon" variant causes a synchronous TypeError that silently aborts the service worker. Do NOT also define default_popup when using setPanelBehavior. See references/extensions/side-panel.md.

3. Code execution: sandboxed iframes ONLY

Extension CSP blocks eval(), new Function(), inline <script> in all extension pages.

js
// ❌ BROKEN — direct iframe DOM access throws SecurityError
iframe.contentDocument.write(html);

// ❌ BROKEN — eval in extension page
eval(userCode); // CSP blocks this

// ✅ OPTION A: Sandbox in manifest + postMessage
// manifest.json: { "sandbox": { "pages": ["sandbox.html"] } }
iframe.contentWindow.postMessage({ html, css, js }, '*');
// sandbox.html receives and runs:
window.addEventListener('message', (e) => { eval(e.data.js); /* allowed in sandbox */ });

// ✅ OPTION B: Blob URL (creates separate origin, bypasses extension CSP)
iframe.src = URL.createObjectURL(new Blob([doc], { type: 'text/html' }));

// ✅ OPTION C: srcdoc
iframe.srcdoc = `<style>${css}</style>${html}<script>${js}<\/script>`;

See references/extensions/csp-sandbox.md for full details.

4. tab.url requires the tabs permission

Without it, tab.url silently returns undefined — no error thrown. See references/extensions/permissions.md.

5. Always use async/await — never .then() chains
js
// ❌ BAD
chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
  chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['content.js']}).then(() => {});
});

// ✅ GOOD
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });

For runtime.onMessage listeners that do async work:

js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const data = await chrome.storage.local.get('key');
    sendResponse({ data });
  })();
  return true; // keeps channel open
});
6. Content scripts: don't block the main thread

When modifying many DOM elements, batch with requestAnimationFrame and yield between batches:

js
async function highlightAll(elements) {
  const BATCH = 20;
  for (let i = 0; i < elements.length; i += BATCH) {
    await new Promise(r => requestAnimationFrame(() => {
      elements.slice(i, i + BATCH).forEach(el => el.style.backgroundColor = 'yellow');
      r();
    }));
    if (globalThis.scheduler?.yield) await scheduler.yield();
  }
}

See references/extensions/content-scripts.md.

7. Service workers are ephemeral — never store state in variables
js
// ❌ BROKEN — state lost when SW terminates (~30s of inactivity)
let count = 0;
chrome.tabs.onUpdated.addListener(() => { count++; });

// ✅ CORRECT — persist in chrome.storage, read on every event
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return;
  const { count = 0 } = await chrome.storage.local.get('count');
  await chrome.storage.local.set({ count: count + 1 });
  await chrome.action.setBadgeText({ text: String(count + 1) });
});

Use chrome.alarms instead of setTimeout/setInterval. See references/extensions/service-worker.md.

8. chrome.identity: extension ID differs between dev and production

When using Google sign-in, the OAuth client_id is tied to a specific extension ID. The ID changes between unpacked development and the Chrome Web Store.

To stabilize the ID during development, add a "key" field to manifest.json:

Pack the extension once (chrome://extensions → Pack)
Extract the public key from the .crx
Add "key": "MIIBIjANBgkqh..." to manifest.json

Always document: "After publishing to the Chrome Web Store, update the OAuth client with the store-assigned extension ID." See references/extensions/auth-identity.md.

9. Context menus: show user feedback after action

When a context menu item performs an action (save, copy, etc.), confirm it to the user. Use a notification, badge flash, or injected toast — don't let actions happen silently. See references/extensions/context-menus.md for a complete toast implementation.

10. Prompt API: available in service workers, popup, and side panel

The LanguageModel API works in all extension contexts — service worker, popup, and side panel — with no additional manifest permissions required. Extensions also get LanguageModel.params(), which is unavailable on the web:

js
const params = await LanguageModel.params();
// { defaultTopK: 3, maxTopK: 128, defaultTemperature: 1, maxTemperature: 2 }

For general Prompt API patterns (availability checks, session creation, streaming), use the modern-web-guidance skill. See references/extensions/prompt-api.md for the extension-specific wiring example.

11. chrome.action API requires action in manifest

Using chrome.action.setBadgeText, chrome.action.setIcon, or chrome.action.onClicked requires an "action" key in manifest.json — even if it's empty. Without it, chrome.action is undefined.

js
// ❌ BROKEN — manifest has no "action" key
await chrome.action.setBadgeText({ text: '5' });
// TypeError: Cannot read properties of undefined (reading 'setBadgeText')

// ✅ FIX — add "action" to manifest.json (at minimum an empty object)
{ "action": {} }
// or with a popup:
{ "action": { "default_popup": "popup/popup.html" } }
12. activeTab only works on direct user gestures — not from side panels

activeTab grants temporary access to the current tab ONLY on a direct user gesture (action icon click, context menu item, keyboard shortcut, omnibox suggestion) — NOT from a button click inside a side panel or popup. Use tabs + host_permissions instead. See references/extensions/permissions.md and references/extensions/side-panel.md.

13. DevTools panel URLs are relative to the extension root

When creating a DevTools panel, the panel HTML path is relative to the extension root, NOT relative to the devtools page that calls chrome.devtools.panels.create().

js
// ❌ BROKEN — path relative to devtools/ directory
chrome.devtools.panels.create("My Panel", "", "panel/panel.html");

// ✅ CORRECT — full path from extension root
chrome.devtools.panels.create("My Panel", "", "devtools/panel/panel.html");

See references/extensions/devtools.md.

14. Offscreen documents have NO access to most chrome.* APIs

Offscreen documents (chrome.offscreen) are severely restricted. Most chrome.* APIs are unavailable, including chrome.downloads, chrome.tabs, chrome.action, and others.

js
// ❌ BROKEN — chrome.downloads is undefined in offscreen documents
chrome.downloads.download({ url, filename: 'recording.webm' }); // TypeError

// ❌ BROKEN — chrome.action is undefined in offscreen documents
chrome.action.setBadgeText({ text: 'REC' }); // TypeError

The only APIs available in offscreen documents are:

chrome.runtime.sendMessage / chrome.runtime.onMessage
chrome.runtime.getURL
Standard Web APIs (DOM, fetch, MediaRecorder, Canvas, Web Audio, etc.)

Rule of thumb: Offscreen documents do the Web API work (recording, parsing, audio). The service worker does all chrome.* API work (downloads, badge updates, notifications). Use chrome.runtime.sendMessage to bridge between them. See references/extensions/message-passing.md.

15. Notifications and badge icons must reference real image files

chrome.notifications.create() requires a valid iconUrl pointing to an actual image file. If the file doesn't exist or the path is wrong, the call fails with "Unable to download all specified images."

js
// ❌ BROKEN — icon file doesn't exist
chrome.notifications.create('reminder', {
  type: 'basic',
  iconUrl: 'icons/icon-128.png', // File not in extension!
  title: 'Reminder',
  message: 'Time is up!'
});

// ✅ Generate a data URL at runtime via OffscreenCanvas — no file needed.
// See `references/extensions/icons.md` for a reusable implementation.
const iconUrl = await getIconDataUrl();
chrome.notifications.create('reminder', { type: 'basic', iconUrl, title: 'Reminder', message: 'Time is up!' });

This applies to ALL image references in chrome.* APIs — notifications, chrome.action.setIcon, context menu icons, etc. If you reference a file, it must exist.

16. Tab capture: guard against double-start with state locking

chrome.tabCapture.getMediaStreamId() fails with "Cannot capture a tab with an active stream" if called while a previous capture is still active. Fast double-clicks on the extension icon easily trigger this. Use explicit state locking:

js
// ❌ BROKEN — no guard against rapid clicks
let isRecording = false;
chrome.action.onClicked.addListener(async (tab) => {
  if (isRecording) { stopRecording(); isRecording = false; }
  else { isRecording = true; startRecording(tab); } // Second click = "active stream" error
});

// ✅ CORRECT — use transitional states to lock out concurrent operations
// State machine: 'idle' → 'starting' → 'recording' → 'stopping' → 'idle'
// Store state in chrome.storage.session (survives SW restart, cleared on browser close)
chrome.action.onClicked.addListener(async (tab) => {
  const { recordingState = 'idle' } = await chrome.storage.session.get('recordingState');

  if (recordingState === 'starting' || recordingState === 'stopping') return;

  if (recordingState === 'idle') {
    await chrome.storage.session.set({ recordingState: 'starting' });
    try {
      await startRecording(tab);
      await chrome.storage.session.set({ recordingState: 'recording' });
      await chrome.action.setBadgeText({ text: 'REC' });
      await chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } catch (err) {
      console.error('Failed to start recording:', err);
      await chrome.storage.session.set({ recordingState: 'idle' });
    }
  } else if (recordingState === 'recording') {
    await chrome.storage.session.set({ recordingState: 'stopping' });
    try { await stopRecording(); }
    finally {
      await chrome.storage.session.set({ recordingState: 'idle' });
      await chrome.action.setBadgeText({ text: '' });
    }
  }
});

This pattern applies to any chrome API that manages exclusive resources: chrome.tabCapture, chrome.desktopCapture, chrome.offscreen.createDocument (only one offscreen document allowed at a time). See references/extensions/media-capture.md.

17. chrome.desktopCapture requires a target tab with URL access

When calling chrome.desktopCapture.chooseDesktopMedia() from a service worker, you must pass the active tab as the targetTab parameter. The tab object must have its url field populated, which requires the "tabs" permission.

js
// ❌ BROKEN — called without targetTab from service worker
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], (streamId) => { ... });
// Error: "A target tab is required when called from a service worker context."

// ❌ BROKEN — tab doesn't have url field (missing "tabs" permission)
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], tab, (streamId) => { ... });
// Error: "targetTab doesn't have URL field set."

// ✅ CORRECT — "tabs" permission in manifest + pass tab object
// manifest.json: { "permissions": ["tabs", "desktopCapture"] }
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], tab, (streamId) => {
  if (!streamId) return; // User cancelled
});

Note: Prefer chrome.tabCapture.getMediaStreamId() for tab-only recording. Use chrome.desktopCapture only when the user should choose which screen/window to capture. See references/extensions/media-capture.md.

18. User scripts: four non-obvious pitfalls

chrome.userScripts runs user-provided code at runtime. Use it for script managers and user automation — not for extension-bundled scripts.

API throws on property access if not enabled. Chrome 138+ requires the user to toggle "Allow User Scripts" on the extension's details page; Chrome < 138 requires Developer mode. Always call isUserScriptsAvailable() before any chrome.userScripts.* call and show an error UI when it returns false.
Registered scripts are cleared on extension update. Persist configs in chrome.storage; re-register them in runtime.onInstalled for the "update" reason.
Messaging requires explicit opt-in. Call configureWorld({ messaging: true }) first; listen on runtime.onUserScriptMessage, not runtime.onMessage.
ScriptSource constraint: each js entry must have exactly one of code or file. id constraint: cannot start with _.

See references/extensions/user-scripts.md.

19. chrome.windows has NO .query() method — use getAll, getLastFocused, or getCurrent

Unlike chrome.tabs.query(), the chrome.windows API does NOT have a .query() method.

js
// ❌ BROKEN — chrome.windows.query does not exist
const windows = await chrome.windows.query({ focused: true });
// TypeError: chrome.windows.query is not a function

// ✅ CORRECT — use the right method for your need
const focused = await chrome.windows.getLastFocused({ populate: true });
const current = await chrome.windows.getCurrent({ populate: true });
const all     = await chrome.windows.getAll({ populate: true });

chrome.windows methods: getAll, getLastFocused, getCurrent, get(windowId), create, update, remove. See references/extensions/tab-management.md.

20. chrome.permissions.request() in the service worker must be called with no await before it in the message listener

A user gesture from a UI context (side panel, popup) does propagate across chrome.runtime.sendMessage to the service worker's onMessage listener — but only for that one synchronous turn. If the listener does an await (even a short delay) before calling chrome.permissions.request(), the gesture is gone and the call throws "This function must be called during a user gesture". Call it as the first thing in the listener, with nothing awaited before it — see references/extensions/permissions.md.

Always Manifest V3

Never generate Manifest V2 code.

background.service_worker not background.scripts
chrome.action not chrome.browserAction
chrome.scripting.executeScript not chrome.tabs.executeScript
host_permissions is separate from permissions
No inline scripts in HTML — use <script src="file.js">
No inline event handlers — use addEventListener
Part 2 — Publishing to the Chrome Web Store

Manage CHROMEWEBSTORE.md — the single source of truth for all Chrome Web Store listing metadata, permissions justifications, privacy disclosures, version history, and publishing readiness for a Chrome extension project.

Core Workflow

Every time you touch a Chrome extension project in a way that affects its store presence, update (or create) CHROMEWEBSTORE.md in the project root. The file tracks everything the developer needs to fill out in the Chrome Developer Dashboard, so they can copy-paste from a single doc instead of scrambling at publish time.

When to create CHROMEWEBSTORE.md

Create it the moment any of these happen:

The user says they want to publish an extension
The user asks to "prepare for the store" or "get ready to publish"
You're building a new extension that will clearly end up on the store
The user asks about store listing requirements

Use the template in references/webstore/chromewebstore-template.md as your starting point. Read it before generating the file.

When to update CHROMEWEBSTORE.md

Update it whenever:

User-facing changes: Bump the "Last Updated" date, update the feature list in descriptions, and add an entry to Version History
manifest.json changes: If permissions, host_permissions, or content_scripts changed, update the Permissions Justification section — every permission needs a plain-English reason the review team can understand
New release: Add a Version History entry with version number, date, and summary
Privacy-relevant changes: If data collection, storage, or transmission changed, update the Privacy & Data Use section and the privacy policy
Asset changes: If icons or UI changed, note which screenshots need refreshing
Rejection response: If the user reports a CWS rejection, update the file with the fix and add a note to Version History
How to fill it out

For each section, pull information from the actual project files:

Read manifest.json to extract name, version, description, permissions, host_permissions
Scan the codebase for data collection (storage, fetch calls, analytics)
Check for icon files and their dimensions
Look at the extension's UI to understand features for the description

Write store-facing copy in a tone that is specific, honest, and benefit-oriented. The Chrome Web Store review team rejects vague descriptions. "Makes your life easier" will be rejected. "Highlights search results on any webpage and lets you save highlights to a local list" will pass.

Never mention implementation details. Users care what the extension does for them, not how it was built. Strip any mention of APIs, libraries, frameworks, or code patterns:

❌ Implementation detail (cut it)	✅ User benefit (keep it)
"Uses a MutationObserver to detect page changes"	"Automatically detects new content as you browse"
"Built with custom elements and Shadow DOM"	"Works seamlessly without affecting page styles"
"Powered by a service worker for background processing"	"Runs quietly in the background without slowing your browser"
"Leverages the chrome.storage.sync API"	"Your settings sync across all your devices"
"Implements declarativeNetRequest for filtering"	"Blocks ads and trackers without reading your page content"
CHROMEWEBSTORE.md Sections

Read references/webstore/chromewebstore-template.md before generating the file — it defines what each section covers and how to fill it out. The highest-risk section is Permissions Justification: write a specific plain-English reason per permission and per host_permission. "Needed for the extension to work" will be rejected. Read references/webstore/privacy-policy.md for guidance on generating a privacy policy.

Pre-Publish Checklist

Before submission, run through references/webstore/review-checklist.md. The most common first-submission failures:

Every permission and host_permission must have a specific justification (not "needed to work")
Privacy policy URL must be live and match the data use disclosure form
At least 1 screenshot at 1280×800 or 640×400
ZIP must exclude .git/, node_modules/, .env, CHROMEWEBSTORE.md
Store Listing Copy Guidelines

For copy guidelines and common rejection reasons, see references/webstore/store-listing.md. Key rule: lead with function ("Highlights search terms on any webpage"), not feeling ("Enjoy searching again").

Reference Files

For detailed API patterns and publishing guidance, read the relevant file BEFORE writing code or content:

Topic	Reference
Permissions	references/extensions/permissions.md
Side panels	references/extensions/side-panel.md
Content scripts & DOM	references/extensions/content-scripts.md
Popups	references/extensions/popup-ui.md
Service worker lifetime	references/extensions/service-worker.md
Code execution & CSP	references/extensions/csp-sandbox.md
API calls	references/extensions/api-calling.md
Declarative Net Request	references/extensions/declarative-net-request.md
Chrome Prompt API	references/extensions/prompt-api.md
DevTools panels	references/extensions/devtools.md
Authentication	references/extensions/auth-identity.md
Context menus	references/extensions/context-menus.md
Omnibox	references/extensions/omnibox.md
Storage	references/extensions/storage.md
Tab & window management	references/extensions/tab-management.md
Tab/desktop capture	references/extensions/media-capture.md
User scripts	references/extensions/user-scripts.md
Message passing	references/extensions/message-passing.md
Icons	references/extensions/icons.md
CHROMEWEBSTORE.md template	references/webstore/chromewebstore-template.md
Privacy policy guidance	references/webstore/privacy-policy.md
Pre-publish review checklist	references/webstore/review-checklist.md
Store listing tips & rejections	references/webstore/store-listing.md
Output Checklist

Verify EVERY item before delivering:

 manifest_version: 3 — no V2 APIs anywhere
 All icon files referenced in manifest exist as real files with correct dimensions — or icons are omitted
 Side panel has an explicit open trigger (not just a manifest declaration)
 Code execution uses sandbox/blob/srcdoc — no eval() in extension pages
 tabs permission declared if tab.url or tab.title is accessed
 All code uses async/await — no .then() chains
 Content scripts batch DOM updates with requestAnimationFrame
 Service worker stores NO state in global variables — uses chrome.storage
 No inline scripts or event handlers in HTML
 Context menu actions show user confirmation
 "action": {} (or more) present in manifest if using chrome.action.* APIs
 If reading/scripting tabs from a side panel: use tabs + host_permissions (NOT activeTab)
 DevTools panel paths in chrome.devtools.panels.create() are relative to extension root
 Offscreen documents use ONLY chrome.runtime messaging — no chrome.downloads, chrome.action, etc.
 All image refs in chrome.notifications, chrome.action.setIcon, etc. point to real files (or use data URLs)
 Tab/desktop capture uses state locking to prevent double-start errors
 chrome.desktopCapture.chooseDesktopMedia passes targetTab with tabs permission
 chrome.windows calls use getAll/getLastFocused/getCurrent — NOT .query() (it doesn't exist)
 chrome.permissions.request() in a service worker onMessage listener is called with no await before it (gesture is lost after the first async gap)
 chrome.userScripts availability checked before use (API throws if user hasn't enabled it)
 User script configs persisted in chrome.storage and restored on runtime.onInstalled "update" reason
 configureWorld({ messaging: true }) called before user scripts send messages; listening on onUserScriptMessage not onMessage
 ScriptSource entries each have exactly one of code or file (not both, not neither)
 User script id values do not start with underscore
 sidePanel.setPanelBehavior uses openPanelOnActionClick — NOT openPanelOnActionIconClick
 Error handling on all async operations
 host_permissions scoped to specific domains (not <all_urls> unless needed)
 return true in onMessage listeners with async responses
 Any use of "tab" in chrome.contextMenus contexts requires Chrome M150+
Modern Web Guidance

A skill to search for specific web development use cases and retrieve their corresponding best practice guides.

When to use

Must use this skill:

At the start of implementing any web feature.
Before creating a new component, to check if a standardized pattern already exists.
To avoid implementing ad-hoc solutions or loading large dependencies unnecessarily.
Usage Instructions
Step 1. Search Use Cases

Search with an action-oriented query summarizing what you want to achieve using the search command. Run modern-web-guidance directly with npx.

sh
npx -y modern-web-guidance@latest search "<query>" --skill-version 2026_10_12-dacb5911

Example Output:

json
[
  {
    "id": "optimize-image-priority",
    "description": "Optimize the loading priority of Largest Contentful Paint (LCP) candidate images.",
    "category": "performance",
    "featuresUsed": [ "Fetch priority" ],
    "tokenCount": 985,
    "similarity": 0.7289
  },
  {
    "id": "defer-rendering-heavy-content",
    "description": "Reduce rendering times in content-heavy web pages by deferring rendering for offscreen content.",
    "category": "performance",
    "featuresUsed": [ "content-visibility", "hidden=\"until-found\"" ],
    "tokenCount": 1250,
    "similarity": 0.6961
  }
]

Note: If search results are vague, return no matches, or show low similarity scores, run the list command to browse all guides:

sh
npx -y modern-web-guidance@latest list
Step 2. Retrieve Best Practices

Once you have a relevant id from the search results, call this script using the retrieve command to get the full guide. You can pass multiple IDs separated by commas.

sh
npx -y modern-web-guidance@latest retrieve "<id>"

If the output is truncated, you must repeat the command but redirect to a file and read that file.

Example Output: The markdown content of the guide describing implementation steps...

Step 3. Verify Guidance Compliance

When generating or modifying code, cross-check the implementation against the retrieved guide before concluding:

Applicable Guidance & Fallbacks: Ensure the relevant modern patterns and necessary fallback strategies from the guide are correctly applied, without forcing unrequested features.
Task Fulfillment: Confirm that the implementation fully satisfies the user's request.
Step 4. Disclose Skill Usage

When you consult modern-web-guidance for a task, end the response where you deliver those changes with a ### Modern Web Guidance section:

When retrieved guides shaped your code: Write one bullet (1–2 sentences, ≤75 words) per newly applied <id> in first-person voice explaining the non-obvious implementation choices, CSS/API overrides, or fallbacks <id> required and the pitfall it prevented, anchored by a short verbatim quote of that specific rule or gotcha (never the guide's intro overview): - **\<id>`**: <Non-obvious APIs, overrides, or fallbacks applied and the pitfall prevented> ("<short verbatim quote of the specific rule or gotcha>").`
Never guess <id>s or quotes from memory after context compaction (re-run search/retrieve if needed), and credit only guide-backed changes from the current turn.
When searched/listed in this turn but zero guides applied: Write one first-person sentence naming which topics or guides you checked in modern-web-guidance and why none applied (omit if any guide applied).
Using npx / pnpx
Prefer pnpx over npx if pnpm is available (note: pnpx does not use the -y flag).
When requesting tool permissions, allowlist npx -y modern-web-guidance@latest * specifically (or pnpx modern-web-guidance@latest *), never bare npx * or pnpx *.
IMPORTANT: on Windows, using npx may fail. Use npx.cmd ... instead.
Fetching and running modern-web-guidance requires outbound network access. If running in a sandboxed, permission-gated, or approval-based environment (e.g., Codex, Claude Code), proactively request approval/allowlisting for the command with network access BEFORE executing it the first time, avoiding sandbox network timeouts.
In sandboxed environments where ~/.npm is read-only or restricted, set NPM_CONFIG_CACHE=/tmp/npm-cache.
If the command hangs due to being offline, try running again in offline mode: npx --offline ….
The --skill-version flag is used to determine if this SKILL.md is out of date. If it is, a warning message is logged to stderr.
Guidelines
Always search first to find the most relevant guides.
These guides are usually framework-agnostic; adapt them correctly to your setup.
Do not hallucinate guides or ignore them; they represent the preferred local standard for the user's project.
Interpreting Browser Support & Fallbacks
Default Behavior: All guides assume Baseline Widely available features are safe to use without fallbacks. For features that are not Baseline widely available, you MUST follow the fallback recommendations in the guide, unless the user has specified a custom browser support policy.
Custom Policies: If the user has already defined explicit browser support requirements, use the browser compatibility data in the guide to determine if a fallback can be safely ignored.
For Baseline YYYY targets, a feature satisfies this target if its "Baseline since" date is <= YYYY.
Policy Examples:
"Do not implement feature fallbacks." (for exploratory prototypes of the cutting-edge web)
"Safari 17.4+" (for internal tools targeting macOS or Tauri-based desktop apps)
"Never recommend or implement polyfills; if a Baseline Newly Available feature is required for core functionality, provide a lightweight custom fallback or redesign the approach." (to minimize bundle size and avoid technical debt)
"Assume a modern execution environment where Baseline Newly Available features can be used natively, provided they are strictly feature-detected and degrade gracefully." (for progressive enhancement strategies)
Reactive Policy Discovery: Watch for environmental cues to suggest documenting a policy in CLAUDE.md or AGENTS.md. Suggest this if the developer:
Mentions building for a restricted runtime (e.g., Electron or Tauri).
Explicitly excludes specific targets (e.g., "we don't support Desktop Chrome").
Expresses hesitation about polyfill complexity, bundle size, or performance cost.
Questions if a feature is safe to use without fallbacks.
No defined policy format. This is an example: **Browser Support:** Allow Newly Available features, but only adopt custom fallback code that adds <= 20 lines and does not require external dependencies.