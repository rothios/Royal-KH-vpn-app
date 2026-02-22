# Apsara VPN Manager — Design Ideas

## Design Approach: iOS Glass-Morphism Dark

**Design Movement:** iOS 17 Dark Mode + Liquid Glass Morphism

**Core Principles:**
1. Deep black backgrounds with translucent glass cards (backdrop-blur + rgba overlays)
2. iOS-style rounded corners (24px radius) and subtle border highlights
3. Vibrant accent colors (iOS Blue #0A84FF, iOS Green #30D158) against dark backgrounds
4. Mobile-first, phone-frame centered layout mimicking a native iOS app

**Color Philosophy:**
- Background: Pure black (#000) with blurred abstract wallpaper
- Cards: rgba(20,20,20,0.75) with 1px white/12% border
- Primary: #0A84FF (iOS Blue)
- Success: #30D158 (iOS Green)
- Text: White with opacity hierarchy (100%, 60%, 40%, 30%)

**Layout Paradigm:**
- Centered phone-frame container (max-width ~430px)
- Fixed bottom dock navigation (iOS-style pill)
- Full-height scrollable content area
- Overlapping modals with backdrop blur

**Signature Elements:**
1. Glowing radial gradient blobs behind cards
2. Animated spinning border loader with logo center
3. Pill-shaped bottom dock with active state glow

**Interaction Philosophy:**
- Scale(0.98) on card press (iOS haptic feel)
- Smooth tab transitions with sliding indicator
- Toast notifications sliding up from bottom

**Animation:**
- fadeIn: opacity 0→1 + scale 0.98→1 on tab switch
- Pulse glow on status indicator
- Bell shake animation for notifications
- Float animation on mascot/logo elements

**Typography System:**
- Primary: SF Pro Display (system font fallback)
- Accent: Koulen (for Khmer language support)
- Hierarchy: 24px bold headers, 15px body, 10px uppercase labels

---

Selected approach: **iOS Glass-Morphism Dark** — faithful replication of the reference site's aesthetic.
