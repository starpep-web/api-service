import logger from '@moonstar-x/logger';
import { createApp } from './app';
import { PORT } from './config/app';

createApp()
  .then(async (app) => {
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  });
