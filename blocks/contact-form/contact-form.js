export default function decorate(block) {
  // Load widget bundle once
  if (!window.contactFormWidgetLoaded) {
    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/gh/vengadesh66/preactwidgets@main/contact-form/app.js?v=${Date.now()}`;
    script.async = true;
    document.head.appendChild(script);
    window.contactFormWidgetLoaded = true;
  }

  // Get configuration from block content
  let title = 'Contact Us';
  let submitEndpoint = '/api/contact';

  // Parse block content (rows: title, endpoint)
  const rows = [...block.children];
  if (rows[0]) {
    const titleText = rows[0].textContent.trim();
    if (titleText) title = titleText;
  }
  if (rows[1]) {
    const endpointText = rows[1].textContent.trim();
    if (endpointText) submitEndpoint = endpointText;
  }

  // Clean block
  block.innerHTML = '';

  // Inject widget
  const widget = document.createElement('contact-form-widget');
  widget.setAttribute('title', title);
  widget.setAttribute('submit-endpoint', submitEndpoint);

  // Add Universal Editor instrumentation
  widget.setAttribute('data-aue-resource', 'urn:aemconnection:/content/contact-form');
  widget.setAttribute('data-aue-type', 'component');
  widget.setAttribute('data-aue-label', 'Contact Form Widget');

  block.appendChild(widget);

  // Listen for custom events
  widget.addEventListener('contact-success', (event) => {
    console.log('[Contact Form Block] Form submitted successfully:', event.detail);
    // You can add custom success handling here (e.g., redirect, show message)
  });

  widget.addEventListener('contact-error', (event) => {
    console.error('[Contact Form Block] Form submission failed:', event.detail);
    // You can add custom error handling here
  });
}
