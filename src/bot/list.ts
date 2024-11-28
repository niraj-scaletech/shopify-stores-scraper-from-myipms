import { CustomLogger } from "../utils";
import { availableBotByPass } from "./bypass";

export const isBotByPassAvailable = (hostname: string) => {
  const find = availableBotByPass.find(
    (v) => new v(new CustomLogger("check")).hostname === hostname
  );
  return find;
};
