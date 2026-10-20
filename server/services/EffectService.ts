import { EffectTypeData } from "../data/effect-type";
import { EffectData } from "../data/effect";
import FormatResponse from "~~/composables/FormatResponse";

const EffectType = new EffectTypeData();
const Effect = new EffectData();

export class EffectService {
  public async getClientEffects(event: any) {
    try {
      const types = await EffectType.getAll();
      const effects = await Effect.getAll();
      
      return FormatResponse.success({
        types,
        effects
      }, "Get effects successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
