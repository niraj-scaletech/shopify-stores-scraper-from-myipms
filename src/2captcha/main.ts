import axios from "axios";
import { TWO_RECAPTCHA_KEY } from "../config";
import FormData from "form-data";
import { z } from "zod";
import { zInResponse, zResResponse } from "./types";
import { CustomLogger } from "../utils";

export enum STATUS {
  CAPCHA_NOT_READY = "CAPCHA_NOT_READY",
  ERROR_CAPTCHA_UNSOLVABLE = "ERROR_CAPTCHA_UNSOLVABLE",
}

// readMore: https://2captcha.com/2captcha-api#solving_captchas
export class TwoCaptchaSolution {
  private logger: CustomLogger;

  private url = "https://2captcha.com";

  private apikey: string;

  private requestId?: number;

  constructor(logger: CustomLogger, apikey?: string) {
    this.apikey = apikey || TWO_RECAPTCHA_KEY;
    this.logger = logger;
  }

  private api() {
    const ax = axios.create({
      baseURL: this.url,
    });

    return ax;
  }

  public async in(imageBase64: string) {
    const form = new FormData();
    form.append("key", this.apikey);
    form.append("json", "1");
    form.append("numeric", "4");
    form.append("phrase", "1");
    form.append("regsense", "1");
    form.append("method", "base64");
    form.append("body", imageBase64);

    const { data } = await this.api().post<z.infer<typeof zInResponse>>(
      "/in.php",
      form,
      {
        maxBodyLength: Infinity,
        headers: {
          Accept: "Application/Json",
          ...form.getHeaders(),
        },
      }
    );

    const res = zInResponse.parse(data);

    if (res.status === 0) {
      throw new Error(`2 captch request failed due to ${res.request}`);
    }

    this.requestId = Number(res.request);
    this.logger.log(`2 captcha request id: ${this.requestId}`);
    return this;
  }

  public async out(): Promise<string | STATUS> {
    if (!this.requestId) {
      throw new Error(
        `No requestId found please do run first .in() method first`
      );
    }
    const form = new FormData();
    form.append("key", this.apikey);
    form.append("json", "1");
    form.append("id", this.requestId);
    form.append("action", "get");

    const { data } = await this.api().post<z.infer<typeof zResResponse>>(
      "/res.php",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const out = zResResponse.parse(data);

    return out.request;
  }
}
