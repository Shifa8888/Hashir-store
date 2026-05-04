import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "./utils/cn";

type ThemeName = "light" | "dark" | "minimal" | "luxury" | "colorful";
type View = "auth" | "home" | "catalog" | "product" | "wishlist" | "cart" | "checkout" | "dashboard";
type AuthMode = "login" | "signup";
type ProductCategory = "Electronics" | "Fashion" | "Home Appliances" | "Beauty" | "Sports";

type Theme = {
  label: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  accentStrong: string;
  secondary: string;
  border: string;
  hero: string;
  backdrop: string;
  shadow: string;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  stock: string;
  description: string;
  features: string[];
  image: string;
};

type CartItem = {
  productId: string;
  quantity: number;
};

type CartLine = CartItem & {
  product: Product;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Shipped" | "Processing";
  items: string[];
};

type HeroSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  category: ProductCategory;
  image: string;
  cta: string;
};

type Profile = {
  name: string;
  email: string;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  region: string;
  zip: string;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "paypal" | "applepay";
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const themes: Record<ThemeName, Theme> = {
  light: {
    label: "Light",
    bg: "#f5f7fb",
    surface: "#ffffff",
    surfaceAlt: "#eef2ff",
    card: "rgba(255, 255, 255, 0.82)",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#4f46e5",
    accentText: "#ffffff",
    accentSoft: "#e0e7ff",
    accentStrong: "#312e81",
    secondary: "#ec4899",
    border: "rgba(148, 163, 184, 0.24)",
    hero: "linear-gradient(135deg, #eef2ff 0%, #ffffff 38%, #fdf2f8 100%)",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(99, 102, 241, 0.16), transparent 34%), radial-gradient(circle at 82% 0%, rgba(236, 72, 153, 0.14), transparent 28%)",
    shadow: "0 20px 60px rgba(99, 102, 241, 0.08)",
  },
  dark: {
    label: "Dark",
    bg: "#081020",
    surface: "#0f172a",
    surfaceAlt: "#111c33",
    card: "rgba(15, 23, 42, 0.78)",
    text: "#e2e8f0",
    muted: "#94a3b8",
    accent: "#818cf8",
    accentText: "#081020",
    accentSoft: "#1e1b4b",
    accentStrong: "#c7d2fe",
    secondary: "#22d3ee",
    border: "rgba(148, 163, 184, 0.16)",
    hero: "linear-gradient(135deg, #172554 0%, #0f172a 42%, #082f49 100%)",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(129, 140, 248, 0.16), transparent 32%), radial-gradient(circle at 82% 0%, rgba(34, 211, 238, 0.12), transparent 30%)",
    shadow: "0 24px 80px rgba(2, 6, 23, 0.45)",
  },
  minimal: {
    label: "Minimal",
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    card: "rgba(255, 255, 255, 0.88)",
    text: "#111827",
    muted: "#6b7280",
    accent: "#111827",
    accentText: "#ffffff",
    accentSoft: "#e5e7eb",
    accentStrong: "#000000",
    secondary: "#64748b",
    border: "rgba(17, 24, 39, 0.08)",
    hero: "linear-gradient(135deg, #ffffff 0%, #f8fafc 42%, #e2e8f0 100%)",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(17, 24, 39, 0.08), transparent 30%), radial-gradient(circle at 82% 0%, rgba(100, 116, 139, 0.08), transparent 24%)",
    shadow: "0 20px 55px rgba(15, 23, 42, 0.06)",
  },
  luxury: {
    label: "Luxury",
    bg: "#110c08",
    surface: "#1a130e",
    surfaceAlt: "#241b14",
    card: "rgba(29, 20, 14, 0.78)",
    text: "#f8ecd8",
    muted: "#d0bca4",
    accent: "#d4af37",
    accentText: "#110c08",
    accentSoft: "#3b2a12",
    accentStrong: "#f5d979",
    secondary: "#b87a33",
    border: "rgba(212, 175, 55, 0.16)",
    hero: "linear-gradient(135deg, #2b2116 0%, #140f0b 42%, #3c2a17 100%)",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(212, 175, 55, 0.14), transparent 34%), radial-gradient(circle at 82% 0%, rgba(184, 122, 51, 0.12), transparent 28%)",
    shadow: "0 24px 80px rgba(0, 0, 0, 0.36)",
  },
  colorful: {
    label: "Colorful",
    bg: "#fff7ed",
    surface: "#ffffff",
    surfaceAlt: "#ffedd5",
    card: "rgba(255, 255, 255, 0.82)",
    text: "#231942",
    muted: "#6d6875",
    accent: "#7c3aed",
    accentText: "#ffffff",
    accentSoft: "#f3e8ff",
    accentStrong: "#4c1d95",
    secondary: "#f97316",
    border: "rgba(124, 58, 237, 0.14)",
    hero: "linear-gradient(135deg, #fdf2f8 0%, #fef3c7 42%, #ede9fe 100%)",
    backdrop:
      "radial-gradient(circle at 20% 18%, rgba(249, 115, 22, 0.16), transparent 34%), radial-gradient(circle at 82% 0%, rgba(124, 58, 237, 0.16), transparent 32%)",
    shadow: "0 22px 70px rgba(124, 58, 237, 0.10)",
  },
};

