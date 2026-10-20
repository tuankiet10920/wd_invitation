import { defineStore } from "pinia";

export const useElementStore = defineStore("element", {
  state: () => ({
    type: "Setup" as string,
  }),
  actions: {},
});
