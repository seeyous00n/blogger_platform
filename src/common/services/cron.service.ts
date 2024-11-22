import { SessionModel } from "../db/schemes/sessionSchema";

class CronService {
  private readonly repeatTime: number;
  private readonly stopCron: number = Math.trunc(new Date().getTime() / 1000) + 60 * 5;

  constructor(timeInSeconds: number) {
    this.repeatTime = timeInSeconds * 1000;
  }

  private async deleteSessions(): Promise<void> {
    try {
      await SessionModel.deleteMany({
        tokenExp: { $lt: Math.trunc(new Date().getTime() / 1000) }
      });
    } catch (e) {
      console.error('cron error');
    }
  }

  public deleteExpiredSessions = async (): Promise<void> => {
    await this.deleteSessions();

    if (Math.trunc(new Date().getTime() / 1000) > this.stopCron) {
      return;
    }

    setTimeout(this.deleteExpiredSessions, this.repeatTime);
  };
}

export { CronService };