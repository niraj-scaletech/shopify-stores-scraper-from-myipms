import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { yellow } from "@nestjs/common/utils/cli-colors.util";
import correlator from "express-correlation-id";

export class CustomLogger extends ConsoleLogger {
  constructor(public override context: string, private correlatorId?: string) {
    super(context);
    super.error.bind(this);
  }

  public createInstance(correlatorId?: string, context?: string) {
    return new CustomLogger(
      context || this.context,
      correlatorId || this.correlatorId
    );
  }

  public setCorrelatorId(id: string) {
    this.correlatorId = id;
  }

  public getCorrelatorId() {
    return this.correlatorId;
  }

  override isLevelEnabled(_level: LogLevel = "verbose"): boolean {
    return true;
  }

  /**
   * Returns the currrent date.
   * @returns string
   */
  setCurrentDate(): string {
    const date = new Date(Date.now());
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.log`;
  }

  /**
   * Retrieves current Process/Request Correlation ID
   *   Supports context switching
   * @param pid number
   * @returns string
   */
  getProcessID(pid: number, requestId?: string) {
    const rpid = requestId ? requestId : pid;
    const crlId = this.getCorrelatorId() || rpid;
    return `[ps] ${crlId}  - `;
  }

  override printMessages(
    messages: unknown[],
    context?: string,
    logLevel: LogLevel = "verbose",
    writeStreamType?: "stdout" | "stderr"
  ) {
    messages.forEach((message) => {
      const contextMessage = context ? yellow(`[${context}] `) : "";
      const timestampDiff = "";
      const formattedLogLevel = logLevel.toUpperCase().padStart(7, " ");
      const formattedMessage = this.formatMessage(
        logLevel,
        message,
        this.getProcessID(process.pid, correlator.getId()),
        formattedLogLevel,
        contextMessage,
        timestampDiff
      );
      process[writeStreamType ?? "stdout"].write(formattedMessage);
    });
  }

  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  override error(message: any, stackOrContext?: string): void;
  override error(message: any, stack?: string, context?: string): void;
  override error(
    message: any,
    ...optionalParams: [...any, string?, string?]
  ): void;
  override error(message: any, ...optionalParams: any[]) {
    if (message instanceof Error) {
      super.error(
        "message: " +
          message.message +
          " stack: " +
          message.stack?.replace("\n", " \\ "),
        ...optionalParams
      );
    } else {
      super.error(message, ...optionalParams);
    }
  }
}

const logger = new CustomLogger("App");

export { logger };
