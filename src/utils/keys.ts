import { InjectionKey, Ref } from "vue";
import { Target } from "./hdc";

export const devicesKey: InjectionKey<Ref<Target[]>> = Symbol('devices')

export const updateDeviceKey: InjectionKey<(device:Target) => void> = Symbol('updateDeviceKey')