import { Op } from 'sequelize';

export interface CoinTransactionRecord {
  id: string;
  code?: string;
  type: 'TOPUP' | 'SEND_GIFT' | 'RECEIVE_GIFT';
  coins: number;
  balanceAfter: number;
  description: string;
  giftId?: number;
  giftName?: string;
  slug?: string;
  createdAt: string;
}

export interface UserCoinRecord {
  userId: string;
  coins: number;
  history: CoinTransactionRecord[];
}

export interface SentGiftRecord {
  id: string;
  code: string;
  senderUserId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  giftId: number;
  giftName: string;
  giftPriceCoins: number;
  giftImage: string;
  giftFile: string;
  amountVnd: number;
  slug: string;
  weddingCardId?: number;
  weddingCardName?: string;
  recipientUserId?: string;
  createdAt: string;
}

const DEFAULT_INITIAL_COINS = 2000;
export const COIN_TO_VND_RATE = 10; // 1 Xu = 10 VNĐ (1.000 Xu = 10.000 VNĐ)

function mapCoinTxRow(row: any): CoinTransactionRecord {
  const plain = row?.get ? row.get({ plain: true }) : row;
  const code = plain.code || `COIN-${plain.id}`;
  return {
    id: code,
    code,
    type: plain.type,
    coins: Number(plain.coins || 0),
    balanceAfter: Number(plain.balance_after || 0),
    description: plain.description || '',
    giftId: plain.id_gift || undefined,
    giftName: plain.gift_name || undefined,
    slug: plain.slug || undefined,
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : new Date().toISOString(),
  };
}

