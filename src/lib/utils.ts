import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}

export function getUnicodeCategory(codePoint: number): string {
  if (codePoint <= 0x007f) return "Basic Latin";
  if (codePoint <= 0x00ff) return "Latin-1 Supplement";
  if (codePoint <= 0x017f) return "Latin Extended-A";
  if (codePoint <= 0x024f) return "Latin Extended-B";
  if (codePoint <= 0x02af) return "IPA Extensions";
  if (codePoint <= 0x02ff) return "Spacing Modifiers";
  if (codePoint <= 0x036f) return "Combining Diacritics";
  if (codePoint <= 0x03ff) return "Greek & Coptic";
  if (codePoint <= 0x04ff) return "Cyrillic";
  if (codePoint <= 0x052f) return "Cyrillic Supplement";
  if (codePoint <= 0x058f) return "Armenian";
  if (codePoint <= 0x05ff) return "Hebrew";
  if (codePoint <= 0x06ff) return "Arabic";
  if (codePoint <= 0x074f) return "Syriac";
  if (codePoint <= 0x077f) return "Arabic Supplement";
  if (codePoint <= 0x07bf) return "Thaana";
  if (codePoint <= 0x07ff) return "N'Ko";
  if (codePoint <= 0x083f) return "Samaritan";
  if (codePoint <= 0x085f) return "Mandaic";
  if (codePoint <= 0x086f) return "Syriac Supplement";
  if (codePoint <= 0x097f) return "Devanagari";
  if (codePoint <= 0x09ff) return "Bengali";
  if (codePoint <= 0x0a7f) return "Gurmukhi";
  if (codePoint <= 0x0aff) return "Gujarati";
  if (codePoint <= 0x0b7f) return "Oriya";
  if (codePoint <= 0x0bff) return "Tamil";
  if (codePoint <= 0x0c7f) return "Telugu";
  if (codePoint <= 0x0cff) return "Kannada";
  if (codePoint <= 0x0d7f) return "Malayalam";
  if (codePoint <= 0x0dff) return "Sinhala";
  if (codePoint <= 0x0e7f) return "Thai";
  if (codePoint <= 0x0eff) return "Lao";
  if (codePoint <= 0x0fff) return "Tibetan";
  if (codePoint <= 0x109f) return "Myanmar";
  if (codePoint <= 0x10ff) return "Georgian";
  if (codePoint <= 0x11ff) return "Korean (Jamo)";
  if (codePoint <= 0x137f) return "Ethiopic";
  if (codePoint <= 0x139f) return "Ethiopic Supplement";
  if (codePoint <= 0x13ff) return "Cherokee";
  if (codePoint <= 0x167f) return "Canadian Aboriginal";
  if (codePoint <= 0x169f) return "Ogham";
  if (codePoint <= 0x16ff) return "Runic";
  if (codePoint <= 0x171f) return "Tagalog";
  if (codePoint <= 0x173f) return "Hanunoo";
  if (codePoint <= 0x175f) return "Buhid";
  if (codePoint <= 0x177f) return "Tagbanwa";
  if (codePoint <= 0x17ff) return "Khmer";
  if (codePoint <= 0x18af) return "Mongolian";
  if (codePoint <= 0x18ff) return "Canadian Extended";
  if (codePoint <= 0x194f) return "Limbu";
  if (codePoint <= 0x197f) return "Tai Le";
  if (codePoint <= 0x19df) return "New Tai Lue";
  if (codePoint <= 0x19ff) return "Khmer Symbols";
  if (codePoint <= 0x1a1f) return "Buginese";
  if (codePoint <= 0x1aaf) return "Tai Tham";
  if (codePoint <= 0x1aff) return "Combining Extended";
  if (codePoint <= 0x1b7f) return "Balinese";
  if (codePoint <= 0x1bbf) return "Sundanese";
  if (codePoint <= 0x1bff) return "Batak";
  if (codePoint <= 0x1c4f) return "Lepcha";
  if (codePoint <= 0x1c7f) return "Ol Chiki";
  if (codePoint <= 0x1c8f) return "Cyrillic Extended-C";
  if (codePoint <= 0x1cbf) return "Georgian Extended";
  if (codePoint <= 0x1ccf) return "Sundanese Supplement";
  if (codePoint <= 0x1cff) return "Vedic Extensions";
  if (codePoint <= 0x1d7f) return "Phonetic Extensions";
  if (codePoint <= 0x1dbf) return "Phonetic Extended";
  if (codePoint <= 0x1dff) return "Combining Supplement";
  if (codePoint <= 0x1eff) return "Latin Extended Additional";
  if (codePoint <= 0x1fff) return "Greek Extended";
  if (codePoint <= 0x206f) return "General Punctuation";
  if (codePoint <= 0x209f) return "Superscripts & Subscripts";
  if (codePoint <= 0x20cf) return "Currency Symbols";
  if (codePoint <= 0x20ff) return "Combining Marks";
  if (codePoint <= 0x214f) return "Letterlike Symbols";
  if (codePoint <= 0x218f) return "Number Forms";
  if (codePoint <= 0x21ff) return "Arrows";
  if (codePoint <= 0x22ff) return "Math Operators";
  if (codePoint <= 0x23ff) return "Misc Technical";
  if (codePoint <= 0x243f) return "Control Pictures";
  if (codePoint <= 0x245f) return "OCR";
  if (codePoint <= 0x24ff) return "Enclosed Alphanumerics";
  if (codePoint <= 0x257f) return "Box Drawing";
  if (codePoint <= 0x259f) return "Block Elements";
  if (codePoint <= 0x25ff) return "Geometric Shapes";
  if (codePoint <= 0x26ff) return "Misc Symbols";
  if (codePoint <= 0x27bf) return "Dingbats";
  if (codePoint <= 0x27ef) return "Misc Math";
  if (codePoint <= 0x27ff) return "Supplemental Arrows-A";
  if (codePoint <= 0x28ff) return "Braille";
  if (codePoint <= 0x297f) return "Supplemental Arrows-B";
  if (codePoint <= 0x29ff) return "Misc Math Symbols-B";
  if (codePoint <= 0x2aff) return "Supplemental Math";
  if (codePoint <= 0x2bff) return "Misc Symbols & Arrows";
  if (codePoint <= 0x2c5f) return "Glagolitic";
  if (codePoint <= 0x2c7f) return "Latin Extended-C";
  if (codePoint <= 0x2cff) return "Coptic";
  if (codePoint <= 0x2d2f) return "Georgian Supplement";
  if (codePoint <= 0x2d7f) return "Tifinagh";
  if (codePoint <= 0x2ddf) return "Ethiopic Extended";
  if (codePoint <= 0x2dff) return "Cyrillic Extended-A";
  if (codePoint <= 0x2e7f) return "Supplemental Punctuation";
  if (codePoint <= 0x2eff) return "CJK Radicals";
  if (codePoint <= 0x2fdf) return "Kangxi Radicals";
  if (codePoint <= 0x2fff) return "Ideographic Desc";
  if (codePoint <= 0x303f) return "CJK Symbols & Punctuation";
  if (codePoint <= 0x309f) return "Hiragana";
  if (codePoint <= 0x30ff) return "Katakana";
  if (codePoint <= 0x312f) return "Bopomofo";
  if (codePoint <= 0x318f) return "Korean (Hangul)";
  if (codePoint <= 0x319f) return "Kanbun";
  if (codePoint <= 0x31bf) return "Bopomofo Extended";
  if (codePoint <= 0x31ef) return "CJK Strokes";
  if (codePoint <= 0x31ff) return "Katakana Phonetic";
  if (codePoint <= 0x32ff) return "Enclosed CJK";
  if (codePoint <= 0x33ff) return "CJK Compatibility";
  if (codePoint <= 0x4dbf) return "CJK Unified Ext A";
  if (codePoint <= 0x4dff) return "Yijing Hexagrams";
  if (codePoint <= 0x9fff) return "CJK Unified Ideographs";
  if (codePoint <= 0xa48f) return "Yi Syllables";
  if (codePoint <= 0xa4cf) return "Yi Radicals";
  if (codePoint <= 0xa4ff) return "Lisu";
  if (codePoint <= 0xa63f) return "Vai";
  if (codePoint <= 0xa69f) return "Cyrillic Extended-B";
  if (codePoint <= 0xa6ff) return "Bamum";
  if (codePoint <= 0xa71f) return "Tone Letters";
  if (codePoint <= 0xa7ff) return "Latin Extended-D";
  if (codePoint <= 0xa82f) return "Syloti Nagri";
  if (codePoint <= 0xa83f) return "Indic Number Forms";
  if (codePoint <= 0xa87f) return "Phags-pa";
  if (codePoint <= 0xa8df) return "Saurashtra";
  if (codePoint <= 0xa8ff) return "Devanagari Extended";
  if (codePoint <= 0xa92f) return "Kayah Li";
  if (codePoint <= 0xa95f) return "Rejang";
  if (codePoint <= 0xa97f) return "Korean (Hangul) Extended";
  if (codePoint <= 0xa9df) return "Javanese";
  if (codePoint <= 0xa9ff) return "Myanmar Extended-B";
  if (codePoint <= 0xaa5f) return "Cham";
  if (codePoint <= 0xaa7f) return "Myanmar Extended-A";
  if (codePoint <= 0xaadf) return "Tai Viet";
  if (codePoint <= 0xaaff) return "Meetei Mayek Extended";
  if (codePoint <= 0xab2f) return "Ethiopic Extended-A";
  if (codePoint <= 0xab6f) return "Latin Extended-E";
  if (codePoint <= 0xabbf) return "Cherokee Supplement";
  if (codePoint <= 0xabff) return "Meetei Mayek";
  if (codePoint <= 0xd7af) return "Korean (Hangul) Syllables";
  if (codePoint <= 0xd7ff) return "Korean (Hangul) Extended-B";
  if (codePoint <= 0xdb7f) return "High Surrogates";
  if (codePoint <= 0xdbff) return "High Private Surrogates";
  if (codePoint <= 0xdfff) return "Low Surrogates";
  if (codePoint <= 0xf8ff) return "Private Use Area";
  if (codePoint <= 0xfaff) return "CJK Compatibility Ideographs";
  if (codePoint <= 0xfb4f) return "Alphabetic Presentation";
  if (codePoint <= 0xfdff) return "Arabic Presentation Forms-A";
  if (codePoint <= 0xfe0f) return "Variation Selectors";
  if (codePoint <= 0xfe1f) return "Vertical Forms";
  if (codePoint <= 0xfe2f) return "Half Marks";
  if (codePoint <= 0xfe4f) return "CJK Compatibility Forms";
  if (codePoint <= 0xfe6f) return "Small Form Variants";
  if (codePoint <= 0xfeff) return "Arabic Presentation Forms-B";
  if (codePoint <= 0xffef) return "Halfwidth & Fullwidth";
  if (codePoint <= 0xffff) return "Specials";
  if (codePoint <= 0x1007f) return "Linear B";
  if (codePoint <= 0x100ff) return "Linear B Syllabary";
  if (codePoint <= 0x1013f) return "Aegean Numbers";
  if (codePoint <= 0x1018f) return "Ancient Greek Numbers";
  if (codePoint <= 0x101cf) return "Ancient Symbols";
  if (codePoint <= 0x101ff) return "Phaistos Disc";
  if (codePoint <= 0x1029f) return "Lycian";
  if (codePoint <= 0x102df) return "Carian";
  if (codePoint <= 0x102ff) return "Coptic Epact";
  if (codePoint <= 0x1032f) return "Old Italic";
  if (codePoint <= 0x1034f) return "Gothic";
  if (codePoint <= 0x1037f) return "Old Permic";
  if (codePoint <= 0x1039f) return "Ugaritic";
  if (codePoint <= 0x103df) return "Old Persian";
  if (codePoint <= 0x1044f) return "Deseret";
  if (codePoint <= 0x1047f) return "Shavian";
  if (codePoint <= 0x104af) return "Osmanya";
  if (codePoint <= 0x104ff) return "Osage";
  if (codePoint <= 0x1052f) return "Elbasan";
  if (codePoint <= 0x1056f) return "Caucasian Albanian";
  if (codePoint <= 0x105bf) return "Vithkuqi";
  if (codePoint <= 0x1077f) return "Linear A";
  if (codePoint <= 0x107bf) return "Latin Extended-F";
  if (codePoint <= 0x1083f) return "Cypriot Syllabary";
  if (codePoint <= 0x1085f) return "Imperial Aramaic";
  if (codePoint <= 0x1087f) return "Palmyrene";
  if (codePoint <= 0x108af) return "Nabataean";
  if (codePoint <= 0x108ff) return "Hatran";
  if (codePoint <= 0x1091f) return "Phoenician";
  if (codePoint <= 0x1093f) return "Lydian";
  if (codePoint <= 0x1099f) return "Meroitic Hieroglyphs";
  if (codePoint <= 0x109ff) return "Meroitic Cursive";
  if (codePoint <= 0x10a5f) return "Kharoshthi";
  if (codePoint <= 0x10a7f) return "Old South Arabian";
  if (codePoint <= 0x10a9f) return "Old North Arabian";
  if (codePoint <= 0x10aff) return "Manichaean";
  if (codePoint <= 0x10b3f) return "Avestan";
  if (codePoint <= 0x10b5f) return "Inscriptional Parthian";
  if (codePoint <= 0x10b7f) return "Inscriptional Pahlavi";
  if (codePoint <= 0x10baf) return "Psalter Pahlavi";
  if (codePoint <= 0x10c4f) return "Old Turkic";
  if (codePoint <= 0x10cff) return "Old Hungarian";
  if (codePoint <= 0x10d3f) return "Hanifi Rohingya";
  if (codePoint <= 0x10e7f) return "Rumi Numeral";
  if (codePoint <= 0x10ebf) return "Yezidi";
  if (codePoint <= 0x10eff) return "Arabic Extended-C";
  if (codePoint <= 0x10f2f) return "Old Sogdian";
  if (codePoint <= 0x10f6f) return "Sogdian";
  if (codePoint <= 0x10faf) return "Old Uyghur";
  if (codePoint <= 0x10fdf) return "Chorasmian";
  if (codePoint <= 0x10fff) return "Elymaic";
  if (codePoint <= 0x1107f) return "Brahmi";
  if (codePoint <= 0x110cf) return "Kaithi";
  if (codePoint <= 0x110ff) return "Sora Sompeng";
  if (codePoint <= 0x1114f) return "Chakma";
  if (codePoint <= 0x1117f) return "Mahajani";
  if (codePoint <= 0x111df) return "Sharada";
  if (codePoint <= 0x111ff) return "Sinhala Archaic";
  if (codePoint <= 0x1124f) return "Khojki";
  if (codePoint <= 0x112af) return "Multani";
  if (codePoint <= 0x112ff) return "Khudawadi";
  if (codePoint <= 0x1137f) return "Grantha";
  if (codePoint <= 0x1147f) return "Newa";
  if (codePoint <= 0x114df) return "Tirhuta";
  if (codePoint <= 0x115ff) return "Siddham";
  if (codePoint <= 0x1165f) return "Modi";
  if (codePoint <= 0x1167f) return "Mongolian Supplement";
  if (codePoint <= 0x116cf) return "Takri";
  if (codePoint <= 0x1174f) return "Ahom";
  if (codePoint <= 0x1184f) return "Dogra";
  if (codePoint <= 0x118ff) return "Warang Citi";
  if (codePoint <= 0x1195f) return "Dives Akuru";
  if (codePoint <= 0x119ff) return "Nandinagari";
  if (codePoint <= 0x11a4f) return "Zanabazar Square";
  if (codePoint <= 0x11aaf) return "Soyombo";
  if (codePoint <= 0x11abf) return "Canadian Extended-A";
  if (codePoint <= 0x11aff) return "Pau Cin Hau";
  if (codePoint <= 0x11b5f) return "Devanagari Extended-A";
  if (codePoint <= 0x11c6f) return "Bhaiksuki";
  if (codePoint <= 0x11cbf) return "Marchen";
  if (codePoint <= 0x11d5f) return "Masaram Gondi";
  if (codePoint <= 0x11daf) return "Gunjala Gondi";
  if (codePoint <= 0x11eff) return "Makasar";
  if (codePoint <= 0x11f5f) return "Kawi";
  if (codePoint <= 0x11fbf) return "Lisu Supplement";
  if (codePoint <= 0x11fff) return "Tamil Supplement";
  if (codePoint <= 0x123ff) return "Cuneiform";
  if (codePoint <= 0x1247f) return "Cuneiform Numbers";
  if (codePoint <= 0x1254f) return "Early Dynastic Cuneiform";
  if (codePoint <= 0x12fff) return "Cypro-Minoan";
  if (codePoint <= 0x1342f) return "Egyptian Hieroglyphs";
  if (codePoint <= 0x1345f) return "Egyptian Format Controls";
  if (codePoint <= 0x1467f) return "Anatolian Hieroglyphs";
  if (codePoint <= 0x16a3f) return "Bamum Supplement";
  if (codePoint <= 0x16a6f) return "Mro";
  if (codePoint <= 0x16acf) return "Tangsa";
  if (codePoint <= 0x16aff) return "Bassa Vah";
  if (codePoint <= 0x16b8f) return "Pahawh Hmong";
  if (codePoint <= 0x16e9f) return "Medefaidrin";
  if (codePoint <= 0x16f9f) return "Miao";
  if (codePoint <= 0x16fff) return "Ideographic Symbols";
  if (codePoint <= 0x187ff) return "Tangut";
  if (codePoint <= 0x18aff) return "Tangut Components";
  if (codePoint <= 0x18cff) return "Khitan Small Script";
  if (codePoint <= 0x18d8f) return "Tangut Supplement";
  if (codePoint <= 0x1afff) return "Kana Extended-B";
  if (codePoint <= 0x1b0ff) return "Kana Supplement";
  if (codePoint <= 0x1b12f) return "Kana Extended-A";
  if (codePoint <= 0x1b16f) return "Small Kana Extension";
  if (codePoint <= 0x1b2ff) return "Nushu";
  if (codePoint <= 0x1bc9f) return "Duployan";
  if (codePoint <= 0x1bcaf) return "Shorthand Format";
  if (codePoint <= 0x1cfcf) return "Znamenny Musical";
  if (codePoint <= 0x1d0ff) return "Byzantine Musical";
  if (codePoint <= 0x1d1ff) return "Musical Symbols";
  if (codePoint <= 0x1d24f) return "Ancient Greek Musical";
  if (codePoint <= 0x1d2ff) return "Mayan Numerals";
  if (codePoint <= 0x1d35f) return "Tai Xuan Jing";
  if (codePoint <= 0x1d37f) return "Counting Rod";
  if (codePoint <= 0x1d7ff) return "Math Alphanumeric";
  if (codePoint <= 0x1daaf) return "Sutton SignWriting";
  if (codePoint <= 0x1dfff) return "Latin Extended-G";
  if (codePoint <= 0x1e02f) return "Glagolitic Supplement";
  if (codePoint <= 0x1e0ff) return "Nyiakeng Puachue Hmong";
  if (codePoint <= 0x1e15f) return "Wancho";
  if (codePoint <= 0x1e2bf) return "Nag Mundari";
  if (codePoint <= 0x1e2ff) return "Cyrillic Extended-D";
  if (codePoint <= 0x1e4ff) return "Nyiakeng Puachue Hmong";
  if (codePoint <= 0x1e5ff) return "Katakana Extended";
  if (codePoint <= 0x1e7ff) return "Kaktovik Numerals";
  if (codePoint <= 0x1e8ff) return "Mende Kikakui";
  if (codePoint <= 0x1e95f) return "Adlam";
  if (codePoint <= 0x1ecff) return "Indic Siyaq";
  if (codePoint <= 0x1edff) return "Ottoman Siyaq";
  if (codePoint <= 0x1eeff) return "Arabic Math";
  if (codePoint <= 0x1efff) return "Game Symbols";
  if (codePoint <= 0x1f02f) return "Domino Tiles";
  if (codePoint <= 0x1f09f) return "Mahjong Tiles";
  if (codePoint <= 0x1f0ff) return "Playing Cards";
  if (codePoint <= 0x1f1ff) return "Enclosed Alphanumeric Supplement";
  if (codePoint <= 0x1f2ff) return "Enclosed Ideographic Supplement";
  if (codePoint <= 0x1f5ff) return "Misc Symbols & Pictographs";
  if (codePoint <= 0x1f64f) return "Emoticons";
  if (codePoint <= 0x1f67f) return "Transport & Map";
  if (codePoint <= 0x1f77f) return "Alchemical Symbols";
  if (codePoint <= 0x1f7ff) return "Geometric Extended";
  if (codePoint <= 0x1f8ff) return "Supplemental Arrows-C";
  if (codePoint <= 0x1f9ff) return "Supplemental Symbols";
  if (codePoint <= 0x1faff) return "Chess Symbols";
  if (codePoint <= 0x1fbff) return "Symbols & Pictographs Extended-A";
  if (codePoint <= 0x1ffff) return "Symbols Supplement";
  return "Unknown";
}

