# DESIGN SYSTEM — RightToBeForgotten

> Version 0.1.0 · User Vault + Service Provider

---

## 1. Philosophy

This UI is not a dashboard. It is a **vault** — a place where consequential, irreversible decisions are made about cryptographic identity and personal data. Every design decision should reinforce one feeling: **controlled gravity**. The user should feel capable and serious, not delighted or entertained.

Design principles in order of priority:

1. **Typography first** — layout is built from type, not containers. If something can be communicated with a line of text at the right size and weight, no box is needed.
2. **Horizontal rules only** — the only structural borders are `1px` horizontal lines. No cards, no panels, no rounded containers unless functionally necessary (e.g. input fields).
3. **Restraint over decoration** — no gradients, no shadows, no glow, no icons used decoratively. Every visual element must earn its presence.
4. **Danger reads danger** — irreversible actions (Revoke) are communicated through color and copy, not just labels. Red is reserved exclusively for destructive states.
5. **Monospace for machine, Syne for human** — the system speaks in `JetBrains Mono`, the user speaks in `Syne`. This split is consistent everywhere.

---

## 2. Color

### Base Palette

| Token       | Value                    | Usage                                        |
| ----------- | ------------------------ | -------------------------------------------- |
| `--bg`      | `#070707`                | Page background — near-black, not pure black |
| `--w100`    | `#ffffff`                | Primary text, active titles, white buttons   |
| `--w60`     | `rgba(255,255,255,0.60)` | Secondary text, footer values                |
| `--w35`     | `rgba(255,255,255,0.35)` | Body copy, descriptions, nav links           |
| `--w18`     | `rgba(255,255,255,0.18)` | Tertiary — labels, numbers, inactive state   |
| `--w08`     | `rgba(255,255,255,0.08)` | Hover backgrounds, dividers                  |
| `--line`    | `rgba(255,255,255,0.08)` | All horizontal rules and structural lines    |
| `--line-md` | `rgba(255,255,255,0.14)` | Emphasized borders (input focus, etc.)       |

### Semantic Colors

| Token | Value | Usage |
| ----- | ----- | ----- |

TokenValueUsage--bg-base#000000Latar belakang utama layar aplikasi--surface-input#1c1c1eLatar belakang area form input nomor telepon--border-default#333333Garis tepi (outline) pada form input--text-primary#ffffffJudul "Welcome!", teks input yang diketik pengguna--text-secondary#a1a1aaTeks deskripsi kecil, placeholder, link "Chat with Support"--text-inverse#000000Label teks "Log In" di dalam tombol utama--button-primary#ffffffLatar belakang tombol aksi utama ("Log In")

### Rules

- **Red is only used for destructive or error states.** Never use red as an accent or brand color.
- **Green is only used for active/live/success states.** Never use as decoration.
- **No other hues.** The palette is intentionally achromatic with two semantic exceptions. Adding blue, purple, or teal breaks the system.
- Hover states use `rgba(255,255,255,0.025)` background — barely visible. The interaction is felt, not seen.

---

## 3. Typography

### Typefaces

| Role    | Family           | Import                                                                   |
| ------- | ---------------- | ------------------------------------------------------------------------ |
| Display | `Syne`           | `https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700;800` |
| Utility | `JetBrains Mono` | `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500`   |

**Syne** — used for all human-facing content: page titles, section headings, navigation item titles, hero copy. Never used for hashes, addresses, status labels, or system data.

**JetBrains Mono** — used for all system-facing content: status labels, tags, metadata, addresses, hashes, txHash, consentId, timestamps, form labels, bottom bar, footer stats, warning banners, descriptions inside list items. Also used for all button text.

### Type Scale

| Name     | Size                     | Weight | Family | Letter-spacing | Usage                         |
| -------- | ------------------------ | ------ | ------ | -------------- | ----------------------------- |
| Hero     | `clamp(56px,9vw,96px)`   | 800    | Syne   | `-0.045em`     | Page hero h1                  |
| Title-XL | `clamp(26px,3.5vw,38px)` | 700    | Syne   | `-0.03em`      | Navigation list item titles   |
| Title-LG | `22px`                   | 700    | Syne   | `-0.025em`     | Section headers, card titles  |
| Title-MD | `16px`                   | 700    | Syne   | `-0.02em`      | Sub-section titles            |
| Mono-SM  | `11px`                   | 400    | Mono   | `0.02em`       | Body descriptions, hero desc  |
| Mono-XS  | `10px`                   | 400    | Mono   | `0.05–0.10em`  | Tags, labels, nav links, copy |
| Mono-XXS | `9px`                    | 400    | Mono   | `0.10–0.18em`  | Status bar, eyebrows, badges  |