const products: Product[] = [
  {
    id: "macbook-air-m3",
    name: "MacBook Air M3 13-inch",
    brand: "Apple",
    category: "Electronics",
    price: 1299,
    originalPrice: 1399,
    rating: 4.9,
    reviews: 1184,
    badge: "Best Seller",
    stock: "In stock • Ships today",
    description:
      "Apple's ultra-portable MacBook Air M3 delivers all-day battery life, a brilliant Liquid Retina display, and flagship performance for creators, founders, and remote teams.",
    features: ["M3 chip with 8-core GPU", "Up to 18 hours battery life", "MagSafe charging + two Thunderbolt ports"],
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sony-wh1000xm5",
    name: "WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    price: 399,
    originalPrice: 449,
    rating: 4.8,
    reviews: 932,
    badge: "Noise Canceling",
    stock: "Low stock • 7 left",
    description:
      "A studio-grade listening experience with adaptive noise canceling, crystal-clear calls, and soft-fit comfort for long workdays and travel.",
    features: ["Industry-leading ANC", "30-hour battery", "Multipoint Bluetooth pairing"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "galaxy-watch6-classic",
    name: "Galaxy Watch6 Classic",
    brand: "Samsung",
    category: "Electronics",
    price: 349,
    originalPrice: 399,
    rating: 4.7,
    reviews: 514,
    badge: "Smart Wellness",
    stock: "In stock • Free band upgrade",
    description:
      "Stay on top of workouts, sleep recovery, and day-to-day productivity with a premium smartwatch built for Android power users.",
    features: ["Advanced sleep coaching", "Rotating bezel design", "Fitness, GPS, and health insights"],
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "zara-structured-blazer",
    name: "Structured Tailored Blazer",
    brand: "Zara",
    category: "Fashion",
    price: 119,
    originalPrice: 149,
    rating: 4.6,
    reviews: 286,
    badge: "New Season",
    stock: "In stock • Tailored fit",
    description:
      "A sharp wardrobe essential with premium drape, refined lapels, and an effortless silhouette designed to transition from office to evening.",
    features: ["Lightweight premium blend", "Modern tailored cut", "Neutral tone styling"],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "levis-trucker-jacket",
    name: "Trucker Denim Jacket",
    brand: "Levi's",
    category: "Fashion",
    price: 89,
    originalPrice: 109,
    rating: 4.7,
    reviews: 463,
    badge: "Iconic Layer",
    stock: "In stock • Extended sizes",
    description:
      "An iconic denim layer with timeless structure, subtle stretch, and the versatility to anchor both casual and streetwear looks.",
    features: ["Classic trucker silhouette", "Washed indigo finish", "Everyday layering essential"],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nike-pegasus-40",
    name: "Air Zoom Pegasus 40",
    brand: "Nike",
    category: "Sports",
    price: 139,
    originalPrice: 170,
    rating: 4.8,
    reviews: 741,
    badge: "Runner Favorite",
    stock: "In stock • Fast delivery",
    description:
      "Nike's trusted road runner returns with energized cushioning, breathable support, and a locked-in fit for daily miles or weekend training.",
    features: ["Responsive Zoom Air units", "Breathable engineered mesh", "Balanced support for everyday runs"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "philips-air-fryer-5000",
    name: "5000 Series Air Fryer XL",
    brand: "Philips",
    category: "Home Appliances",
    price: 229,
    originalPrice: 279,
    rating: 4.7,
    reviews: 618,
    badge: "Kitchen Upgrade",
    stock: "In stock • Free recipe guide",
    description:
      "Create crisp, healthier meals with rapid air technology, generous family-sized capacity, and presets that simplify weeknight cooking.",
    features: ["Rapid Air circulation", "XL family capacity", "Smart presets for quick meals"],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "roomba-combo-i5",
    name: "Roomba Combo i5",
    brand: "iRobot",
    category: "Home Appliances",
    price: 449,
    originalPrice: 529,
    rating: 4.5,
    reviews: 352,
    badge: "Smart Cleaning",
    stock: "In stock • 2-year warranty",
    description:
      "Hands-free floor care with intelligent mapping, powerful pickup, and wet-mop compatibility designed for busy homes and hybrid work routines.",
    features: ["Learns your floor plan", "Vacuums and mops", "App scheduling + voice assistants"],
    image: "https://images.unsplash.com/photo-1581579188871-45ea61f2a6c8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dyson-purifier-cool",
    name: "Purifier Cool Formaldehyde",
    brand: "Dyson",
    category: "Home Appliances",
    price: 749,
    originalPrice: 829,
    rating: 4.8,
    reviews: 277,
    badge: "Premium Air Care",
    stock: "In stock • White glove shipping",
    description:
      "A high-performance purifier and cooling fan that captures microscopic particles while delivering refined air quality intelligence in real time.",
    features: ["Sealed HEPA H13 filtration", "Air quality LCD reporting", "Captures allergens and odors"],
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dyson-airwrap-complete",
    name: "Airwrap Complete Long",
    brand: "Dyson",
    category: "Beauty",
    price: 599,
    originalPrice: 649,
    rating: 4.8,
    reviews: 689,
    badge: "Editor Pick",
    stock: "In stock • Limited colorway",
    description:
      "Create salon-level curls, waves, and smooth finishes with intelligent heat control and a multi-styler designed for fast, healthy styling.",
    features: ["Multiple styling attachments", "Intelligent heat control", "Fast drying + smoothing"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "advanced-night-repair",
    name: "Advanced Night Repair Serum",
    brand: "Estée Lauder",
    category: "Beauty",
    price: 92,
    originalPrice: 110,
    rating: 4.9,
    reviews: 1541,
    badge: "Cult Favorite",
    stock: "In stock • Travel size included",
    description:
      "A restorative overnight serum that targets hydration, radiance, and visible smoothness with a formula trusted in premium skincare routines worldwide.",
    features: ["Deep hydration complex", "Lightweight nightly repair", "Radiance-boosting formula"],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "theragun-mini",
    name: "Theragun Mini",
    brand: "Therabody",
    category: "Sports",
    price: 199,
    originalPrice: 229,
    rating: 4.6,
    reviews: 401,
    badge: "Recovery Essential",
    stock: "In stock • Carry pouch included",
    description:
      "Portable muscle recovery with a compact form factor, quiet-force power, and deep tissue relief for travel, training blocks, and post-work sessions.",
    features: ["Compact percussion therapy", "QuietForce Technology", "Travel-ready design"],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "wilson-evolution-basketball",
    name: "Evolution Indoor Basketball",
    brand: "Wilson",
    category: "Sports",
    price: 74,
    originalPrice: 89,
    rating: 4.8,
    reviews: 520,
    badge: "Game Ready",
    stock: "In stock • Ships in 24h",
    description:
      "The go-to indoor game ball for serious players, featuring a soft feel composite cover and reliable grip for training and competition.",
    features: ["Soft touch composite cover", "Moisture-wicking channels", "Trusted for indoor play"],
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "nintendo-switch-oled",
    name: "Nintendo Switch OLED",
    brand: "Nintendo",
    category: "Electronics",
    price: 349,
    originalPrice: 379,
    rating: 4.9,
    reviews: 889,
    badge: "Family Fun",
    stock: "In stock • Bundle deal live",
    description:
      "A brighter handheld-console experience with a vivid OLED display, flexible play modes, and easy access to couch co-op, indie titles, and travel gaming.",
    features: ["7-inch OLED screen", "Docked or handheld play", "Enhanced audio + wide kickstand"],
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80",
  },
];

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Next-gen essentials",
    title: "Upgrade your everyday setup with premium tech and smart devices.",
    copy:
      "Discover flagship laptops, immersive audio, wearables, and entertainment picks curated for modern work, play, and travel.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    cta: "Shop electronics",
  },
  {
    eyebrow: "Refined style",
    title: "Fresh fashion edits designed for elevated, effortless dressing.",
    copy:
      "From tailored blazers to iconic denim and street-ready layers, build a wardrobe that looks polished on every screen and every street.",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    cta: "Explore fashion",
  },
  {
    eyebrow: "Home meets wellness",
    title: "Bring smart comfort, beauty, and healthy living into every room.",
    copy:
      "Curate your home with purifier-grade air, stress-free appliances, and premium beauty favorites that elevate everyday routines.",
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    cta: "Refresh your home",
  },
  {
    eyebrow: "Move better",
    title: "Performance gear and recovery essentials built for active lifestyles.",
    copy:
      "Train, recover, and compete with footwear, therapy tools, and sports gear selected to support high-energy routines.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80",
    cta: "Shop sports",
  },
];

const categorySummaries: Record<ProductCategory, { blurb: string; metric: string }> = {
  Electronics: {
    blurb: "Premium gadgets, workstations, audio, and entertainment tech.",
    metric: "120+ smart picks",
  },
  Fashion: {
    blurb: "Modern silhouettes, refined textures, and versatile wardrobe staples.",
    metric: "Weekly new drops",
  },
  "Home Appliances": {
    blurb: "Smart living essentials for comfort, cooking, and air quality.",
    metric: "Fast-install favorites",
  },
  Beauty: {
    blurb: "Skincare and styling icons trusted by beauty enthusiasts.",
    metric: "Top-rated formulas",
  },
  Sports: {
    blurb: "Run, recover, and perform with athlete-inspired gear.",
    metric: "Performance curated",
  },
};

const defaultProfile: Profile = {
  name: "Avery Stone",
  email: "avery@novacart.com",
};

const starterOrders: Order[] = [
  {
    id: "NC-2048",
    date: "Apr 28, 2026",
    total: 538,
    status: "Delivered",
    items: ["sony-wh1000xm5", "nike-pegasus-40"],
  },
  {
    id: "NC-1982",
    date: "Apr 12, 2026",
    total: 229,
    status: "Delivered",
    items: ["philips-air-fryer-5000"],
  },
  {
    id: "NC-1874",
    date: "Mar 30, 2026",
    total: 92,
    status: "Shipped",
    items: ["advanced-night-repair"],
  },
];

const defaultCheckoutForm: CheckoutForm = {
  fullName: defaultProfile.name,
  email: defaultProfile.email,
  address: "58 Market Street",
  city: "San Francisco",
  region: "CA",
  zip: "94105",
  shippingMethod: "standard",
  paymentMethod: "card",
  cardName: "Avery Stone",
  cardNumber: "4242 4242 4242 4242",
  expiry: "09/28",
  cvv: "424",
};

const categories: Array<"All" | ProductCategory> = [
  "All",
  "Electronics",
  "Fashion",
  "Home Appliances",
  "Beauty",
  "Sports",
];

const navItems: Array<{ label: string; view: Exclude<View, "auth" | "product" | "checkout"> }> = [
  { label: "Home", view: "home" },
  { label: "Catalog", view: "catalog" },
  { label: "Wishlist", view: "wishlist" },
  { label: "Cart", view: "cart" },
  { label: "Dashboard", view: "dashboard" },
];

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusTone(status: Order["status"], theme: Theme): CSSProperties {
  if (status === "Delivered") {
    return {
      backgroundColor: theme.accentSoft,
      color: theme.accentStrong,
      borderColor: theme.border,
    };
  }

  if (status === "Shipped") {
    return {
      backgroundColor: theme.surfaceAlt,
      color: theme.secondary,
      borderColor: theme.border,
    };
  }

  return {
    backgroundColor: theme.surfaceAlt,
    color: theme.text,
    borderColor: theme.border,
  };
}

function SurfaceCard({
  theme,
  className,
  children,
  style,
}: {
  theme: Theme;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("border backdrop-blur-2xl", className)}
      style={{
        background: theme.card,
        borderColor: theme.border,
        boxShadow: theme.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ActionButton({
  theme,
  variant = "primary",
  className,
  children,
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  theme: Theme;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variantStyle: Record<NonNullable<typeof variant>, CSSProperties> = {
    primary: {
      backgroundColor: theme.accent,
      color: theme.accentText,
      borderColor: theme.accent,
    },
    secondary: {
      backgroundColor: theme.surfaceAlt,
      color: theme.text,
      borderColor: theme.border,
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.text,
      borderColor: theme.border,
    },
  };

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      style={{ ...variantStyle[variant], ...style }}
    >
      {children}
    </button>
  );
}

function TextField({
  theme,
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  theme: Theme;
  label: string;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span style={{ color: theme.muted }}>{label}</span>
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2",
          className,
        )}
        style={{
          backgroundColor: theme.surfaceAlt,
          borderColor: theme.border,
          color: theme.text,
          boxShadow: `0 0 0 0 ${theme.accent}`,
        }}
      />
    </label>
  );
}

function ThemeSwitcher({
  activeTheme,
  onChange,
  theme,
  compact = false,
  className,
}: {
  activeTheme: ThemeName;
  onChange: (themeName: ThemeName) => void;
  theme: Theme;
  compact?: boolean;
  className?: string;
}) {
  const entries = Object.entries(themes) as Array<[ThemeName, Theme]>;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {entries.map(([name, palette]) => {
        const active = name === activeTheme;

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition duration-300 hover:-translate-y-0.5",
              compact ? "min-w-0" : "min-w-[108px] justify-center",
            )}
            style={{
              backgroundColor: active ? palette.accent : theme.surfaceAlt,
              color: active ? palette.accentText : theme.text,
              borderColor: active ? palette.accent : theme.border,
            }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: `linear-gradient(135deg, ${palette.accent}, ${palette.secondary})` }}
            />
            {!compact && palette.label}
          </button>
        );
      })}
    </div>
  );
}

