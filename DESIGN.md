---
name: Jithesh Shaju P Portfolio
description: A model's view of one career, where the things that matter are detected, framed, and labelled.
colors:
  ink: "#080b12"
  surface: "#0d121e"
  raised: "#141a29"
  line: "#222a3b"
  line-strong: "#3a4560"
  text: "#e8ecf4"
  muted: "#9aa5ba"
  faint: "#7e8aa3"
  signal: "#7c9bff"
  signal-deep: "#3d5bd9"
  lock: "#c9f24b"
  on-lock: "#0b1005"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.5rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 116"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 108"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.7vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 108"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
    fontFeature: "'tnum'"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 4rem)"
  shell: "82.5rem"
  nav-h: "4.5rem"
  section-top: "clamp(6rem, 10vw, 9rem)"
  section-bottom: "clamp(2.5rem, 5vw, 4rem)"
  column-gap: "4rem"
  control-gap: "0.75rem"
components:
  button-solid:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-solid-hover:
    backgroundColor: "{colors.lock}"
    textColor: "{colors.on-lock}"
  button-frame:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-frame-hover:
    textColor: "{colors.lock}"
  tag:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0.3125rem 0.5rem"
  tag-locked:
    backgroundColor: "{colors.lock}"
    textColor: "{colors.on-lock}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "2rem"
  nav-link:
    textColor: "{colors.muted}"
    padding: "0 0.875rem"
    height: "2.75rem"
  nav-link-active:
    textColor: "{colors.text}"
  skill-chip:
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0 0.875rem"
    height: "2.75rem"
  skill-chip-locked:
    textColor: "{colors.lock}"
---

# Design System: Jithesh Shaju P Portfolio

<!-- Recorded from the shipped build on 2026-09-30 (src/app/globals.css, src/app/layout.tsx, src/components, .impeccable/review captures). Token values are extracted. The North Star name, the atmosphere language, and the descriptive colour names were written from that evidence without the owner's confirmation round and are UNCONFIRMED until the owner signs them off. -->

## Overview

**Creative North Star: "The Annotated Field"** *(unconfirmed)*

The page is what a detection model sees when it looks at one career. A blue-black ground holds a field of data points that enter scattered, pass through a network, and leave in ordered rows. Over that field, the things that matter are picked out the way a detector picks out a target: four corner ticks at rest, a closed box and a label when attention lands. The interface has no other ornament. Everything that looks like decoration is a diagram of something, and everything that lights up does so because it is being attended to.

The mood is dark, quiet, and exact. Type is large and wide-set but the page is sparse: one column of reading, hairline rules between entries, a single tinted panel where a figure or a fact sheet needs a ground. Colour is rationed. Blue belongs to the data. Lime belongs to the lock. Everything else is ink, off-white, and two greys. Motion follows the same logic: ticks draw out to a box, a signal travels from one stage to the next, and everything eases out exponentially and then stays still.

**Key Characteristics:**
- Blue-black ground, off-white type, zero radius, zero shadow.
- One component language: the annotation frame (corner ticks at rest, closed box on lock).
- Lime appears only on a lock and on the path that feeds it.
- One type family (Archivo) whose width axis carries the hierarchy; mono only for data.
- Hairline rules and open space separate content; tinted panels are reserved for figures and fact sheets.
- A fixed 3D data field sits behind the hero and returns, dimmed, behind Contact.
- Complete without WebGL, on a phone, and with reduced motion.

## Colors

Near-monochrome blue-black with two rationed accents: a periwinkle blue for data and an acid lime for attention. All neutrals share the ground's hue (OKLCH hue about 265) at low chroma, so greys read as lit ink and never as flat grey. Descriptive names below are unconfirmed.

