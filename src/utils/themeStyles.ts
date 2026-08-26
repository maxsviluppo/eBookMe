import { ReaderTheme, ReaderFont, MarginWidth, TextAlign } from '../types';

export interface ThemeConfig {
  name: string;
  label: string;
  bgClass: string;
  bgHex: string;
  textClass: string;
  textMutedClass: string;
  borderClass: string;
  headerBgClass: string;
  cardBgClass: string;
  accentClass: string;
  isDark: boolean;
  paperTexture?: boolean;
}

export const THEME_CONFIGS: Record<ReaderTheme, ThemeConfig> = {
  isabelline: {
    name: 'isabelline',
    label: 'Avorio / Isabellino',
    bgClass: 'bg-[#F7F6F2]',
    bgHex: '#F7F6F2',
    textClass: 'text-[#2D2D2A]',
    textMutedClass: 'text-[#8C8B85]',
    borderClass: 'border-[#E8E7E0]',
    headerBgClass: 'bg-[#F7F6F2]/90',
    cardBgClass: 'bg-[#EFECE5]',
    accentClass: 'text-[#2D2D2A] border-[#2D2D2A]',
    isDark: false,
  },
  bone: {
    name: 'bone',
    label: 'Pergamena Calda',
    bgClass: 'bg-[#F2EFE9]',
    bgHex: '#F2EFE9',
    textClass: 'text-[#282622]',
    textMutedClass: 'text-[#8A857A]',
    borderClass: 'border-[#E2DDCF]',
    headerBgClass: 'bg-[#F2EFE9]/90',
    cardBgClass: 'bg-[#EAE4D9]',
    accentClass: 'text-[#574B3C] border-[#574B3C]',
    isDark: false,
  },
  sepia: {
    name: 'sepia',
    label: 'Seppia Classico',
    bgClass: 'bg-[#F4ECD8]',
    bgHex: '#F4ECD8',
    textClass: 'text-[#3B3023]',
    textMutedClass: 'text-[#8C7B65]',
    borderClass: 'border-[#E4D7BE]',
    headerBgClass: 'bg-[#F4ECD8]/90',
    cardBgClass: 'bg-[#ECE1C8]',
    accentClass: 'text-[#6E4F28] border-[#6E4F28]',
    isDark: false,
  },
  pure: {
    name: 'pure',
    label: 'Bianco Naturale',
    bgClass: 'bg-[#FAF9F6]',
    bgHex: '#FAF9F6',
    textClass: 'text-[#1F1E1D]',
    textMutedClass: 'text-[#7D7A75]',
    borderClass: 'border-[#E9E7E2]',
    headerBgClass: 'bg-[#FAF9F6]/90',
    cardBgClass: 'bg-[#F2EFEA]',
    accentClass: 'text-[#2D2D2A] border-[#2D2D2A]',
    isDark: false,
  },
  slate: {
    name: 'slate',
    label: 'Ardesia Notturna',
    bgClass: 'bg-[#1E2227]',
    bgHex: '#1E2227',
    textClass: 'text-[#E1E4E8]',
    textMutedClass: 'text-[#838B95]',
    borderClass: 'border-[#2C333B]',
    headerBgClass: 'bg-[#1E2227]/90',
    cardBgClass: 'bg-[#252B32]',
    accentClass: 'text-[#C9D1D9] border-[#C9D1D9]',
    isDark: true,
  },
  night: {
    name: 'night',
    label: 'OLED / Nero Puro',
    bgClass: 'bg-[#121212]',
    bgHex: '#121212',
    textClass: 'text-[#E0E0E0]',
    textMutedClass: 'text-[#7D7D7D]',
    borderClass: 'border-[#222222]',
    headerBgClass: 'bg-[#121212]/90',
    cardBgClass: 'bg-[#1A1A1A]',
    accentClass: 'text-[#EDEDED] border-[#EDEDED]',
    isDark: true,
  },
};

export const FONT_CONFIGS: Record<ReaderFont, { label: string; fontClass: string; desc: string }> = {
  newsreader: {
    label: 'Newsreader',
    fontClass: 'font-serif [font-family:Newsreader,serif]',
    desc: 'Serif editoriale ad alta leggibilità',
  },
  garamond: {
    label: 'EB Garamond',
    fontClass: 'font-serif [font-family:EB_Garamond,Georgia,serif]',
    desc: 'Classico letterario rinascimentale',
  },
  lora: {
    label: 'Lora',
    fontClass: 'font-serif [font-family:Lora,serif]',
    desc: 'Elegante, caldo ed equilibrato',
  },
  sans: {
    label: 'Jakarta Sans',
    fontClass: 'font-sans [font-family:Plus_Jakarta_Sans,sans-serif]',
    desc: 'Moderno, geometrico e pulito',
  },
};

export const MARGIN_CONFIGS: Record<MarginWidth, { label: string; maxWidthClass: string }> = {
  narrow: {
    label: 'Compatto',
    maxWidthClass: 'max-w-xl', // ~576px
  },
  normal: {
    label: 'Bilanciato',
    maxWidthClass: 'max-w-2xl', // ~672px (sweet spot for books 65-75 ch)
  },
  wide: {
    label: 'Ampio',
    maxWidthClass: 'max-w-3xl', // ~768px
  },
};
