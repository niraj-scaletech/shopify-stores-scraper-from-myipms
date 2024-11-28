import { Page } from "puppeteer";
import { BotByPassInterface, BotPassUtil } from "./common";
import { CustomLogger } from "../../utils";
import { STATUS, TwoCaptchaSolution } from "../../2captcha";

export class MyIpMsBot extends BotPassUtil implements BotByPassInterface {
  constructor(logger: CustomLogger) {
    super(logger);
  }

  public readonly hostname = "myip.ms";

  public async completeCaptcha(page: Page) {
    const twoCaptcha = new TwoCaptchaSolution(this.logger);

    // Wait for the CAPTCHA image to be visible
    const captchaSelector = 'img[title-orig="Please enter Captcha"]';
    await page.waitForSelector(captchaSelector).catch(() => null);

    let retryCount = 3;
    let res: string | null = null;

    while (retryCount > 0) {
      try {
        const captchaElement = await page.$(captchaSelector).catch(() => null);

        if (!captchaElement) {
          this.logger.error(`captcha element selector not found`);
          return;
        }

        // Capture the screenshot as a buffer
        const imageString = await captchaElement.screenshot({
          type: "png",
          encoding: "base64",
        });

        this.logger.log(
          `Attempting to solve CAPTCHA. Retries left: ${retryCount}`
        );

        const twoCaptchaRes = await twoCaptcha.in(imageString);

        await this.delay(60);

        res = await twoCaptchaRes.out();

        if (res !== STATUS.CAPCHA_NOT_READY) {
          this.logger.log(`Successfully retrieved CAPTCHA solution: ${res}`);
          break;
        }

        this.logger.log(`CAPTCHA service response: ${res}`);
      } catch (error) {
        this.logger.error(`Error solving CAPTCHA: ${(error as Error).message}`);
      }

      retryCount--;
      await this.delay(3);
    }

    if (!res || res.trim() === "") {
      this.logger.error(`Failed to solve CAPTCHA after retries.`);
      return;
    }

    // enter the captcha
    await page.type("#p_captcha_response", res);
    // click on submit button
    await page.click("#captcha_submit");

    this._logger.log("two captcha res:" + res);
  }

  private async isCaptcha(page: Page): Promise<void> {
    const pageTitle = (await page.title()).trim();
    if (pageTitle !== "Human Verification") {
      return;
    }

    this.logger.log(`Asking for human verification`);

    const cookieConsent = await page
      .waitForSelector("button.fc-button.fc-cta-content.fc-primary-button")
      .catch(() => {
        this.logger.debug(`cookie consent banner not found`);
        return null;
      });

    if (cookieConsent) {
      await page.click("button.fc-button.fc-cta-content.fc-primary-button");
      this.logger.debug(`cookie consent button clicked`);
    }

    const consentPopup = await page.$('button[aria-label="Consent"]');
    if (consentPopup) {
      await consentPopup.click();
      this.logger.debug("consent popup closed.");
    }

    // Check if the element with id="g_recaptcha_loaded" exists
    const captchaElement = await page.$("#captcha_submit").catch(() => {
      this.logger.log("Captcha element not found.");
      return null;
    });

    if (captchaElement) {
      this.logger.log(`captcha element is found`);
      await captchaElement.click().catch(() => {});
      this.logger.log(`button is clicked`);

      await page.waitForNavigation({ waitUntil: ["load"] }).catch(() => {
        this.logger.error(`1x failed to navigate to the new page`);
      });

      const isStillHumanVerificationPage = pageTitle === "Human Verification";

      if (!isStillHumanVerificationPage) {
        return;
      }

      await this.completeCaptcha(page);

      await page.waitForSelector("table.tablesorter").catch(async () => {
        this.logger.error(`could not found table.tablesorter`);
      });
    }
  }

  public async execute(page: Page) {
    await this.isCaptcha(page);
  }
}
