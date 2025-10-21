# Design Guidelines: Test Político Argentino

## Design Approach
**Selected Framework:** Material Design with Quiz Platform Patterns
**Rationale:** This is a utility-focused, information-dense application where clarity and usability are paramount. We'll draw inspiration from successful quiz platforms (Political Compass, 8values, BuzzFeed quizzes) while maintaining a clean, professional aesthetic appropriate for political content.

## Core Design Principles
1. **Clarity First:** Every question and option must be immediately readable
2. **Trust & Authority:** Design should feel credible for political content
3. **Mobile-Optimized:** Quiz will likely be shared on social media
4. **Minimal Distraction:** No competing visual elements during test-taking

## Color Palette

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary (CTAs): 220 90% 56% (professional blue)
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%
- Border: 220 13% 91%

**Dark Mode:**
- Background: 220 18% 12%
- Surface: 220 15% 16%
- Primary (CTAs): 220 90% 60%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 70%
- Border: 220 15% 25%

**Option Buttons:**
- Unselected: Surface color with subtle border
- Selected: Primary color with white text
- Hover: Subtle background shift (surface + 3% lightness)

## Typography

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - Clean, highly legible
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Hierarchy:**
- H1 (Landing title): text-4xl md:text-5xl font-bold
- H2 (Section headers): text-2xl md:text-3xl font-semibold
- H3 (Results title): text-xl font-semibold
- Question text: text-lg md:text-xl font-medium
- Body text: text-base
- Small text (progress, descriptions): text-sm

## Layout System

**Spacing Scale:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Common pattern: p-6 md:p-8 for cards, gap-4 for buttons, mb-8 for sections

**Container Strategy:**
- Max width: max-w-2xl (optimal for reading questions)
- All content centered: mx-auto
- Padding: px-4 md:px-6 (breathing room on mobile)
- Vertical spacing: py-8 md:py-12 between major sections

## Component Library

### Landing Page
- **Hero Section:** py-20 md:py-32, centered layout
  - Title in H1 with mb-6
  - Subtitle/description in text-lg text-secondary mb-8
  - Large CTA button: px-8 py-4 text-lg rounded-lg
- **Card Container:** bg-surface rounded-xl shadow-lg p-8
- **No hero image:** Keep focus on text and CTA

### Question Interface
- **Card Layout:** bg-surface rounded-xl shadow-md p-6 md:p-8
- **Progress Indicator:** Horizontal bar showing "Pregunta X de 10" at top with visual progress bar (h-1 rounded-full)
- **Question Display:** 
  - Question number as badge (text-sm)
  - Question text prominent (text-lg md:text-xl) with mb-6
- **Option Buttons:**
  - Full width on mobile, stacked vertically
  - 3 buttons with gap-3
  - Height: py-4, padding: px-6
  - Border: 2px solid for clear interaction
  - Rounded: rounded-lg
  - Text: text-base font-medium, centered

### Results Page
- **Results Card:** bg-surface rounded-xl shadow-lg p-8 md:p-10
- **Dominant Current:**
  - Title with icon/badge indicator
  - Description in well-spaced paragraphs (mb-4 between)
  - Clear visual separation from percentages (border-t mt-8 pt-8)
- **Percentage Breakdown:**
  - List format with gap-3
  - Each item: Flex row justify-between
  - Current name on left (font-medium)
  - Percentage on right (font-semibold)
  - Subtle dividers between items
- **Action Buttons:**
  - Two-button layout (flex gap-4)
  - "Compartir Resultado" (primary color, filled)
  - "Reiniciar Test" (outline variant)
  - Both: px-6 py-3 rounded-lg

### Navigation
- **Minimal header:** Simple logo/title area, no complex nav
- **Footer:** Copyright and minimal links if needed, py-6 text-sm text-secondary

## Interaction Patterns

### Question Progression
1. Fade-in animation for each new question (duration-200 ease-in)
2. Selected option highlights immediately
3. "Siguiente" button appears below options after selection
4. Smooth transition to next question

### Button States
- **Unselected:** border-2 border-border bg-transparent
- **Selected:** bg-primary text-white border-primary
- **Hover:** subtle scale (scale-[1.02]) and shadow increase
- **Disabled:** opacity-50 cursor-not-allowed

### Mobile Responsiveness
- Stack all buttons vertically on mobile
- Reduce padding on small screens (p-4 vs p-8)
- Ensure touch targets minimum 44px height
- Text size adjustments via md: breakpoint

## Accessibility
- Maintain consistent dark mode with proper contrast ratios (WCAG AA)
- Focus states: ring-2 ring-primary ring-offset-2
- Semantic HTML: proper heading hierarchy
- Keyboard navigation fully supported
- ARIA labels for progress and current question

## Images
**No images required** - This is a text-focused quiz application where clarity and speed are prioritized. The design relies on strong typography, spacing, and minimal UI elements to create a professional, distraction-free experience.

## Key Visual Details
- **Shadows:** Use sparingly - shadow-md for cards, shadow-lg for elevated states
- **Borders:** Consistent 2px borders for interactive elements
- **Rounded corners:** rounded-lg (8px) for buttons/cards, rounded-full for progress bars
- **Transitions:** Fast and subtle (duration-200) - avoid slow animations
- **White space:** Generous spacing between questions and options for scannability