### Primary
- **Lock Lime** (#c9f24b, `lock`): the attention colour. A closed annotation frame, the label chip of a locked target, the lit path through a network or pipeline, the dot of a stage the signal has reached, hover on any link or button, the focus ring (2px outline, 3px offset), text selection, and the caret. 15.3:1 on the ground.
- **Lock Ink** (#0b1005, `on-lock`): the only text colour allowed on lime (locked chips, the solid button on hover, selected text). 14.9:1 on lime.

### Secondary
- **Signal Blue** (#7c9bff, `signal`): the data colour. Nodes in the skills graph, points and bounding boxes in project figures, the resting ticks of the hero's tracked labels, group markers. Its single text use is the one-line domain under each project title. 7.5:1 on the ground.
- **Deep Signal** (#3d5bd9, `signal-deep`): edges of the static (no-WebGL) network drawing only. 3.5:1 on the ground, so it is for lines, never text.

The WebGL field renders its own blues in shader uniforms (#5f80f5 edges, #4f6fe8 raw points, #b9c8ff ordered points, #dfe7ff pulses). They sit in the Signal Blue family but are not tokens; its lit path uses Lock Lime exactly.

### Neutral
- **Ink** (#080b12, `ink`): the page ground, the scrolled nav bar, the mobile menu, and text on the solid button.
- **Surface** (#0d121e, `surface`): the ground of a framed panel (project figures, the About fact sheet).
- **Raised** (#141a29, `raised`): the ground of a resting label chip, and small fills inside figures.
- **Line** (#222a3b, `line`): hairline rules between entries, list dividers, the nav bar's bottom edge once scrolled, unlit pipeline connectors.
- **Strong Line** (#3a4560, `line-strong`): resting corner ticks on non-interactive frames, link underlines, list dashes, unreached pipeline dots, scrollbar thumb. 2.1:1 on the ground, so it never carries text or the only boundary of a control.
- **Text** (#e8ecf4, `text`): headings, primary reading text, the solid button's fill. 16.6:1 on the ground.
- **Muted** (#9aa5ba, `muted`): secondary prose, field labels, resting nav links and chip labels. 7.9:1.
- **Faint** (#7e8aa3, `faint`): tertiary text (stack lists, dates, captions, footer) and the resting ticks of frame buttons. 5.7:1 on the ground, 5.4:1 on Surface; the lowest-contrast text the system allows.

### Named Rules
**The Lock Rule.** Lime means attention is here. It appears on a locked target, on the path that feeds that target, and as the hover and focus response of a control. It is never a resting fill, a heading colour, or decoration.

**The Blue Is Data Rule.** Signal Blue colours data marks: points, nodes, edges, bounding boxes. It never fills a control or a surface.

**The One Ink Rule.** Every neutral is a lightness step of the same blue-black. No neutral grey, no pure black, no pure white.

## Typography

**Display Font:** Archivo, variable, width axis loaded (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo at normal width
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular, monospace)

**Character:** One grotesque doing every job by changing its width: stretched wide and heavy for the name, easing back to normal width for reading. The mono is a second voice used only where the page is reporting data.

### Hierarchy
- **Display** (700, width 125%, clamp(2.75rem, 8.2vw, 6rem), line-height 0.94, -0.02em, uppercase): the name in the hero and the closing line in Contact (there capped at clamp(2.5rem, 7.4vw, 5.5rem), 12ch wide). Two uses per page.
- **Headline** (650, width 116%, clamp(2rem, 4.6vw, 3.5rem), line-height 1.02, -0.02em, balanced wrap): one per section. Sentence case. Nothing sits above it.
- **Title** (600, width 108%, clamp(1.375rem, 2.2vw, 1.75rem), line-height 1.15, -0.01em): role titles, the degree.
- **Lead** (400, normal width, clamp(1.1875rem, 1.7vw, 1.5rem), line-height 1.45): the hero sentence, the first paragraph of About, stated outcomes and impact lines.
- **Body** (400, 1.0625rem, line-height 1.65): reading text, capped at 68ch, usually in Muted.
- **Small** (0.9375rem; 400 for field labels and secondary lines, 600 for block sub-headings such as "Implementation" and "Certifications").
- **Label** (600, width 108%, 0.875rem, 0.06em, uppercase): button text only.
- **Data** (JetBrains Mono 400, 0.8125rem, line-height 1.4, 0.02em, tabular figures; 0.75rem at 0.04em inside label chips): dates, stack names, pipeline stage names (uppercase), figure labels, tracked labels on the 3D field.

### Named Rules
**The Width Is Rank Rule.** Hierarchy is set by Archivo's width axis together with size: 125% display, 116% headline, 108% title and label, 100% for everything read. Do not introduce a second sans family to make a heading feel different.

**The Mono Is Data Rule.** Mono appears only where the page reports a value or a machine label: a date, a stack item, a stage name, a detector's class label. Never for prose, headings, or buttons.

## Layout

A single centred shell, `min(100% - 2 × gutter, 82.5rem)`, with a fluid gutter of clamp(1.25rem, 5vw, 4rem). Sections stack in one column with asymmetric vertical padding: clamp(6rem, 10vw, 9rem) above, clamp(2.5rem, 5vw, 4rem) below, so each headline gets air and the section's content runs on into the next rule.

From 1024px, section content sits on a 12-column grid with a 4rem column gap, split unevenly by role: 6/6 for About (prose beside fact sheet), 3/9 for Experience (date rail beside content), 5/7 for Projects (text beside figure, alternating sides each entry), 5/7 for Education. Below 1024px everything collapses to one column. Entries in a list are separated by a 1px Line rule and 3rem to 5rem of padding, not by boxes.

The hero fills the viewport (100svh) with its content bottom-aligned on the left; the 3D field is a fixed full-viewport layer behind it, weighted right on desktop and sitting above the name on phones. A linear scrim from Ink to transparent (80° on desktop, bottom-up on phones) keeps the type legible where the field passes behind it. The field fades out as the hero scrolls away and returns at reduced presence behind Contact, which is 92svh and vertically centred.

Controls sit 0.75rem apart and wrap. Every interactive target is at least 2.75rem tall; primary buttons are 3rem.

Breakpoints are Tailwind's defaults: 640px (fact-sheet and list rows become two columns), 768px (pipelines turn horizontal, hero labels move to the right of their nodes), 1024px (12-column grid, inline nav, skills graph).

### Named Rules
**The Hairline Rule.** Separate entries with a 1px rule and space. A tinted panel is for a figure or a fact sheet, never a wrapper around ordinary content.

## Elevation & Depth

Flat. There are no box shadows, no blur, no glass, and no glow anywhere in the build. Depth is tonal and literal: three lightness steps of the same ink (ground, Surface, Raised) mark what is a panel and what is a chip, and the only true depth is the 3D field itself, a fixed layer behind the content whose camera travels inward as the page scrolls. The nav bar is transparent over the hero and becomes solid Ink with a Line bottom edge after 24px of scroll.

The one gradient in the system is the hero scrim, which exists for legibility over the field.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow or blurs what is behind it. A surface is distinguished by a lightness step or a frame.

## Shapes

Every box is square: buttons, panels, chips, the menu, the focus ring. No border radius is declared anywhere. Roundness exists only as data: circular nodes and points in diagrams and in the field.

The signature form is the **annotation frame**: eight 1px strokes forming four corner ticks (10px at rest, 5px on small stage markers, 7px on hero labels) drawn in Strong Line. On lock the ticks extend to 51% of each side so they meet, the frame closes into a full 1px box, and it turns Lock Lime. A frame is never absent at rest and never filled; its resting ticks are the unlit state.

Lines are 1px throughout: rules, ticks, underlines, diagram edges (1.5px for an emphasised or lit edge). Icons are drawn on a 24px grid with a 1.5px stroke and square caps to match the frames. List markers are 12px hairline dashes.

### Named Rules
**The Ghost Tick Rule.** Anything that can lock shows its four corner ticks before it does. The unlit state is designed, never blank.

**The Square Corner Rule.** Zero radius on every container and control. Circles are data points only.

## Components

Controls are quiet until attended to, then answer in one colour. Every state change is a lock: ticks draw out over 420ms on an exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), colour follows in 180ms, a press moves the control down 1px. Nothing bounces, spins, or loops.

### Buttons
- **Shape:** square (0 radius), 3rem tall, 1.5rem side padding, Label type (uppercase, 0.06em). A compact form at 2.75rem tall with 1rem padding is used for Menu, Close, and pipeline run controls.
- **Solid (primary):** Text fill with Ink label. One per group ("View Projects", "Open case study").
- **Frame (secondary):** no fill, Text label, corner ticks in Faint so the control's edge stays visible at rest.
- **Hover / Focus:** Solid turns Lock Lime with Lock Ink text. Frame closes its ticks into a lime box and its label turns lime. Focus shows the global 2px lime outline at 3px offset. Active shifts down 1px.
- **Disabled:** 50% opacity, not-allowed cursor (a pipeline's run control while it is tracing).
- **Icons:** optional 14 to 16px stroke icon beside the label, 0.625rem gap.

### Chips
- **Label chip (tag):** Data type at 0.75rem on Raised, Muted text, 0.3125rem × 0.5rem padding, square. It rides the top-left edge of a framed figure or panel and names what the frame contains ("retrieval", "detection", "profile"), lowercase, like a detector's class label. Locked: Lock Lime fill, Lock Ink text. It labels a frame; it is not placed above a heading.
- **Skill chip:** an annotation frame 2.75rem tall with 0.875rem side padding, Small type in Muted, preceded by its group marker (12px square, circle, or diamond in Signal Blue). Hover or selection closes the frame and turns the label lime; chips linked to the locked skill brighten to Text.

### Cards / Containers
- **Corner Style:** square.
- **Background:** Surface, with the annotation frame's ticks at its corners and a label chip on its top edge.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** none beyond the corner ticks.
- **Internal Padding:** 1.5rem, 2rem from 640px (fact sheet); 0.75rem, 1.25rem from 640px (figures).
- **Use:** project figures and the About fact sheet only. Rows inside are divided by Line rules with 0.875rem vertical padding.

### Inputs / Fields
None exist in the build. Contact is four direct links, not a form.

### Navigation
- **Bar:** fixed, 4.5rem tall, transparent over the hero; solid Ink with a Line bottom edge after 24px of scroll (300ms).
- **Mark:** the initials in 0.9375rem bold at 125% width, uppercase.
- **Links (from 1024px):** 0.875rem, Muted, Text on hover and when current. The current section is marked by a single closed lime frame, 2.25rem tall, that slides from link to link (500ms, exponential ease-out) instead of each link toggling its own state.
- **Mobile:** a compact Frame button labelled "Menu" opens a full-screen Ink dialog. Links are set at clamp(1.75rem, 8vw, 2.5rem), 600, 116% width, in Muted; the current one is lime. The email sits at the bottom in Data type.
- **In-text links:** underlined 1px in Strong Line at 0.28em offset; text and underline turn lime on hover.

### Pipeline (signature)
A system drawn as its ordered stages. Each stage is a 1.25rem frame marker with a 6px square dot, a stage name in uppercase Data type, and one line of Small text. Stages are joined by a 1px Line connector. Tracing sends a signal along it: each stage locks in turn every 520ms, its connector fills with lime over 360ms, reached stages keep a lime dot and brighten to Text, and the current stage's name is lime. Horizontal from 768px, vertical below (the signal then travels top to bottom). Any stage can be selected directly; a run control replays the trace. With reduced motion nothing auto-traces.

### Tracked label (hero)
A 2.25rem frame with 7px ticks in Signal Blue at 55% opacity, centred on an output node of the 3D field, with a mono chip beside it on an 86% Ink backing so the data stream passes behind the text. The node nearest the pointer locks: frame closes, chip turns lime, and the path through the network that feeds it lights. Labels hide once the hero is half scrolled away.

### Figure
An inline SVG diagram inside a framed Surface panel, drawn only in system tokens: Signal Blue points, Strong Line guides, Text for selected items, and lime only on the locked target, its tick marks, and its chip. Strokes draw in once over 1400ms when the figure enters view. A one-line caption in Faint below states what the figure illustrates.

### Contact row
A full-width link row at least 4rem tall between Line rules: a Small Muted label, the value at clamp(1.0625rem, 2.2vw, 1.5rem) medium, and a stroke arrow in Faint at the right. On hover the whole row turns lime and the arrow shifts 2px up and right.

## Do's and Don'ts

### Do:
- **Do** build every new interactive or highlighted element from the annotation frame: corner ticks at rest, closed 1px lime box on lock, ticks drawing out over 420ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Do** keep lime for attention only: a lock, the path feeding it, hover, and focus. Put only Lock Ink (#0b1005) on a lime fill.
- **Do** give a Frame control's resting ticks the Faint colour (#7e8aa3) so its boundary is visible before hover.
- **Do** set hierarchy with Archivo's width axis: 125% display, 116% headline, 108% title and label, normal width for reading text.
- **Do** separate entries with a 1px Line rule and generous space, and cap reading text at 68ch.
- **Do** keep every interactive target at least 2.75rem tall and keep the 2px lime focus outline.
- **Do** make every diagram a true picture of something in the content, drawn in the system's tokens, with lime only on its locked target.
- **Do** keep the page complete when WebGL is missing and when motion is reduced: the static network drawing and the final state of every animation must stand on their own.
- **Do** keep tertiary text at Faint or brighter; Strong Line and Line are for strokes.

### Don't:
- **Don't** round a corner. No border radius on any container, control, chip, or focus ring.
- **Don't** add box shadows, glows, blur, or glass panels. Depth is a lightness step of ink or a frame.
- **Don't** use lime as a resting fill, a heading colour, or decoration.
- **Don't** fill a control or a surface with Signal Blue; blue is for data marks.
- **Don't** set prose, headings, or button labels in mono.
- **Don't** wrap ordinary content in a tinted panel; panels are for figures and fact sheets.
- **Don't** put a small label above a section headline. Headlines stand alone.
- **Don't** bounce, spin, or loop. Motion eases out exponentially, plays once, and rests.
- **Don't** introduce a second sans family, a neutral grey, pure black, or pure white.
