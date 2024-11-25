import { app } from './app';
import { SETTINGS } from './common/settings';
import { runDB } from './common/db/db';

const startApp = async () => {
  await runDB()
  app.listen(SETTINGS.PORT, () => {
    console.log(`server started on port ${SETTINGS.PORT}`);
  });
};

startApp();