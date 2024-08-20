import path from 'path';
import { glob } from 'glob';
import { Router } from 'express';

type LoaderFunction = (file: string) => Promise<{ attach: (router: Router) => void }>;

export const attachRoutes = async (router: Router, moduleDirectory: string, loader: LoaderFunction) => {
  const files = await glob(`${moduleDirectory}/**/*.route.{ts,js}`, { cwd: __dirname });

  await Promise.all(files.map(async (file) => {
    const module = await loader(path.join(__dirname, file));
    module.attach(router);
  }));

  return router;
};
