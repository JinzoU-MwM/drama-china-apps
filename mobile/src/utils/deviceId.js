import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const STORAGE_KEY = "@drama_china:device_id";
let cachedId;

async function generateDeviceId() {
  if (typeof Crypto.randomUUID === "function") {
    return Crypto.randomUUID();
  }
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getDeviceId() {
  if (cachedId) return cachedId;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      cachedId = stored;
      return cachedId;
    }
    const generated = await generateDeviceId();
    await AsyncStorage.setItem(STORAGE_KEY, generated);
    cachedId = generated;
    return cachedId;
  } catch (error) {
    console.warn("Failed to resolve device id", error);
    cachedId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return cachedId;
  }
}
