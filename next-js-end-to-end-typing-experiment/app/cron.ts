import { CronJob } from "cron";
import { Moment } from "moment";

export default function cron<Input, Output>(
    time: string | Date | Moment,
    job: () => Promise<void>,
): (CronJob_: typeof CronJob) => Promise<CronJob> {
    return async (CronJob_) => {
        return new CronJob_(time, job);
    };
}
