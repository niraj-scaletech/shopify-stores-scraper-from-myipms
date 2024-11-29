import { sequence_id } from "./config";
import { Page } from "puppeteer-extra-plugin/dist/puppeteer";
import { windows } from "@crawlora/browser";
import { botDetection } from "./bot/main";
import { logger } from "./utils";

const logging = logger("scrapper");

export default async function scrapeRecords(fromPage: number, toPage: number) {
  fromPage = Number(fromPage);
  toPage = Number(toPage);

  if (typeof fromPage !== "number" || typeof toPage !== "number") {
    throw new Error("please enter numbers");
  }

  if (fromPage <= 0 || toPage < fromPage) {
    throw new Error(
      "Invalid page range. Ensure 'fromPage' <= 'toPage' and both are positive integers."
    );
  }

  const urls = await generatePaginationUrls(fromPage, toPage);

  await windows(urls, async (url, { page, wait, output, debug }) => {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    debug("Navigated to the base URL.");

    const consentPopup = await page.$('button[aria-label="Consent"]');
    if (consentPopup) {
      await consentPopup.click();
      debug("consent popup closed.");
    }

    // Handle bot detection
    await botDetection(page, new URL(url), logging);

    const storesData = await scrapeData(page);

    await wait(2);

    await Promise.all(
      storesData.map(async (store) => {
        await output.create({
          sequence_id,
          sequence_output: store,
        });
      })
    );
  });
}

async function generatePaginationUrls(fromPage: number, toPage: number) {
  const urls = [];
  for (let page = fromPage; page <= toPage; page++) {
    urls.push(
      `https://myip.ms/browse/sites/${page}/ownerID/376714/ownerID_A/1`
    );
  }
  return urls;
}

async function scrapeData(page: Page) {
  return await page.evaluate(() => {
    const getText = (element: Element, selector: string) =>
      element.querySelector(selector)?.textContent?.trim() || "N/A";

    const childRows = Array.from(
      document.querySelectorAll("tr.expand-child.odd,tr.expand-child.even") ||
        []
    );

    return childRows.map((childRow) => {
      const parentRow = childRow.previousElementSibling as HTMLTableRowElement;

      const childRowData: Record<string, string> = {};
      const childRowKey = childRow.querySelectorAll("div.stitle");

      childRowKey.forEach((keyElement) => {
        let rawKey = (keyElement as HTMLElement)?.textContent
          ?.replace(/:/g, "")
          .replace(/\s+/g, "_")
          .replace(/[()]/g, "")
          .trim();

        if (!rawKey) return;

        const valueElement =
          keyElement.nextElementSibling as HTMLElement | null;
        let value;

        if (rawKey === "DNS_Records") {
          const links = valueElement
            ? Array.from(valueElement.querySelectorAll("a"))
            : [];

          value =
            links.map((link) => link.textContent?.trim() || "N/A").join(", ") ||
            "N/A";
        } else {
          value = valueElement?.textContent?.trim() || "N/A";
        }

        childRowData[rawKey] = value;
      });

      return {
        No: parseInt(getText(parentRow, "td:nth-child(1)") || "0", 10),
        Web_Site: getText(parentRow, "td:nth-child(2) a"),
        Website_IP_Address: getText(parentRow, "td:nth-child(3) a"),
        Web_Hosting_Company_IP_Owner: getText(parentRow, "td:nth-child(4) a"),
        Web_Hosting_Server_IP_Location: getText(parentRow, "td:nth-child(5) a"),
        Web_Hosting_City: getText(parentRow, "td:nth-child(6) a"),
        World_Site_Popular_Rating: getText(parentRow, "td:nth-child(7) span"),
        ...childRowData,
      };
    });
  });
}
