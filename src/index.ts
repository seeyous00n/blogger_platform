import { app } from './app';
import { SETTINGS } from './settings';

app.listen(SETTINGS.PORT, () => {
  console.log(`server started on port ${SETTINGS.PORT}`);
});