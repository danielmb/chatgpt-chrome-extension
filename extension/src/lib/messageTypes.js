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
    type: 'REPHRASE_CHATGPT',
    text: 'Rephrase ChatGPT',
    template: (input) => {
      return `Rephrase this: ${input}`;
    },
  },
  {
    type: 'DETECT_LANGUAGE_CHATGPT',
    text: 'Detect Language ChatGPT',
    template: (input) => {
      return `What is the language here?: ${input}`;
    },
  },
  {
    type: 'KEYWORDS_CHATGPT',
    text: 'Keywords ChatGPT',
    template: (input) => {
      return `What are the keywords here?: ${input}`;
    },
  },
  {
    type: 'CHATGPT_WRITE_IN_HERMAN_MELVILLE_STYLE',
    text: 'Write in Herman Melville style',
    template: (input) => {
      return `Write this in the style of Herman Melville: ${input}`;
    },
  },
  {
    type: 'WRITE_IN_STYLE_OF_A_5YEAR_OLD',
    text: 'Write in style of a 5 year old',
    template: (input) => {
      return `Write this in the style of a 5 year old: ${input}`;
    },
  },
];
