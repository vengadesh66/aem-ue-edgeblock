export default function decorate(block) {
  // Load widget bundle once
  if (!window.countdownTimerWidgetLoaded) {
    const script = document.createElement('script');
    // Use commit hash or timestamp for cache busting: increment v=2, v=3, etc. on updates
    script.src = 'https://cdn.jsdelivr.net/gh/vengadesh66/preactwidgets@main/countdown/app.js?v=2';
    script.async = true;
    document.head.appendChild(script);
    window.countdownTimerWidgetLoaded = true;
  }

  // Get configuration from block content
  let targetDate = '';
  let title = 'Countdown';
  let expiredMessage = 'Event has started!';

  // Parse block content (rows: target-date, title, expired-message)
  const rows = [...block.children];
  if (rows[0]) {
    targetDate = rows[0].textContent.trim();
  }
  if (rows[1]) {
    const titleText = rows[1].textContent.trim();
    if (titleText) title = titleText;
  }
  if (rows[2]) {
    const messageText = rows[2].textContent.trim();
    if (messageText) expiredMessage = messageText;
  }

  // Clean block
  block.innerHTML = '';

  // Inject widget
  const widget = document.createElement('countdown-timer-widget');
  if (targetDate) {
    widget.setAttribute('target-date', targetDate);
  }
  widget.setAttribute('title', title);
  widget.setAttribute('expired-message', expiredMessage);

  // Add Universal Editor instrumentation
  widget.setAttribute('data-aue-resource', 'urn:aemconnection:/content/countdown-timer');
  widget.setAttribute('data-aue-type', 'component');
  widget.setAttribute('data-aue-label', 'Countdown Timer Widget');

  block.appendChild(widget);

  // Listen for countdown-expired event
  widget.addEventListener('countdown-expired', () => {
    console.log('[Countdown Timer Block] Countdown expired!');
    // You can add custom expiry handling here (e.g., confetti, redirect, show message)
  });
}
