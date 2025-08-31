import { getCurrentTab } from "./utils.js";
// adding a new bookmark row to the popup
const addNewBookmark = (bookmarkElement, bookmark) => {
  const bookmarkTitle = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitle.textContent = bookmark.desc;
  bookmarkTitle.className = "bookmark-title";

  controlsElement.className = "bookmarks-controls";

  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.appendChild(bookmarkTitle);
  newBookmarkElement.appendChild(controlsElement);
  bookmarkElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentVideoBookmarks = []) => {
  const bookmarkElement = document.getElementById("bookmarks");
  bookmarkElement.innerHTML = "";
  if (currentVideoBookmarks.length > 0) {
    currentVideoBookmarks.forEach((bookmark) => {
      addNewBookmark(bookmarkElement, bookmark);
    });
  } else {
    bookmarkElement.innerHTML = '<i class="row">No Bookmarks</i>';
  }
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTab();
  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTab();
  const elementToDelete = document.getElementById(`bookmark-${bookmarkTime}`);
  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("popup loaded");

  const activeTab = await getCurrentTab();
  const queryParams = activeTab.url.split("?")[1];
  const urlParams = new URLSearchParams(queryParams);

  const currentVideo = urlParams.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a YT page</div>';
  }
});
