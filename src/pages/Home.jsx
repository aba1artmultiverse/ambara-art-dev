import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { headContainerAnimation, headContentAnimation, headTextAnimation, slideAnimation } from '../config/motion';
import BlurText from '../components/BlurText';
import state from '../store';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          {/* Brand header */}
          <motion.header {...slideAnimation('down')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a227, #7b2fff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 18px rgba(201,162,39,0.35)',
                fontSize: '1rem',
              }}>◈</div>
              <span className="mono" style={{
                fontSize: '0.78rem', letterSpacing: '0.2em',
                background: 'linear-gradient(135deg, #c9a227, #f2d060)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                AMBARA ART
              </span>
            </div>
          </motion.header>

          <motion.div {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <p className="home-tagline">afro-futurist fashion · kigali</p>
              <div className="afro-line" style={{ marginBottom: 20 }} />

              {/* BlurText animated headline */}
              <BlurText
                text="WEAR YOUR UNIVERSE"
                delay={120}
                animateBy="words"
                direction="top"
                className="head-text"
                stepDuration={0.5}
              />
            </motion.div>

            <motion.div {...headContentAnimation} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <BlurText
                text="Design your signature piece. Place your art, choose your merch — own your identity."
                delay={60}
                animateBy="words"
                direction="bottom"
                stepDuration={0.3}
                style={{
                  maxWidth: '22rem', fontFamily: "'Outfit', sans-serif",
                  fontWeight: 300, color: 'rgba(232,213,255,0.7)',
                  lineHeight: 1.75, fontSize: '0.92rem',
                }}
              />

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <motion.button
                  className="btn-gold"
                  onClick={() => { state.intro = false; state.shopOpen = false; }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  ✦ customize now
                </motion.button>
                <motion.button
                  onClick={() => { state.intro = false; state.shopOpen = true; }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(8,0,22,0.7)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(201,162,39,0.4)',
                    color: '#c9a227',
                    fontFamily: "'Major Mono Display', monospace",
                    letterSpacing: '0.08em',
                    borderRadius: 8, padding: '0.75rem 1.5rem',
                    fontSize: '0.65rem', transition: 'all 0.3s', cursor: 'pointer',
                  }}
                >
                  ⬡ shop merch
                </motion.button>
              </div>

              {/* Merch badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {['imvejuru', 'urusengo', 'custom'].map(label => (
                  <span key={label} className="mono" style={{
                    fontSize: '0.58rem', letterSpacing: '0.14em',
                    padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(201,162,39,0.1)',
                    border: '1px solid rgba(201,162,39,0.28)',
                    color: '#c9a227',
                  }}>
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
