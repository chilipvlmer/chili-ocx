---
name: frontend-philosophy
description: The 5 Pillars of Intentional UI - principles for creating distinctive, memorable interfaces
version: 1.0.1
author: kdcokenny
---

# Frontend Philosophy

## TL;DR

Five principles for UI that doesn't look like "AI slop":
1. Every Pixel is a Decision
2. Motion is Meaning
3. Typography is Voice
4. Hierarchy is Storytelling
5. Consistency is Trust

## When to Use

- Starting a new UI component or page
- Reviewing existing UI for improvements
- When something feels "off" but you can't identify why
- Before finalizing any user-facing design

## The 5 Pillars

### 1. Every Pixel is a Decision

**Core Principle**: Intentionality over convenience

**Guidelines**:
- Default is not an option. Every spacing value, color choice, and animation timing must be deliberate
- "Because the library does it this way" is not a valid reason
- Document your decisions in comments or design notes
- When in doubt, justify it. If you can't, reconsider it

**Examples**:
- ✅ `margin: 24px; /* Optical alignment with logo height */`
- ❌ `margin: 1rem; /* Bootstrap default */`
- ✅ Custom color palette derived from brand photography
- ❌ Default Tailwind gray scale

### 2. Motion is Meaning

**Core Principle**: Animation serves communication, not decoration

**Guidelines**:
- Every animation must answer: "What is this communicating?"
- Transitions should clarify state changes, not obscure them
- Timing curves should reflect physical properties (mass, velocity, friction)
- No animation is better than meaningless animation

**Examples**:
- ✅ Smooth height transition showing content expansion (communicates "more available")
- ❌ Bounce-in animation on every element (distracting, no meaning)
- ✅ Fade transition for background (communicates "context switch")
- ❌ Spinning loader on button for 50ms operation (creates perceived slowness)

**Timing Reference**:
- Micro-interactions: 100-200ms
- Content transitions: 300-500ms
- Page transitions: 400-600ms
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for natural motion

### 3. Typography is Voice

**Core Principle**: Type choices convey personality and tone

**Guidelines**:
- Your font stack is your brand voice
- Limit to 2-3 typefaces maximum (one for UI, one for content, optional accent)
- Line length should be 45-75 characters for body text
- Font weights and sizes should create clear hierarchy

**Examples**:
- ✅ Inter for UI + Merriweather for long-form content (clear functional separation)
- ❌ Using 6 different fonts because each "looks cool"
- ✅ Bold weight only for primary actions and headers
- ❌ Every third word bold for "emphasis"

### 4. Hierarchy is Storytelling

**Core Principle**: Visual hierarchy guides the user's journey

**Guidelines**:
- The page should tell a story from top to bottom, left to right
- Primary actions must be visually dominant (size, color, position)
- Related elements should be visually connected (proximity, alignment)
- Secondary information should recede, not compete

**Examples**:
- ✅ Primary CTA: full color, larger size, centered
- ✅ Secondary action: outlined style, smaller, offset
- ✅ "Cancel" link: minimal styling, lower in hierarchy
- ❌ Three equally-styled buttons with no visual priority

### 5. Consistency is Trust

**Core Principle**: Patterns build user confidence

**Guidelines**:
- Establish a design system and follow it religiously
- Inconsistency signals brokenness or unprofessionalism
- Exceptions must be justified and documented
- Users should predict behavior based on previous interactions

**Examples**:
- ✅ All destructive actions use red + confirmation pattern
- ❌ Delete button styled differently on every page
- ✅ Form inputs share the same base styles across all forms
- ❌ 12 variations of input styling "for variety"

## Practical Application

### When Building a Component

1. **Define the purpose**: What is this communicating?
2. **Establish hierarchy**: What's primary, secondary, tertiary?
3. **Choose the voice**: Fonts, colors, spacing
4. **Add motion meaningfully**: What state changes need communication?
5. **Review against 5 pillars**: Is every decision intentional?

### Red Flags (Anti-patterns)

- "I'll just use the default"
- "Let's add animation to make it pop"
- "This font looks cool, let's use it"
- "I'll style this button differently because I'm bored of the pattern"
- "Users will figure it out"

## What NOT to Do

- Don't use AI-generated color palettes without human review
- Don't animate everything that moves
- Don't use more than 3 font families
- Don't make users guess which element is clickable
- Don't break established patterns without a migration plan

## Remember

The goal isn't perfection—it's **intentionality**. Every design choice should be a deliberate decision, not an accident or default. Users can feel the difference between "carefully crafted" and "generated."
