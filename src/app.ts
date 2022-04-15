import Docker from 'dockerode';
import TelegramClient from './telegram';
// @ts-ignore
import * as JSONStream from 'JSONStream';
import getTemplate from './templates';

const {ONLY_WHITELIST} = process.env;
const docker = new Docker();
const telegram = new TelegramClient();

export type TEvent = {
  Type: string; Action: string; Actor: {
    ID: string;
    Attributes: { [x: string]: any; };
  };
}

async function sendEvent(event: TEvent) {
  // console.debug(event);
  const template = getTemplate(event)
  if (template) {
    const label = event.Actor && event.Actor.Attributes && event.Actor.Attributes['telegram-notifier.monitor'];
    const shouldMonitor = label === undefined ? undefined : label.toLowerCase().trim() !== 'false';
    if (shouldMonitor || !ONLY_WHITELIST && shouldMonitor !== false) {
      const attachment = template(event);
      console.log(attachment, "\n");
      await telegram.send(attachment)
    }
  }
}

async function sendEventStream() {
  const eventStream = await docker.getEvents();
  eventStream.pipe(JSONStream.parse())
    .on('data', (event: TEvent) => sendEvent(event).catch(handleError))
    .on('error', handleError);
}

async function sendVersion() {
  const version = await docker.version();
  let text = `Connected to docker ${version.Version}`;
  console.log(text, "\n");
  await telegram.send(text);
}

async function main() {
  await sendVersion();
  await sendEventStream();
}

async function healthcheck() {
  try {
    await docker.version();
  } catch (e) {
    console.error(e);
    console.error("Docker is unavailable");
    process.exit(101);
  }
  
  try {
    console.log(await telegram.check());
  } catch (e) {
    console.error(e);
    console.error("Telegram API is unavailable");
    process.exit(102);
  }
  
  console.log("OK");
  process.exit(0);
}

function handleError(e: Error) {
  console.error(e);
  telegram.sendError(e).catch(console.error);
}

if (process.argv.includes("healthcheck")) {
  healthcheck();
} else {
  main().catch(handleError);
}