export function isEmoji(codePoint: number): boolean {
  return (
    (codePoint >= 0x1f600 && codePoint <= 0x1f64f) || // emoticons
    (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) || // misc symbols & pictographs
    (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) || // transport & map
    (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) || // supplemental symbols
    (codePoint >= 0x1fa00 && codePoint <= 0x1faff) || // chess symbols, etc
    (codePoint >= 0x2600 && codePoint <= 0x26ff) || // misc symbols
    (codePoint >= 0x2700 && codePoint <= 0x27bf) || // dingbats
    codePoint === 0x231a ||
    codePoint === 0x231b ||
    codePoint === 0x23e9 ||
    codePoint === 0x23ea ||
    codePoint === 0x23ed ||
    codePoint === 0x23ee ||
    codePoint === 0x23ef ||
    codePoint === 0x23f0 ||
    codePoint === 0x23f3 ||
    codePoint === 0x25fd ||
    codePoint === 0x25fe ||
    codePoint === 0x2614 ||
    codePoint === 0x2615 ||
    codePoint === 0x2648 ||
    (codePoint >= 0x2649 && codePoint <= 0x2653) ||
    codePoint === 0x267f ||
    codePoint === 0x2693 ||
    codePoint === 0x26a1 ||
    codePoint === 0x26aa ||
    codePoint === 0x26ab ||
    codePoint === 0x26bd ||
    codePoint === 0x26be ||
    codePoint === 0x26c4 ||
    codePoint === 0x26c5 ||
    codePoint === 0x26ce ||
    codePoint === 0x26d4 ||
    codePoint === 0x26ea ||
    codePoint === 0x26f2 ||
    codePoint === 0x26f3 ||
    codePoint === 0x26f5 ||
    codePoint === 0x26fa ||
    codePoint === 0x26fd ||
    codePoint === 0x2705 ||
    codePoint === 0x2728 ||
    codePoint === 0x274c ||
    codePoint === 0x274e ||
    codePoint === 0x2753 ||
    codePoint === 0x2754 ||
    codePoint === 0x2755 ||
    codePoint === 0x2795 ||
    codePoint === 0x2796 ||
    codePoint === 0x2797 ||
    codePoint === 0x27b0 ||
    codePoint === 0x27bf ||
    codePoint === 0x2b50 ||
    codePoint === 0x2b55 ||
    codePoint === 0x00a9 ||
    codePoint === 0x00ae ||
    codePoint === 0x2122
  );
}
