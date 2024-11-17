import { rateLimitCollection, sessionCollection } from "../../db";
import { add } from "date-fns";

const oneSecond = 1000;

class CustomCronService {
  private readonly repeatTime: number;
  private readonly stopCron: number = Math.trunc(new Date().getTime() / oneSecond) + 60 * 5;

  constructor(timeInSeconds: number) {
    this.repeatTime = timeInSeconds * oneSecond;
  }

  private async deleteSessions(): Promise<void> {
    try {
      await sessionCollection.deleteMany({
        tokenExp: { $lt: Math.trunc(new Date().getTime() / 1000) }
      });
    } catch (e) {
      console.log('cron error');
    }
  }

  public deleteExpiredSessions = async () => {
    await this.deleteSessions();

    if (Math.trunc(new Date().getTime() / oneSecond) > this.stopCron) {
      return;
    }

    setTimeout(this.deleteExpiredSessions, this.repeatTime);
  };

  private async deleteRateLimit(): Promise<void> {
    try {
      await rateLimitCollection.deleteMany({
        date: { $lt: add(new Date(), { seconds: -20 }) }
      });
    } catch (e) {
      console.log('cron error');
    }
  }

  public deleteOldRateLimit = async () => {
    await this.deleteRateLimit();

    if (Math.trunc(new Date().getTime() / oneSecond) > this.stopCron) {
      return;
    }

    setTimeout(this.deleteOldRateLimit, this.repeatTime);
  };
}

export { CustomCronService };