function mapSentGiftRow(row: any): SentGiftRecord {
  const plain = row?.get ? row.get({ plain: true }) : row;
  const priceCoins = Number(plain.gift_price_coins || 0);
  const amountVnd = Number(plain.amount_vnd) > 0 ? Number(plain.amount_vnd) : priceCoins * COIN_TO_VND_RATE;
  const code = plain.code || `GIFT-${plain.id}`;
  return {
    id: code,
    code,
    senderUserId: plain.id_sender_user ? String(plain.id_sender_user) : '',
    senderName: plain.sender_name || 'Khách mời ẩn danh',
    senderAvatar: plain.sender_avatar || undefined,
    message: plain.message || '',
    giftId: Number(plain.id_gift || 0),
    giftName: plain.gift_name || 'Quà mừng cưới',
    giftPriceCoins: priceCoins,
    giftImage: plain.gift_image || '',
    giftFile: plain.gift_file || '',
    amountVnd,
    slug: plain.slug || '',
    weddingCardId: plain.id_wedding_card || undefined,
    weddingCardName: plain.wedding_card_name || undefined,
    recipientUserId: plain.id_recipient_user ? String(plain.id_recipient_user) : undefined,
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getUserCoinRecord(userId: string | number): Promise<UserCoinRecord> {
  const db = (global as any).__db;
  const uid = Number(userId);
  const user = await db.User.findByPk(uid, { attributes: ['id', 'coins'] });
  const coins = user && user.coins !== null && user.coins !== undefined ? Number(user.coins) : DEFAULT_INITIAL_COINS;

  const txRows = await db.CoinTransaction.findAll({
    where: { id_user: uid },
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: 100,
  });

  return {
    userId: String(uid),
    coins,
    history: txRows.map(mapCoinTxRow),
  };
}

export async function getUserCoins(userId: string | number): Promise<number> {
  const db = (global as any).__db;
  const user = await db.User.findByPk(Number(userId), { attributes: ['id', 'coins'] });
  return user && user.coins !== null && user.coins !== undefined ? Number(user.coins) : DEFAULT_INITIAL_COINS;
}

export async function addUserCoins(
  userId: string | number,
  coinsToAdd: number,
  description = 'Nạp xu vào ví',
  codeOrExtra?: string | Partial<CoinTransactionRecord>
): Promise<UserCoinRecord> {
  const db = (global as any).__db;
  const uid = Number(userId);
  const amount = Number(coinsToAdd);
  const extra: Partial<CoinTransactionRecord> =
    typeof codeOrExtra === 'string' ? { id: codeOrExtra, code: codeOrExtra } : codeOrExtra || {};

  await db.sequelize.transaction(async (t: any) => {
    const user = await db.User.findByPk(uid, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const currentCoins = Number(user.coins ?? DEFAULT_INITIAL_COINS);
    const newBalance = currentCoins + amount;

    await user.update({ coins: newBalance }, { transaction: t });

    await db.CoinTransaction.create(
      {
        code: extra.id || extra.code || `COIN-TOPUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        id_user: uid,
        type: extra.type || 'TOPUP',
        coins: amount,
        balance_after: newBalance,
        description,
        id_gift: extra.giftId || null,
        gift_name: extra.giftName || null,
        slug: extra.slug || null,
      },
      { transaction: t }
    );
  });

  return getUserCoinRecord(uid);
}

export async function sendGiftWithCoins(params: {
  senderUserId: string | number;
  senderName: string;
  senderAvatar?: string;
  message: string;
  giftId: number;
  giftName: string;
  giftPriceCoins: number;
  giftImage: string;
  giftFile: string;
  slug: string;
  weddingCardId?: number;
  weddingCardName?: string;
  recipientUserId?: string | number;
}) {
  const db = (global as any).__db;
  const senderUid = Number(params.senderUserId);
  const price = Math.max(0, Number(params.giftPriceCoins || 0));

  return await db.sequelize.transaction(async (t: any) => {
    const sender = await db.User.findByPk(senderUid, { transaction: t, lock: t.LOCK.UPDATE });
    const currentCoins = sender ? Number(sender.coins ?? DEFAULT_INITIAL_COINS) : DEFAULT_INITIAL_COINS;

    if (currentCoins < price) {
      const missingCoins = price - currentCoins;
      return {
        success: false as const,
        code: 'INSUFFICIENT_COINS',
        currentCoins,
        requiredCoins: price,
        missingCoins,
        missingAmountVnd: missingCoins * COIN_TO_VND_RATE,
      };
    }

    const newSenderBalance = currentCoins - price;
    if (sender) {
      await sender.update({ coins: newSenderBalance }, { transaction: t });
    }

    const txRow = await db.CoinTransaction.create(
      {
        code: `COIN-GIFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        id_user: senderUid,
        type: 'SEND_GIFT',
        coins: -price,
        balance_after: newSenderBalance,
        description: `Tặng "${params.giftName}" cho thiệp ${params.weddingCardName || params.slug || ''}`.trim(),
        id_gift: params.giftId || null,
        gift_name: params.giftName,
        slug: params.slug || null,
      },
      { transaction: t }
    );

    const recipientUid = params.recipientUserId ? Number(params.recipientUserId) : null;
    if (recipientUid && recipientUid !== senderUid) {
      const recipient = await db.User.findByPk(recipientUid, { transaction: t, lock: t.LOCK.UPDATE });
      if (recipient) {
        const newRecipientBalance = Number(recipient.coins ?? DEFAULT_INITIAL_COINS) + price;
        await recipient.update({ coins: newRecipientBalance }, { transaction: t });

        await db.CoinTransaction.create(
          {
            code: `COIN-RECV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            id_user: recipientUid,
            type: 'RECEIVE_GIFT',
            coins: price,
            balance_after: newRecipientBalance,
            description: `Nhận quà "${params.giftName}" từ ${params.senderName}`,
            id_gift: params.giftId || null,
            gift_name: params.giftName,
            slug: params.slug || null,
          },
          { transaction: t }
        );
      }
    }

    const sentGiftRow = await db.SentGift.create(
      {
        code: `GIFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        id_sender_user: senderUid || null,
        sender_name: params.senderName,
        sender_avatar: params.senderAvatar || null,
        message: params.message || '',
        id_gift: params.giftId || null,
        gift_name: params.giftName,
        gift_price_coins: price,
        gift_image: params.giftImage || '',
        gift_file: params.giftFile || '',
        amount_vnd: price * COIN_TO_VND_RATE,
        slug: params.slug || null,
        id_wedding_card: params.weddingCardId || null,
        wedding_card_name: params.weddingCardName || null,
        id_recipient_user: recipientUid || null,
      },
      { transaction: t }
    );

    const mappedGift = mapSentGiftRow(sentGiftRow);
    const mappedTx = mapCoinTxRow(txRow);

    return {
      success: true as const,
      previousCoins: currentCoins,
      deductedCoins: price,
      remainingCoins: newSenderBalance,
      giftRecord: mappedGift,
      sentGift: mappedGift,
      transaction: mappedTx,
    };
  });
}

export async function loadSentGifts(filter?: {
  recipientUserId?: number | string;
  weddingCardIds?: number[];
  slug?: string;
}): Promise<SentGiftRecord[]> {
  const db = (global as any).__db;
  const where: any = {};

  if (filter) {
    const orConditions: any[] = [];
    if (filter.recipientUserId) {
      orConditions.push({ id_recipient_user: Number(filter.recipientUserId) });
    }
    if (filter.weddingCardIds && filter.weddingCardIds.length > 0) {
      orConditions.push({ id_wedding_card: { [Op.in]: filter.weddingCardIds } });
    }
    if (orConditions.length > 0) {
      where[Op.or] = orConditions;
    }
    if (filter.slug) {
      where.slug = filter.slug;
    }
  }

  const rows = await db.SentGift.findAll({
    where,
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: 500,
  });

  return rows.map(mapSentGiftRow);
}
