import { create } from 'zustand';

export const useAyaStore = create((set) => ({
  baseImage: null,
  paletteImage: null,
  palette: [],
  recolorResult: null,

  setBaseImage: (image) => set({ baseImage: image }),
  setPaletteImage: (image) => set({ paletteImage: image }),
  setPalette: (palette) => set({ palette }),
  setRecolorResult: (result) => set({ recolorResult: result }),
}));
