import { rateRepository } from './rate.repository.js';
import { calculateAllRates } from './rate.calculator.js';
import { scrapeLiveMarketRates } from './rate.scraper.js';

export const rateService = {
  async getCurrentRates() {
    const current = await rateRepository.getActiveRate();
    if (!current) {
      return this.syncLiveRates('System (Auto-Init)');
    }
    const ageMinutes = (Date.now() - new Date(current.lastSyncedAt || current.updatedAt).getTime()) / (1000 * 60);
    if (!current.isManualOverride && ageMinutes > 60) {
      this.syncLiveRates('System (Background Refresh)').catch(() => {});
    }
    return current;
  },

  async syncLiveRates(triggeredBy = 'System') {
    const scraped = await scrapeLiveMarketRates();
    const calculated = calculateAllRates(scraped.gold24kTola, scraped.silver24kTola, {
      gold24kTenGram: scraped.gold24kTenGram,
      gold24kGram: scraped.gold24kGram,
      silver24kTenGram: scraped.silver24kTenGram,
      silver24kGram: scraped.silver24kGram
    });

    const rateData = {
      gold: calculated.gold,
      silver: calculated.silver,
      marketSource: scraped.source || 'Karachi Sarafa Jewellers Association (gold.pk)',
      marketStatus: 'Open',
      isManualOverride: false,
      lastSyncedAt: new Date(),
      updatedBy: triggeredBy
    };

    const saved = await rateRepository.upsertActiveRate(rateData);
    await rateRepository.logChange({
      gold24kTola: scraped.gold24kTola,
      silver24kTola: scraped.silver24kTola,
      source: rateData.marketSource,
      isManualOverride: false,
      updatedBy: triggeredBy
    });

    return saved;
  },

  async overrideRates(payload, adminUser = 'Artisan Admin') {
    const gold24kTola = Number(payload.gold24kTola);
    const silver24kTola = Number(payload.silver24kTola);

    const calculated = calculateAllRates(gold24kTola, silver24kTola, {
      gold24kTenGram: payload.gold24kTenGram,
      gold24kGram: payload.gold24kGram,
      gold22kTola: payload.gold22kTola,
      silver24kTenGram: payload.silver24kTenGram,
      silver24kGram: payload.silver24kGram
    });

    const isManual = payload.isManualOverride !== undefined ? Boolean(payload.isManualOverride) : true;
    const rateData = {
      gold: calculated.gold,
      silver: calculated.silver,
      marketSource: isManual ? 'Atelier Hallmark Benchmark (Khalil & Sons)' : 'Karachi Sarafa Jewellers Association',
      marketStatus: payload.marketStatus || 'Open',
      isManualOverride: isManual,
      lastSyncedAt: new Date(),
      updatedBy: adminUser
    };

    const saved = await rateRepository.upsertActiveRate(rateData);
    await rateRepository.logChange({
      gold24kTola,
      silver24kTola,
      source: rateData.marketSource,
      isManualOverride: isManual,
      updatedBy: adminUser
    });

    return saved;
  },

  async getRateHistory(limit = 50) {
    return rateRepository.getLogs(limit);
  },

  async deleteRateHistory(id) {
    return rateRepository.deleteLog(id);
  }
};
