import { Page } from 'puppeteer';
import { CustomLogger } from '../../utils';

export class BotPassUtil {
    protected _logger: CustomLogger;
    constructor(logger: CustomLogger) {
        this._logger = logger || new CustomLogger(BotPassUtil.name);
    }

    set logger(logger: CustomLogger) {
        this._logger = logger;
    }

    get logger() {
        return this._logger;
    }

    async delay(sec: number) {
        this._logger.debug(`delaying for ${sec} seconds`);
        return new Promise(function (resolve) {
            setTimeout(resolve, sec * 1000);
        });
    }

    // Function to generate random coordinates
    getRandomCoordinate(max: number) {
        return Math.floor(Math.random() * max);
    }

    // Function to move the mouse dynamically
    async dynamicMouseMovement(page: Page, startX: number, startY: number, steps: number) {
        const targetX = this.getRandomCoordinate(1280); // Assuming a 1280px wide screen
        const targetY = this.getRandomCoordinate(800); // Assuming an 800px tall screen

        // Move the mouse to the starting position
        await page.mouse.move(startX, startY);

        // Move the mouse to the target position with dynamic steps
        await page.mouse.move(targetX, targetY, { steps });
    }

    async mouseMove(page: Page) {
        // Start from random initial coordinates
        const startX = this.getRandomCoordinate(1280);
        const startY = this.getRandomCoordinate(800);

        // Randomize the number of steps
        const steps = Math.floor(Math.random() * 20) + 5; // Between 5 and 25 steps

        // Perform dynamic mouse movement
        await this.dynamicMouseMovement(page, startX, startY, steps);
    }
}

export interface BotByPassInterface extends BotPassUtil {
    hostname: string;
    execute(page: Page, logger: CustomLogger): Promise<void>;
}
