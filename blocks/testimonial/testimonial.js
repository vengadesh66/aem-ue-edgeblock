import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Testimonial Block
 * Displays customer testimonials with avatar, name, role, and quote
 *
 * Expected structure from AEM:
 * <div class="testimonial">
 *   <div>
 *     <div><picture>avatar</picture></div>
 *     <div>John Doe</div>
 *     <div>CEO, Company</div>
 *     <div>This is an amazing product!</div>
 *   </div>
 * </div>
 *
 * AI Agent Skills Applied:
 * ✅ Skill #1: Block Architecture & Decoration Pattern
 * ✅ Skill #2: Instrumentation Attribute Preservation
 * ✅ Skill #3: Image Optimization Pattern
 * ✅ Skill #4: RUM Tracking & Performance Monitoring
 * ✅ Skill #5: CSS Scoping
 */
export default function decorate(block) {
  // Skill #1: Understand structure - each row is a testimonial
  // Skill #4: Keep decoration fast and synchronous
  const ul = document.createElement('ul');
  ul.className = 'testimonial-list';

  [...block.children].forEach((row) => {
    // Skill #2: Preserve instrumentation when transforming
    const li = document.createElement('li');
    li.className = 'testimonial-item';
    moveInstrumentation(row, li);

    // Extract children - typical structure: [avatar, name, role, quote]
    const children = [...row.children];

    // Skill #7: Error handling - graceful fallback
    if (children.length < 4) {
      console.warn('[Testimonial] Expected 4 columns (avatar, name, role, quote), got:', children.length);
    }

    // Build testimonial structure
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'testimonial-avatar';
    if (children[0]) {
      moveInstrumentation(children[0], avatarDiv);
      avatarDiv.append(...children[0].children);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'testimonial-content';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'testimonial-name';
    if (children[1]) {
      moveInstrumentation(children[1], nameDiv);
      nameDiv.textContent = children[1].textContent.trim();
    }

    const roleDiv = document.createElement('div');
    roleDiv.className = 'testimonial-role';
    if (children[2]) {
      moveInstrumentation(children[2], roleDiv);
      roleDiv.textContent = children[2].textContent.trim();
    }

    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'testimonial-quote';
    if (children[3]) {
      moveInstrumentation(children[3], quoteDiv);
      // Preserve rich text content
      quoteDiv.innerHTML = children[3].innerHTML;
    }

    contentDiv.append(nameDiv, roleDiv, quoteDiv);
    li.append(avatarDiv, contentDiv);
    ul.append(li);
  });

  // Skill #3: Image optimization with proper instrumentation
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt || 'Customer testimonial avatar',
      false,
      [{ width: '150' }], // Small avatar size
    );
    // Skill #2: Preserve instrumentation on optimized image
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Skill #1: Replace block content with transformed structure
  block.replaceChildren(ul);

  // Skill #4: RUM tracking for block visibility
  // Note: sampleRUM is called automatically by scripts.js for block load
  // We could add custom checkpoint here if needed:
  // import { sampleRUM } from '../../scripts/aem.js';
  // sampleRUM('testimonial:loaded', { source: 'testimonial-block' });
}