### Rules

- **All caps text** is always Mono-XXS or Mono-XS with `letter-spacing: 0.14em` minimum.
- **No bold in monospace** except for footer values and status indicators (`font-weight: 500`).
- **Line height for mono body copy:** `1.85`. For titles: `0.90–1.05`.
- **Muted text in hero:** use `color: var(--w18)` and `font-weight: 300` on the same `h1` element — not a separate element. Creates internal contrast without needing two elements.
- **Never mix Syne and Mono in the same semantic unit.** A title is all Syne. A tag is all Mono.

---

## 4. Layout & Spacing

### Grid

- **No CSS grid for page layout.** Flexbox columns only.
- **Content max-width:** `none` — layout fills the viewport with consistent padding.
- **Horizontal padding:** `3.5rem` on all top-level sections. This is the single consistent gutter.
- **No container divs** with background color or border. Structure comes from spacing and rules only.

### Spacing Scale

| Token  | Value     | Usage                                       |
| ------ | --------- | ------------------------------------------- |
| `4px`  | `0.25rem` | Internal gaps (badge dot → text, etc.)      |
| `8px`  | `0.5rem`  | Tight internal spacing                      |
| `12px` | `0.75rem` | Between label and value in footer cells     |
| `16px` | `1rem`    | Warning padding, nav link padding           |
| `24px` | `1.5rem`  | Gap between nav links in horizontal lists   |
| `28px` | `1.75rem` | Navigation list item vertical padding       |
| `40px` | `2.5rem`  | Hero body top margin, rule margins          |
| `56px` | `3.5rem`  | Section top padding, horizontal page gutter |
| `64px` | `4rem`    | Hero top padding                            |
| `96px` | `6rem`    | Maximum hero top padding on large viewports |

### Horizontal Rules

All structural dividers are `1px solid var(--line)`. Used for:

- Nav bottom border
- Warning banner bottom border (red tinted: `rgba(255,59,59,0.15)`)
- Hero body top border (separates headline from description)
- Each navigation list item top border
- Last navigation list item bottom border
- Footer top border
- Bottom bar top border

**Never use vertical borders** except inside the bottom bar between status items (hairline, same `--line` value).

---

## 5. Components

### 5.1 Navigation Bar

```
height: 54px
padding: 0 3.5rem
border-bottom: 1px solid var(--line)
background: var(--bg)  ← not transparent, so content scrolls under it cleanly
```

- **Logo / app identifier:** Mono-XXS, `letter-spacing: 0.18em`, `color: var(--w35)`, uppercase. Format: `RTF · User Vault`
- **Nav links (desktop):** Mono-XS, `letter-spacing: 0.10em`, `color: var(--w35)`, no underline, uppercase. Hover: `color: var(--w100)`.
- **Wallet button:** Syne or Mono-XS, uppercase, `background: var(--w100)`, `color: #000`, `border-radius: 2px`, `padding: 8px 18px`. Hover: `opacity: 0.82`. When connected: show truncated address `0x1a2b…3c4d` instead, same style but `background: transparent`, `border: 1px solid var(--line-md)`, `color: var(--w60)`.

### 5.2 Warning Banner

Used when a required prerequisite is missing (no identity, wallet disconnected before a required action).

```
padding: 9px 3.5rem
border-bottom: 1px solid rgba(255,59,59,0.15)
background: rgba(255,59,59,0.09)
```

- Pulsing dot: `5px`, `background: var(--red)`, `animation: blink 1.8s ease-in-out infinite` (opacity 1 → 0.15 → 1)
- Text: Mono-XS, `color: var(--red)`, `letter-spacing: 0.05em`
- Link: same color, `text-underline-offset: 3px`
- **Only one warning banner per page.** If multiple conditions fail, show the most critical one.

