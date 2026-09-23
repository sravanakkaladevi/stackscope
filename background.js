// Background Service Worker for StackScope Extension Badge Updates

function updateBadge(tabId, count) {
  if (!tabId) return;

  if (count && count > 0) {
    const text = String(count);
    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#6366F1", tabId });
    if (chrome.action.setBadgeTextColor) {
      chrome.action.setBadgeTextColor({ color: "#FFFFFF", tabId });
    }
  } else {
    chrome.action.setBadgeText({ text: "", tabId });
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "update-badge") {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId) {
      updateBadge(tabId, message.count);
    }
  }
  return true;
});

// Clear badge on tab replacement/removal
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: "", tabId });
});
