import fs from "fs";
import path from "path";

export interface CoinTransaction {
  id: string;
  userId: number;
  type: "TOPUP" | "SEND_GIFT";
  coins: number; // positive for TOPUP, negative for SEND_GIFT
  balanceAfter: number;
  description: string;
  code?: string;
  giftId?: number;
  giftName?: string;
  slug?: string;
  createdAt: string;
}

export interface UserCoinRecord {
  userId: number;
  coins: number;
  updatedAt: string;
  history: CoinTransaction[];
}

export interface SentGiftRecord {
  id: string;
  code: string;
  senderUserId: number;
  senderName: string;
  senderAvatar?: string;
  message?: string;
  giftId: number;
  giftName: string;
  giftPriceCoins: number;
  giftImage?: string;
  giftFile?: string;
  amountVnd: number;
  slug?: string;
  weddingCardId?: number;
  weddingCardName?: string;
  recipientUserId?: number;
  createdAt: string;
}

const COINS_FILE = path.resolve(process.cwd(), "server/data/user-coins.json");
const SENT_GIFTS_FILE = path.resolve(process.cwd(), "server/data/sent-gifts.json");

export const DEFAULT_INITIAL_COINS = 2000;
export const COIN_TO_VND_RATE = 10; // 1 xu = 10 VNĐ

