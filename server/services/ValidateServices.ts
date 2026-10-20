import { z } from "zod";

export class ValidateService {
  checkExists(
    needToCheck: string[],
    body: Record<string, any>,
    bool: boolean = false
  ) {
    if (bool) return needToCheck.every((item) => item in body);

    const nf = needToCheck.filter(
      (item) => !Object.prototype.hasOwnProperty.call(body, item)
    );

    return nf.length == 0 ? true : nf;
  }
}
