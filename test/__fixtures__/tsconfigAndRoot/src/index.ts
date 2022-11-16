import LOG from '@utils/logger';

export default function hello(): string {
  const msg = process.env?.secret
    ? `Hellooooooo, ${process.env.secret}`
    : 'Hello world!';

  LOG.info(msg);

  return msg;
}