function loadCoinsMap(): Record<string, UserCoinRecord> {
  try {
    if (fs.existsSync(COINS_FILE)) {
      const raw = fs.readFileSync(COINS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("[CoinStore] Failed to load user-coins.json:", e);
  }
  return {};
}

function saveCoinsMap(map: Record<string, UserCoinRecord>) {
  try {
    const dir = path.dirname(COINS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(COINS_FILE, JSON.stringify(map, null, 2), "utf-8");
  } catch (e) {
    console.error("[CoinStore] Failed to save user-coins.json:", e);
  }
}

export function loadSentGifts(): SentGiftRecord[] {
  try {
    if (fs.existsSync(SENT_GIFTS_FILE)) {
      const raw = fs.readFileSync(SENT_GIFTS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("[CoinStore] Failed to load sent-gifts.json:", e);
  }
  return [];
}

function saveSentGifts(list: SentGiftRecord[]) {
  try {
    const dir = path.dirname(SENT_GIFTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SENT_GIFTS_FILE, JSON.stringify(list.slice(0, 500), null, 2), "utf-8");
  } catch (e) {
    console.error("[CoinStore] Failed to save sent-gifts.json:", e);
  }
}

export function getUserCoinRecord(userId: number): UserCoinRecord {
  const key = String(userId || 0);
  const map = loadCoinsMap();
  if (!map[key]) {
    map[key] = {
      userId: Number(userId || 0),
      coins: DEFAULT_INITIAL_COINS,
      updatedAt: new Date().toISOString(),
      history: [],
    };
    saveCoinsMap(map);
  }
  return map[key];
}

export function getUserCoins(userId: number): number {
  return getUserCoinRecord(userId).coins;
}

export function addUserCoins(
  userId: number,
  coinsToAdd: number,
  description = "Nạp xu vào tài khoản",
  code?: string
): UserCoinRecord {
  const key = String(userId || 0);
  const map = loadCoinsMap();
  const record = map[key] || {
    userId: Number(userId || 0),
    coins: DEFAULT_INITIAL_COINS,
    updatedAt: new Date().toISOString(),
    history: [],
  };

  // Tránh cộng trùng nếu mã giao dịch đã được cộng trước đó
  if (code && record.history.some((tx) => tx.code === code && tx.type === "TOPUP")) {
    return record;
  }

  const added = Math.max(0, Math.floor(Number(coinsToAdd) || 0));
  record.coins += added;
  record.updatedAt = new Date().toISOString();

  record.history.unshift({
    id: `coin-tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: Number(userId || 0),
    type: "TOPUP",
    coins: added,
    balanceAfter: record.coins,
    description,
    code,
    createdAt: record.updatedAt,
  });

  map[key] = record;
  saveCoinsMap(map);
  return record;
}

export function sendGiftWithCoins(params: {
  senderUserId: number;
  senderName: string;
  senderAvatar?: string;
  message?: string;
  giftId: number;
  giftName: string;
  giftPriceCoins: number;
  giftImage?: string;
  giftFile?: string;
  slug?: string;
  weddingCardId?: number;
  weddingCardName?: string;
  recipientUserId?: number;
}) {
  const userId = Number(params.senderUserId || 0);
  const key = String(userId);
  const map = loadCoinsMap();
  const record = map[key] || {
    userId,
    coins: DEFAULT_INITIAL_COINS,
    updatedAt: new Date().toISOString(),
    history: [],
  };

  const priceCoins = Math.max(0, Math.floor(Number(params.giftPriceCoins) || 0));
  const currentCoins = record.coins;

  if (currentCoins < priceCoins) {
    const missingCoins = priceCoins - currentCoins;
    return {
      success: false,
      code: "INSUFFICIENT_COINS",
      currentCoins,
      requiredCoins: priceCoins,
      missingCoins,
      missingAmountVnd: missingCoins * COIN_TO_VND_RATE,
    };
  }

  // Trừ xu của người dùng
  const previousCoins = record.coins;
  record.coins = currentCoins - priceCoins;
  record.updatedAt = new Date().toISOString();

  const txCode = `GIFT-${Date.now().toString().slice(-6)}`;

  record.history.unshift({
    id: `coin-tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    type: "SEND_GIFT",
    coins: -priceCoins,
    balanceAfter: record.coins,
    description: `Tặng quà "${params.giftName}" (-${priceCoins} xu)`,
    code: txCode,
    giftId: params.giftId,
    giftName: params.giftName,
    slug: params.slug,
    createdAt: record.updatedAt,
  });

  map[key] = record;

  // Cộng xu vào tài khoản người nhận thiệp (nếu người nhận khác người gửi)
  if (params.recipientUserId && Number(params.recipientUserId) !== userId && priceCoins > 0) {
    const recipientId = Number(params.recipientUserId);
    const recipientKey = String(recipientId);
    const recipientRecord = map[recipientKey] || {
      userId: recipientId,
      coins: DEFAULT_INITIAL_COINS,
      updatedAt: record.updatedAt,
      history: [],
    };
    recipientRecord.coins += priceCoins;
    recipientRecord.updatedAt = record.updatedAt;
    recipientRecord.history.unshift({
      id: `coin-tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: recipientId,
      type: "TOPUP",
      coins: priceCoins,
      balanceAfter: recipientRecord.coins,
      description: `Nhận quà "${params.giftName}" từ ${params.senderName} (+${priceCoins} xu)`,
      code: `${txCode}-RECV`,
      giftId: params.giftId,
      giftName: params.giftName,
      slug: params.slug,
      createdAt: record.updatedAt,
    });
    map[recipientKey] = recipientRecord;
  }

  saveCoinsMap(map);

  // Lưu lịch sử quà đã tặng
  const sentGifts = loadSentGifts();
  const sentRecord: SentGiftRecord = {
    id: `sent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: txCode,
    senderUserId: userId,
    senderName: params.senderName,
    senderAvatar: params.senderAvatar,
    message: params.message || "",
    giftId: params.giftId,
    giftName: params.giftName,
    giftPriceCoins: priceCoins,
    giftImage: params.giftImage,
    giftFile: params.giftFile,
    amountVnd: priceCoins * COIN_TO_VND_RATE,
    slug: params.slug,
    weddingCardId: params.weddingCardId,
    weddingCardName: params.weddingCardName,
    recipientUserId: params.recipientUserId,
    createdAt: record.updatedAt,
  };

  sentGifts.unshift(sentRecord);
  saveSentGifts(sentGifts);

  return {
    success: true,
    previousCoins,
    deductedCoins: priceCoins,
    remainingCoins: record.coins,
    giftRecord: sentRecord,
  };
}

