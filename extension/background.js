// Create a context menu item
chrome.contextMenus.create({
  id: 'ask-chatgpt',
  title: 'Ask ChatGPT',
  contexts: ['all'],
});

chrome.contextMenus.create({
  id: 'summarize-chatgpt',
  title: 'Summarize with ChatGPT',
  contexts: ['all'],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'ask-chatgpt':
      chrome.tabs.sendMessage(tab.id, { type: 'ASK_CHATGPT' });
      break;
    case 'summarize-chatgpt':
      chrome.tabs.sendMessage(tab.id, { type: 'SUMMARIZE_CHATGPT' });
      break;
  }
});
