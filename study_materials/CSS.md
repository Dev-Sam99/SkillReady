Q: How does the CSS Box Model work, and what is the difference between `content-box` and `border-box`?
A: The **CSS Box Model** consists of four layers surrounding every HTML element: **Content ➔ Padding ➔ Border ➔ Margin**.

- **`box-sizing: content-box` (Default):** `width` applies ONLY to the content. Total element width = `width + padding-left + padding-right + border-left + border-right`. Causes layout calculations to break easily!
- **`box-sizing: border-box` (Recommended):** `width` includes content, padding, AND border. Element stays at declared width regardless of padding/border.

```css
/* Modern CSS Reset Rule */
*, *::before, *::after {
  box-sizing: border-box;
}
```
---
Q: Explain CSS Flexbox vs CSS Grid and when to use each.
A:
- **CSS Flexbox (1D Layout):** Designed for layouts in a single direction (row OR column). Ideal for navigation bars, alignment, pill buttons, centered items.
- **CSS Grid (2D Layout):** Designed for 2D layouts using rows AND columns simultaneously. Ideal for full page layouts, dashboard grid cards, complex image galleries.

```css
/* Responsive Grid layout without media queries */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```
---
Q: Explain CSS Specificity Hierarchy and how Specificity scores are calculated.
A: Specificity determines which CSS rule applies when multiple selectors match an element. Calculated as `(Inline, IDs, Classes/Attributes/Pseudo-classes, Elements)`:

1. **Inline styles (`style="..."`):** Score `(1, 0, 0, 0)`
2. **IDs (`#header`):** Score `(0, 1, 0, 0)`
3. **Classes, attributes, pseudo-classes (`.btn`, `[type="text"]`, `:hover`):** Score `(0, 0, 1, 0)`
4. **Elements & pseudo-elements (`div`, `p`, `::before`):** Score `(0, 0, 0, 1)`

*Note:* `!important` overrides normal specificity rules, but overuse leads to unmaintainable CSS.
---
Q: What are BEM naming conventions in CSS and why do they improve maintainability?
A: **BEM (Block, Element, Modifier)** provides clean namespace modularity:
- `Block`: Standalone component (`.card`)
- `Element`: Child element dependent on block (`.card__title`, `.card__button`)
- `Modifier`: Variant or state of block/element (`.card--dark`, `.card__button--disabled`)

Prevents specificity wars and style leakage in large enterprise codebases.