function ProductCard({
  product,
  theme,
  wished,
  onOpen,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product;
  theme: Theme;
  wished: boolean;
  onOpen: (id: string) => void;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
}) {
  return (
    <SurfaceCard theme={theme} className="shine-card group flex h-full flex-col overflow-hidden rounded-[28px]">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/4.3] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span
            className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.72)",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.18)",
            }}
          >
            {product.badge}
          </span>
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className="rounded-full border px-3 py-2 text-sm font-semibold backdrop-blur-xl transition duration-300 hover:scale-105"
            style={{
              backgroundColor: wished ? theme.accent : "rgba(255, 255, 255, 0.88)",
              color: wished ? theme.accentText : theme.text,
              borderColor: wished ? theme.accent : "rgba(255, 255, 255, 0.28)",
            }}
          >
            {wished ? "Saved" : "♡"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: theme.muted }}>
            {product.category}
          </p>
          <button
            type="button"
            onClick={() => onOpen(product.id)}
            className="text-left text-lg font-semibold leading-tight transition duration-300 hover:opacity-80"
            style={{ color: theme.text }}
          >
            {product.name}
          </button>
          <p className="text-sm" style={{ color: theme.muted }}>
            {product.brand}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="tracking-[0.24em] text-amber-400">★★★★★</span>
          <span style={{ color: theme.muted }}>
            {product.rating.toFixed(1)} • {product.reviews} reviews
          </span>
        </div>

        <p className="text-sm leading-6" style={{ color: theme.muted }}>
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-xl font-bold" style={{ color: theme.text }}>
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm line-through" style={{ color: theme.muted }}>
              {formatCurrency(product.originalPrice)}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <ActionButton theme={theme} variant="secondary" className="px-4 py-2" onClick={() => onOpen(product.id)}>
              Details
            </ActionButton>
            <ActionButton theme={theme} className="px-4 py-2" onClick={() => onAddToCart(product.id)}>
              Add to cart
            </ActionButton>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

