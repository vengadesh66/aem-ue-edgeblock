    
export default function decorate(block) {
  // Load widget bundle once
  if (!window.__signupWidgetLoaded) {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/vengadesh66/preactwidgets/signup/app1.js";
    script.async = true;
    document.head.appendChild(script);
    window.__signupWidgetLoaded = true;
  }

  let contentPath = '';

  // Universal Editor often outputs a link
  const anchor = block.querySelector('a[href]');
  if (anchor) {
    contentPath = anchor.getAttribute('href');
  }

  // Fallback: plain text (in case UE changes format)
  if (!contentPath) {
    contentPath = block.textContent.trim();
  }

  // Clean block
  block.innerHTML = '';

  // Inject widget
  const widget = document.createElement('signup-widget');
  widget.setAttribute('content-path', contentPath);
  widget.setAttribute(
    'aem-author',
    'https://author-p120465-e1171116.adobeaemcloud.com'
  );

  block.appendChild(widget);
}
