import { CustomLogger } from "./log";
export { CustomLogger } from "./log";

export const logger = (name: string) => new CustomLogger(name);
