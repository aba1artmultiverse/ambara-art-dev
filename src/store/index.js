import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#6b3fa0',        // visible purple — not near-black
  isLogoTexture: false,
  isFullTexture: false,
  logoDecal: '/threejs.png',
  fullDecal: '/threejs.png',
  logoPosition: [0, 0.04, 0.15],
  logoScale: 0.15,
  modelRotationY: 0,
  activeMerch: 'tshirt',
  cart: [],
  shopOpen: false,
  cartOpen: false,
  orbitEnabled: false,     // free-explore / orbit mode toggle
});

export default state;
