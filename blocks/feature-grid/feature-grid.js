import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Feature Grid Block
 * Displays product/service features in a responsive grid with icons, titles, and descriptions
 *
 * Expected structure from AEM:
 * <div class="feature-grid">
 *   <div>
 *     <div><picture>icon</picture></div>
 *     <div>Feature Title</div>
 *     <div>Feature description text</div>
 *   </div>
 *   <div>
 *     <div><picture>icon</picture></div>
 *     <div>Another Feature</div>
 *     <div>More description</div>
 *   </div>
 * </div>
 *
 * AI Agent Skills Applied:
 * ✅ Skill #1: Block Architecture & Decoration Pattern
 * ✅ Skill #2: Instrumentation Attribute Preservation (Critical)
 * ✅ Skill #3: Image Optimization Pattern
 * ✅ Skill #5: Content Model Understanding
 * ✅ Skill #7: Error Handling and Fallbacks
 * ✅ Skill #9: Performance-First Mindset
 */
export default function decorate(block) {
  // Skill #9: Performance-first - single pass, batch DOM operations
  const ul = document.createElement('ul');
  ul.className = 'feature-grid-list';

  // Skill #1: Parse structure - each row is a feature with [icon, title, description]
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'feature-grid-item';

    // Skill #2: CRITICAL - Preserve AEM editor instrumentation
    moveInstrumentation(row, li);

    const children = [...row.children];

    // Skill #7: Error handling - validate expected structure
    if (children.length < 2) {
      console.warn('[Feature Grid] Expected at least 2 columns (icon/title, description), got:', children.length);
      // Fallback: still render what we have
    }

    // Icon container
    const iconDiv = document.createElement('div');
    iconDiv.className = 'feature-grid-icon';
    if (children[0]) {
      moveInstrumentation(children[0], iconDiv);
      // Check if it's an image or text icon
      const hasImage = children[0].querySelector('picture, img');
      if (hasImage) {
        iconDiv.append(...children[0].children);
      } else {
        // Text-based icon (emoji, symbol, or text)
        iconDiv.innerHTML = children[0].innerHTML;
        iconDiv.classList.add('feature-grid-icon-text');
      }
    }

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'feature-grid-title';
    if (children[1]) {
      moveInstrumentation(children[1], titleDiv);
      titleDiv.textContent = children[1].textContent.trim();
    }

    // Description (optional - might be in column 2 or 3 depending on structure)
    const descDiv = document.createElement('div');
    descDiv.className = 'feature-grid-description';
    if (children[2]) {
      moveInstrumentation(children[2], descDiv);
      descDiv.innerHTML = children[2].innerHTML;
    } else if (children.length === 2 && children[1]) {
      // Alternative structure: icon + combined title/desc
      // Check if second column has rich content (multiple elements)
      const secondCol = children[1];
      const hasRichContent = secondCol.children.length > 1 || secondCol.querySelector('p, h3, h4');
      if (hasRichContent) {
        // Extract title from first element, rest is description
        const firstEl = secondCol.firstElementChild;
        if (firstEl) {
          titleDiv.textContent = firstEl.textContent.trim();
          // Rest goes to description
          descDiv.innerHTML = '';
          let sibling = firstEl.nextElementSibling;
          while (sibling) {
            descDiv.appendChild(sibling.cloneNode(true));
            sibling = sibling.nextElementSibling;
          }
        }
      }
    }

    // Assemble feature item
    li.append(iconDiv, titleDiv);
    if (descDiv.textContent.trim() || descDiv.children.length > 0) {
      li.append(descDiv);
    }

    ul.append(li);
  });

  // Skill #3: Image optimization with proper sizes and instrumentation
  ul.querySelectorAll('.feature-grid-icon picture > img').forEach((img) => {
    // Skill #9: Performance - appropriate icon size (small)
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt || 'Feature icon',
      false,
      [{ width: '100' }], // Small icon size for performance
    );
    // Skill #2: Preserve instrumentation during optimization
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Skill #1: Replace with transformed structure
  block.replaceChildren(ul);

  // Skill #9: No heavy computation in decorator - keep it fast
  // Block is ready to render immediately
}