### 5.3 Hero Section

```
padding: 6rem 3.5rem 0
```

**Eyebrow:**

- Mono-XXS, `letter-spacing: 0.18em`, uppercase, `color: var(--w18)`, `margin-bottom: 1.75rem`
- Format: `Right to be Forgotten · User Vault`

**H1:**

- Syne 800, `font-size: clamp(56px, 9vw, 96px)`, `letter-spacing: -0.045em`, `line-height: 0.90`
- Primary clause: `color: var(--w100)`
- Secondary/muted clause: `color: var(--w18)`, `font-weight: 300`, inline `<span class="muted">`

**Hero body** (below rule):

```
display: flex
justify-content: space-between
align-items: flex-end
margin-top: 2.5rem
padding-top: 2.5rem
border-top: 1px solid var(--line)
```

- Left: description, Mono-SM, `color: var(--w35)`, `line-height: 1.85`, `max-width: 380px`
- Right: large decorative number (`04` = number of modules), Syne 800, `font-size: 48px`, `color: var(--w18)` + label beneath in Mono-XXS

### 5.4 Navigation List

The primary navigation pattern. No cards, no boxes. Pure typographic list.

```html
<ul class="nav-list">   ← margin-top: 4rem, list-style: none
  <li class="nav-list-item">   ← border-top: 1px solid var(--line)
    <a href="#">   ← display: flex, padding: 1.75rem 3.5rem
      <span class="nl-num">   ← Mono-XXS, w18, width: 3rem
      <span class="nl-title">   ← Syne 700, Title-XL, flex: 1
      <div class="nl-meta">   ← width: 240px, text-align: right
        <span class="nl-tag">   ← Mono-XXS, uppercase, w18
        <span class="nl-desc">  ← Mono-XS, w35, line-height: 1.65
        <span class="nl-badge"> ← green dot + Mono-XXS, only if has live data
      </div>
      <span class="nl-arrow">↗  ← 22px, w18, margin-left: 2rem
    </a>
  </li>
</ul>
```

Last `<li>` gets `border-bottom: 1px solid var(--line)` as well.

**Hover state (on `<a>`):**

- Background: `rgba(255,255,255,0.025)`
- `.nl-num`: `color: var(--w35)`
- `.nl-title`: `letter-spacing: -0.01em` (subtle expansion, `transition: letter-spacing 0.2s`)
- `.nl-arrow`: `color: var(--w100)`, `transform: translate(4px, -4px)`, `transition: 0.13s`

**Destructive item (Revoke):**

- `.nl-title`: `color: var(--red)`
- `.nl-tag`: `color: rgba(255,59,59,0.60)`
- No other changes — the red communicates danger without needing extra warning elements

### 5.5 Status Badge (inline)

Used inside nav list items to show live data (e.g. active consent count).

```
display: flex
align-items: center
gap: 5px
font-family: Mono, font-size: 9px
letter-spacing: 0.10em
color: var(--green)
margin-top: 4px
```

- Dot: `4px`, `border-radius: 50%`, `background: var(--green)`
- Text: uppercase, no animation on dot (unlike warning pulse)
- **Only use for positive live states.** For errors, use `color: var(--red)` on the footer stat value instead.

### 5.6 Footer Stats Strip

A horizontal row of key system values, flush to page bottom before the fixed bar.

```
display: flex
align-items: center
padding: 1.25rem 3.5rem
border-top: 1px solid var(--line)
gap: 3rem
```

Each cell:

- Label: Mono-XXS, `letter-spacing: 0.14em`, uppercase, `color: var(--w18)`, `margin-bottom: 4px`
- Value: Mono-XS, `font-weight: 500`
  - Healthy/active → `color: var(--green)`
  - Error/missing → `color: var(--red)`
  - Neutral/unknown → `color: var(--w18)`
  - Normal → `color: var(--w60)`

Use `flex: 1` on a spacer div to push the last cell to the right.

### 5.7 Bottom Status Bar (Fixed)

```
position: fixed
bottom: 0, left: 0, right: 0
height: 32px
background: rgba(7,7,7,0.96)
backdrop-filter: blur(14px)
border-top: 1px solid var(--line)
padding: 0 3.5rem
```

