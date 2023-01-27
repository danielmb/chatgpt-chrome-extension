// Create a context menu item
// chrome.contextMenus.create({
//   id: 'ask-chatgpt',
//   title: 'Ask ChatGPT',
//   contexts: ['all'],
// });

// chrome.contextMenus.create({
//   id: 'summarize-chatgpt',
//   title: 'Summarize with ChatGPT',
//   contexts: ['all'],
// });

// chrome.contextMenus.create({
//   id: 'transelate-to-swedishchef',
//   title: 'Translate to SwedishChef',
//   contexts: ['all'],
// });

// import messageTypes from './messageTypes.js';
console.log('Loading context menus');
import { messageTypes } from './lib/messageTypes.js';
for (let messageType of messageTypes) {
  chrome.contextMenus.create({
    id: messageType.type,
    title: messageType.text,
    contexts: ['all'],
  });
}
console.log('Loaded context menus');
// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // switch (info.menuItemId) {
  //   case 'ask-chatgpt':
  //     chrome.tabs.sendMessage(tab.id, { type: 'ASK_CHATGPT' });
  //     break;
  //   case 'summarize-chatgpt':
  //     chrome.tabs.sendMessage(tab.id, { type: 'SUMMARIZE_CHATGPT' });
  //     break;
  //   case 'transelate-to-swedishchef':
  //     chrome.tabs.sendMessage(tab.id, { type: 'TRANSLATE_TO_SWEDISHCHEF' });
  // }
  let messageType = messageTypes.find((type) => type.type === info.menuItemId);
  if (!messageType) {
    alert('Invalid message type');
    return;
  }
  try {
    chrome.tabs.sendMessage(tab.id, {
      type: messageType.type,
    });
  } catch (error) {
    console.error(error);
    alert('Error sending message');
  }
});
