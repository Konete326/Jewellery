import { rateService } from '../rates/rate.service.js';
import { Product } from '../products/product.model.js';

export function calculateItemNetWeight(it) {
  if (!it) return 0;
  const gross = Number(it.grossWeight) || 0;
  const stoneWeight = Number(it.stoneWeight) || 0;
  const stoneSizeMm = it.stoneSizeMm !== undefined && it.stoneSizeMm !== null ? Number(it.stoneSizeMm) : null;

  if (gross > 0 && stoneSizeMm !== null && !isNaN(stoneSizeMm)) {
    if (stoneSizeMm <= 1.5) {
      return gross;
    }
    return Math.max(0, gross - stoneWeight);
  }

  if (typeof it.netWeight === 'number' && it.netWeight > 0) {
    return it.netWeight;
  }

  if (gross > 0) {
    return Math.max(0, gross - stoneWeight);
  }

  return 0;
}

export async function calculateItemsPureGold(items, rates) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  let totalGoldValue = 0;

  for (const it of items) {
    let netWeight = calculateItemNetWeight(it);
    if (netWeight <= 0 && it.productId) {
      const prod = await Product.findById(it.productId).lean().catch(() => null);
      if (prod) {
        netWeight = calculateItemNetWeight(prod);
      }
    }

    if (netWeight <= 0) return 0;

    const purity = it.purity || '22K';
    const ratePerGram = rates?.gold?.[purity]?.gram || 0;
    if (ratePerGram <= 0) return 0;

    const quantity = Number(it.quantity) || 1;
    totalGoldValue += Math.round(netWeight * ratePerGram * quantity);
  }

  return totalGoldValue;
}

export async function createOrderRateSnapshot(data) {
  const karat = data.goldRateLock?.karat || data.items?.[0]?.purity || '22K';
  const rates = await rateService.getCurrentRates().catch(() => null);
  const goldKaratData = rates?.gold?.[karat] || rates?.gold?.['22K'] || null;

  const snapshotRate = data.goldRateLock?.snapshotRate || goldKaratData?.tola || 419000;
  const snapshotRatePerGram = data.goldRateLock?.snapshotRatePerGram || goldKaratData?.gram || Math.round(snapshotRate / 11.664);

  let pureGoldValue = 0;
  if (Array.isArray(data.items) && data.items.length > 0) {
    pureGoldValue = await calculateItemsPureGold(data.items, rates);
  }
  if (!pureGoldValue) {
    pureGoldValue = Number(data.goldRateLock?.pureGoldValue || data.pureGoldValue) || 0;
  }

  const minAdvanceRequired = pureGoldValue > 0 ? Math.round(pureGoldValue * 0.9) : 0;

  return {
    isLocked: Boolean(data.goldRateLock?.isLocked),
    lockedRate: Number(data.goldRateLock?.lockedRate) || 0,
    karat,
    lockedAt: data.goldRateLock?.lockedAt ? new Date(data.goldRateLock.lockedAt) : null,
    snapshotRate,
    snapshotRatePerGram,
    snapshotKarat: karat,
    snapshotAt: data.goldRateLock?.snapshotAt ? new Date(data.goldRateLock.snapshotAt) : new Date(),
    pureGoldValue,
    minAdvanceRequired
  };
}

export function evaluateRateLock(goldRateLock, totalApprovedAdvance) {
  if (!goldRateLock) return { isLocked: false };
  const pureGoldValue = Number(goldRateLock.pureGoldValue) || 0;
  const minRequired = Number(goldRateLock.minAdvanceRequired) || 0;
  const approved = Number(totalApprovedAdvance) || 0;

  if (pureGoldValue <= 0 || minRequired <= 0) {
    return {
      isLocked: false,
      lockedRate: 0,
      lockedAt: null,
      karat: goldRateLock.snapshotKarat || goldRateLock.karat || '22K'
    };
  }

  const thresholdRatio = approved / pureGoldValue;
  if (approved >= minRequired && thresholdRatio >= 0.899999) {
    return {
      isLocked: true,
      lockedRate: goldRateLock.snapshotRate || 0,
      lockedAt: goldRateLock.lockedAt || new Date(),
      karat: goldRateLock.snapshotKarat || goldRateLock.karat || '22K'
    };
  }

  return {
    isLocked: false,
    lockedRate: 0,
    lockedAt: null,
    karat: goldRateLock.snapshotKarat || goldRateLock.karat || '22K'
  };
}