Items: `display: flex`, `align-items: center`, `gap: 7px`, separated by `border-right: 1px solid var(--line)` with `padding-right: 1.5rem`, `margin-right: 1.5rem`.

- Dot: `4px` circle. Green = live/ok, Red = error/missing, Yellow = pending
- Text: Mono-XXS, `letter-spacing: 0.10em`, uppercase, `color: var(--w18)`
- Version string: `margin-left: auto`, same style

**Body must have `padding-bottom: 32px`** to prevent content hidden behind bar.

### 5.8 Form Inputs

Used in Register Consent, Revoke Consent, Identity pages.

```
width: 100%
padding: 12px 16px
background: transparent
border: 1px solid var(--line-md)
border-radius: 2px
color: var(--w100)
font-family: var(--mono)
font-size: 12px
letter-spacing: 0.04em
outline: none
transition: border-color 0.13s
```

Focus: `border-color: rgba(255,255,255,0.40)`
Error: `border-color: var(--red)`
Placeholder: `color: var(--w18)`

Labels above inputs:

- Mono-XXS, uppercase, `letter-spacing: 0.14em`, `color: var(--w18)`, `margin-bottom: 8px`

### 5.9 Buttons

**Primary (white):**

```
background: var(--w100)
color: #000
font-family: var(--mono)
font-size: 10px
font-weight: 500
letter-spacing: 0.10em
text-transform: uppercase
padding: 12px 24px
border: none
border-radius: 2px
cursor: pointer
transition: opacity 0.12s
```

Hover: `opacity: 0.82`

**Ghost:**

```
background: transparent
color: var(--w60)
border: 1px solid var(--line-md)
(same font/size/padding as primary)
```

Hover: `border-color: var(--w35)`, `color: var(--w100)`

**Destructive (Revoke confirm):**

```
background: var(--red)
color: #fff
border: none
(same font/size/padding as primary)
```

Hover: `opacity: 0.85`
Disabled: `opacity: 0.30`, `cursor: not-allowed` — used before checkbox is checked

**No border-radius above 2px on any interactive element.**

### 5.10 Checkbox (Revoke confirmation)

```
appearance: none
width: 16px, height: 16px
border: 1px solid var(--line-md)
border-radius: 1px
background: transparent
cursor: pointer
```

Checked: `background: var(--red)`, `border-color: var(--red)`, checkmark via `::after` pseudo

Label text: Mono-XS, `color: var(--w35)`. When checked: `color: var(--w100)`.

### 5.11 Transaction Loading State

While a blockchain transaction is pending:

- Button becomes disabled, text changes to `"Pending..."` with a pulsing dot before it
- Dot: `5px`, `color: var(--yellow)`, `animation: blink 1.2s ease-in-out infinite`
- Below button: Mono-XXS text `"Waiting for confirmation"`, `color: var(--w18)`
- **Do not use a spinner.** A pulsing dot is sufficient and matches the system aesthetic.

### 5.12 Success / Error States (post-transaction)

**Success:**

- Small green dot + Mono-XS text in `color: var(--green)`
- Below: txHash in Mono-XXS, `color: var(--w18)`, truncated to `0x1234…abcd`
- consentId same treatment

**Error:**

- Red dot + Mono-XS error message in `color: var(--red)`
- Below: technical reason in `color: var(--w35)` if available

**No modal overlays.** States appear inline below the submit button, not in popups.

### 5.13 Wallet Connection Gate

When a page requires a connected wallet and none is found, show a full-width inline prompt (not a modal):

```
padding: 4rem 3.5rem
text-align: left
```

- Eyebrow: Mono-XXS, `color: var(--w18)`, `"Wallet Required"`
- Heading: Syne 700, `22px`, `color: var(--w100)`, `"Connect your wallet to continue"`
- Desc: Mono-XS, `color: var(--w35)`, one line
- Button: Primary white button — `"Connect Wallet"`

---

## 6. Page-Specific Notes

### User Vault — Landing (`/`)

- Show warning banner if no identity in IndexedDB
- Hero stat number = `04` (total modules)
- Navigation list order: Dashboard → Register → Revoke → Identity
- Footer stats: Network · Identity · Consent Version · Wallet · ZK Circuit

