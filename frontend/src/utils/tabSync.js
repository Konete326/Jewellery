import { getCartStorageKey, getLocalCartCount, getLocalCart } from './cartStorage';

export { getCartStorageKey, getLocalCartCount, getLocalCart };

const CHANNEL_NAME = 'khalil_multi_tab_sync';

let channel = null;
let lastBroadcastKey = '';
let lastBroadcastPayload = '';

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      const data = event?.data;
      if (!data) return;
      if (data.type === 'CART_UPDATE') {
        const currentKey = getCartStorageKey();
        if (!data.cartKey || data.cartKey === currentKey) {
          lastBroadcastKey = data.cartKey || currentKey;
          lastBroadcastPayload = JSON.stringify({ count: data.count, items: data.items });
          window.dispatchEvent(
            new CustomEvent('khalil_cart_change', {
              detail: { cartKey: data.cartKey, count: data.count, items: data.items }
            })
          );
        }
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
      } else if (data.type === 'AUTH_UPDATE') {
        window.dispatchEvent(
          new CustomEvent('khalil_auth_change', {
            detail: data.user
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
    const currentCartKey = getCartStorageKey();
    if (event.key === 'khalil_cart' && currentCartKey === 'khalil_cart_guest') {
      try {
        const legacy = localStorage.getItem('khalil_cart');
        if (legacy) {
          localStorage.setItem('khalil_cart_guest', legacy);
          localStorage.removeItem('khalil_cart');
        }
      } catch {}
    }
    if (event.key === currentCartKey || (currentCartKey === 'khalil_cart_guest' && event.key === 'khalil_cart')) {
      const items = getLocalCart();
      const count = getLocalCartCount();
      lastBroadcastKey = currentCartKey;
      lastBroadcastPayload = JSON.stringify({ count, items });
      window.dispatchEvent(
        new CustomEvent('khalil_cart_change', {
          detail: { cartKey: currentCartKey, count, items }
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
    } else if (event.key === 'auth_user') {
      try {
        const user = event.newValue ? JSON.parse(event.newValue) : null;
        window.dispatchEvent(
          new CustomEvent('khalil_auth_change', {
            detail: user
          })
        );
      } catch {}
    } else if (event.key === 'auth_token') {
      if (!event.newValue && !localStorage.getItem('auth_user')) {
        window.dispatchEvent(
          new CustomEvent('khalil_auth_change', {
            detail: null
          })
        );
      }
    }
  });
}

export function broadcastCartUpdate(count, items, user) {
  const cartKey = getCartStorageKey(user);
  const finalCount = count !== undefined ? count : getLocalCartCount(user);
  const finalItems = items !== undefined ? items : getLocalCart(user);
  const payload = JSON.stringify({ count: finalCount, items: finalItems });
  if (lastBroadcastKey === cartKey && lastBroadcastPayload === payload) {
    return;
  }
  lastBroadcastKey = cartKey;
  lastBroadcastPayload = payload;
  if (channel) {
    try {
      channel.postMessage({
        type: 'CART_UPDATE',
        cartKey,
        count: finalCount,
        items: finalItems
      });
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('khalil_cart_change', {
        detail: { cartKey, count: finalCount, items: finalItems }
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

export function broadcastAuthUpdate(user) {
  if (channel) {
    try {
      channel.postMessage({
        type: 'AUTH_UPDATE',
        user: user || null
      });
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('khalil_auth_change', {
        detail: user || null
      })
    );
  }
}

export function subscribeToTabSync(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event) => {
    if (event?.data && callback) {
      if (event.data.type === 'CART_UPDATE') {
        const currentKey = getCartStorageKey();
        if (event.data.cartKey && event.data.cartKey !== currentKey) {
          return;
        }
        lastBroadcastKey = event.data.cartKey || currentKey;
        lastBroadcastPayload = JSON.stringify({ count: event.data.count, items: event.data.items });
      }
      callback(event.data);
    }
  };

  const handleStorage = (event) => {
    const currentCartKey = getCartStorageKey();
    if (event.key === 'khalil_cart' && currentCartKey === 'khalil_cart_guest') {
      try {
        const legacy = localStorage.getItem('khalil_cart');
        if (legacy) {
          localStorage.setItem('khalil_cart_guest', legacy);
          localStorage.removeItem('khalil_cart');
        }
      } catch {}
    }
    if ((event.key === currentCartKey || (currentCartKey === 'khalil_cart_guest' && event.key === 'khalil_cart')) && callback) {
      const items = getLocalCart();
      const count = getLocalCartCount();
      lastBroadcastKey = currentCartKey;
      lastBroadcastPayload = JSON.stringify({ count, items });
      callback({
        type: 'CART_UPDATE',
        cartKey: currentCartKey,
        count,
        items
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
    } else if (event.key === 'auth_user' && callback) {
      try {
        const user = event.newValue ? JSON.parse(event.newValue) : null;
        callback({
          type: 'AUTH_UPDATE',
          user
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
