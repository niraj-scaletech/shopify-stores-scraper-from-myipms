import { Page } from "puppeteer";
import { isBotByPassAvailable } from "./list";
import { CustomLogger } from "../utils";

export const botDetection = async (
  page: Page,
  path: URL,
  logger: CustomLogger
) => {
  const botManage = isBotByPassAvailable(path.hostname);
  if (!botManage) {
    logger.log(`No bot manage available for hostname: ${path.hostname}`);
    return;
  }

  const b = new botManage(logger);
  await b.execute(page);
};
