/** @type {Array<{type: string, text: string, contextMenuId: string, template: (input: string) => string}>} */
export let messageTypes = [
  {
    type: 'ASK_CHATGPT',
    text: 'Ask ChatGPT',
    template: (input) => {
      return input;
    },
  },
  {
    type: 'SUMMARIZE_CHATGPT',
    text: 'Summarize ChatGPT',
    template: (input) => {
      return `Summarize this: ${input}`;
    },
  },
  {
    type: 'TRANSLATE_TO_SWEDISHCHEF',
    text: 'Translate to Swedish Chef',

    template: (input) => {
      return `Translate this text to swedish chef accent ${input}`;
    },
  },
];
