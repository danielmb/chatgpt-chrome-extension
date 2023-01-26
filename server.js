import dotenv from 'dotenv-safe';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChatGPTAPIBrowser } from 'chatgpt';
import { oraPromise } from 'ora';
import config from './config.js';

const app = express().use(cors()).use(bodyParser.json());

const gptApi = new ChatGPTAPIBrowser({
  email: process.env.OPENAI_EMAIL,
  password: process.env.OPENAI_PASSWORD,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  isMicrosoftLogin: true,
});

await gptApi.initSession();

const Config = configure(config);
/** @class Conversation */
class Conversation {
  /** @type {string | null} */
  conversationId = null;
  /** @type {string | null} */
  parentMessageId = null;

  constructor() {}
  /**
   *
   * @param {string} msg
   * @returns {Promise<string>}
   */
  async sendMessage(msg) {
    const res = await gptApi.sendMessage(
      msg,
      this.conversationId && this.parentMessageId
        ? {
            conversationId: this.conversationId,
            parentMessageId: this.parentMessageId,
          }
        : {}
    );
    if (res.conversationId) {
      this.conversationId = res.conversationId;
    }
    if (res.parentMessageID) {
      this.parentMessageId = res.parentMessageId;
    }
    console.log(this);
    if (!res.response) throw new Error('No response');
    return res.response;
  }
}

const conversation = new Conversation();

app.post('/', async (req, res) => {
  try {
    const rawReply = await oraPromise(
      conversation.sendMessage(req.body.message),
      {
        text: req.body.message,
      }
    );
    const reply = await Config.parse(rawReply);
    console.log(`----------\n${reply}\n----------`);
    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

const EnsureAuth = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (gptApi.getIsAuthenticated()) resolve();
    else reject();
  }, 300);
});

/** @return {Promise<void>} */
async function start() {
  await oraPromise(EnsureAuth, { text: 'Connecting to ChatGPT' });
  await oraPromise(Config.train(), {
    text: `Training ChatGPT with (${Config.rules.join('\n')} )`,
  });
  await oraPromise(
    new Promise((resolve) => app.listen(3000, () => resolve())),
    {
      text: `You may now use the extension`,
    }
  );
}

/**
 * @param {import('./config').Config} config
 * @return {
 *  {
 *   train: () => Promise<void>,
 *  parse: (reply: string) => Promise<string>,
 *  rules: string[],
 * ...import('./config').Config
 * }
 */
function configure({ plugins, ...opts }) {
  /** @type {string[]} */
  let rules = [];
  /** @type {((reply: string) => Promise<string>)[]} */
  let parsers = [];

  // Collect rules and parsers from all plugins
  for (const plugin of plugins) {
    if (plugin.rules) {
      rules = rules.concat(plugin.rules);
    }
    if (plugin.parse) {
      parsers.push(plugin.parse);
    }
  }

  // Send ChatGPT a training message that includes all plugin rules
  /**
   *
   * @returns {Promise<string>}
   */
  const train = () => {
    if (!rules.length) return;

    const message = `
      Please follow these rules when replying to me:
      ${rules.map((rule) => `\n- ${rule}`)}
    `;
    return conversation.sendMessage(message);
  };

  // Run the ChatGPT response through all plugin parsers
  /**
   * @param {string} reply
   * @returns {Promise<string>}
   * */
  const parse = async (reply) => {
    for (const parser of parsers) {
      reply = await parser(reply);
    }
    return reply;
  };
  return { train, parse, rules, ...opts };
}

start();
