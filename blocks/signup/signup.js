export default function decorate(block) {
  // load app bundle if not already
  if (!window.__signupWidgetLoaded) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/vengadesh66/preactwidgets/signup/app.js";
    script.async = true;
    document.head.appendChild(script);
    window.__signupWidgetLoaded = true;
  }

  // read block’s data (content-path row)
  let contentPath = "";
  [...block.children].forEach((row) => {
    const t = row.textContent.trim();
    if (t.startsWith("content-path:")) {
      contentPath = t.replace("content-path:", "").trim();
    }
  });

  // clear the block and insert the widget
  block.innerHTML = "";
  const widget = document.createElement("signup-widget");
  widget.setAttribute("content-path", contentPath);
  widget.setAttribute(
    "aem-author",
    "https://author-p120465-e1171116.adobeaemcloud.com"
  );
  block.appendChild(widget);
}
