import logger from '@moonstar-x/logger';
import { createApp } from './app';
import { PORT } from './config/app';
import { GraphDatabaseService } from './shared/services/neo4j/GraphDatabaseService';

createApp()
  .then(async (app) => {
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  });

process.on('beforeExit', () => {
  return GraphDatabaseService.getInstance().getDriver().close();
});
