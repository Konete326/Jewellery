const CHANNEL_NAME = 'khalil_multi_tab_sync';

let channel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      const data = event?.data;
      if (!data) return;
      if (data.type === 'CART_UPDATE') {
        window.dispatchEvent(
          new CustomEvent('khalil_cart_change', {
            detail: { count: data.count, items: data.items }
          })
        );
      } else if (data.type === 'VAULT_UPDATE') {
        window.dispatchEvent(
          new CustomEvent('khalil_vault_change', {
            detail: { count: data.count, ids: data.ids }
          })
        );
      } else if (data.type === 'RATES_UPDATE') {
        window.dispatchEvent(
          new CustomEvent('khalil_rates_change', {
            detail: { rates: data.rates }
          })
        );
      }
    };
  }
} catch {
  channel = null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'khalil_cart') {
      window.dispatchEvent(
        new CustomEvent('khalil_cart_change', {
          detail: { count: getLocalCartCount() }
        })
      );
    } else if (event.key === 'khalil_atelier_vault') {
      try {
        const ids = JSON.parse(event.newValue || '[]');
        window.dispatchEvent(
          new CustomEvent('khalil_vault_change', {
            detail: { count: Array.isArray(ids) ? ids.length : 0, ids }
          })
        );
      } catch {}
    } else if (event.key === 'khalil_sarafa_rates_cache') {
      try {
        const rates = JSON.parse(event.newValue || '{}');
        window.dispatchEvent(
          new CustomEvent('khalil_rates_change', {
            detail: { rates }
          })
        );
      } catch {}
    }
  });
}

export function getLocalCartCount() {
  try {
    const raw = localStorage.getItem('khalil_cart');
    if (!raw) return 0;
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  } catch {
    return 0;
  }
}

export function broadcastCartUpdate(count, items) {
  const finalCount = count !== undefined ? count : getLocalCartCount();
  if (channel) {
    try {
      channel.postMessage({
        type: 'CART_UPDATE',
        count: finalCount,
        items
      });
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('khalil_cart_change', {
        detail: { count: finalCount, items }
      })
    );
  }
}

export function broadcastVaultUpdate(count, ids) {
  if (channel) {
    try {
      channel.postMessage({
        type: 'VAULT_UPDATE',
        count,
        ids
      });
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('khalil_vault_change', {
        detail: { count, ids }
      })
    );
  }
}

export function broadcastRatesUpdate(rates) {
  if (channel) {
    try {
      channel.postMessage({
        type: 'RATES_UPDATE',
        rates
      });
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('khalil_rates_change', {
        detail: { rates }
      })
    );
  }
}

export function subscribeToTabSync(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event) => {
    if (event?.data && callback) {
      callback(event.data);
    }
  };

  const handleStorage = (event) => {
    if (event.key === 'khalil_cart' && callback) {
      callback({
        type: 'CART_UPDATE',
        count: getLocalCartCount()
      });
    } else if (event.key === 'khalil_atelier_vault' && callback) {
      try {
        const ids = JSON.parse(event.newValue || '[]');
        callback({
          type: 'VAULT_UPDATE',
          count: Array.isArray(ids) ? ids.length : 0,
          ids
        });
      } catch {}
    } else if (event.key === 'khalil_sarafa_rates_cache' && callback) {
      try {
        const rates = JSON.parse(event.newValue || '{}');
        callback({
          type: 'RATES_UPDATE',
          rates
        });
      } catch {}
    }
  };

  if (channel) {
    channel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}
