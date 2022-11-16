import LOG from '@utils/logger';
import { useSpecialBanana } from '@hooks/someSpecialBanana';

export default function hello(): string {
  const msg = process.env?.secret
    ? `Hellooooooo, ${process.env.secret}`
    : 'Hello world!';

  const notReactHookBanana = useSpecialBanana(Math.random() * 10);

  LOG.info(msg);

  if (notReactHookBanana.access) {
    LOG.info(`Here your ${notReactHookBanana.size} size Special Banana`);
  } else {
    LOG.info('HOLD ON. You still have energy. Have your Banana later');
  }

  return msg;
}
