const pageId = document.body.dataset.sectionPage;

if (pageId) {
  window.location.replace(`index.html?section=${encodeURIComponent(pageId)}`);
}
