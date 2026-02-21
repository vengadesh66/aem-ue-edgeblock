    
export default function decorate(block) {
  // Load widget bundle once
  if (!window.__signupWidgetLoaded) {
    const script = document.createElement('script');
    // Use @latest to get the newest version, with cache-bust query param
    script.src = "https://cdn.jsdelivr.net/gh/vengadesh66/preactwidgets@main/signup/app.js?v=" + Date.now();
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

  // Strip .html extension if present (UE sometimes adds it)
  contentPath = contentPath.replace(/\.html$/, '');

  // Clean block
  block.innerHTML = '';

  // Build UE resource URN for Content Fragment authoring
  const cfResourcePath = contentPath.startsWith('/content/dam')
    ? contentPath
    : `/content/dam${contentPath.startsWith('/') ? '' : '/'}${contentPath}`;
  const aueResource = `urn:aemconnection:${cfResourcePath}/jcr:content/data/master`;

  // Inject widget with UE instrumentation on the outer element
  const widget = document.createElement('signup-widget');
  widget.setAttribute('content-path', contentPath);
  widget.setAttribute(
    'aem-author',
    'https://author-p120465-e1171116.adobeaemcloud.com'
  );

  // UE instrumentation - allows editing CF via properties panel
  widget.setAttribute('data-aue-resource', aueResource);
  widget.setAttribute('data-aue-type', 'reference');
  widget.setAttribute('data-aue-filter', 'cf');
  widget.setAttribute('data-aue-label', 'Signup Widget');

  block.appendChild(widget);
}
