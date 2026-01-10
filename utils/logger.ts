export class APILogger {
  private recentLogs: any[] = [];

  //note: here we have body? , a question mark, which will make this param as optional
  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any
  ) {
    const logEntry = { method, url, headers, body }; //this is here a object creation..
    //we have not yet declared it's value, we just told that
    //we gonna have 4 keys for this object and these keys are of this type as
    //type of these fields are already defined above

    this.recentLogs.push({ type: "Request Details", data: logEntry });
  }

  logResponse(statusCode: number, body?: any) {
    const logEntry = { statusCode, body };
    this.recentLogs.push({ type: "Response Details", data: logEntry });
  }

  getRecentLogs() {
    //for-each,filter,map..
    const logs = this.recentLogs
      .map((log) => {
        return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`;
      })
      .join("\n\n");

    return logs;
  }
}
