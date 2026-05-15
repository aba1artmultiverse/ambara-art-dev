import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { SketchPicker } from 'react-color';
import state from '../store';
import { reader } from '../config/helpers';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { FilePicker } from '../components';
import Shop from './Shop';
import Cart from './Cart';

const MERCH_OPTIONS = [
  { id:'tshirt',  label:'t-shirt', icon:'◻' },
  { id:'hoodie',  label:'hoodie',  icon:'◈' },
  { id:'cap',     label:'cap',     icon:'⊙', soon:true },
  { id:'kicks',   label:'kicks',   icon:'◇', soon:true },
  { id:'shades',  label:'shades',  icon:'◎', soon:true },
  { id:'chains',  label:'chains',  icon:'⬡', soon:true },
];

export default function Customizer() {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [logoActive, setLogoActive] = useState(false);
  const [fullActive, setFullActive] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const isDragging = useRef(false);
  const dragStart = useRef({ x:0, y:0 });
  const posStart   = useRef([0, 0.04, 0.15]);

  const readFile = (type) => {
    reader(file).then(result => {
      if (type === 'logo') { state.logoDecal = result; state.isLogoTexture = true; setLogoActive(true); }
      else { state.fullDecal = result; state.isFullTexture = true; setFullActive(true); }
      setActiveTab('');
    });
  };

  const toggleTab = (tab) => setActiveTab(prev => prev === tab ? '' : tab);

  // Drag-to-place
  const onMouseDown = useCallback((e) => {
    if (!snap.isLogoTexture) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = [...snap.logoPosition];
  }, [snap.isLogoTexture, snap.logoPosition]);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStart.current.x) / 420;
    const dy = -(e.clientY - dragStart.current.y) / 420;
    state.logoPosition = [posStart.current[0]+dx, posStart.current[1]+dy, posStart.current[2]];
  }, []);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Drag overlay — disabled during orbit/explore mode */}
          <div
            style={{
              position:'absolute', inset:0,
              zIndex: (!snap.orbitEnabled && snap.isLogoTexture) ? 5 : 0,
              cursor: (!snap.orbitEnabled && snap.isLogoTexture) ? 'crosshair' : 'default',
              pointerEvents: snap.orbitEnabled ? 'none' : 'auto',
            }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          />

          {/* ── Left sidebar ── */}
          <motion.div key="sidebar" className="absolute top-0 left-0 z-10" {...slideAnimation('left')}>
            <div style={{ display:'flex', alignItems:'center', minHeight:'100vh' }}>
              <div className="editortabs-container">

                {/* Colour */}
                <button className={`tab-btn ${activeTab==='color' ? 'active' : ''}`} onClick={() => toggleTab('color')} title="Colour">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
                </button>

                {/* Upload */}
                <button className={`tab-btn ${activeTab==='file' ? 'active' : ''}`} onClick={() => toggleTab('file')} title="Upload Artwork">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </button>

                {/* Resize */}
                {snap.isLogoTexture && (
                  <button className={`tab-btn ${activeTab==='size' ? 'active' : ''}`} onClick={() => toggleTab('size')} title="Resize & Position">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  </button>
                )}

                {/* Merch */}
                <button className={`tab-btn ${activeTab==='merch' ? 'active' : ''}`} onClick={() => toggleTab('merch')} title="Switch Merch">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H7v10a1 1 0 001 1h8a1 1 0 001-1V10h3.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
                </button>

                {/* Panels */}
                {activeTab === 'color' && (
                  <div className="side-panel">
                    <p className="panel-label">colour</p>
                    <SketchPicker color={snap.color} disableAlpha onChange={c => state.color = c.hex} />
                  </div>
                )}
                {activeTab === 'file' && (
                  <FilePicker file={file} setFile={setFile} readFile={readFile} />
                )}
                {activeTab === 'size' && (
                  <div className="side-panel" style={{ minWidth: 200 }}>
                    <p className="panel-label">artwork size</p>
                    <input type="range" className="size-slider" min={0.05} max={0.8} step={0.01}
                      value={snap.logoScale} onChange={e => state.logoScale = parseFloat(e.target.value)} style={{ width:'100%', marginBottom:6 }}/>
                    <div className="mono" style={{ display:'flex', justifyContent:'space-between', fontSize:'0.52rem', color:'rgba(232,213,255,0.35)', marginBottom:16 }}>
                      <span>small</span><span>large</span>
                    </div>
                    <p className="panel-label">position</p>
                    <p className="mono" style={{ fontSize:'0.55rem', color:'rgba(232,213,255,0.35)', marginBottom:10, lineHeight:1.5 }}>
                      drag on shirt or use arrows
                    </p>
                    <div className="position-pad">
                      <div/><button onClick={()=>state.logoPosition=[snap.logoPosition[0],snap.logoPosition[1]+0.03,snap.logoPosition[2]]}>▲</button><div/>
                      <button onClick={()=>state.logoPosition=[snap.logoPosition[0]-0.03,snap.logoPosition[1],snap.logoPosition[2]]}>◀</button>
                      <button style={{background:'rgba(201,162,39,0.2)'}} onClick={()=>{state.logoPosition=[0,0.04,0.15];state.logoScale=0.15;}}>⊙</button>
                      <button onClick={()=>state.logoPosition=[snap.logoPosition[0]+0.03,snap.logoPosition[1],snap.logoPosition[2]]}>▶</button>
                      <div/><button onClick={()=>state.logoPosition=[snap.logoPosition[0],snap.logoPosition[1]-0.03,snap.logoPosition[2]]}>▼</button><div/>
                    </div>
                  </div>
                )}
                {activeTab === 'merch' && (
                  <div className="side-panel" style={{ minWidth: 190 }}>
                    <p className="panel-label">select merch</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {MERCH_OPTIONS.map(opt => (
                        <button key={opt.id}
                          disabled={opt.soon}
                          onClick={() => { if (!opt.soon) { state.activeMerch = opt.id; setActiveTab(''); }}}
                          className={`merch-tab-btn ${snap.activeMerch===opt.id ? 'active' : ''}`}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                          {opt.soon && <span className="mono" style={{ marginLeft:'auto', fontSize:'0.5rem', color:'rgba(201,162,39,0.4)' }}>soon</span>}
                          {snap.activeMerch===opt.id && <span style={{ marginLeft:'auto', color:'#c9a227' }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Top bar ── */}
          <motion.div className="absolute z-10 top-4 right-4 flex gap-2 items-center" {...fadeAnimation}>
            <button onClick={() => state.cartOpen = true} className="topbar-btn topbar-btn-ghost" style={{ position:'relative', width:40, padding:0, justifyContent:'center' }}>
              🛒
              {snap.cart.length > 0 && <span className="cart-badge">{snap.cart.reduce((a,c)=>a+c.qty,0)}</span>}
            </button>
            <button onClick={() => state.shopOpen = true} className="topbar-btn topbar-btn-plasma">⬡ shop</button>
            <button onClick={() => setShowOrder(true)} className="btn-gold" style={{ height:40, padding:'0 14px', borderRadius:10, fontSize:'0.6rem' }}>order</button>
            <button onClick={() => state.intro = true} className="topbar-btn topbar-btn-ghost">← back</button>
          </motion.div>

          {/* ── Rotation controls ── */}
          <motion.div className="rotation-controls" {...fadeAnimation}>
            {/* Explore / orbit mode toggle */}
            <button
              className={`rot-btn orbit-toggle-btn${snap.orbitEnabled ? ' orbit-active' : ''}`}
              onClick={() => { state.orbitEnabled = !snap.orbitEnabled; }}
              title={snap.orbitEnabled ? 'Exit explore mode' : 'Explore model freely (drag + pinch zoom)'}
              style={{ fontSize: '0.65rem', letterSpacing: '0.04em', padding: '0 10px', minWidth: 72 }}
            >
              {snap.orbitEnabled ? '✕ exit' : '⟳ explore'}
            </button>

            {!snap.orbitEnabled && (
              <>
                <button className="rot-btn" onClick={() => state.modelRotationY -= Math.PI/4}>◀</button>
                <input type="range" className="rotation-slider" min={-Math.PI} max={Math.PI} step={0.01}
                  value={snap.modelRotationY} onChange={e => state.modelRotationY = parseFloat(e.target.value)}/>
                <button className="rot-btn" onClick={() => state.modelRotationY += Math.PI/4}>▶</button>
                <button className="rot-label" onClick={() => state.modelRotationY = Math.PI}>back</button>
                <button className="rot-label" onClick={() => state.modelRotationY = 0}>front</button>
              </>
            )}

            {snap.orbitEnabled && (
              <span style={{ fontSize: '0.55rem', color: 'rgba(201,162,39,0.7)', fontFamily: "'Major Mono Display', monospace", letterSpacing: '0.03em' }}>
                drag · scroll · pinch to zoom
              </span>
            )}
          </motion.div>

          {/* ── Filter tabs (bottom) ── */}
          <motion.div className="filtertabs-container" {...slideAnimation('up')}>
            <button
              className={`filter-tab-btn ${logoActive ? 'active' : ''}`}
              onClick={() => { const next = !logoActive; setLogoActive(next); state.isLogoTexture = next; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
              logo
            </button>
            <button
              className={`filter-tab-btn ${fullActive ? 'active' : ''}`}
              onClick={() => { const next = !fullActive; setFullActive(next); state.isFullTexture = next; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              full wrap
            </button>
          </motion.div>

          {/* ── Order modal ── */}
          <AnimatePresence>
            {showOrder && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' }}
                onClick={e => { if (e.target===e.currentTarget) setShowOrder(false); }}
              >
                <motion.div initial={{ scale:0.88, opacity:0, y:30 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.88, opacity:0, y:30 }}
                  transition={{ type:'spring', stiffness:300, damping:26 }}
                  style={{
                    width:'100%', maxWidth:340,
                    background:'rgba(8,0,22,0.97)',
                    border:'1px solid rgba(201,162,39,0.28)',
                    borderRadius:16, overflow:'hidden',
                    boxShadow:'0 20px 60px rgba(0,0,0,0.7)',
                  }}
                >
                  <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(201,162,39,0.18)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h2 className="section-title" style={{ fontSize:'0.9rem' }}>place your order</h2>
                    <button onClick={() => setShowOrder(false)} style={{ background:'none', border:'none', color:'rgba(232,213,255,0.5)', fontSize:'0.9rem', cursor:'pointer' }}>✕</button>
                  </div>
                  <div style={{ padding:20 }}>
                    {[
                      { n:1, title:'📸 screenshot your design', desc:'Capture your 3D creation before ordering.', c:'rgba(102,126,234,0.55)' },
                      { n:2, title:'📋 include your details',   desc:'Size (S 18k / M 22k / L-XL 25k / 2XL 30k), colour preference, any notes.', c:'rgba(240,147,251,0.45)' },
                      { n:3, title:'📬 send it our way',        desc:"WhatsApp or email — we'll confirm & send payment details.", c:'rgba(79,172,254,0.45)' },
                    ].map(s => (
                      <div key={s.n} style={{ display:'flex', gap:11, marginBottom:14, alignItems:'flex-start' }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:s.c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:"'Major Mono Display', monospace", fontSize:'0.65rem', flexShrink:0 }}>{s.n}</div>
                        <div>
                          <p className="mono" style={{ fontWeight:400, color:'#e8d5ff', fontSize:'0.72rem', marginBottom:3 }}>{s.title}</p>
                          <p style={{ color:'rgba(232,213,255,0.5)', fontSize:'0.72rem', lineHeight:1.5 }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display:'flex', flexDirection:'column', gap:7, marginTop:4 }}>
                      <a href="https://wa.me/250790031001" target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', borderRadius:9, background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.32)', color:'#25d366', fontSize:'0.7rem', fontFamily:"'Major Mono Display', monospace", textDecoration:'none', letterSpacing:'0.05em' }}>
                        💬 whatsapp · 0790 031 001
                      </a>
                      <a href="mailto:aba.art.multiverse@gmail.com" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', borderRadius:9, background:'rgba(234,67,53,0.12)', border:'1px solid rgba(234,67,53,0.28)', color:'#ea4335', fontSize:'0.7rem', fontFamily:"'Major Mono Display', monospace", textDecoration:'none', letterSpacing:'0.05em' }}>
                        ✉️ aba.art.multiverse@gmail.com
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Shop />
          <Cart />

          {snap.cartOpen && (
            <div onClick={() => state.cartOpen = false}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:199 }}/>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