### User Vault — Dashboard (`/dashboard`)

- Wallet gate if disconnected
- Consent list: each item is a horizontal rule-separated row (same nav-list pattern)
  - Left: truncated `consentId` in Mono-XS + `spId` below in Mono-XXS `color: var(--w18)`
  - Right: timestamp in Mono-XXS + status badge
  - Status: `ACTIVE` in green, `REVOKED` in red — all caps, Mono-XXS
- Empty state: centered Mono-XS `"No consents registered yet."` + link to `/consent`

### User Vault — Register Consent (`/consent`)

- Wallet gate
- Form: SP Address input + Passphrase input (password type)
- Below inputs: description of what happens in Mono-XXS `color: var(--w18)`
- Submit button: Primary white — `"Register Consent"`
- Flow states: idle → pending (yellow dot) → success (green, show consentId + txHash) → error (red)

### User Vault — Revoke Consent (`/revoke`)

- Wallet gate
- List of ACTIVE consents only, each as a selectable row (radio pattern without visible radio UI — selected row gets `border-left: 2px solid var(--w60)` and lighter background)
- Warning strip below list: Mono-XS in red — `"This action is permanent and cannot be undone."`
- Checkbox + label: `"I understand this action is permanent and irreversible"`
- Destructive button disabled until checkbox checked
- Flow states same as Register

### User Vault — Identity (`/identity`)

- Five tabs: `STATUS · CREATE · UNLOCK · EXPORT · IMPORT`
- Tab bar: horizontal, flush-left, each tab separated by `1px solid var(--line)`, Mono-XXS uppercase
- Active tab: `color: var(--w100)`, `border-bottom: 1px solid var(--w100)` (overrides the rule)
- Each view is full-width below the tab bar, with `padding: 2.5rem 0`

### Service Provider — Login With Privacy (`/`)

- Large textarea for pasting ZK proof JSON
- Textarea style: same as input but `min-height: 200px`, `font-size: 11px`
- Below: Ghost button `"Submit Proof"` → Primary white when valid JSON is detected
- Error: inline red text below textarea

### Service Provider — Verify Access (`/verify`)

- Show proof details: consentId + nullifier in Mono-XS rows (label/value pattern)
- Single primary button: `"Verify Access"`
- Success: `"Access Verified"` in green + link to `/access`
- Failure: `"Access Denied"` in red + explanation in `var(--w35)`

### Service Provider — Protected Content (`/access`)

- Guard check on sessionStorage — if not verified, show wallet gate equivalent with `"Verification required"`
- On success: heading `"Access Granted"` in Syne 700 + green dot
- Three privacy guarantees as a nav-list-style rows (no bullets): `userSecret never exposed · consent validity confirmed · nullifier prevents replay`
- Logout: Ghost button bottom — `"End Session"` — clears sessionStorage and redirects

---

## 7. Animation

- **Pulsing dot (warning/pending):** `opacity: 1 → 0.15 → 1`, duration `1.6–1.8s`, `ease-in-out`, `infinite`
- **Nav list hover arrow:** `transform: translate(4px, -4px)`, `transition: 0.13s`
- **Nav title letter-spacing on hover:** `letter-spacing: -0.045em → -0.01em`, `transition: 0.20s` — subtle expansion
- **Button hover:** `opacity 0.12s` only — no scale, no lift, no glow
- **No scroll animations.** No entrance animations. No page transitions.
- `@media (prefers-reduced-motion: reduce)` — all animations and transitions disabled

---

## 8. Do Not

- ❌ No border-radius above `2px` on any element except the ambient orb
- ❌ No `box-shadow` anywhere
- ❌ No gradient on interactive elements
- ❌ No icons used decoratively — if an icon is used, it must be functional and labeled
- ❌ No card components with both background color and border
- ❌ No modal/dialog/overlay — all states are inline
- ❌ No color outside the defined palette (no blue, purple, orange, teal)
- ❌ No `font-weight: 600` or `900` — use `500`, `700`, or `800` only
- ❌ No `border-radius` on inputs above `2px`
- ❌ No spinner animations — use pulsing dot instead
- ❌ No toast/snackbar notifications — inline state feedback only
