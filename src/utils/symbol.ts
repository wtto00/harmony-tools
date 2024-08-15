import type { InjectionKey } from "vue";
import type { AlertType } from "../components/Alert.vue";

export const ALERT_KEY: InjectionKey<(type: AlertType, msg: string, notAutoClose?: boolean) => void> =
  Symbol("ALERT_KEY");
