# Accessible Custom Multi-Select

A non-trivial accessible multi-select dropdown built completely from scratch with React and CSS. No Radix, MUI, Headless UI, or other component library is used.

## Features

- Custom multi-select dropdown
- Full keyboard navigation
- WAI-ARIA `listbox` / `option` semantics
- `aria-multiselectable="true"`
- `aria-activedescendant` focus management
- Arrow Up / Arrow Down navigation
- Home / End navigation
- Space to toggle the active option
- Ctrl+A / Cmd+A to select or clear all filtered options
- Escape closes the dropdown and restores focus to the trigger
- Tab exits the component naturally
- Type-ahead navigation
- Search/filter options
- Mouse and keyboard interactions share the same selection logic
- Visible focus indicators
- Responsive layout
- No component library

## Requirements

- Node.js 18+
- npm

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Production build

```bash
npm run build
```

## Keyboard controls

| Key | Action |
|---|---|
| Enter / Space | Open the dropdown from the trigger |
| Arrow Down | Move to next option |
| Arrow Up | Move to previous option |
| Home / Fn + Left arrow  | Move to first option |
| End / Fn + Right arrow | Move to last option |
| Space | Toggle active option |
| Ctrl+A / Cmd+A | Select all filtered options; repeat to clear |
| Printable characters | Type-ahead search |
| Escape | Close dropdown and return focus to trigger |
| Tab | Leave the component |

## Accessibility decisions

The component follows the WAI-ARIA listbox guidance. The listbox exposes `aria-multiselectable="true"` and each option exposes `aria-selected`. Keyboard focus remains on the listbox while the visually active option is represented with `aria-activedescendant`.

This keeps DOM focus management predictable while allowing the active option to change through keyboard navigation.

References:

- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- MDN keyboard-accessible JavaScript widgets: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets

## Project structure

```text
accessible-multi-select/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── MultiSelect.jsx
    └── styles.css
```

## Technical-task submission

Recommended submission:

1. Push this project to a GitHub repository.
2. Add the repository URL to the recruitment portal.
3. Record a short walkthrough showing:
   - opening the dropdown
   - keyboard navigation
   - multi-selection
   - search/filtering
   - Ctrl/Cmd+A
   - Escape restoring focus
   - the accessibility/ARIA implementation
4. Mention that the component was implemented without a UI/component library.
