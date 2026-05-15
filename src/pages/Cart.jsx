import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';

export default function Cart() {
  const snap = useSnapshot(state);

  const total = snap.cart.reduce((acc, item) => acc + (item.priceNum || 0) * item.qty, 0);

  const removeItem = (id) => {
    const i = state.cart.findIndex(c => c.id === id);
    if (i !== -1) state.cart.splice(i, 1);
  };

  const updateQty = (id, d) => {
    const item = state.cart.find(c => c.id === id);
    if (item) item.qty = Math.max(1, item.qty + d);
  };

  const checkout = () => {
    const lines = snap.cart.map(c => `${c.qty}x ${c.name} (${c.price})`).join('\n');
    const msg = encodeURIComponent(
      `Hello Ambara Art! 👋\n\nI'd like to order:\n${lines}\n\nTotal: RWF ${total.toLocaleString()}\n\nPlease send payment and delivery details. Thank you!`
    );
    window.open(`https://wa.me/250790031001?text=${msg}`, '_blank');
  };

  return (
    <div className={`cart-drawer ${snap.cartOpen ? 'open' : ''}`}>
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid rgba(201,162,39,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h3 className="section-title" style={{ fontSize: '0.95rem' }}>your cart</h3>
          <p className="mono" style={{ fontSize: '0.52rem', color: 'rgba(232,213,255,0.38)', marginTop: 2 }}>
            {snap.cart.reduce((a, c) => a + c.qty, 0)} item(s)
          </p>
        </div>
        <button onClick={() => state.cartOpen = false} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, width: 34, height: 34, color: 'rgba(232,213,255,0.6)',
          fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>✕</button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
        <AnimatePresence>
          {snap.cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 60, color: 'rgba(232,213,255,0.3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🛒</div>
              <p className="mono" style={{ fontSize: '0.7rem' }}>cart is empty</p>
            </div>
          ) : (
            snap.cart.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,162,39,0.12)',
                  borderRadius: 12, padding: '10px',
                  marginBottom: 9,
                  display: 'flex', gap: 11, alignItems: 'center',
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 48, height: 48, borderRadius: 8, flexShrink: 0,
                  background: item.gradient || 'rgba(42,0,96,0.8)',
                  overflow: 'hidden',
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      {item.emoji || '🛍'}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="mono" style={{
                    fontSize: '0.7rem', color: '#e8d5ff',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </p>
                  <p className="mono" style={{ fontSize: '0.62rem', color: '#c9a227', marginTop: 2 }}>{item.price}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{
                      width: 22, height: 22, borderRadius: 4,
                      background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.28)',
                      color: '#c9a227', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1,
                    }}>-</button>
                    <span className="mono" style={{ fontSize: '0.78rem', color: '#e8d5ff', minWidth: 16, textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button onClick={() => updateQty(item.id, 1)} style={{
                      width: 22, height: 22, borderRadius: 4,
                      background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.28)',
                      color: '#c9a227', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1,
                    }}>+</button>
                  </div>
                </div>

                <button onClick={() => removeItem(item.id)} style={{
                  background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)',
                  borderRadius: 6, width: 26, height: 26, color: '#ff6666',
                  fontSize: '0.65rem', cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {snap.cart.length > 0 && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(201,162,39,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'rgba(232,213,255,0.45)' }}>total</span>
            <span className="mono" style={{ color: '#c9a227', fontSize: '1rem' }}>
              RWF {total.toLocaleString()}
            </span>
          </div>
          <button
            onClick={checkout}
            style={{
              width: '100%', padding: '11px',
              background: 'linear-gradient(135deg,#c9a227,#ff8c00)',
              border: 'none', borderRadius: 10,
              color: '#030008', fontFamily: "'Major Mono Display', monospace",
              fontSize: '0.65rem', letterSpacing: '0.08em',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,162,39,0.4)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            💬 order via whatsapp
          </button>
          <p className="mono" style={{
            textAlign: 'center', marginTop: 7,
            fontSize: '0.52rem', color: 'rgba(232,213,255,0.22)',
          }}>
            we'll confirm payment & delivery
          </p>
        </div>
      )}
    </div>
  );
}