function EmptyState({
  theme,
  title,
  copy,
  actionLabel,
  onAction,
}: {
  theme: Theme;
  title: string;
  copy: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <SurfaceCard theme={theme} className="rounded-[32px] p-8 text-center sm:p-10">
      <div className="mx-auto max-w-xl space-y-4">
        <span
          className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ backgroundColor: theme.surfaceAlt, color: theme.accentStrong, borderColor: theme.border }}
        >
          NovaCart
        </span>
        <h3 className="text-2xl font-semibold" style={{ color: theme.text }}>
          {title}
        </h3>
        <p className="text-sm leading-7 sm:text-base" style={{ color: theme.muted }}>
          {copy}
        </p>
        <div className="pt-2">
          <ActionButton theme={theme} onClick={onAction}>
            {actionLabel}
          </ActionButton>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function App() {
  const [themeName, setThemeName] = useState<ThemeName>(() => readStoredValue<ThemeName>("novacart-theme", "light"));
  const [profile, setProfile] = useState<Profile>(() => readStoredValue<Profile>("novacart-profile", defaultProfile));
  const [authenticated, setAuthenticated] = useState<boolean>(() => readStoredValue<boolean>("novacart-auth", false));
  const [activeView, setActiveView] = useState<View>(() => (readStoredValue<boolean>("novacart-auth", false) ? "home" : "auth"));
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState({ name: "", email: defaultProfile.email, password: "" });
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [search, setSearch] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>(() => readStoredValue<string[]>("novacart-wishlist", []));
  const [cart, setCart] = useState<CartItem[]>(() => readStoredValue<CartItem[]>("novacart-cart", []));
  const [notification, setNotification] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(() => readStoredValue<CheckoutForm>("novacart-checkout", defaultCheckoutForm));
  const [orders, setOrders] = useState<Order[]>(() => readStoredValue<Order[]>("novacart-orders", starterOrders));

  const theme = themes[themeName];

  const productMap = useMemo(
    () =>
      products.reduce<Record<string, Product>>((accumulator, product) => {
        accumulator[product.id] = product;
        return accumulator;
      }, {}),
    [],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory;
      const haystack = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const cartLines = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productMap[item.productId];
          return product ? { ...item, product } : null;
        })
        .filter((item): item is CartLine => item !== null),
    [cart, productMap],
  );

  const wishlistProducts = useMemo(
    () => wishlist.map((productId) => productMap[productId]).filter(Boolean),
    [productMap, wishlist],
  );

  const selectedProduct = productMap[selectedProductId] ?? products[0];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartLines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = checkoutForm.shippingMethod === "express" ? 24 : subtotal > 500 ? 0 : cartLines.length > 0 ? 12 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;
  const lifetimeSpend = orders.reduce((sum, order) => sum + order.total, 0);

  const favoriteCategories = useMemo(() => {
    const counts = new Map<ProductCategory, number>();

    orders.forEach((order) => {
      order.items.forEach((productId) => {
        const product = productMap[productId];
        if (product) {
          counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
        }
      });
    });

    wishlist.forEach((productId) => {
      const product = productMap[productId];
      if (product) {
        counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
      }
    });

    const sorted = [...counts.entries()].sort((left, right) => right[1] - left[1]).map(([category]) => category);
    return sorted.length > 0 ? sorted.slice(0, 4) : categories.slice(1, 5);
  }, [orders, productMap, wishlist]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBannerIndex((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("novacart-theme", JSON.stringify(themeName));
    window.localStorage.setItem("novacart-profile", JSON.stringify(profile));
    window.localStorage.setItem("novacart-auth", JSON.stringify(authenticated));
    window.localStorage.setItem("novacart-wishlist", JSON.stringify(wishlist));
    window.localStorage.setItem("novacart-cart", JSON.stringify(cart));
    window.localStorage.setItem("novacart-checkout", JSON.stringify(checkoutForm));
    window.localStorage.setItem("novacart-orders", JSON.stringify(orders));
  }, [authenticated, cart, checkoutForm, orders, profile, themeName, wishlist]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  useEffect(() => {
    const title = authenticated
      ? `NovaCart • ${
          activeView === "home"
            ? "Home"
            : activeView === "catalog"
              ? "Catalog"
              : activeView === "product"
                ? selectedProduct.name
                : activeView === "wishlist"
                  ? "Wishlist"
                  : activeView === "cart"
                    ? "Cart"
                    : activeView === "checkout"
                      ? "Checkout"
                      : "Dashboard"
        }`
      : "NovaCart • Welcome";

    document.title = title;
  }, [activeView, authenticated, selectedProduct.name]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = window.setTimeout(() => setNotification(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const showToast = (message: string) => setNotification(message);

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView("product");
  };

  const addToCart = (productId: string, quantity = 1, quiet = false) => {
    const product = productMap[productId];
    if (!product) {
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...current, { productId, quantity }];
    });

    if (!quiet) {
      showToast(`${product.name} added to cart`);
    }
  };

  const updateCartQuantity = (productId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      showToast("Item removed from cart");
      return;
    }

    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item)),
    );
  };

  const removeFromCart = (productId: string) => {
    const product = productMap[productId];
    setCart((current) => current.filter((item) => item.productId !== productId));
    if (product) {
      showToast(`${product.name} removed from cart`);
    }
  };

  const toggleWishlist = (productId: string) => {
    const product = productMap[productId];
    if (!product) {
      return;
    }

    setWishlist((current) => {
      const exists = current.includes(productId);
      showToast(exists ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
      return exists ? current.filter((id) => id !== productId) : [...current, productId];
    });
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fallbackName = authForm.email.split("@")[0]?.replace(/[._-]/g, " ") || defaultProfile.name;
    const computedName = authMode === "signup" && authForm.name.trim() ? authForm.name.trim() : fallbackName;

    setProfile({
      name: computedName
        .split(" ")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" "),
      email: authForm.email,
    });
    setCheckoutForm((current) => ({
      ...current,
      fullName: computedName,
      email: authForm.email,
      cardName: computedName,
    }));
    setAuthenticated(true);
    setActiveView("home");
    showToast(authMode === "signup" ? "Account created successfully" : "Welcome back to NovaCart");
    setAuthForm((current) => ({ ...current, password: "" }));
  };

  const logout = () => {
    setAuthenticated(false);
    setActiveView("auth");
    showToast("Signed out successfully");
  };

  const openCategory = (category: ProductCategory | "All") => {
    setSelectedCategory(category);
    setActiveView("catalog");
  };

  const buyNow = (productId: string) => {
    addToCart(productId, 1, true);
    setActiveView("checkout");
    setCheckoutStep(1);
    showToast("Ready for express checkout");
  };

  const placeOrder = () => {
    const orderId = `NC-${String(Date.now()).slice(-4)}`;
    const createdOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      total,
      status: "Processing",
      items: cartLines.map((line) => line.productId),
    };

    setOrders((current) => [createdOrder, ...current]);
    setCart([]);
    setCheckoutStep(1);
    setActiveView("dashboard");
    showToast(`Order ${orderId} placed successfully`);
  };

  const renderHome = () => {
    const currentSlide = heroSlides[bannerIndex];
    const spotlight = products.find((product) => product.category === currentSlide.category) ?? products[0];
    const featuredProducts = filteredProducts.slice(0, 8);
    const topRated = [...products].sort((left, right) => right.rating - left.rating).slice(0, 3);

    return (
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <SurfaceCard theme={theme} className="relative overflow-hidden rounded-[36px] p-8 sm:p-10 lg:p-12">
            <img src={currentSlide.image} alt={currentSlide.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div
              className="absolute inset-0 opacity-90"
              style={{ background: "linear-gradient(90deg, rgba(2, 6, 23, 0.68) 0%, rgba(2, 6, 23, 0.22) 62%, rgba(2, 6, 23, 0.08) 100%)" }}
            />

            <div className="relative z-10 max-w-2xl space-y-6 text-white">
              <div key={bannerIndex} className="page-shell space-y-6">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-xl">
                  {currentSlide.eyebrow}
                </span>
                <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  {currentSlide.title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                  {currentSlide.copy}
                </p>
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    theme={theme}
                    onClick={() => openCategory(currentSlide.category)}
                    style={{ backgroundColor: "#ffffff", color: "#0f172a", borderColor: "rgba(255,255,255,0.18)" }}
                  >
                    {currentSlide.cta}
                  </ActionButton>
                  <ActionButton
                    theme={theme}
                    variant="ghost"
                    onClick={() => setActiveView("wishlist")}
                    style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.28)" }}
                  >
                    Curate wishlist
                  </ActionButton>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setBannerIndex(index)}
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: index === bannerIndex ? 48 : 18,
                      backgroundColor: index === bannerIndex ? "#ffffff" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>
          </SurfaceCard>

          <div className="grid gap-6">
            <SurfaceCard theme={theme} className="rounded-[32px] p-6 sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                    Spotlight pick
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold" style={{ color: theme.text }}>
                    {spotlight.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                    {spotlight.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWishlist(spotlight.id)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }}
                >
                  {wishlist.includes(spotlight.id) ? "Saved" : "Save"}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:items-center">
                <img src={spotlight.image} alt={spotlight.name} className="aspect-[4/3.7] w-full rounded-[24px] object-cover" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="tracking-[0.24em] text-amber-400">★★★★★</span>
                    <span style={{ color: theme.muted }}>
                      {spotlight.rating.toFixed(1)} • {spotlight.reviews} reviews
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <p className="text-3xl font-bold" style={{ color: theme.text }}>
                      {formatCurrency(spotlight.price)}
                    </p>
                    <p className="pb-1 text-sm line-through" style={{ color: theme.muted }}>
                      {formatCurrency(spotlight.originalPrice)}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: theme.muted }}>
                    {spotlight.features.map((feature) => (
                      <p key={feature}>• {feature}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <ActionButton theme={theme} onClick={() => addToCart(spotlight.id)}>
                      Add to cart
                    </ActionButton>
                    <ActionButton theme={theme} variant="secondary" onClick={() => openProduct(spotlight.id)}>
                      View details
                    </ActionButton>
                  </div>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard theme={theme} className="rounded-[32px] p-6 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "5", label: "Animated themes" },
                  { value: "24h", label: "Fast dispatch" },
                  { value: "30d", label: "Returns window" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border p-4"
                    style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                  >
                    <p className="text-2xl font-bold" style={{ color: theme.text }}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] border p-5" style={{ backgroundColor: theme.hero, borderColor: theme.border }}>
                <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: theme.accentStrong }}>
                  Personalized styling and smarter shopping
                </p>
                <p className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                  Switch themes instantly, save favorites, manage cart items, and move through checkout with polished transitions across every device.
                </p>
              </div>
            </SurfaceCard>
          </div>
        </section>

        <div className="overflow-hidden rounded-full border py-3" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="marquee-track text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
            {Array.from({ length: 2 }).map((_, outerIndex) => (
              <div key={outerIndex} className="flex items-center gap-8 px-6">
                {[
                  "Electronics",
                  "Fashion",
                  "Home Appliances",
                  "Beauty",
                  "Sports",
                  "Wishlist",
                  "Secure Checkout",
                  "Fast Delivery",
                ].map((item) => (
                  <span key={`${outerIndex}-${item}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Premium curation",
              copy: "Real brands, refined selections, and quality-first merchandising.",
            },
            {
              title: "Responsive by design",
              copy: "A polished shopping flow across mobile, tablet, and desktop screens.",
            },
            {
              title: "Smooth interactions",
              copy: "Hover states, banner transitions, and lightweight animated details.",
            },
            {
              title: "Confident checkout",
              copy: "Saved details, clear summaries, and a frictionless purchase path.",
            },
          ].map((item) => (
            <SurfaceCard key={item.title} theme={theme} className="rounded-[28px] p-6">
              <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                {item.copy}
              </p>
            </SurfaceCard>
          ))}
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Category edit
              </p>
              <h2 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                Browse collections your way
              </h2>
            </div>
            <ActionButton theme={theme} variant="secondary" onClick={() => setActiveView("catalog")}>
              Open full catalog
            </ActionButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {(categories.slice(1) as ProductCategory[]).map((category) => {
              const preview = products.find((product) => product.category === category) ?? products[0];
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => openCategory(category)}
                  className="group overflow-hidden rounded-[30px] border text-left transition duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: theme.card, borderColor: theme.border, boxShadow: theme.shadow }}
                >
                  <div className="relative">
                    <img
                      src={preview.image}
                      alt={category}
                      className="aspect-[4/4.8] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-lg font-semibold">{category}</p>
                      <p className="mt-2 text-sm text-white/80">{categorySummaries[category].metric}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7" style={{ color: theme.muted }}>
                      {categorySummaries[category].blurb}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Featured products
              </p>
              <h2 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                High-converting picks across every category
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: selectedCategory === category ? theme.accent : theme.surfaceAlt,
                    color: selectedCategory === category ? theme.accentText : theme.text,
                    borderColor: selectedCategory === category ? theme.accent : theme.border,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  theme={theme}
                  wished={wishlist.includes(product.id)}
                  onOpen={openProduct}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              theme={theme}
              title="No matches in the featured selection"
              copy="Try clearing your search or switching to another category to continue exploring premium products."
              actionLabel="Reset filters"
              onAction={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            />
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <SurfaceCard theme={theme} className="relative overflow-hidden rounded-[34px] p-8 sm:p-10">
            <div className="absolute inset-0 opacity-90" style={{ background: theme.hero }} />
            <div className="relative z-10 max-w-2xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accentStrong }}>
                Exclusive member benefits
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: theme.text }}>
                Build a personalized shopping rhythm with saved themes, wishlists, and seamless checkout.
              </h2>
              <p className="text-sm leading-7 sm:text-base" style={{ color: theme.muted }}>
                NovaCart is designed like a premium digital storefront: visual merchandising up front, frictionless purchase flow in the middle, and smart account management at the end.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <ActionButton theme={theme} onClick={() => setActiveView("dashboard")}>
                  Open dashboard
                </ActionButton>
                <ActionButton theme={theme} variant="secondary" onClick={() => setActiveView("cart")}>
                  Review cart
                </ActionButton>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard theme={theme} className="rounded-[34px] p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                  Top rated now
                </p>
                <h3 className="mt-2 text-2xl font-semibold" style={{ color: theme.text }}>
                  Trusted by customers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveView("catalog")}
                className="text-sm font-semibold transition duration-300 hover:opacity-70"
                style={{ color: theme.accentStrong }}
              >
                Browse all →
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {topRated.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => openProduct(product.id)}
                  className="flex w-full items-center gap-4 rounded-[24px] border p-3 text-left transition duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                >
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-[18px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
                      {product.category}
                    </p>
                    <p className="mt-2 truncate text-base font-semibold" style={{ color: theme.text }}>
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                      {product.rating.toFixed(1)} rating • {formatCurrency(product.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    );
  };

  const renderCatalog = () => {
    return (
      <div className="space-y-6">
        <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Catalog
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: theme.text }}>
                Explore curated products across premium categories
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 sm:text-base" style={{ color: theme.muted }}>
                Filter by category, search by product or brand, and move smoothly from inspiration to checkout.
              </p>
            </div>
            <div className="rounded-[24px] border px-5 py-4" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                {filteredProducts.length} results found
              </p>
              <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                {selectedCategory === "All" ? "All categories" : selectedCategory}
                {search ? ` • Search: “${search}”` : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: selectedCategory === category ? theme.accent : theme.surfaceAlt,
                  color: selectedCategory === category ? theme.accentText : theme.text,
                  borderColor: selectedCategory === category ? theme.accent : theme.border,
                }}
              >
                {category}
              </button>
            ))}
            <ActionButton
              theme={theme}
              variant="ghost"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Reset
            </ActionButton>
          </div>
        </SurfaceCard>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                theme={theme}
                wished={wishlist.includes(product.id)}
                onOpen={openProduct}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            theme={theme}
            title="No products match your filters"
            copy="Adjust the search term, switch to another category, or reset everything to see all curated items again."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          />
        )}
      </div>
    );
  };

  const renderProduct = () => {
    const relatedProducts = products
      .filter((product) => product.category === selectedProduct.category && product.id !== selectedProduct.id)
      .slice(0, 4);

    return (
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => setActiveView("catalog")}
          className="text-sm font-semibold transition duration-300 hover:opacity-70"
          style={{ color: theme.accentStrong }}
        >
          ← Back to catalog
        </button>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SurfaceCard theme={theme} className="overflow-hidden rounded-[34px] p-4 sm:p-6">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-[4/4.1] w-full rounded-[28px] object-cover" />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Category", value: selectedProduct.category },
                { label: "Badge", value: selectedProduct.badge },
                { label: "Availability", value: selectedProduct.stock },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border p-4"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6" style={{ color: theme.text }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <div className="space-y-6">
            <SurfaceCard theme={theme} className="rounded-[34px] p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                {selectedProduct.brand}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: theme.text }}>
                {selectedProduct.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="tracking-[0.24em] text-amber-400">★★★★★</span>
                <span style={{ color: theme.muted }}>
                  {selectedProduct.rating.toFixed(1)} rating • {selectedProduct.reviews} verified reviews
                </span>
              </div>

              <div className="mt-5 flex items-end gap-4">
                <p className="text-4xl font-bold" style={{ color: theme.text }}>
                  {formatCurrency(selectedProduct.price)}
                </p>
                <p className="pb-1 text-lg line-through" style={{ color: theme.muted }}>
                  {formatCurrency(selectedProduct.originalPrice)}
                </p>
              </div>

              <p className="mt-6 text-sm leading-7 sm:text-base" style={{ color: theme.muted }}>
                {selectedProduct.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {selectedProduct.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border px-4 py-2 text-sm font-medium"
                    style={{ backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Delivery", copy: "Fast shipping in 1–3 business days." },
                  { title: "Returns", copy: "30-day returns with prepaid labels." },
                  { title: "Support", copy: "Dedicated product help and order care." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[22px] border p-4" style={{ borderColor: theme.border }}>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionButton theme={theme} onClick={() => addToCart(selectedProduct.id)}>
                  Add to cart
                </ActionButton>
                <ActionButton theme={theme} variant="secondary" onClick={() => buyNow(selectedProduct.id)}>
                  Buy now
                </ActionButton>
                <ActionButton theme={theme} variant="ghost" onClick={() => toggleWishlist(selectedProduct.id)}>
                  {wishlist.includes(selectedProduct.id) ? "Saved to wishlist" : "Save to wishlist"}
                </ActionButton>
              </div>
            </SurfaceCard>

            <SurfaceCard theme={theme} className="rounded-[34px] p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                    Why customers love it
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-7" style={{ color: theme.muted }}>
                    <li>• Crafted around premium materials and real-world performance.</li>
                    <li>• Easy to combine with other picks in your cart or wishlist.</li>
                    <li>• Merchandise-ready presentation with trusted brand appeal.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                    Included with your order
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-7" style={{ color: theme.muted }}>
                    <li>• Original branded packaging and authenticity guarantee.</li>
                    <li>• Standard warranty coverage and customer care support.</li>
                    <li>• Order tracking updates through the dashboard.</li>
                  </ul>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
              Related picks
            </p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
              More from {selectedProduct.category}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                theme={theme}
                wished={wishlist.includes(product.id)}
                onOpen={openProduct}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderWishlist = () => {
    return wishlistProducts.length === 0 ? (
      <EmptyState
        theme={theme}
        title="Your wishlist is ready for curation"
        copy="Save standout products you want to compare, revisit later, or move into your cart when the timing feels right."
        actionLabel="Explore catalog"
        onAction={() => setActiveView("catalog")}
      />
    ) : (
      <div className="space-y-6">
        <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Wishlist
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: theme.text }}>
                Saved products worth coming back to
              </h1>
            </div>
            <p className="text-sm" style={{ color: theme.muted }}>
              {wishlistProducts.length} item{wishlistProducts.length === 1 ? "" : "s"} saved
            </p>
          </div>
        </SurfaceCard>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              theme={theme}
              wished={wishlist.includes(product.id)}
              onOpen={openProduct}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderCart = () => {
    return cartLines.length === 0 ? (
      <EmptyState
        theme={theme}
        title="Your cart is currently empty"
        copy="Add products from any category, review the live totals, and then move through a polished checkout flow."
        actionLabel="Start shopping"
        onAction={() => setActiveView("catalog")}
      />
    ) : (
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                  Shopping cart
                </p>
                <h1 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                  Review your selected products
                </h1>
              </div>
              <p className="text-sm" style={{ color: theme.muted }}>
                {cartCount} item{cartCount === 1 ? "" : "s"} in cart
              </p>
            </div>
          </SurfaceCard>

          {cartLines.map((line) => (
            <SurfaceCard key={line.productId} theme={theme} className="rounded-[30px] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={line.product.image} alt={line.product.name} className="h-28 w-full rounded-[24px] object-cover sm:w-32" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
                        {line.product.category}
                      </p>
                      <button
                        type="button"
                        onClick={() => openProduct(line.product.id)}
                        className="mt-2 text-left text-xl font-semibold transition duration-300 hover:opacity-75"
                        style={{ color: theme.text }}
                      >
                        {line.product.name}
                      </button>
                      <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                        {line.product.stock}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold" style={{ color: theme.text }}>
                        {formatCurrency(line.product.price * line.quantity)}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                        {formatCurrency(line.product.price)} each
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border p-1" style={{ borderColor: theme.border }}>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(line.productId, line.quantity - 1)}
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        −
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold" style={{ color: theme.text }}>
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(line.productId, line.quantity + 1)}
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <ActionButton theme={theme} variant="secondary" onClick={() => toggleWishlist(line.productId)}>
                        {wishlist.includes(line.productId) ? "Saved" : "Save"}
                      </ActionButton>
                      <ActionButton theme={theme} variant="ghost" onClick={() => removeFromCart(line.productId)}>
                        Remove
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>

        <div className="space-y-4">
          <SurfaceCard theme={theme} className="sticky top-28 rounded-[34px] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
              Order summary
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Subtotal</span>
                <span style={{ color: theme.text }}>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Shipping</span>
                <span style={{ color: theme.text }}>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Tax</span>
                <span style={{ color: theme.text }}>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-4" style={{ borderColor: theme.border }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold" style={{ color: theme.text }}>
                    Total
                  </span>
                  <span className="text-2xl font-bold" style={{ color: theme.text }}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <ActionButton
                theme={theme}
                className="w-full"
                onClick={() => {
                  setCheckoutStep(1);
                  setActiveView("checkout");
                }}
              >
                Proceed to checkout
              </ActionButton>
              <ActionButton theme={theme} variant="secondary" className="w-full" onClick={() => setActiveView("catalog")}>
                Continue shopping
              </ActionButton>
            </div>

            <div className="mt-6 rounded-[24px] border p-4" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Delivery promise
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                Free standard shipping on orders over {formatCurrency(500)} and express checkout support for premium items.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    );
  };

  const renderCheckout = () => {
    if (cartLines.length === 0) {
      return (
        <EmptyState
          theme={theme}
          title="Checkout is waiting for your cart"
          copy="Add a few premium products first, then come back to finish shipping, payment, and order review."
          actionLabel="Go to catalog"
          onAction={() => setActiveView("catalog")}
        />
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                  Checkout
                </p>
                <h1 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                  Secure purchase flow in three clear steps
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Shipping", "Payment", "Review"].map((stepLabel, index) => {
                  const isActive = checkoutStep === index + 1;
                  const isComplete = checkoutStep > index + 1;

                  return (
                    <span
                      key={stepLabel}
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: isActive || isComplete ? theme.accent : theme.surfaceAlt,
                        color: isActive || isComplete ? theme.accentText : theme.text,
                        borderColor: isActive || isComplete ? theme.accent : theme.border,
                      }}
                    >
                      {index + 1}. {stepLabel}
                    </span>
                  );
                })}
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
            {checkoutStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                    Shipping details
                  </h2>
                  <p className="mt-2 text-sm leading-7" style={{ color: theme.muted }}>
                    Confirm your destination and select the delivery experience that fits your timeline.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    theme={theme}
                    label="Full name"
                    value={checkoutForm.fullName}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, fullName: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="Email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, email: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="Address"
                    className="sm:col-span-2"
                    value={checkoutForm.address}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, address: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="City"
                    value={checkoutForm.city}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, city: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="Region"
                    value={checkoutForm.region}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, region: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="ZIP code"
                    value={checkoutForm.zip}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, zip: event.target.value }))}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      key: "standard",
                      title: "Standard delivery",
                      copy: shippingCost === 0 ? "Free with your order" : "2–4 business days",
                    },
                    {
                      key: "express",
                      title: "Express delivery",
                      copy: "Next business day • premium handling",
                    },
                  ].map((option) => {
                    const active = checkoutForm.shippingMethod === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setCheckoutForm((current) => ({
                            ...current,
                            shippingMethod: option.key as CheckoutForm["shippingMethod"],
                          }))
                        }
                        className="rounded-[24px] border p-5 text-left transition duration-300 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: active ? theme.accentSoft : theme.surfaceAlt,
                          borderColor: active ? theme.accent : theme.border,
                        }}
                      >
                        <p className="font-semibold" style={{ color: theme.text }}>
                          {option.title}
                        </p>
                        <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                          {option.copy}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                    Payment method
                  </h2>
                  <p className="mt-2 text-sm leading-7" style={{ color: theme.muted }}>
                    Choose how you want to pay and verify the essentials for a smooth and secure confirmation.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { key: "card", label: "Credit / debit card" },
                    { key: "paypal", label: "PayPal" },
                    { key: "applepay", label: "Apple Pay" },
                  ].map((option) => {
                    const active = checkoutForm.paymentMethod === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setCheckoutForm((current) => ({
                            ...current,
                            paymentMethod: option.key as CheckoutForm["paymentMethod"],
                          }))
                        }
                        className="rounded-[24px] border p-5 text-left transition duration-300 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: active ? theme.accentSoft : theme.surfaceAlt,
                          borderColor: active ? theme.accent : theme.border,
                        }}
                      >
                        <p className="font-semibold" style={{ color: theme.text }}>
                          {option.label}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    theme={theme}
                    label="Name on card"
                    value={checkoutForm.cardName}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, cardName: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="Card number"
                    value={checkoutForm.cardNumber}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, cardNumber: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="Expiry"
                    value={checkoutForm.expiry}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, expiry: event.target.value }))}
                  />
                  <TextField
                    theme={theme}
                    label="CVV"
                    value={checkoutForm.cvv}
                    onChange={(event) => setCheckoutForm((current) => ({ ...current, cvv: event.target.value }))}
                  />
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                    Review and confirm
                  </h2>
                  <p className="mt-2 text-sm leading-7" style={{ color: theme.muted }}>
                    Double-check delivery, payment, and your selected products before final confirmation.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border p-5" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
                      Shipping
                    </p>
                    <div className="mt-3 space-y-2 text-sm leading-6" style={{ color: theme.text }}>
                      <p>{checkoutForm.fullName}</p>
                      <p>{checkoutForm.address}</p>
                      <p>
                        {checkoutForm.city}, {checkoutForm.region} {checkoutForm.zip}
                      </p>
                      <p>{checkoutForm.email}</p>
                    </div>
                  </div>
                  <div className="rounded-[24px] border p-5" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: theme.muted }}>
                      Payment
                    </p>
                    <div className="mt-3 space-y-2 text-sm leading-6" style={{ color: theme.text }}>
                      <p className="capitalize">Method: {checkoutForm.paymentMethod}</p>
                      <p>Name: {checkoutForm.cardName}</p>
                      <p>Card ending: {checkoutForm.cardNumber.slice(-4)}</p>
                      <p>Delivery: {checkoutForm.shippingMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {cartLines.map((line) => (
                    <div
                      key={line.productId}
                      className="flex items-center justify-between gap-4 rounded-[22px] border px-4 py-3"
                      style={{ borderColor: theme.border }}
                    >
                      <div>
                        <p className="font-semibold" style={{ color: theme.text }}>
                          {line.product.name}
                        </p>
                        <p className="text-sm" style={{ color: theme.muted }}>
                          Qty {line.quantity} • {line.product.category}
                        </p>
                      </div>
                      <p className="font-semibold" style={{ color: theme.text }}>
                        {formatCurrency(line.product.price * line.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {checkoutStep > 1 && (
                <ActionButton theme={theme} variant="secondary" onClick={() => setCheckoutStep((current) => current - 1)}>
                  Back
                </ActionButton>
              )}
              {checkoutStep < 3 ? (
                <ActionButton theme={theme} onClick={() => setCheckoutStep((current) => current + 1)}>
                  Continue
                </ActionButton>
              ) : (
                <ActionButton theme={theme} onClick={placeOrder}>
                  Place order
                </ActionButton>
              )}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-4">
          <SurfaceCard theme={theme} className="sticky top-28 rounded-[34px] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
              Order overview
            </p>
            <div className="mt-5 space-y-4">
              {cartLines.map((line) => (
                <div key={line.productId} className="flex items-center gap-4 rounded-[22px] border p-3" style={{ borderColor: theme.border }}>
                  <img src={line.product.image} alt={line.product.name} className="h-16 w-16 rounded-[16px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold" style={{ color: theme.text }}>
                      {line.product.name}
                    </p>
                    <p className="text-sm" style={{ color: theme.muted }}>
                      Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: theme.text }}>
                    {formatCurrency(line.product.price * line.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t pt-5 text-sm" style={{ borderColor: theme.border }}>
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Subtotal</span>
                <span style={{ color: theme.text }}>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Shipping</span>
                <span style={{ color: theme.text }}>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                <span>Tax</span>
                <span style={{ color: theme.text }}>{formatCurrency(tax)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold" style={{ color: theme.text }}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border p-4" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Security & trust
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                Encrypted checkout UI, transparent totals, and order history synced to your dashboard experience.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const recommendedProducts = products.filter((product) => !wishlist.includes(product.id)).slice(0, 4);

    return (
      <div className="space-y-6">
        <SurfaceCard theme={theme} className="relative overflow-hidden rounded-[36px] p-8 sm:p-10">
          <div className="absolute inset-0 opacity-95" style={{ background: theme.hero }} />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accentStrong }}>
                Account dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl" style={{ color: theme.text }}>
                Welcome back, {profile.name.split(" ")[0]}.
              </h1>
              <p className="mt-4 text-sm leading-7 sm:text-base" style={{ color: theme.muted }}>
                Track orders, revisit favorite categories, switch themes, and continue shopping from a clean, modern control center.
              </p>
            </div>

            <div className="rounded-[28px] border p-5" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Active theme: {themes[themeName].label}
              </p>
              <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                Personalized storefront styling updates instantly with animated transitions.
              </p>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Orders placed", value: String(orders.length) },
            { label: "Lifetime spend", value: formatCurrency(lifetimeSpend) },
            { label: "Wishlist items", value: String(wishlist.length) },
            { label: "Cart items", value: String(cartCount) },
          ].map((item) => (
            <SurfaceCard key={item.label} theme={theme} className="rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: theme.muted }}>
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-bold" style={{ color: theme.text }}>
                {item.value}
              </p>
            </SurfaceCard>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                  Recent orders
                </p>
                <h2 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                  Order history and fulfillment
                </h2>
              </div>
              <ActionButton theme={theme} variant="secondary" onClick={() => setActiveView("catalog")}>
                Shop more
              </ActionButton>
            </div>

            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[26px] border p-5" style={{ borderColor: theme.border }}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold" style={{ color: theme.text }}>
                        {order.id}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                        {order.date} • {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="rounded-full border px-4 py-2 text-sm font-semibold" style={statusTone(order.status, theme)}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((productId) => (
                      <span
                        key={`${order.id}-${productId}`}
                        className="rounded-full border px-3 py-2 text-sm"
                        style={{ backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }}
                      >
                        {productMap[productId]?.name ?? "Premium product"}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm" style={{ color: theme.muted }}>
                      Order total
                    </p>
                    <p className="text-lg font-semibold" style={{ color: theme.text }}>
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <div className="space-y-6">
            <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-base font-bold"
                  style={{ backgroundColor: theme.accent, color: theme.accentText }}
                >
                  {getInitials(profile.name)}
                </div>
                <div>
                  <p className="text-xl font-semibold" style={{ color: theme.text }}>
                    {profile.name}
                  </p>
                  <p className="text-sm" style={{ color: theme.muted }}>
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                  <span>Preferred shipping</span>
                  <span style={{ color: theme.text }}>{checkoutForm.shippingMethod}</span>
                </div>
                <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                  <span>Saved city</span>
                  <span style={{ color: theme.text }}>{checkoutForm.city}</span>
                </div>
                <div className="flex items-center justify-between" style={{ color: theme.muted }}>
                  <span>Loyalty tier</span>
                  <span style={{ color: theme.text }}>Premium</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <ActionButton theme={theme} onClick={() => setActiveView("wishlist")}>
                  Open wishlist
                </ActionButton>
                <ActionButton theme={theme} variant="secondary" onClick={() => setActiveView("cart")}>
                  Review cart
                </ActionButton>
              </div>
            </SurfaceCard>

            <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Favorite categories
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {favoriteCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => openCategory(category as ProductCategory)}
                    className="rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                    style={{ backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7" style={{ color: theme.muted }}>
                These preferences are generated from your orders and saved items to keep discovery relevant.
              </p>
            </SurfaceCard>

            <SurfaceCard theme={theme} className="rounded-[34px] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Theme studio
              </p>
              <h3 className="mt-2 text-2xl font-semibold" style={{ color: theme.text }}>
                Switch your storefront mood instantly
              </h3>
              <p className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                Move between light, dark, minimal, luxury, and colorful experiences with animated visual transitions.
              </p>
              <ThemeSwitcher activeTheme={themeName} onChange={setThemeName} theme={theme} className="mt-5" />
            </SurfaceCard>
          </div>
        </div>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                Recommended next
              </p>
              <h2 className="mt-2 text-3xl font-semibold" style={{ color: theme.text }}>
                Continue discovering standout products
              </h2>
            </div>
            <ActionButton theme={theme} variant="secondary" onClick={() => setActiveView("catalog")}>
              Browse catalog
            </ActionButton>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                theme={theme}
                wished={wishlist.includes(product.id)}
                onOpen={openProduct}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderStoreView = () => {
    switch (activeView) {
      case "home":
        return renderHome();
      case "catalog":
        return renderCatalog();
      case "product":
        return renderProduct();
      case "wishlist":
        return renderWishlist();
      case "cart":
        return renderCart();
      case "checkout":
        return renderCheckout();
      case "dashboard":
        return renderDashboard();
      default:
        return renderHome();
    }
  };

  const appShellStyle: CSSProperties = {
    backgroundColor: theme.bg,
    color: theme.text,
    transition: "background-color 450ms ease, color 450ms ease",
  };

  if (!authenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={appShellStyle}>
        <div className="pointer-events-none fixed inset-0" style={{ backgroundImage: theme.backdrop }} />

        <div className="relative z-10 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <SurfaceCard theme={theme} className="relative overflow-hidden rounded-[38px] p-8 sm:p-10 lg:p-12" style={{ background: theme.hero }}>
              <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-white/20 blur-3xl float-slow" />
              <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl float-slower" />
              <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl orbital" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
                      style={{ backgroundColor: theme.accent, color: theme.accentText }}
                    >
                      N
                    </div>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: theme.accentStrong }}>
                      NovaCart Storefront
                    </p>
                  </div>
                  <ThemeSwitcher activeTheme={themeName} onChange={setThemeName} theme={theme} compact />
                </div>

                <div className="max-w-2xl space-y-6">
                  <span
                    className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ backgroundColor: theme.surface, color: theme.accentStrong, borderColor: theme.border }}
                  >
                    Animated authentication experience
                  </span>
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ color: theme.text }}>
                    A fully modern eCommerce experience that starts with a memorable first impression.
                  </h1>
                  <p className="max-w-xl text-base leading-8 sm:text-lg" style={{ color: theme.muted }}>
                    Sign in or create an account to enter a multi-theme storefront with category-led discovery, real product merchandising, smooth transitions, wishlist, cart, checkout, and dashboard views.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: "5", label: "Seamless themes" },
                    { value: "24/7", label: "Responsive shopping" },
                    { value: "1-click", label: "Fast curated flow" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[26px] border p-5" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                      <p className="text-3xl font-bold" style={{ color: theme.text }}>
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {products.slice(0, 2).map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(
                        "rounded-[28px] border p-4 backdrop-blur-2xl",
                        index === 0 ? "float-slow" : "float-slower",
                      )}
                      style={{ backgroundColor: theme.card, borderColor: theme.border }}
                    >
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="h-24 w-24 rounded-[20px] object-cover" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                            {product.category}
                          </p>
                          <p className="mt-2 text-lg font-semibold" style={{ color: theme.text }}>
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm" style={{ color: theme.muted }}>
                            {formatCurrency(product.price)} • {product.badge}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>

            <div className="flex items-center justify-center">
              <SurfaceCard theme={theme} className="w-full rounded-[38px] p-6 sm:p-8 lg:p-9">
                <div className="flex flex-wrap gap-3">
                  {(["login", "signup"] as AuthMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAuthMode(mode)}
                      className="rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                      style={{
                        backgroundColor: authMode === mode ? theme.accent : theme.surfaceAlt,
                        color: authMode === mode ? theme.accentText : theme.text,
                        borderColor: authMode === mode ? theme.accent : theme.border,
                      }}
                    >
                      {mode === "login" ? "Login" : "Sign up"}
                    </button>
                  ))}
                </div>

                <div className="mt-8 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.muted }}>
                    Access your storefront
                  </p>
                  <h2 className="text-3xl font-semibold" style={{ color: theme.text }}>
                    {authMode === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-sm leading-7" style={{ color: theme.muted }}>
                    Use any email and password to enter the demo experience and explore the complete eCommerce flow.
                  </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleAuthSubmit}>
                  {authMode === "signup" && (
                    <TextField
                      theme={theme}
                      label="Full name"
                      placeholder="Avery Stone"
                      value={authForm.name}
                      onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                      required
                    />
                  )}
                  <TextField
                    theme={theme}
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={authForm.email}
                    onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                  <TextField
                    theme={theme}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={authForm.password}
                    onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm" style={{ color: theme.muted }}>
                    <span>Fully animated demo flow</span>
                    <span>Responsive across all devices</span>
                  </div>

                  <ActionButton theme={theme} type="submit" className="mt-2 w-full">
                    {authMode === "login" ? "Enter NovaCart" : "Create account and continue"}
                  </ActionButton>
                </form>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Homepage with sliding hero banners",
                    "Product detail, cart, and checkout flow",
                    "Wishlist and customer dashboard",
                    "Five switchable visual themes",
                  ].map((item) => (
                    <div key={item} className="rounded-[22px] border p-4 text-sm leading-6" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.muted }}>
                      {item}
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>

        {notification && (
          <div
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-3 text-sm font-semibold shadow-xl"
            style={{ backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }}
          >
            {notification}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-24 lg:pb-10" style={appShellStyle}>
      <div className="pointer-events-none fixed inset-0" style={{ backgroundImage: theme.backdrop }} />

      <header
        className="sticky top-0 z-40 border-b backdrop-blur-2xl"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <button type="button" onClick={() => setActiveView("home")} className="flex items-center gap-4 text-left">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold"
                  style={{ backgroundColor: theme.accent, color: theme.accentText }}
                >
                  N
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: theme.muted }}>
                    NovaCart
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: theme.text }}>
                    Modern commerce for curated living
                  </p>
                </div>
              </button>

              <div className="flex flex-1 flex-col gap-3 xl:mx-8 xl:max-w-3xl xl:flex-row xl:items-center">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, brands, or categories"
                  className="w-full min-w-0 rounded-full border px-5 py-3 text-sm outline-none transition duration-300"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.text }}
                />
                <ThemeSwitcher activeTheme={themeName} onChange={setThemeName} theme={theme} compact className="xl:hidden" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView("wishlist")}
                  className="rounded-full border px-3 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 sm:px-4 sm:py-3"
                  style={{ backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }}
                >
                  <span className="sm:hidden">♡ {wishlist.length}</span>
                  <span className="hidden sm:inline">Wishlist ({wishlist.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("cart")}
                  className="rounded-full border px-3 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 sm:px-4 sm:py-3"
                  style={{ backgroundColor: theme.accent, color: theme.accentText, borderColor: theme.accent }}
                >
                  <span className="sm:hidden">⊡ {cartCount}</span>
                  <span className="hidden sm:inline">Cart ({cartCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("dashboard")}
                  className="flex items-center gap-3 rounded-full border px-3 py-2 transition duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: theme.accent, color: theme.accentText }}
                  >
                    {getInitials(profile.name)}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs uppercase tracking-[0.24em]" style={{ color: theme.muted }}>
                      Account
                    </span>
                    <span className="block text-sm font-semibold" style={{ color: theme.text }}>
                      {profile.name}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <nav className="hidden flex-wrap gap-2 lg:flex">
                {navItems.map((item) => {
                  const active = activeView === item.view;
                  return (
                    <button
                      key={item.view}
                      type="button"
                      onClick={() => setActiveView(item.view)}
                      className="rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
                      style={{
                        backgroundColor: active ? theme.accent : theme.surfaceAlt,
                        color: active ? theme.accentText : theme.text,
                        borderColor: active ? theme.accent : theme.border,
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <ThemeSwitcher activeTheme={themeName} onChange={setThemeName} theme={theme} className="hidden xl:flex" compact />
                <ActionButton theme={theme} variant="ghost" onClick={logout}>
                  Sign out
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main key={activeView} className="page-shell relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {renderStoreView()}
      </main>

      <div
        className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-1 rounded-full border px-2 py-2 backdrop-blur-2xl sm:max-w-xl sm:gap-2 lg:hidden"
        style={{ backgroundColor: theme.card, borderColor: theme.border, boxShadow: theme.shadow }}
      >
        {navItems.map((item) => {
          const active = activeView === item.view;
          const icons: Record<string, string> = {
            home: "⌂",
            catalog: "◫",
            wishlist: "♡",
            cart: "⊡",
            dashboard: "◉",
          };
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setActiveView(item.view)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition duration-300 sm:flex-row sm:gap-1 sm:px-3 sm:py-3 sm:text-xs sm:tracking-[0.18em]"
              style={{
                backgroundColor: active ? theme.accent : "transparent",
                color: active ? theme.accentText : theme.text,
              }}
            >
              <span className="text-base leading-none sm:hidden">{icons[item.view]}</span>
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>

      {notification && (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-3 text-sm font-semibold shadow-xl lg:bottom-6"
          style={{ backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }}
        >
          {notification}
        </div>
      )}
    </div>
  );
}
