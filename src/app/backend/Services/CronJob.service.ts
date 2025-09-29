import axios from "axios";

export default class CronJobService {
  static async register(id: string, cronExpression: string) {
    try {
      const response = await axios.post(
        "http://cgwckg8kcooowcg04s0804kw.5.181.218.65.sslip.io/jobs",
        {
          id,
          cronTime: cronExpression,
        }, 
        {
          headers: {
            "x-api-key": process.env.CRON_JOB_API_KEY || "",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error registering cron job:", error);
      throw error;
    }
  }

  static async unregister(id: string) {
    try {
      const response = await axios.delete(
        `http://cgwckg8kcooowcg04s0804kw.5.181.218.65.sslip.io/jobs/${id}`,
        {
            headers: {
                'x-api-key': process.env.CRON_JOB_API_KEY || ''
            }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error unregistering cron job:", error);
      throw error;
    }
  }
}
