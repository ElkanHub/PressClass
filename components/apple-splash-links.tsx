// components/apple-splash-links.tsx
// iOS apple-touch-startup-image links. Next.js metadata API doesn't yet
// expose the `media` attribute these need, so we render them as raw <link>
// tags in <head>. Each splash image matches one device class.

const SPLASHES: { w: number; h: number; ratio: number; media: string }[] = [
  // iPhone 14 Pro Max
  { w: 1290, h: 2796, ratio: 3, media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
  // iPhone 14 Pro
  { w: 1179, h: 2556, ratio: 3, media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
  // iPhone 14/13/12
  { w: 1170, h: 2532, ratio: 3, media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
  // iPhone 11 Pro Max / Xs Max
  { w: 1242, h: 2688, ratio: 3, media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
  // iPhone 11 Pro / Xs / X
  { w: 1125, h: 2436, ratio: 3, media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
  // iPhone 11 / XR
  { w: 828, h: 1792, ratio: 2, media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
  // iPhone SE / 8 / 7 / 6
  { w: 750, h: 1334, ratio: 2, media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
  // iPad Pro 12.9"
  { w: 2048, h: 2732, ratio: 2, media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" },
  // iPad Pro 11"
  { w: 1668, h: 2388, ratio: 2, media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" },
  // iPad Air
  { w: 1640, h: 2360, ratio: 2, media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2)" },
  // iPad (basic)
  { w: 1536, h: 2048, ratio: 2, media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" },
];

export function AppleSplashLinks() {
  return (
    <>
      {SPLASHES.map((s) => (
        <link
          key={`${s.w}x${s.h}`}
          rel="apple-touch-startup-image"
          href={`/icons/splash/apple-splash-${s.w}-${s.h}.png`}
          media={`${s.media} and (orientation: portrait)`}
        />
      ))}
    </>
  );
}
