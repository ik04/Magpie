console.log("Background service worker loaded");

// Listen for when a tab is updated (navigates, reloads, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("youtube.com/watch")
  ) {
    try {
      const queryParams = tab.url.split("?")[1];
      const urlParams = new URLSearchParams(queryParams);
      const videoId = urlParams.get("v");
      console.log(urlParams);

      if (videoId) {
        chrome.tabs.sendMessage(tabId, {
          type: "NEW",
          videoId: videoId,
        });
      }
    } catch (err) {
      console.error("Error parsing YouTube URL:", err);
    }
  }
});
