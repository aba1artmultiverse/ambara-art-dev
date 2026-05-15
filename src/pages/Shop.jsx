import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useState } from 'react';
import state from '../store';

const MERCH = [
  // ── T-Shirts ──
  { id:'imvejuru-tee', name:'imvejuru tee', collection:'IMVEJURU', type:'T-Shirt', tag:'Released', badge:'LIVE', accent:'#c9a227', gradient:'linear-gradient(135deg,#1a0a2e,#2a0060)', images:['/merch/imvejuru_tee.jpg'], sizes:[{label:'S',price:18000},{label:'M',price:22000},{label:'L',price:25000},{label:'XL',price:25000},{label:'2XL',price:30000}], desc:'bold figure-in-motion artwork. heavy oversized cotton.' },
  { id:'urusengo-tee', name:'urusengo tee', collection:'URUSENGO', type:'T-Shirt', tag:'Released', badge:'LIVE', accent:'#7b2fff', gradient:'linear-gradient(135deg,#0d0020,#1a3060)', images:['/merch/urusengo_tee.jpg'], sizes:[{label:'S',price:18000},{label:'M',price:22000},{label:'L',price:25000},{label:'XL',price:25000},{label:'2XL',price:30000}], desc:'guitar-soul hand-drawn artwork. premium 100% cotton.' },
  // ── Hoodies ──
  { id:'imvejuru-hoodie', name:'imvejuru hoodie', collection:'IMVEJURU', type:'Hoodie', tag:'Released', badge:'LIVE', accent:'#c9a227', gradient:'linear-gradient(135deg,#1a1a0a,#3a2000)', images:['/merch/imvejuru_hoodie.jpg'], sizes:[{label:'S',price:30000},{label:'M',price:32000},{label:'L',price:32000},{label:'XL',price:35000},{label:'2XL',price:38000}], desc:'figure-in-motion on heavy fleece. premium drop.' },
  { id:'urusengo-hoodie', name:'urusengo hoodie', collection:'URUSENGO', type:'Hoodie', tag:'Released', badge:'LIVE', accent:'#7b2fff', gradient:'linear-gradient(135deg,#0d0020,#1a3060)', images:['/merch/hoodie_urusengo.jpg'], sizes:[{label:'S',price:30000},{label:'M',price:32000},{label:'L',price:32000},{label:'XL',price:35000},{label:'2XL',price:38000}], desc:'guitar-soul artwork on heavyweight hoodie.' },
  // ── Caps ──
  { id:'inyuke-black', name:'inyuke cap · black', collection:'INYUKE', type:'Cap', tag:'Released', badge:'LIVE', accent:'#888', gradient:'linear-gradient(135deg,#111,#333)', images:['/merch/inyuke_black.png','/merch/inyuke_black_and_white.png'], price:30000, desc:'structured cap. all-black colourway.' },
  { id:'inyuke-bw', name:'inyuke cap · b&w', collection:'INYUKE', type:'Cap', tag:'Released', badge:'LIVE', accent:'#fff', gradient:'linear-gradient(135deg,#222,#555)', images:['/merch/inyuke_black_and_white.png','/merch/inyuke_black.png'], price:30000, desc:'structured cap. black & white colourway.' },
  // ── Glasses ──
  { id:'one-shade-gold', name:'one shade · gold', collection:'ONE SHADE', type:'Glasses', tag:'Released', badge:'LIVE', accent:'#c9a227', gradient:'linear-gradient(135deg,#1a1000,#3a2800)', images:['/merch/one_shade.jpg','/merch/one_eyed_classic.jpg'], price:20000, desc:'round gold-frame. amber polarized lens.' },
  { id:'one-shade-black', name:'one shade · dark', collection:'ONE SHADE', type:'Glasses', tag:'Released', badge:'LIVE', accent:'#aaa', gradient:'linear-gradient(135deg,#111,#222)', images:['/merch/one_shade_black.jpg'], price:20000, desc:'round frame. dark smoked lens. statement piece.' },
  { id:'one-eyed', name:'one eyed · round', collection:'ONE SHADE', type:'Glasses', tag:'Released', badge:'LIVE', accent:'#f2d060', gradient:'linear-gradient(135deg,#1a1500,#2a2500)', images:['/merch/one_eyed.jpg','/merch/one_eyed_classic.jpg'], price:20000, desc:'one lens. ultra minimal futurist design.' },
  // ── Jewelry ──
  { id:'urunigi-chain', name:'urunigi chain', collection:'URUNIGI', type:'Jewelry', tag:'Released', badge:'LIVE', accent:'#c0a060', gradient:'linear-gradient(135deg,#1a1000,#3a2500)', images:['/merch/urunigi_chain.jpg'], price:69000, desc:'handcrafted pearl & chain mixed bracelet.' },
  { id:'chain-1', name:'diamond chain', collection:'JEWELRY', type:'Jewelry', tag:'Released', badge:'LIVE', accent:'#aaa', gradient:'linear-gradient(135deg,#111,#222)', images:['/merch/chain_1.png'], price:69000, desc:'black & white iced bead bracelet. statement piece.' },
  { id:'kimoyo-bead', name:'kimoyo bead', collection:'KIMOYO', type:'Jewelry', tag:'Released', badge:'LIVE', accent:'#7b2fff', gradient:'linear-gradient(135deg,#0d0020,#1a003a)', images:['/merch/kimoyo_bead.jpg','/merch/kimoyo_bead_2.jpg'], price:69000, desc:'engraved symbol beads. blue gem centrepiece.' },
  // ── Kicks ──
  { id:'kicks-yeezy-zebra', name:'yeezy zebra · 350 v2', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#fff', gradient:'linear-gradient(135deg,#1a1a1a,#333)', images:['/merch/kicks_yeezy_zebra.jpg'], price:null, desc:'zebra colourway. black & white primeknit. iconic.' },
  { id:'kicks-jordan12-wool', name:'jordan 12 · wool', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#888', gradient:'linear-gradient(135deg,#111,#2a2a2a)', images:['/merch/kicks_jordan12_wool.jpg'], price:null, desc:'all-black wool upper. dark owl energy.' },
  { id:'kicks-jordan13-panther', name:'jordan 13 · panther', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#00ff88', gradient:'linear-gradient(135deg,#000,#111)', images:['/merch/kicks_jordan13_panther.jpg'], price:null, desc:'all-black with glowing green hologram. wakanda.' },
  { id:'kicks-yeezy-tan', name:'yeezy 350 · oxford tan', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#c9a227', gradient:'linear-gradient(135deg,#1a1500,#2a2000)', images:['/merch/kicks_yeezy_350_tan.jpg'], price:null, desc:'sand/black duo. classic 350 low profile.' },
  { id:'kicks-nmd-blackout', name:'nmd · triple black', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#555', gradient:'linear-gradient(135deg,#000,#111)', images:['/merch/kicks_nmd_blackout.jpg'], price:null, desc:'full black-on-black. gorilla energy.' },
  { id:'kicks-nmd-bape', name:'nmd · bape camo', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#aaa', gradient:'linear-gradient(135deg,#111,#222)', images:['/merch/kicks_nmd_bape.jpg'], price:null, desc:'bape × adidas camo collab. street royalty.' },
  { id:'kicks-vapormax-purple', name:'vapormax · purple', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#a855f7', gradient:'linear-gradient(135deg,#1a0030,#2a0050)', images:['/merch/kicks_vapormax_purple.jpg'], price:null, desc:'all-purple flyknit. ultra light air unit.' },
  { id:'kicks-jordan4-kaws', name:'jordan 4 · kaws', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#00ff88', gradient:'linear-gradient(135deg,#000,#111)', images:['/merch/kicks_jordan4_kaws.jpg'], price:null, desc:'kaws collab. black suede with glow-in-dark sole.' },
  { id:'kicks-jordan8-trooper', name:'jordan 8 · trooper', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#aaa', gradient:'linear-gradient(135deg,#111,#222)', images:['/merch/kicks_jordan8_trooper.jpg'], price:null, desc:'storm trooper grey. AJ8 retro silhouette.' },
  { id:'kicks-jordan1-offwhite', name:'jordan 1 · off-white', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#ff4444', gradient:'linear-gradient(135deg,#1a0500,#2a0800)', images:['/merch/kicks_jordan1_offwhite.jpg'], price:null, desc:'off-white collab. "VILLAIN" edition. iconic.' },
  { id:'kicks-vapormax-ice', name:'vapormax · ice blue', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#00cfff', gradient:'linear-gradient(135deg,#001a2a,#002a3a)', images:['/merch/kicks_vapormax_ice.jpg'], price:null, desc:'ice blue flyknit. rick & morty energy.' },
  { id:'kicks-yeezy-sponge', name:'yeezy 350 · semi frozen', collection:'KICKS', type:'Kicks', tag:'Commission', badge:'ORDER', accent:'#ccff00', gradient:'linear-gradient(135deg,#1a1a00,#2a2a00)', images:['/merch/kicks_yeezy_sponge.jpg'], price:null, desc:'semi-frozen yellow. knit upper. hype energy.' },
  // ── Art ──
  { id:'portrait-imvejuru', name:'imvejuru portrait', collection:'ART', type:'Artwork', tag:'Commission', badge:'ART', accent:'#a855f7', gradient:'linear-gradient(135deg,#200010,#400020)', images:['/merch/potrait_imvejuru.jpg'], price:null, desc:'original ink on paper. figure-in-motion collection.' },
  { id:'portrait-urusengo', name:'urusengo portrait', collection:'ART', type:'Artwork', tag:'Commission', badge:'ART', accent:'#a855f7', gradient:'linear-gradient(135deg,#200010,#400020)', images:['/merch/potrait_urusengo.jpg'], price:null, desc:'original ink on paper. guitar-soul collection.' },
];

const CATS = ['All','T-Shirt','Hoodie','Cap','Glasses','Jewelry','Kicks','Artwork'];

function MerchCard({ item, onAddToCart, onCustomize }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(item.sizes ? item.sizes[0] : null);
  const currentPrice = size ? size.price : item.price;
  const priceDisplay = currentPrice ? `RWF ${currentPrice.toLocaleString()}` : 'on order';

  return (
    <motion.div className="merch-card" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} layout>
      {/* Image */}
      <div style={{ position:'relative', aspectRatio:'1', overflow:'hidden', background:item.gradient }}>
        {item.images.map((src, i) => (
          <img key={src} src={src} alt={item.name}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity: i===imgIdx ? 1 : 0, transition:'opacity 0.4s ease' }}
            onError={e => { e.target.style.opacity='0'; }}
          />
        ))}
        {/* bottom gradient */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to top,rgba(0,0,0,0.75),transparent)', pointerEvents:'none' }} />
        {/* Badge */}
        <span className="mono" style={{
          position:'absolute', top:8, right:8,
          background: item.tag==='Released' ? 'linear-gradient(135deg,#c9a227,#ff8c00)' : item.badge==='ART' ? 'rgba(168,85,247,0.88)' : 'rgba(30,30,30,0.85)',
          color: item.tag==='Released' ? '#030008' : '#fff',
          fontSize:'0.5rem', fontWeight:700, padding:'3px 8px', borderRadius:20, letterSpacing:'0.1em',
          backdropFilter:'blur(4px)', border: item.tag!=='Released' ? '1px solid rgba(255,255,255,0.15)' : 'none',
        }}>{item.badge}</span>
        {/* Live dot */}
        {item.tag==='Released' && (
          <span style={{ position:'absolute', bottom:10, left:10, display:'flex', alignItems:'center', gap:4, fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.1em', color:'#00c896' }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#00c896', boxShadow:'0 0 5px #00c896', display:'inline-block' }} />
            available
          </span>
        )}
        {item.tag==='Commission' && (
          <span style={{ position:'absolute', bottom:10, left:10, display:'flex', alignItems:'center', gap:4, fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.1em', color:'#ff8c00' }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#ff8c00', boxShadow:'0 0 5px #ff8c00', display:'inline-block' }} />
            order now
          </span>
        )}
        {/* Swatch dots */}
        {item.images.length > 1 && (
          <div style={{ position:'absolute', bottom:10, right:10, display:'flex', gap:4 }}>
            {item.images.map((_,i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{ width: i===imgIdx ? 18 : 6, height:6, borderRadius:3, border:'none', background: i===imgIdx ? '#c9a227' : 'rgba(255,255,255,0.4)', cursor:'pointer', transition:'all 0.2s', padding:0 }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
          <div>
            <p className="mono" style={{ fontSize:'0.5rem', color:item.accent, letterSpacing:'0.16em', textTransform:'uppercase' }}>{item.collection}</p>
            <h3 className="mono" style={{ fontSize:'0.82rem', color:'#e8d5ff', marginTop:2, lineHeight:1.2 }}>{item.name}</h3>
          </div>
          <span className="mono" style={{ color:'#c9a227', fontSize:'0.78rem', whiteSpace:'nowrap', marginLeft:8, paddingTop:2 }}>{priceDisplay}</span>
        </div>
        <p style={{ fontSize:'0.68rem', color:'rgba(232,213,255,0.48)', lineHeight:1.55, marginBottom:10 }}>{item.desc}</p>

        {/* Size selector */}
        {item.sizes && (
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
            {item.sizes.map(s => (
              <button key={s.label} onClick={() => setSize(s)} className="mono" style={{
                padding:'3px 7px', borderRadius:5, fontSize:'0.55rem',
                border:`1px solid ${size?.label===s.label ? '#c9a227' : 'rgba(255,255,255,0.1)'}`,
                background: size?.label===s.label ? 'rgba(201,162,39,0.18)' : 'transparent',
                color: size?.label===s.label ? '#c9a227' : 'rgba(232,213,255,0.4)',
                cursor:'pointer', transition:'all 0.15s',
              }}>
                {s.label} <span style={{ opacity:0.55 }}>{(s.price/1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:6 }}>
          {item.tag==='Released' && (
            <button onClick={() => onAddToCart(item, size)}
              style={{ flex:1, padding:'8px', background:'linear-gradient(135deg,#c9a227,#ff8c00)', border:'none', borderRadius:8, color:'#030008', fontFamily:"'Major Mono Display',monospace", fontSize:'0.58rem', letterSpacing:'0.06em', cursor:'pointer', transition:'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity='0.85'}
              onMouseOut={e => e.currentTarget.style.opacity='1'}
            >add to cart</button>
          )}
          {(item.type==='T-Shirt' || item.type==='Hoodie') && (
            <button onClick={() => onCustomize(item)}
              style={{ padding:'8px 10px', background:'rgba(123,47,255,0.14)', border:'1px solid rgba(123,47,255,0.38)', borderRadius:8, color:'#a855f7', fontFamily:"'Major Mono Display',monospace", fontSize:'0.58rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
              onMouseOver={e => e.currentTarget.style.background='rgba(123,47,255,0.25)'}
              onMouseOut={e => e.currentTarget.style.background='rgba(123,47,255,0.14)'}
            >✦ 3d</button>
          )}
          {(item.tag==='Commission') && (
            <a href="https://wa.me/250790031001" target="_blank" rel="noreferrer"
              style={{ flex:1, padding:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap:4, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.28)', borderRadius:8, color:'#25d366', fontFamily:"'Major Mono Display',monospace", fontSize:'0.58rem', letterSpacing:'0.05em', textDecoration:'none' }}
            >💬 order</a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const snap = useSnapshot(state);
  const [filter, setFilter] = useState('All');
  const [notification, setNotification] = useState('');

  const filtered = filter==='All' ? MERCH : MERCH.filter(m => m.type===filter);

  const addToCart = (item, size) => {
    const cartId = size ? `${item.id}-${size.label}` : item.id;
    const price = size ? size.price : item.price;
    const existing = state.cart.find(c => c.id===cartId);
    if (existing) { existing.qty += 1; }
    else { state.cart.push({ id:cartId, name:size?`${item.name} · ${size.label}`:item.name, price:price?`RWF ${price.toLocaleString()}`:'Custom', priceNum:price||0, image:item.images[0], gradient:item.gradient, qty:1 }); }
    setNotification(`${item.name}${size?` (${size.label})`:''} added!`);
    setTimeout(() => setNotification(''), 2200);
  };

  const customize = (item) => { state.activeMerch = item.type==='Hoodie'?'hoodie':'tshirt'; state.shopOpen=false; };

  return (
    <AnimatePresence>
      {snap.shopOpen && (
        <motion.div className="shop-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>

          {/* Header */}
          <div style={{ position:'sticky', top:0, zIndex:10, background:'rgba(3,0,8,0.96)', borderBottom:'1px solid rgba(201,162,39,0.18)', backdropFilter:'blur(20px)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h2 className="section-title" style={{ fontSize:'1.1rem' }}>Ambara Merch</h2>
              <p className="mono" style={{ fontSize:'0.5rem', color:'rgba(232,213,255,0.35)', letterSpacing:'0.22em', marginTop:2 }}>afro-futurist fashion · kigali</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => state.cartOpen=true} style={{ position:'relative', background:'rgba(201,162,39,0.1)', border:'1px solid rgba(201,162,39,0.28)', borderRadius:10, width:40, height:40, color:'#c9a227', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                🛒
                {snap.cart.length>0 && <span className="cart-badge">{snap.cart.reduce((a,c)=>a+c.qty,0)}</span>}
              </button>
              <button onClick={() => state.shopOpen=false} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, width:40, height:40, color:'rgba(232,213,255,0.6)', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>✕</button>
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {notification && (
              <motion.div initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-30, opacity:0 }}
                style={{ position:'fixed', top:68, left:'50%', transform:'translateX(-50%)', background:'rgba(201,162,39,0.95)', color:'#030008', padding:'7px 18px', borderRadius:8, zIndex:999, fontFamily:"'Major Mono Display',monospace", fontSize:'0.6rem', letterSpacing:'0.06em', whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(201,162,39,0.4)' }}
              >✓ {notification}</motion.div>
            )}
          </AnimatePresence>

          {/* Filter tabs */}
          <div style={{ padding:'16px 24px 0', display:'flex', gap:6, flexWrap:'wrap' }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className="mono" style={{
                padding:'5px 12px', borderRadius:20, fontSize:'0.58rem', letterSpacing:'0.1em',
                border:`1px solid ${filter===cat ? '#c9a227' : 'rgba(201,162,39,0.18)'}`,
                background: filter===cat ? 'rgba(201,162,39,0.14)' : 'transparent',
                color: filter===cat ? '#c9a227' : 'rgba(232,213,255,0.42)',
                cursor:'pointer', transition:'all 0.2s',
              }}>
                {cat==='Kicks' ? '👟 '+cat.toLowerCase() : cat.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="mono" style={{ padding:'10px 24px 0', fontSize:'0.55rem', color:'rgba(232,213,255,0.25)', letterSpacing:'0.1em' }}>
            {filtered.length} item{filtered.length!==1?'s':''}
          </p>

          {/* Grid */}
          <motion.div layout style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:16, padding:'14px 24px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map(item => (
                <MerchCard key={item.id} item={item} onAddToCart={addToCart} onCustomize={customize} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <div style={{ textAlign:'center', padding:'32px 24px', borderTop:'1px solid rgba(201,162,39,0.1)' }}>
            <p className="mono" style={{ fontSize:'0.55rem', color:'rgba(232,213,255,0.28)', letterSpacing:'0.14em' }}>
              📍 kigali, rwanda · 📱 0790 031 001 · ✉️ aba.art.multiverse@gmail.com
            </p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
