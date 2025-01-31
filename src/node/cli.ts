import { resolve } from 'path';
import { cac } from 'cac';
import { build } from './build';
import { serve } from './serve';

const cli = cac('island').version('0.0.0').help();

cli
  .command('[root]', 'start dev server') // default command
  .alias('dev')
  .action(async (root: string) => {
    try {
      const createServer = async () => {
        const { createDevServer } = await import(`./dev.js?t=${Date.now()}`);
        const server = await createDevServer(root, async () => {
          await server.close();
          await createServer();
        });
        await server.listen();
        console.log();
        server.printUrls();
      };
      await createServer();
    } catch (e) {
      console.log(e);
    }
  });

cli
  .command('build [root]', 'build for production') // default command
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli
  .command('start [root]', 'serve for production') // default command
  .option('--port <port>', 'port to use for serve')
  .action(async (root: string, { port }: { port: number }) => {
    try {
      root = resolve(root);
      await serve(root, port);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
