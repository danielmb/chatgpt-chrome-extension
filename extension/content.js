// Listen for messages from the background script
/** @param {string} data */
let sendData = async (data) => {
  let response = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: data }),
  });
  let json = await response.json();
  return json;
};
/** @param {string} text
 * @param {HTMLElement} activeElement
 * @returns {void} */

let insertText = (text, activeElement) => {
  if (
    activeElement.nodeName.toUpperCase() === 'TEXTAREA' ||
    activeElement.nodeName.toUpperCase() === 'INPUT'
  ) {
    // Insert after selection
    activeElement.value =
      activeElement.value.slice(0, activeElement.selectionEnd) +
      `\n\n${text}` +
      activeElement.value.slice(
        activeElement.selectionEnd,
        activeElement.length,
      );
  } else {
    // Special handling for contenteditable
    const replyNode = document.createTextNode(`\n\n${text}`);
    const selection = window.getSelection();

    if (selection.rangeCount === 0) {
      selection.addRange(document.createRange());
      selection.getRangeAt(0).collapse(activeElement, 1);
    }

    const range = selection.getRangeAt(0);
    range.collapse(false);

    // Insert reply
    range.insertNode(replyNode);

    // Move the cursor to the end
    selection.collapse(replyNode, replyNode.length);
  }
};
/** @returns {{selectedText: string | undefined, originalActiveElement: HTMLElement | undefined}} */
let getTextAndOriginalActiveElement = () => {
  let originalActiveElement;
  let selectedText;
  if (
    document.activeElement &&
    (document.activeElement.isContentEditable ||
      document.activeElement.nodeName.toUpperCase() === 'TEXTAREA' ||
      document.activeElement.nodeName.toUpperCase() === 'INPUT')
  ) {
    // Set as original for later
    originalActiveElement = document.activeElement;
    // Use selected text or all text in the input
    selectedText =
      document.getSelection().toString().trim() ||
      document.activeElement.textContent.trim();
  } else {
    // If no active text input use any selected text on page
    selectedText = document.getSelection().toString().trim();
  }
  return {
    selectedText,
    originalActiveElement,
  };
};

/** @type {Array<{type: string, template: (input: string) => string}>} */
let messageTypes = [
  {
    type: 'ASK_CHATGPT',
    template: (input) => {
      return input;
    },
  },
  {
    type: 'SUMMARIZE_CHATGPT',
    template: (input) => {
      return `Summarize this: ${input}`;
    },
  },
];
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  let messageType = messageTypes.find((type) => type.type === message.type);
  if (!messageType) {
    alert('Invalid message type');
    return;
  }
  let { selectedText, originalActiveElement } =
    getTextAndOriginalActiveElement();

  // If there's an active text input

  if (!selectedText) {
    // eslint-disable-next-line max-len

    return window.alert(
      `No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text.`,
    );
  }

  showLoadingCursor();

  // Send the text to the API endpoint

  let data;
  try {
    data = await sendData(messageType.template(selectedText));
  } catch (_error) {
    alert(
      "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000.",
    );
    restoreCursor();
    return;
  }
  // Use original text element and fallback to current active text element
  const activeElement =
    originalActiveElement ||
    (document.activeElement.isContentEditable && document.activeElement);
  if (activeElement) {
    insertText(data.reply, activeElement);
  } else {
    // Alert reply since no active text area
    alert(`ChatGPT says: ${data.reply}`);
  }

  restoreCursor();
});
/** @return {void} */
const showLoadingCursor = () => {
  const style = document.createElement('style');
  style.id = 'cursor_wait';
  style.innerHTML = `* {cursor: wait;}`;
  document.head.insertBefore(style, null);
};
/**  @return {void} */
const restoreCursor = () => {
  document.getElementById('cursor_wait').remove();
};
