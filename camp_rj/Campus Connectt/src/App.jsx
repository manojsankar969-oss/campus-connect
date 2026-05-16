// ═══════════════════════════════════════════════════════════════
//  CampusConnect — Premium Redesign v2
//  Theme: Crimson Red · True Black · Pure White
//  Design: Clash Display (display) + Satoshi (body)
//  Auth: Mutable userStore → register() auto-logs in
//  Tech: React · Context API · Custom Router · useEffect · JWT-sim
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { useState, useEffect, useContext, createContext, useReducer, useCallback } from "react";


// ─── HELPERS ──────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

// ─── MOCK DATA ────────────────────────────────────────────────
const mockListings = [
  { id: "1",  title: "Engineering Mathematics Vol 2",  price: 180, category: "Books",       seller: "Ravi Kumar",  image: "📚", condition: "Good",      description: "MTU syllabus, minimal highlights. Very useful for sem 3.",         date: "2024-12-01", sold: false },
  { id: "2",  title: "Scientific Calculator FX-991",   price: 350, category: "Electronics", seller: "Priya Meena", image: "🔢", condition: "Excellent", description: "Casio FX-991ES Plus, barely used. Includes protective cover.",      date: "2024-12-03", sold: false },
  { id: "3",  title: "Lab Coat (Size M)",              price:  90, category: "Lab Kit",     seller: "Arjun S",     image: "🥼", condition: "Fair",      description: "Used one semester, washed and clean.",                             date: "2024-12-05", sold: false },
  { id: "4",  title: "Hostel Study Lamp",              price: 220, category: "Hostel",      seller: "Meera T",     image: "💡", condition: "Good",      description: "LED lamp with USB charging port, works perfectly.",               date: "2024-12-07", sold: false },
  { id: "5",  title: "Data Structures Textbook",       price: 250, category: "Books",       seller: "Admin User",  image: "📗", condition: "Excellent", description: "Classic Cormen CLRS, 3rd edition. No marks.",                     date: "2024-12-08", sold: false },
  { id: "6",  title: "Drawing Instruments Kit",        price: 150, category: "Lab Kit",     seller: "Divya N",     image: "📐", condition: "Good",      description: "Full set — compass, scale, mini drafter.",                        date: "2024-12-10", sold: false },
  { id: "7",  title: "Wireless Mouse (Logitech M185)", price: 300, category: "Electronics", seller: "Kiran Das",   image: "🖱️", condition: "Excellent", description: "Logitech M185, wireless with USB receiver. Works flawlessly.",       date: "2024-12-12", sold: false },
  { id: "8",  title: "Hostel Bedside Organizer",      price: 130, category: "Hostel",      seller: "Ravi Kumar",  image: "🛏️", condition: "Fair",      description: "Hanging organizer with multiple pockets, some wear on edges.",       date: "2024-12-14", sold: false },
  { id: "9",  title: "Computer Networks Textbook",    price: 270, category: "Books",       seller: "Priya Meena", image: "📘", condition: "Good",      description: "Tanenbaum's Computer Networks, 5th edition. Some underlines.",     date: "2024-12-15", sold: false },
  { id: "10", title: "USB Flash Drive 64GB",          price: 400, category: "Electronics", seller: "Admin User",  image: "💾", condition: "Excellent", description: "SanDisk Ultra Flair, USB 3.0, used for one semester.",              date: "2024-12-17", sold: false },
  { id: "11", title: "Hostel Laundry Bag",           price:  80, category: "Hostel",      seller: "Meera T",     image: "🧺", condition: "Good",      description: "Foldable laundry bag with handles, used but clean.",              date: "2024-12-18", sold: false },
  { id: "12", title: "Mechanical Engg. Textbook",    price: 260, category: "Books",       seller: "Arjun S",     image: "📙", condition: "Fair",      description: "Shigley's Mechanical Engineering Design, 10th edition. Some notes.", date: "2024-12-20", sold: false },
  { id: "13", title: "Bluetooth Earphones",          price: 450, category: "Electronics", seller: "Divya N",     image: "🎧", condition: "Excellent", description: "Redmi AirDots Pro, Bluetooth 5.0, excellent sound quality.",       date: "2024-12-21", sold: false },
  { id: "14", title: "Hostel Storage Box",          price: 110, category: "Hostel",      seller: "Kiran Das",   image: "📦", condition: "Good",      description: "Plastic storage box with lid, some scratches.",                    date: "2024-12-22", sold: false },
  { id: "15", title: "Operating Systems Textbook",   price: 240, category: "Books",       seller: "Ravi Kumar",  image: "📕", condition: "Fair",      description: "Silberschatz Operating System Concepts, 9th edition. Highlighted.", date: "2024-12-23", sold: false },
];

const mockLostFound = [
  { id: "lf1",  type: "Lost",  title: "Blue Casio Watch",          location: "Library Block",        date: "2024-12-09", claimedBy: null, description: "Blue strap, digital display, lost near reading hall.",                  image: "⌚", postedBy: "Ravi Kumar"   },
  { id: "lf2",  type: "Found", title: "Tata Sky ID Card",          location: "Canteen",              date: "2024-12-10", claimedBy: null, description: "Found on table near counter 3. Name: Anand Raj.",                       image: "🪪", postedBy: "Priya Meena"  },
  { id: "lf3",  type: "Lost",  title: "Physics Lab Manual",        location: "Block B Lab",          date: "2024-12-11", claimedBy: null, description: "Purple cover, Reg No. 22CSE045 written inside.",                        image: "📔", postedBy: "Meera T"      },
  { id: "lf4",  type: "Found", title: "Earphones (JBL)",           location: "Sports Ground",        date: "2024-12-12", claimedBy: null, description: "Black JBL earphones in case. Found after PT class.",                    image: "🎧", postedBy: "Arjun S"      },
  { id: "lf5",  type: "Lost",  title: "HP Laptop Charger 65W",     location: "Room 204, Hostel A",   date: "2024-12-13", claimedBy: null, description: "Black HP charger with blue tip, left on desk.",                         image: "🔌", postedBy: "Kiran Das"    },
  { id: "lf6",  type: "Found", title: "Maths Notebook (Green)",    location: "Classroom 3B",         date: "2024-12-13", claimedBy: null, description: "Green notebook with formulas, found under bench.",                      image: "📗", postedBy: "Deepa R"      },
  { id: "lf7",  type: "Lost",  title: "Bluetooth Speaker JBL Go",  location: "Common Room",          date: "2024-12-14", claimedBy: null, description: "Small red JBL Go 3 speaker, missing since Tuesday.",                   image: "🔊", postedBy: "Ravi Kumar"   },
  { id: "lf8",  type: "Found", title: "Prescription Glasses",      location: "Library 2nd Floor",   date: "2024-12-14", claimedBy: null, description: "Black frame spectacles in brown case. Power −2.5.",                    image: "👓", postedBy: "Admin User"   },
  { id: "lf9",  type: "Lost",  title: "Green Water Bottle",        location: "Sports Ground",        date: "2024-12-15", claimedBy: null, description: "Stainless steel bottle, name 'Meera' written on it.",                  image: "🍶", postedBy: "Meera T"      },
  { id: "lf10", type: "Found", title: "USB-C Hub (Silver)",        location: "Computer Lab",         date: "2024-12-15", claimedBy: null, description: "7-in-1 USB hub found near workstation 12.",                             image: "🔗", postedBy: "Arjun S"      },
  { id: "lf11", type: "Lost",  title: "Analog Wristwatch",         location: "Canteen",              date: "2024-12-16", claimedBy: null, description: "Brown leather strap, TITAN brand, gold dial.",                         image: "⌚", postedBy: "Priya Meena"  },
  { id: "lf12", type: "Found", title: "Bus Pass (TNSTC)",          location: "Main Gate",            date: "2024-12-16", claimedBy: null, description: "Monthly pass, photo ID visible. Route 47B.",                           image: "🎫", postedBy: "Kiran Das"    },
  { id: "lf13", type: "Lost",  title: "Purple Umbrella",           location: "Dept. of CSE Block",   date: "2024-12-17", claimedBy: null, description: "Foldable purple umbrella with floral print.",                          image: "☂️", postedBy: "Divya N"      },
  { id: "lf14", type: "Found", title: "AirPods (2nd Gen)",         location: "Examination Hall B",   date: "2024-12-17", claimedBy: null, description: "White AirPods in original case, left after exam.",                    image: "🎧", postedBy: "Admin User"   },
  { id: "lf15", type: "Lost",  title: "Student ID Card",           location: "Hostel B Corridor",    date: "2024-12-18", claimedBy: null, description: "ID belongs to Reg. 21EEE032. Please contact warden.",                  image: "🪪", postedBy: "Ravi Kumar"   },
  { id: "lf16", type: "Found", title: "Geometry Box (Camlin)",     location: "Drawing Hall",         date: "2024-12-18", claimedBy: null, description: "Full Camlin set in blue case. Reg. 22ME011 written.",                  image: "📐", postedBy: "Arjun S"      },
  { id: "lf17", type: "Lost",  title: "Red Backpack",              location: "Workshop Block",       date: "2024-12-19", claimedBy: null, description: "Red Wildcraft backpack, laptop + books inside.",                       image: "🎒", postedBy: "Priya Meena"  },
  { id: "lf18", type: "Found", title: "Scientific Calculator",     location: "Seminar Hall",         date: "2024-12-19", claimedBy: null, description: "Casio FX-82 found after department seminar.",                          image: "🔢", postedBy: "Deepa R"      },
  { id: "lf19", type: "Lost",  title: "Physiology Lab Record",     location: "Bio Lab",              date: "2024-12-20", claimedBy: null, description: "Blue-covered record, contains charts for Unit 3.",                     image: "📔", postedBy: "Meera T"      },
  { id: "lf20", type: "Found", title: "Phone (Samsung A53)",       location: "Basketball Court",     date: "2024-12-20", claimedBy: null, description: "Black Samsung A53, cracked screen protector. Locked.",                image: "📱", postedBy: "Admin User"   },
];

// ─── MUTABLE USER STORE ───────────────────────────────────────
let userStore = [
  { id: "u1", name: "Ravi Kumar",  email: "ravi@campus.edu",  password: "ravi123",  role: "student" },
  { id: "u2", name: "Admin User",  email: "admin@campus.edu", password: "admin123", role: "admin"   },
  { id: "u3", name: "Priya Meena", email: "priya@campus.edu", password: "priya123", role: "student" },
];

const fakeDelay = (data, ms = 500) => new Promise(r => setTimeout(() => r(data), ms));

const API = {
  getListings:  () => fakeDelay([...mockListings]),
  getLostFound: () => fakeDelay([...mockLostFound]),
  login: (email, password) => {
    const u = userStore.find(u =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!u) return fakeDelay(null, 500);
    const token = btoa(JSON.stringify({ id: u.id, role: u.role, exp: Date.now() + 36e5 }));
    return fakeDelay({ user: u, token }, 500);
  },
  register: (name, email, password, role) => {
    if (userStore.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return fakeDelay({ error: "This email is already registered. Please sign in." }, 400);
    const user = { id: `u${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), password, role };
    userStore.push(user);
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 36e5 }));
    return fakeDelay({ user, token }, 650);
  },
};

// ─── CONTEXTS ─────────────────────────────────────────────────
const AuthContext     = createContext(null);
const CartContext     = createContext(null);
const WishlistContext = createContext(null);
const NotifContext    = createContext(null);

function cartReducer(state, { type, item, id }) {
  if (type === "ADD")    return state.find(i => i.id === item.id) ? state : [...state, { ...item, qty: 1 }];
  if (type === "REMOVE") return state.filter(i => i.id !== id);
  if (type === "CLEAR")  return [];
  return state;
}

function AppProviders({ children }) {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem("cc_user"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("cc_token") || null);

  const _save = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem("cc_user", JSON.stringify(u));
    localStorage.setItem("cc_token", t);
  };

  const login = async (email, password) => {
    const res = await API.login(email, password);
    if (res) { _save(res.user, res.token); return { success: true }; }
    return { success: false, error: "Invalid email or password." };
  };
  const register = async (name, email, password, role) => {
    const res = await API.register(name, email, password, role);
    if (res.error) return { success: false, error: res.error };
    _save(res.user, res.token);
    return { success: true };
  };
  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem("cc_user"); localStorage.removeItem("cc_token");
  };

  const [cart, cartDispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem("cc_cart") || "[]"); } catch { return []; }
  });
  useEffect(() => localStorage.setItem("cc_cart", JSON.stringify(cart)), [cart]);

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_wishlist") || "[]"); } catch { return []; }
  });
  const toggleWishlist = item => setWishlist(prev => {
    const next = prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item];
    localStorage.setItem("cc_wishlist", JSON.stringify(next));
    return next;
  });

  const [notifs, setNotifs] = useState([
    { id: 1, msg: "New listing: Engineering Mathematics", read: false },
    { id: 2, msg: "Claim for 'Blue Watch' is under review", read: false },
  ]);
  const markRead = id => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      <CartContext.Provider value={{ cart, cartDispatch }}>
        <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
          <NotifContext.Provider value={{ notifs, markRead, unreadCount }}>
            {children}
          </NotifContext.Provider>
        </WishlistContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

// ─── ROUTER ───────────────────────────────────────────────────
const RouterCtx = createContext(null);

function Router({ children }) {
  const [page, setPage]     = useState("home");
  const [params, setParams] = useState({});
  const navigate = useCallback((p, prms = {}) => {
    setPage(p); setParams(prms);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return <RouterCtx.Provider value={{ page, params, navigate }}>{children}</RouterCtx.Provider>;
}

const useRouter = () => useContext(RouterCtx);

function ProtectedRoute({ children }) {
  const { user }     = useContext(AuthContext);
  const { navigate } = useRouter();
  useEffect(() => { if (!user) navigate("login"); }, [user]);
  return user ? children : null;
}

// ─── GLOBAL STYLES ────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&f[]=clash-display@400,500,600,700&display=swap');

    :root {
      /* ── Core surfaces — true black family ── */
      --ink:  #080808;
      --s0:   #0C0C0C;
      --s1:   #111111;
      --s2:   #191919;
      --s3:   #222222;
      --s4:   #2E2E2E;
      /* ── Borders ── */
      --line:  rgba(255,255,255,.07);
      --lineh: rgba(255,255,255,.12);
      /* ── Accent — Crimson Red ── */
      --a:    #E8192C;
      --al:   #FF3347;
      --ad:   rgba(232,25,44,.10);
      --ag:   rgba(232,25,44,.18);
      --sha:  0 8px 28px rgba(232,25,44,.25);
      /* ── Text ── */
      --t1:   #F8F8F8;
      --t2:   #999999;
      --t3:   #555555;
      /* ── Status ── */
      --ok:   #34C974; --okd: rgba(52,201,116,.10);
      --er:   #E05252; --erd: rgba(224,82,82,.10);
      --wn:   #F0A030; --wnd: rgba(240,160,48,.10);
      --in:   #4EAADC; --ind: rgba(78,170,220,.10);
      /* ── Radius ── */
      --r1: 6px; --r2: 10px; --r3: 14px; --r4: 18px; --r5: 24px; --rf: 9999px;
      /* ── Shadows ── */
      --sh1: 0 1px 3px rgba(0,0,0,.5);
      --sh2: 0 4px 20px rgba(0,0,0,.65);
      --sh3: 0 12px 48px rgba(0,0,0,.8);
      /* ── Fonts ── */
      --ff-display: 'Clash Display', 'Helvetica Neue', sans-serif;
      --ff-body:    'Satoshi', 'Helvetica Neue', sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body {
      background: var(--ink); color: var(--t1);
      font-family: var(--ff-body);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
    }
    h1,h2,h3,h4,h5,h6 {
      font-family: var(--ff-display);
      line-height: 1.15;
      letter-spacing: -.02em;
    }
    a  { color: inherit; text-decoration: none; }
    button { cursor: pointer; font-family: var(--ff-body); }
    input, textarea, select { font-family: var(--ff-body); }
    ::selection { background: var(--ad); color: var(--t1); }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--s0); }
    ::-webkit-scrollbar-thumb { background: rgba(232,25,44,.35); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(232,25,44,.6); }

    /* ── LAYOUT ── */
    .app { display: flex; flex-direction: column; min-height: 100vh; }
    .main { flex: 1; }

    /* ══════════════════════════════
       KEYFRAMES
    ══════════════════════════════ */
    @keyframes up        { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
    @keyframes fadeUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:none; } }
    @keyframes slideUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
    @keyframes scaleIn   { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:none; } }
    @keyframes shimmer   { 0%,100% { opacity:.05; } 50% { opacity:.13; } }
    @keyframes pulseRed  { 0%,100% { box-shadow:0 0 0 0 rgba(232,25,44,.5); } 70% { box-shadow:0 0 0 10px rgba(232,25,44,0); } }
    @keyframes borderGlow { 0%,100% { border-color:rgba(232,25,44,.18); } 50% { border-color:rgba(232,25,44,.55); } }
    @keyframes float     { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
    @keyframes spin      { to { transform:rotate(360deg); } }
    @keyframes gradShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
    @keyframes ripple    { to { transform:scale(2.5); opacity:0; } }
    @keyframes scanline  { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }

    /* ── Card entrance stagger ── */
    .g2 .card:nth-child(1),.g3 .card:nth-child(1) { animation:fadeUp .35s .05s both; }
    .g2 .card:nth-child(2),.g3 .card:nth-child(2) { animation:fadeUp .35s .10s both; }
    .g2 .card:nth-child(3),.g3 .card:nth-child(3) { animation:fadeUp .35s .15s both; }
    .g2 .card:nth-child(4),.g3 .card:nth-child(4) { animation:fadeUp .35s .20s both; }
    .g2 .card:nth-child(n+5),.g3 .card:nth-child(n+5) { animation:fadeUp .35s .25s both; }

    /* ── Stat card entrance ── */
    .ostat { animation:fadeUp .4s both; }
    .ostat:nth-child(1) { animation-delay:.05s; }
    .ostat:nth-child(2) { animation-delay:.10s; }
    .ostat:nth-child(3) { animation-delay:.15s; }
    .ostat:nth-child(4) { animation-delay:.20s; }

    /* ── Page sections ── */
    .sec { animation:fadeUp .4s .05s both; }

    /* ══════════════════════════════
       NAVBAR
    ══════════════════════════════ */
    .nav {
      position: sticky; top: 0; z-index: 200;
      height: 58px;
      background: rgba(8,8,8,.92);
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
      border-bottom: 1px solid var(--line);
      padding: 0 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
      gap: 1rem;
    }
    .nav-brand {
      display: flex; align-items: center; gap: 9px;
      cursor: pointer; flex-shrink: 0;
      font-family: var(--ff-display); font-weight: 600;
      font-size: .9375rem; letter-spacing: -.025em;
      color: var(--t1);
    }
    .brand-mark {
      width: 28px; height: 28px; border-radius: 7px;
      background: var(--a);
      display: flex; align-items: center; justify-content: center;
      font-size: .625rem; font-weight: 700; color: #fff;
      font-family: var(--ff-display); flex-shrink: 0;
      animation: pulseRed 3s ease-in-out infinite;
    }
    .nav-links { display: flex; gap: 2px; align-items: center; }

    /* Nav link with animated red underline */
    .nl {
      position: relative;
      padding: .375rem .8rem; border-radius: var(--r2);
      font-size: .8125rem; font-weight: 500; color: var(--t2);
      border: none; background: none;
      transition: color .14s, background .14s;
      letter-spacing: -.005em;
    }
    .nl::after {
      content: ''; position: absolute; bottom: 4px; left: 50%; right: 50%;
      height: 2px; background: var(--a); border-radius: 1px;
      transition: left .2s cubic-bezier(.4,0,.2,1), right .2s cubic-bezier(.4,0,.2,1);
    }
    .nl:hover { color: var(--t1); background: rgba(255,255,255,.04); }
    .nl:hover::after { left: 15%; right: 15%; }
    .nl.on { color: var(--t1); background: rgba(232,25,44,.08); }
    .nl.on::after { left: 15%; right: 15%; }

    .nav-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

    /* Icon button */
    .ib {
      width: 34px; height: 34px; border-radius: var(--r2);
      border: 1px solid var(--line); background: transparent;
      color: var(--t2); display: flex; align-items: center; justify-content: center;
      font-size: .875rem; cursor: pointer; transition: all .14s;
      position: relative;
    }
    .ib:hover { background: rgba(232,25,44,.08); color: var(--t1); border-color: rgba(232,25,44,.3); }

    /* Badge dot */
    .dot {
      position: absolute; top: 5px; right: 5px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--er); border: 1.5px solid var(--ink);
    }
    /* Badge count */
    .bc {
      position: absolute; top: -4px; right: -4px;
      min-width: 16px; height: 16px; border-radius: 8px;
      background: var(--a); color: #fff;
      font-size: .5625rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px; border: 1.5px solid var(--ink);
      font-family: var(--ff-display);
    }
    /* Avatar */
    .av {
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--ad); border: 1.5px solid rgba(232,25,44,.35);
      display: flex; align-items: center; justify-content: center;
      font-size: .625rem; font-weight: 700; color: var(--a);
      cursor: pointer; transition: all .15s;
      font-family: var(--ff-display); flex-shrink: 0;
    }
    .av:hover { transform: scale(1.06); box-shadow: 0 0 0 3px var(--ad); }

    /* Hamburger */
    .burger {
      width: 34px; height: 34px; border-radius: var(--r2);
      background: none; border: 1px solid var(--line);
      display: none; align-items: center; justify-content: center;
      cursor: pointer; color: var(--t2); transition: all .14s;
    }
    .burger:hover { background: rgba(232,25,44,.08); color: var(--t1); }

    /* Notif panel */
    .np {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 288px; background: var(--s2); border: 1px solid var(--lineh);
      border-radius: var(--r4); box-shadow: var(--sh3); z-index: 300;
      overflow: hidden; animation: slideDown .18s cubic-bezier(.4,0,.2,1) both;
    }
    .np-hd { padding: 11px 16px; border-bottom: 1px solid var(--line); font-family: var(--ff-display); font-size: .8125rem; font-weight: 600; color: var(--t2); letter-spacing: .04em; text-transform: uppercase; }
    .ni { padding: 10px 16px; font-size: .8125rem; color: var(--t2); cursor: pointer; transition: background .12s; border-bottom: 1px solid var(--line); line-height: 1.45; }
    .ni:last-child { border-bottom: none; }
    .ni:hover { background: rgba(255,255,255,.04); }
    .ni.unr { color: var(--t1); border-left: 2px solid var(--a); padding-left: 14px; }

    /* Mobile menu */
    .mob-menu {
      display: none; position: fixed; inset: 0; top: 58px;
      background: var(--s0); z-index: 190;
      padding: .875rem; flex-direction: column; gap: 2px;
      border-top: 1px solid var(--line);
      animation: fadeIn .16s ease;
    }
    .mob-menu.show { display: flex; }
    .ml {
      padding: 11px 14px; border-radius: var(--r2);
      font-size: .9375rem; font-weight: 500; color: var(--t2);
      cursor: pointer; border: none; background: none; text-align: left; width: 100%;
      transition: all .13s;
    }
    .ml:hover { background: rgba(232,25,44,.06); color: var(--t1); }
    .ml.on { background: var(--ad); color: var(--a); }
    .msep { height: 1px; background: var(--line); margin: 6px 0; }

    /* ══════════════════════════════
       BUTTONS
    ══════════════════════════════ */
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 6px; padding: .5rem 1.125rem;
      border-radius: var(--r2); font-weight: 600;
      font-size: .8125rem; border: none;
      transition: all .15s cubic-bezier(.4,0,.2,1);
      white-space: nowrap; letter-spacing: -.005em;
      font-family: var(--ff-body);
    }
    .btn:disabled { opacity: .45; cursor: not-allowed; }
    /* Primary — red with shimmer sweep */
    .btn-p {
      background: var(--a); color: #fff;
      box-shadow: 0 1px 3px rgba(232,25,44,.3);
      position: relative; overflow: hidden;
    }
    .btn-p::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.18) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform .45s ease;
    }
    .btn-p:hover::after { transform: translateX(100%); }
    .btn-p:hover:not(:disabled) { background: var(--al); transform: translateY(-1px); box-shadow: var(--sha); }
    .btn-p:active:not(:disabled) { transform: none; box-shadow: none; }
    /* Secondary */
    .btn-s { background: var(--s3); color: var(--t1); border: 1px solid var(--line); }
    .btn-s:hover:not(:disabled) { background: var(--s4); border-color: var(--lineh); }
    /* Ghost */
    .btn-g { background: transparent; color: var(--t2); border: 1px solid var(--line); }
    .btn-g:hover { background: rgba(255,255,255,.05); color: var(--t1); border-color: var(--lineh); }
    /* Danger */
    .btn-d { background: var(--erd); color: var(--er); border: 1px solid rgba(224,82,82,.2); }
    .btn-d:hover { background: rgba(224,82,82,.16); }
    /* OK */
    .btn-ok { background: var(--okd); color: var(--ok); border: 1px solid rgba(52,201,116,.2); }
    /* Sizes */
    .btn-sm { padding: .3125rem .75rem; font-size: .75rem; border-radius: var(--r1); }
    .btn-lg { padding: .6875rem 1.5rem; font-size: .9375rem; border-radius: var(--r3); }
    .btn-fw { width: 100%; }

    /* ══════════════════════════════
       CARDS
    ══════════════════════════════ */
    .card {
      background: var(--s1); border: 1px solid var(--line);
      border-radius: var(--r4); overflow: hidden;
      transition: transform .22s cubic-bezier(.4,0,.2,1),
                  box-shadow .22s cubic-bezier(.4,0,.2,1),
                  border-color .22s;
    }
    .card-lift:hover {
      transform: translateY(-5px) scale(1.012);
      box-shadow: 0 16px 48px rgba(0,0,0,.6), 0 0 0 1px rgba(232,25,44,.15);
      border-color: rgba(232,25,44,.2);
    }
    .cb { padding: 1.125rem; }
    .ch { padding: .875rem 1.125rem; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; }

    /* ══════════════════════════════
       FORMS
    ══════════════════════════════ */
    .fg  { display: flex; flex-direction: column; gap: 5px; }
    .flb { font-size: .75rem; font-weight: 600; color: var(--t3); letter-spacing: .04em; text-transform: uppercase; }
    .fi  {
      background: var(--s2); border: 1px solid var(--line); color: var(--t1);
      padding: .625rem .875rem; border-radius: var(--r2);
      font-size: .9375rem; font-family: var(--ff-body);
      transition: border-color .15s, box-shadow .15s; width: 100%;
    }
    .fi:focus { outline: none; border-color: var(--a); box-shadow: 0 0 0 3px var(--ad); }
    .fi::placeholder { color: var(--t3); }
    .fi:hover:not(:focus) { border-color: var(--lineh); }
    select.fi option { background: var(--s2); }
    textarea.fi { resize: vertical; min-height: 80px; line-height: 1.55; }
    .ferr { font-size: .75rem; color: var(--er); font-weight: 500; }

    /* ══════════════════════════════
       TAGS / CHIPS
    ══════════════════════════════ */
    .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--rf); font-size: .6875rem; font-weight: 600; letter-spacing: .02em; }
    .t-am { background: rgba(232,25,44,.10); color: #FF3347; border: 1px solid rgba(232,25,44,.22); }
    .t-bl { background: var(--ind); color: var(--in); border: 1px solid rgba(78,170,220,.15); }
    .t-gr { background: var(--okd); color: var(--ok); border: 1px solid rgba(52,201,116,.15); }
    .t-rd { background: var(--erd); color: var(--er); border: 1px solid rgba(224,82,82,.15); }
    .t-yw { background: var(--wnd); color: var(--wn); border: 1px solid rgba(240,160,48,.15); }
    .t-mu { background: rgba(255,255,255,.05); color: var(--t2); border: 1px solid var(--line); }

    /* ══════════════════════════════
       FILTER CHIPS
    ══════════════════════════════ */
    .fc {
      padding: 4px 14px; border-radius: var(--rf);
      font-size: .8125rem; font-weight: 500; border: 1px solid var(--line);
      background: transparent; color: var(--t2); cursor: pointer; transition: all .14s;
    }
    .fc:hover { color: var(--t1); border-color: var(--lineh); }
    .fc.on { background: var(--a); color: #fff; border-color: var(--a); font-weight: 600; }

    /* ══════════════════════════════
       SPINNER
    ══════════════════════════════ */
    .sw { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; gap: 10px; }
    .sp { width: 28px; height: 28px; border: 2px solid var(--line); border-top-color: var(--a); border-radius: 50%; animation: spin .7s linear infinite; }

    /* ══════════════════════════════
       HERO
    ══════════════════════════════ */
    .hero {
      padding: 5.5rem 1.5rem 4.5rem;
      text-align: center;
      position: relative; overflow: hidden;
      background: radial-gradient(ellipse at 60% 40%, rgba(232,25,44,.07) 0%, transparent 60%), var(--s0);
    }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-glow {
      position: absolute; top: -280px; left: 50%; transform: translateX(-50%);
      width: 800px; height: 600px; border-radius: 50%;
      background: radial-gradient(ellipse at center, rgba(232,25,44,.08) 0%, transparent 65%);
    }
    .hero-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px);
      background-size: 52px 52px;
      mask-image: radial-gradient(ellipse 80% 70% at center, black 0%, transparent 70%);
    }
    .hero-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; background: var(--ad);
      border: 1px solid rgba(232,25,44,.2); border-radius: var(--rf);
      font-size: .75rem; color: var(--al); font-weight: 600;
      margin-bottom: 1.5rem; animation: up .5s ease both;
      font-family: var(--ff-body); letter-spacing: .01em;
    }
    .hero-h1 {
      font-size: clamp(2.25rem, 5.5vw, 3.75rem); font-weight: 700;
      line-height: 1.06; letter-spacing: -.03em;
      margin-bottom: 1.25rem; animation: up .5s .1s ease both;
      font-family: var(--ff-display);
    }
    /* Animated gradient text */
    .hero-anim {
      background: linear-gradient(135deg, #FF3347, #F8F8F8, #E8192C);
      background-size: 200% 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: gradShift 6s ease infinite;
    }
    /* Hero accent underline bar */
    .hero-bar {
      width: 60px; height: 3px; border-radius: 99px;
      background-image: linear-gradient(90deg, #E8192C, #FF6B6B, #E8192C);
      background-size: 200% 200%;
      animation: gradShift 4s ease infinite;
      margin: 1rem auto 0;
    }
    .hero-p {
      color: var(--t2); font-size: 1.0625rem; max-width: 420px;
      margin: 0 auto 2.5rem; line-height: 1.65;
      animation: up .5s .2s ease both;
    }
    .hero-ctas { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: up .5s .3s ease both; }
    /* Floating emoji */
    .hero-float { animation: float 4s ease-in-out infinite; display: inline-block; }

    /* ══════════════════════════════
       STATS STRIP
    ══════════════════════════════ */
    .sstrip {
      display: flex; flex-wrap: wrap;
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      background: var(--s0);
    }
    .ssi { flex: 1; min-width: 110px; padding: 1.375rem 1.5rem; text-align: center; border-right: 1px solid var(--line); }
    .ssi:last-child { border-right: none; }
    .ssi-n { font-family: var(--ff-display); font-size: 1.75rem; font-weight: 700; color: var(--t1); letter-spacing: -.04em; line-height: 1; margin-bottom: 3px; }
    .ssi-n em { font-style: normal; color: var(--a); }
    .ssi-l { font-size: .75rem; color: var(--t2); font-weight: 500; }

    /* ══════════════════════════════
       SECTIONS
    ══════════════════════════════ */
    .sec { padding: 0 1.5rem 3rem; max-width: 1200px; margin: 0 auto; }
    .sec-hd { display: flex; align-items: center; justify-content: space-between; padding: 2.25rem 0 1.125rem; }
    .sec-title { font-size: 1.125rem; font-weight: 700; letter-spacing: -.025em; font-family: var(--ff-display); }

    /* ══════════════════════════════
       CATEGORY GRID
    ══════════════════════════════ */
    .cgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 8px; }
    .cchip {
      padding: .875rem .75rem; background: var(--s1); border: 1px solid var(--line);
      border-radius: var(--r3); text-align: center; cursor: pointer;
      transition: all .18s cubic-bezier(.4,0,.2,1); font-size: .8125rem; font-weight: 500; color: var(--t2);
      font-family: var(--ff-body);
    }
    .cchip:hover {
      border-color: rgba(232,25,44,.3); background: var(--s2); color: var(--t1);
      transform: translateY(-3px); box-shadow: 0 8px 24px rgba(232,25,44,.12);
    }
    .cchip-ic { font-size: 1.625rem; display: block; margin-bottom: 5px; }

    /* ══════════════════════════════
       PRODUCT CARD
    ══════════════════════════════ */
    .pcimg {
      height: 96px;
      background: linear-gradient(135deg, var(--s2), var(--s3));
      border-bottom: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; position: relative; overflow: hidden;
    }
    /* Shimmer overlay on product image area */
    .pcimg-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent, rgba(255,255,255,.04), transparent);
      animation: shimmer 3s ease-in-out infinite;
      pointer-events: none;
    }
    .wl-btn {
      position: absolute; top: 8px; right: 8px;
      width: 26px; height: 26px; border-radius: 50%;
      background: rgba(8,8,8,.85); border: 1px solid var(--line);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      font-size: .65rem; cursor: pointer; transition: all .14s;
    }
    .wl-btn:hover { border-color: rgba(224,82,82,.4); transform: scale(1.1); }
    .wl-btn.on { background: rgba(224,82,82,.12); border-color: rgba(224,82,82,.35); }
    .pcbd { padding: .875rem; }
    .pctitle {
      font-weight: 600; font-size: .9375rem; letter-spacing: -.01em;
      line-height: 1.3; margin-bottom: 5px; color: var(--t1); cursor: pointer;
      transition: color .14s; font-family: var(--ff-body);
    }
    .pctitle:hover { color: var(--a); }
    .pcprice {
      font-family: var(--ff-display); font-size: 1.125rem;
      font-weight: 700; color: var(--t1); letter-spacing: -.03em; margin-bottom: 7px;
    }
    .pcmeta { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 7px; }
    .pcseller { font-size: .75rem; color: var(--t2); display: flex; align-items: center; gap: 5px; margin-bottom: 10px; }
    .selav {
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--s4); display: inline-flex; align-items: center; justify-content: center;
      font-size: .5rem; font-weight: 700; color: var(--a);
      font-family: var(--ff-display); flex-shrink: 0;
    }
    .pcactions { display: flex; gap: 5px; flex-wrap: wrap; }

    /* ══════════════════════════════
       LF CARD
    ══════════════════════════════ */
    .lf-lost  { border-left: 2px solid var(--a) !important; animation: borderGlow 3s ease-in-out infinite; }
    .lf-found { border-left: 2px solid var(--ok) !important; }
    .lf-ic { font-size: 1.75rem; }

    /* ══════════════════════════════
       SEARCH BAR
    ══════════════════════════════ */
    .sbar { position: relative; flex: 1; min-width: 180px; max-width: 320px; }
    .sbar-ic { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--t3); font-size: .8125rem; pointer-events: none; }
    .sbar-in { padding-left: 2.125rem !important; }

    /* ══════════════════════════════
       AUTH PAGES
    ══════════════════════════════ */
    .auth-pg {
      min-height: calc(100vh - 58px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem; position: relative; overflow: hidden;
    }
    .auth-glow {
      position: absolute; top: -60px; right: -80px;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(232,25,44,.06), transparent 65%);
      pointer-events: none;
    }
    .auth-card {
      width: 100%; max-width: 388px;
      background: var(--s1); border: 1px solid var(--lineh);
      border-radius: var(--r5); padding: 2.25rem 2rem;
      position: relative; box-shadow: var(--sh3);
      animation: scaleIn .3s cubic-bezier(.4,0,.2,1) both;
    }
    .auth-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 1.75rem; }
    .auth-lm {
      width: 30px; height: 30px; border-radius: 7px; background: var(--a);
      display: flex; align-items: center; justify-content: center;
      font-size: .65rem; font-weight: 700; color: #fff; font-family: var(--ff-display);
    }
    .auth-lt { font-family: var(--ff-display); font-weight: 600; font-size: .9375rem; }
    .auth-h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.03em; margin-bottom: 5px; font-family: var(--ff-display); }
    .auth-sub { font-size: .875rem; color: var(--t2); margin-bottom: 1.625rem; line-height: 1.55; }
    .auth-form { display: flex; flex-direction: column; gap: 13px; }
    .auth-foot { text-align: center; margin-top: 1.375rem; font-size: .8125rem; color: var(--t2); }
    .auth-lnk { color: var(--a); font-weight: 600; background: none; border: none; cursor: pointer; transition: color .14s; font-family: var(--ff-body); font-size: inherit; }
    .auth-lnk:hover { color: var(--al); }
    .demo-box {
      margin-top: 1rem; padding: 10px 13px;
      background: var(--s2); border: 1px solid var(--line);
      border-radius: var(--r2); font-size: .75rem; color: var(--t2); line-height: 1.7;
    }
    .demo-box strong { color: var(--t1); }
    .demo-fill {
      color: var(--a); cursor: pointer; text-decoration: underline;
      text-decoration-style: dotted; text-underline-offset: 2px;
      background: none; border: none; font-size: inherit; font-family: inherit;
    }
    .demo-fill:hover { color: var(--al); }

    /* ══════════════════════════════
       ALERTS
    ══════════════════════════════ */
    .alert { padding: 9px 13px; border-radius: var(--r2); font-size: .8125rem; font-weight: 500; }
    .a-err  { background: var(--erd); border: 1px solid rgba(224,82,82,.22); color: var(--er); }
    .a-ok   { background: var(--okd); border: 1px solid rgba(52,201,116,.22); color: var(--ok); }
    .a-info { background: var(--ad);  border: 1px solid rgba(232,25,44,.22); color: var(--al); }

    /* ══════════════════════════════
       TOAST
    ══════════════════════════════ */
    .tstack { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 400; display: flex; flex-direction: column; gap: 6px; pointer-events: none; }
    .toast {
      padding: 9px 14px; border-radius: var(--r2);
      font-size: .8125rem; font-weight: 500;
      animation: slideUp .22s cubic-bezier(.4,0,.2,1) both;
      backdrop-filter: blur(16px); pointer-events: all; box-shadow: var(--sh2);
      font-family: var(--ff-body);
    }
    .t-ok  { background: rgba(8,18,12,.95); border: 1px solid rgba(52,201,116,.28); color: var(--ok); }
    .t-err { background: rgba(18,8,8,.95);  border: 1px solid rgba(224,82,82,.28); color: var(--er); }

    /* ══════════════════════════════
       MODAL
    ══════════════════════════════ */
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.8);
      backdrop-filter: blur(16px); z-index: 350;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; animation: fadeIn .16s ease;
    }
    .mbox {
      background: var(--s1); border: 1px solid var(--lineh);
      border-radius: var(--r5); width: 100%; max-width: 460px;
      max-height: 90vh; overflow-y: auto;
      animation: scaleIn .22s cubic-bezier(.4,0,.2,1) both;
      box-shadow: var(--sh3);
    }
    .mhd {
      display: flex; align-items: center; justify-content: space-between;
      padding: .875rem 1.25rem; border-bottom: 1px solid var(--line);
      position: sticky; top: 0; background: var(--s1); z-index: 1;
    }
    .mtitle { font-family: var(--ff-display); font-weight: 700; font-size: .9375rem; }
    .mbd { padding: 1.25rem; display: flex; flex-direction: column; gap: 13px; }
    .cbtn {
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(255,255,255,.06); border: 1px solid var(--line);
      color: var(--t2); font-size: .75rem;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .14s;
    }
    .cbtn:hover { background: rgba(232,25,44,.12); color: var(--t1); border-color: rgba(232,25,44,.3); }

    /* ══════════════════════════════
       PRODUCT DETAIL
    ══════════════════════════════ */
    .det { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem; }
    .det-hero {
      height: 160px;
      background: linear-gradient(135deg, var(--s2), var(--s3));
      border: 1px solid var(--line);
      border-bottom: none; border-radius: var(--r4) var(--r4) 0 0;
      display: flex; align-items: center; justify-content: center; font-size: 5rem;
    }
    .det-body { padding: 1.5rem; border: 1px solid var(--line); border-top: none; border-radius: 0 0 var(--r4) var(--r4); background: var(--s1); }
    .det-price { font-family: var(--ff-display); font-size: 1.875rem; font-weight: 700; color: var(--t1); letter-spacing: -.04em; }

    /* ══════════════════════════════
       CART
    ══════════════════════════════ */
    .ci { display: flex; align-items: center; gap: .875rem; padding: .875rem 1.125rem; border-bottom: 1px solid var(--line); }
    .ci:last-child { border-bottom: none; }
    .ci-ic { font-size: 1.75rem; width: 40px; text-align: center; flex-shrink: 0; }
    .ctot { font-family: var(--ff-display); font-size: 1.375rem; font-weight: 700; letter-spacing: -.035em; }

    /* ══════════════════════════════
       DASHBOARD
    ══════════════════════════════ */
    .dash { display: grid; grid-template-columns: 200px 1fr; gap: 1.25rem; padding: 2rem 1.5rem; max-width: 1200px; margin: 0 auto; }
    .dsb { display: flex; flex-direction: column; gap: 3px; }
    .sbl {
      display: flex; align-items: center; gap: 9px;
      padding: 7px 11px; border-radius: var(--r2);
      font-size: .8125rem; font-weight: 500; color: var(--t2);
      cursor: pointer; border: none; background: none; text-align: left; width: 100%;
      transition: all .13s; font-family: var(--ff-body);
    }
    .sbl:hover { background: rgba(232,25,44,.06); color: var(--t1); }
    .sbl.on { background: var(--ad); color: var(--a); }
    .pcard {
      padding: .875rem 1rem; background: var(--s1); border: 1px solid var(--line);
      border-radius: var(--r3); display: flex; align-items: center; gap: 10px; margin-bottom: 6px;
    }
    .pav {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--ad); border: 2px solid rgba(232,25,44,.25);
      display: flex; align-items: center; justify-content: center;
      font-size: .8125rem; font-weight: 700; color: var(--a);
      flex-shrink: 0; font-family: var(--ff-display);
    }
    .pname  { font-weight: 700; font-size: .9375rem; letter-spacing: -.02em; font-family: var(--ff-display); }
    .prole  { font-size: .65rem; font-weight: 600; color: var(--a); text-transform: uppercase; letter-spacing: .06em; }
    .pemail { font-size: .7rem; color: var(--t3); margin-top: 1px; }

    /* Overview stat cards */
    .ogrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 8px; margin-bottom: 1.375rem; }
    .ostat {
      background: var(--s1); border: 1px solid var(--line); border-radius: var(--r3);
      padding: .875rem; text-align: center; transition: all .18s;
    }
    .ostat:hover { border-color: rgba(232,25,44,.25); transform: translateY(-2px); }
    .osta-ic { font-size: 1.375rem; margin-bottom: 5px; }
    .osta-n  { font-family: var(--ff-display); font-size: 1.5rem; font-weight: 700; letter-spacing: -.035em; color: var(--t1); line-height: 1; }
    .osta-l  { font-size: .6875rem; color: var(--t2); margin-top: 3px; }

    /* ══════════════════════════════
       GRIDS
    ══════════════════════════════ */
    .g2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: .875rem; }
    .g3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 1rem; }

    /* ══════════════════════════════
       TABLE
    ══════════════════════════════ */
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 9px 13px; font-size: .6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--t3); border-bottom: 1px solid var(--line); }
    td { padding: 11px 13px; font-size: .875rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255,255,255,.02); }

    /* ══════════════════════════════
       EMPTY STATE
    ══════════════════════════════ */
    .empty { text-align: center; padding: 3.5rem 2rem; color: var(--t2); }
    .empty-ic { font-size: 2.25rem; margin-bottom: .875rem; opacity: .45; }
    .empty-h  { font-family: var(--ff-display); font-weight: 700; font-size: 1rem; margin-bottom: 4px; }
    .empty-p  { font-size: .8125rem; color: var(--t3); }

    /* ══════════════════════════════
       CTA BLOCK
    ══════════════════════════════ */
    .cta-block {
      background: var(--s1); border: 1px solid var(--line);
      border-radius: var(--r5); padding: 2.75rem 2rem;
      text-align: center; position: relative; overflow: hidden;
    }
    .cta-glow {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at center bottom, rgba(232,25,44,.08) 0%, transparent 60%);
    }

    /* ══════════════════════════════
       FOOTER — red gradient border
    ══════════════════════════════ */
    .footer {
      border-top: 1px solid transparent;
      background:
        linear-gradient(var(--s0), var(--s0)) padding-box,
        linear-gradient(90deg, transparent, rgba(232,25,44,.3), transparent) border-box;
      padding: 1.75rem 1.5rem; margin-top: 4rem;
    }
    .footer-in { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .f-logo { display: flex; align-items: center; gap: 7px; font-family: var(--ff-display); font-weight: 600; font-size: .9rem; letter-spacing: -.02em; }
    .f-mark { width: 22px; height: 22px; border-radius: 5px; background: var(--a); display: flex; align-items: center; justify-content: center; font-size: .55rem; font-weight: 700; color: #fff; font-family: var(--ff-display); }
    .f-meta { font-size: .75rem; color: var(--t3); text-align: center; line-height: 1.7; }
    .f-tags { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
    .ftag { padding: 2px 8px; border-radius: var(--rf); font-size: .65rem; font-weight: 500; background: rgba(255,255,255,.04); border: 1px solid var(--line); color: var(--t3); }

    /* ══════════════════════════════
       RESPONSIVE
    ══════════════════════════════ */
    @media (max-width: 900px) { .dash { grid-template-columns: 1fr; } }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .burger { display: flex; }
      .hero { padding: 3.75rem 1.25rem 3rem; }
      .sec  { padding: 0 1rem 2.5rem; }
      .dash { padding: 1rem; }
      .sstrip .ssi { border-right: none; border-bottom: 1px solid var(--line); }
      .sstrip .ssi:last-child { border-bottom: none; }
    }
    @media (max-width: 480px) {
      .auth-card { padding: 1.75rem 1.25rem; border-radius: var(--r4); }
      .g2, .g3 { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ─── TOAST ────────────────────────────────────────────────────
let _toast = null;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toast = (msg, type = "ok") => {
      const id = Date.now();
      setToasts(p => [...p, { id, msg, type }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };
  }, []);
  return (
    <div className="tstack" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast t-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

const toast = (msg, type) => _toast?.(msg, type);

// ─── NAVBAR ───────────────────────────────────────────────────
function Navbar() {
  const { user, logout }               = useContext(AuthContext);
  const { cart }                       = useContext(CartContext);
  const { notifs, markRead, unreadCount } = useContext(NotifContext);
  const { navigate, page }             = useRouter();
  const [showNotif, setNotif]          = useState(false);
  const [mobOpen, setMob]              = useState(false);

  const links = [
    { key: "home",        label: "Home"        },
    { key: "marketplace", label: "Marketplace" },
    { key: "lostfound",   label: "Lost & Found" },
    ...(user ? [{ key: "dashboard", label: "Dashboard" }] : []),
  ];

  const go = k => { navigate(k); setMob(false); setNotif(false); };

  return (
    <>
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-brand" onClick={() => go("home")} role="button" tabIndex={0}
          onKeyDown={e => e.key === "Enter" && go("home")}>
          <div className="brand-mark" aria-hidden="true">CC</div>
          CampusConnect
        </div>

        <div className="nav-links">
          {links.map(l => (
            <button key={l.key} className={`nl ${page === l.key ? "on" : ""}`}
              onClick={() => go(l.key)} aria-current={page === l.key ? "page" : undefined}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              {/* Notifications */}
              <div style={{ position: "relative" }}>
                <button className="ib"
                  onClick={() => setNotif(p => !p)}
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}>
                  🔔
                  {unreadCount > 0 && <span className="dot" aria-hidden="true" />}
                </button>
                {showNotif && (
                  <div className="np" role="menu">
                    <div className="np-hd">Notifications</div>
                    {notifs.length === 0
                      ? <div style={{ padding: "1.25rem", textAlign: "center", color: "var(--t3)", fontSize: ".8125rem" }}>All caught up</div>
                      : notifs.map(n => (
                        <div key={n.id} className={`ni ${!n.read ? "unr" : ""}`}
                          onClick={() => { markRead(n.id); setNotif(false); }}
                          role="menuitem" tabIndex={0}>
                          {n.msg}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button className="ib" onClick={() => go("cart")} aria-label={`Cart, ${cart.length} items`}>
                🛒
                {cart.length > 0 && <span className="bc">{cart.length}</span>}
              </button>

              {/* Avatar */}
              <div className="av" onClick={() => go("dashboard")} role="button" tabIndex={0}
                title={user.name} onKeyDown={e => e.key === "Enter" && go("dashboard")}>
                {getInitials(user.name)}
              </div>

              <button className="btn btn-g btn-sm"
                onClick={() => { logout(); toast("Signed out"); navigate("home"); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-g btn-sm" onClick={() => go("login")}>Log in</button>
              <button className="btn btn-p btn-sm" onClick={() => go("register")}>Sign up</button>
            </>
          )}
          <button className="burger" onClick={() => setMob(p => !p)}
            aria-label="Toggle navigation" aria-expanded={mobOpen}>
            {mobOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <div className={`mob-menu ${mobOpen ? "show" : ""}`} role="dialog" aria-label="Mobile navigation">
        {links.map(l => (
          <button key={l.key} className={`ml ${page === l.key ? "on" : ""}`} onClick={() => go(l.key)}>
            {l.label}
          </button>
        ))}
        <div className="msep" />
        {!user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button className="btn btn-g" onClick={() => go("login")}>Log in</button>
            <button className="btn btn-p" onClick={() => go("register")}>Sign up</button>
          </div>
        ) : (
          <button className="btn btn-d"
            onClick={() => { logout(); toast("Signed out"); navigate("home"); setMob(false); }}>
            Sign out
          </button>
        )}
      </div>
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage() {
  const { navigate }            = useRouter();
  const { user }                = useContext(AuthContext);
  const [listings, setListings]  = useState([]);
  const [lostFound, setLF]       = useState([]);
  const [loading, setLoading]    = useState(true);
  const [counter, setCounter]    = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all([API.getListings(), API.getLostFound()]).then(([l, lf]) => {
      if (alive) { setListings(l); setLF(lf); setLoading(false); }
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (loading) return;
    const target = 248; let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + 7, target);
      setCounter(cur);
      if (cur >= target) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [loading]);

  const categories = [
    { icon: "📚", label: "Books" },
    { icon: "🔌", label: "Electronics" },
    { icon: "🥼", label: "Lab Kit" },
    { icon: "🏠", label: "Hostel" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-glow" />
          <div className="hero-grid" />
        </div>
        <div className="hero-pill">
          <span className="hero-float">⚡</span> Your campus, smarter.
        </div>
        <h1 className="hero-h1" id="hero-heading">
          Buy, Sell &amp; Reclaim<br />
          <span className="hero-anim">Campus Essentials</span>
        </h1>
        <div className="hero-bar" aria-hidden="true" />
        <p className="hero-p" style={{ marginTop: "1.5rem" }}>
          The all-in-one platform for students to trade items, recover lost belongings, and stay connected.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-p btn-lg" onClick={() => navigate("marketplace")}>Browse Marketplace →</button>
          <button className="btn btn-g btn-lg" onClick={() => navigate("lostfound")}>Lost &amp; Found</button>
        </div>
      </section>

      {/* STATS */}
      {!loading && (
        <div className="sstrip" role="region" aria-label="Platform statistics">
          {[
            { n: counter, suf: "+", l: "Active Listings"    },
            { n: lostFound.length, suf: "", l: "Lost & Found Items" },
            { n: 4,   suf: "",   l: "Categories"          },
            { n: 99,  suf: "%",  l: "Student Satisfaction" },
          ].map((s, i) => (
            <div key={i} className="ssi">
              <div className="ssi-n">{s.n}<em>{s.suf}</em></div>
              <div className="ssi-l">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORIES */}
      <div className="sec">
        <div className="sec-hd">
          <h2 className="sec-title">Browse Categories</h2>
        </div>
        <div className="cgrid">
          {categories.map(c => (
            <button key={c.label} className="cchip" onClick={() => navigate("marketplace")}
              aria-label={`Browse ${c.label}`}>
              <span className="cchip-ic" aria-hidden="true">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED LISTINGS */}
      <div className="sec">
        <div className="sec-hd">
          <h2 className="sec-title">Featured Listings</h2>
          <button className="btn btn-g btn-sm" onClick={() => navigate("marketplace")}>View all</button>
        </div>
        {loading
          ? <div className="sw"><div className="sp" /><span style={{ color: "var(--t2)", fontSize: ".8125rem" }}>Loading…</span></div>
          : <div className="g2">{listings.slice(0, 4).map(l => <ProductCard key={l.id} item={l} />)}</div>
        }
      </div>

      {/* RECENT LOST & FOUND */}
      <div className="sec">
        <div className="sec-hd">
          <h2 className="sec-title">Recent Lost &amp; Found</h2>
          <button className="btn btn-g btn-sm" onClick={() => navigate("lostfound")}>View all</button>
        </div>
        {!loading && (
          <div className="g2">{lostFound.slice(0, 4).map(i => <LFCard key={i.id} item={i} compact />)}</div>
        )}
      </div>

      {/* CTA */}
      {!user && (
        <div className="sec" style={{ paddingBottom: "4rem" }}>
          <div className="cta-block">
            <div className="cta-glow" aria-hidden="true" />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "1.875rem", marginBottom: "1rem" }} className="hero-float">🎓</div>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-.025em", marginBottom: ".5rem", fontFamily: "var(--ff-display)" }}>
                Join CampusConnect
              </h3>
              <p style={{ color: "var(--t2)", marginBottom: "1.5rem", maxWidth: 380, margin: "0 auto 1.5rem", lineHeight: 1.65, fontSize: ".9375rem" }}>
                List your items, claim lost goods, and connect with 248+ students.
              </p>
              <button className="btn btn-p btn-lg" onClick={() => navigate("register")}>
                Create free account →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ item, onDelete }) {
  const { cart, cartDispatch }       = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { user }                     = useContext(AuthContext);
  const { navigate }                 = useRouter();
  const inCart     = cart.some(i => i.id === item.id);
  const inWishlist = wishlist.some(i => i.id === item.id);
  const condMap    = { "Excellent": "t-gr", "Good": "t-bl", "Fair": "t-yw" };

  return (
    <article className="card card-lift" aria-label={`${item.title}, ₹${item.price}`}>
      <div className="pcimg" aria-hidden="true">
        <div className="pcimg-shimmer" />
        {item.image}
        <button className={`wl-btn ${inWishlist ? "on" : ""}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(item); }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
          {inWishlist ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="pcbd">
        <h3 className="pctitle" onClick={() => navigate("product", { id: item.id })}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === "Enter" && navigate("product", { id: item.id })}>
          {item.title}
        </h3>
        <div className="pcprice">₹{item.price}</div>
        <div className="pcmeta">
          <span className="tag t-mu">{item.category}</span>
          <span className={`tag ${condMap[item.condition] || "t-mu"}`}>{item.condition}</span>
        </div>
        <div className="pcseller">
          <span className="selav" aria-hidden="true">{getInitials(item.seller)}</span>
          {item.seller}
        </div>
        <div className="pcactions">
          <button className="btn btn-p btn-sm" onClick={() => navigate("product", { id: item.id })}>
            View
          </button>
          {user && !inCart && (
            <button className="btn btn-s btn-sm"
              onClick={() => { cartDispatch({ type: "ADD", item }); toast("Added to cart ✓"); }}>
              + Cart
            </button>
          )}
          {user && inCart && <span className="tag t-gr">✓ In cart</span>}
          {onDelete && (
            <button className="btn btn-d btn-sm" onClick={() => onDelete(item.id)}>Remove</button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── LF CARD ──────────────────────────────────────────────────
function LFCard({ item, onClaim, compact }) {
  const { user } = useContext(AuthContext);
  return (
    <article className={`card card-lift lf-${item.type.toLowerCase()}`}
      aria-label={`${item.type}: ${item.title}`}>
      <div className="cb">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span className="lf-ic" aria-hidden="true">{item.image}</span>
          <span className={`tag ${item.type === "Lost" ? "t-rd" : "t-gr"}`}>{item.type}</span>
        </div>
        <h3 style={{ fontWeight: 600, fontSize: ".9375rem", marginBottom: 5, letterSpacing: "-.01em", fontFamily: "var(--ff-body)" }}>
          {item.title}
        </h3>
        <p style={{ color: "var(--t2)", fontSize: ".75rem", marginBottom: 5 }}>
          📍 {item.location} · <time dateTime={item.date}>{item.date}</time>
        </p>
        {!compact && <p style={{ color: "var(--t2)", fontSize: ".875rem", margin: "7px 0 10px", lineHeight: 1.55 }}>{item.description}</p>}
        <p style={{ fontSize: ".6875rem", color: "var(--t3)", marginBottom: 10 }}>Posted by {item.postedBy}</p>
        {item.claimedBy
          ? <span className="tag t-yw">✓ Claimed</span>
          : user && onClaim && (
            <button className="btn btn-g btn-sm" onClick={() => onClaim(item.id)}>Submit Claim</button>
          )}
      </div>
    </article>
  );
}

// ─── MARKETPLACE PAGE ─────────────────────────────────────────
function MarketplacePage() {
  const { user }                = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [sort, setSort]         = useState("newest");
  const [modal, setModal]       = useState(false);

  useEffect(() => {
    setLoading(true); setError(null);
    API.getListings()
      .then(d => { setListings(d); setLoading(false); })
      .catch(() => { setError("Failed to load listings."); setLoading(false); });
  }, []);

  const cats = ["All", "Books", "Electronics", "Lab Kit", "Hostel"];
  const filtered = listings
    .filter(l => cat === "All" || l.category === cat)
    .filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "price-asc"  ? a.price - b.price :
      sort === "price-desc" ? b.price - a.price :
      b.id.localeCompare(a.id)
    );

  const handleDelete = id => { setListings(p => p.filter(l => l.id !== id)); toast("Listing removed"); };
  const handleAdd    = item => {
    const n = { ...item, id: `c${Date.now()}`, seller: user?.name || "You", date: new Date().toISOString().slice(0, 10) };
    setListings(p => [n, ...p]); setModal(false); toast("Listing posted 🎉");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".875rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-.025em", fontFamily: "var(--ff-display)" }}>Marketplace</h1>
          <p style={{ color: "var(--t2)", fontSize: ".8125rem", marginTop: 3 }}>{filtered.length} items available</p>
        </div>
        {user && <button className="btn btn-p" onClick={() => setModal(true)}>+ Post listing</button>}
      </div>

      {/* Search + sort */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div className="sbar">
          <span className="sbar-ic" aria-hidden="true">🔍</span>
          <input className="fi sbar-in" placeholder="Search items or sellers…"
            value={search} onChange={e => setSearch(e.target.value)}
            aria-label="Search marketplace" />
        </div>
        <select className="fi" style={{ width: "auto" }} value={sort}
          onChange={e => setSort(e.target.value)} aria-label="Sort listings">
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {cats.map(c => (
          <button key={c} className={`fc ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {loading && <div className="sw"><div className="sp" /><span style={{ color: "var(--t2)", fontSize: ".8125rem" }}>Loading…</span></div>}
      {error   && <div className="alert a-err" role="alert">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-ic">📭</div>
          <h3 className="empty-h">No listings found</h3>
          <p className="empty-p">Try adjusting your filters or search term.</p>
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="g2">
          {filtered.map(l => (
            <ProductCard key={l.id} item={l}
              onDelete={user && (user.role === "admin" || l.seller === user.name) ? handleDelete : undefined} />
          ))}
        </div>
      )}

      {modal && <AddListingModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </div>
  );
}

// ─── ADD LISTING MODAL ────────────────────────────────────────
function AddListingModal({ onClose, onAdd }) {
  const [form, setForm]     = useState({ title: "", price: "", category: "Books", condition: "Good", description: "", image: "📦" });
  const [errors, setErrors] = useState({});
  const emojis = ["📚", "🔢", "🥼", "💡", "📐", "🖥️", "📦", "🎒"];

  const validate = () => {
    const e = {};
    if (!form.title.trim())                          e.title = "Title is required";
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = "Enter a valid price";
    if (!form.description.trim())                    e.description = "Description is required";
    setErrors(e); return !Object.keys(e).length;
  };

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Add new listing">
      <div className="mbox" onClick={e => e.stopPropagation()}>
        <div className="mhd">
          <span className="mtitle">Post New Listing</span>
          <button className="cbtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mbd">
          <div className="fg">
            <label className="flb">Choose icon</label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {emojis.map(e => (
                <button key={e} onClick={() => setForm(p => ({ ...p, image: e }))}
                  style={{ fontSize: "1.25rem", background: form.image === e ? "var(--ad)" : "transparent",
                    border: `1.5px solid ${form.image === e ? "var(--a)" : "transparent"}`,
                    borderRadius: "var(--r1)", padding: ".2rem .35rem", cursor: "pointer", transition: "all .13s" }}
                  aria-pressed={form.image === e}>{e}</button>
              ))}
            </div>
          </div>
          <div className="fg">
            <label htmlFor="ml-title" className="flb">Title *</label>
            <input id="ml-title" className="fi" placeholder="e.g. Engineering Maths Textbook"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            {errors.title && <span className="ferr">{errors.title}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="fg">
              <label htmlFor="ml-price" className="flb">Price (₹) *</label>
              <input id="ml-price" className="fi" type="number" placeholder="200"
                value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              {errors.price && <span className="ferr">{errors.price}</span>}
            </div>
            <div className="fg">
              <label htmlFor="ml-cat" className="flb">Category</label>
              <select id="ml-cat" className="fi" value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {["Books","Electronics","Lab Kit","Hostel"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="fg">
            <label htmlFor="ml-cond" className="flb">Condition</label>
            <select id="ml-cond" className="fi" value={form.condition}
              onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
              {["Excellent","Good","Fair"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fg">
            <label htmlFor="ml-desc" className="flb">Description *</label>
            <textarea id="ml-desc" className="fi" rows={3} placeholder="Describe the item…"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            {errors.description && <span className="ferr">{errors.description}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-g" onClick={onClose}>Cancel</button>
            <button className="btn btn-p"
              onClick={() => { if (validate()) onAdd({ ...form, price: +form.price }); }}>
              Post listing 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────
function ProductDetailPage() {
  const { params, navigate }         = useRouter();
  const { cart, cartDispatch }       = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { user }                     = useContext(AuthContext);
  const [item, setItem]              = useState(null);
  const [loading, setLoading]        = useState(true);

  useEffect(() => {
    setLoading(true);
    API.getListings().then(data => { setItem(data.find(l => l.id === params.id) || null); setLoading(false); });
  }, [params.id]);

  if (loading) return <div className="sw"><div className="sp" /></div>;
  if (!item)   return (
    <div className="empty" style={{ paddingTop: "5rem" }}>
      <div className="empty-ic">😕</div>
      <h2 className="empty-h">Item not found</h2>
      <p className="empty-p" style={{ marginBottom: "1.25rem" }}>This listing may have been removed.</p>
      <button className="btn btn-g" onClick={() => navigate("marketplace")}>← Back to Marketplace</button>
    </div>
  );

  const inCart     = cart.some(i => i.id === item.id);
  const inWishlist = wishlist.some(i => i.id === item.id);
  const condMap    = { "Excellent": "t-gr", "Good": "t-bl", "Fair": "t-yw" };

  return (
    <div className="det">
      <button className="btn btn-g btn-sm" style={{ marginBottom: "1.5rem" }}
        onClick={() => navigate("marketplace")}>← Back</button>
      <div className="det-hero" aria-hidden="true">{item.image}</div>
      <div className="det-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".875rem", marginBottom: ".875rem" }}>
          <div>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-.025em", marginBottom: 7, fontFamily: "var(--ff-display)" }}>{item.title}</h1>
            <div className="det-price">₹{item.price}</div>
          </div>
          <button onClick={() => { toggleWishlist(item); toast(inWishlist ? "Removed from wishlist" : "Saved to wishlist ❤️"); }}
            style={{ fontSize: "1.625rem", background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 1 }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
            {inWishlist ? "❤️" : "🤍"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: ".875rem" }}>
          <span className="tag t-mu">{item.category}</span>
          <span className={`tag ${condMap[item.condition] || "t-mu"}`}>{item.condition}</span>
          <span className="tag t-mu">{item.date}</span>
        </div>

        <div style={{ margin: ".875rem 0" }}>
          <div className="flb" style={{ marginBottom: 5 }}>Description</div>
          <p style={{ color: "var(--t2)", lineHeight: 1.7, fontSize: ".9375rem" }}>{item.description}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: ".75rem .875rem",
          background: "var(--s2)", borderRadius: "var(--r2)", marginBottom: "1.125rem",
          border: "1px solid var(--line)" }}>
          <div className="selav" style={{ width: 28, height: 28, fontSize: ".6875rem" }} aria-hidden="true">
            {getInitials(item.seller)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: ".9375rem" }}>{item.seller}</div>
            <div style={{ fontSize: ".6875rem", color: "var(--t2)" }}>Seller</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {user && !inCart && (
            <button className="btn btn-p"
              onClick={() => { cartDispatch({ type: "ADD", item }); toast("Added to cart ✓"); }}>
              Add to Cart
            </button>
          )}
          {user && inCart && <button className="btn btn-ok">✓ In Cart</button>}
          {!user && <button className="btn btn-p" onClick={() => navigate("login")}>Log in to Purchase</button>}
          <button className="btn btn-g" onClick={() => navigate("marketplace")}>Browse More</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOST & FOUND PAGE ────────────────────────────────────────
function LostFoundPage() {
  const { user }            = useContext(AuthContext);
  const [items, setItems]   = useState([]);
  const [loading, setL]     = useState(true);
  const [filter, setFilter] = useState("All");
  const [modal, setModal]   = useState(false);

  useEffect(() => {
    API.getLostFound().then(d => { setItems(d); setL(false); });
  }, []);

  const filtered = filter === "All" ? items : items.filter(i => i.type === filter);

  const handleClaim = id => {
    setItems(p => p.map(i => i.id === id ? { ...i, claimedBy: user?.name || "You" } : i));
    toast("Claim submitted ✓");
  };
  const handlePost = form => {
    const n = { ...form, id: `lf${Date.now()}`, claimedBy: null,
      date: new Date().toISOString().slice(0, 10), postedBy: user?.name || "You" };
    setItems(p => [n, ...p]); setModal(false); toast("Item posted ✓");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.375rem", flexWrap: "wrap", gap: ".875rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-.025em", fontFamily: "var(--ff-display)" }}>Lost &amp; Found</h1>
          <p style={{ color: "var(--t2)", fontSize: ".8125rem", marginTop: 3 }}>
            {items.filter(i => !i.claimedBy).length} open reports
          </p>
        </div>
        {user && <button className="btn btn-p" onClick={() => setModal(true)}>+ Post item</button>}
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "1.375rem" }}>
        {["All", "Lost", "Found"].map(f => (
          <button key={f} className={`fc ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {loading && <div className="sw"><div className="sp" /></div>}
      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-ic">🔎</div>
          <h3 className="empty-h">No items found</h3>
          <p className="empty-p">Try switching between Lost and Found.</p>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="g2">{filtered.map(i => <LFCard key={i.id} item={i} onClaim={handleClaim} />)}</div>
      )}
      {modal && <PostLFModal onClose={() => setModal(false)} onPost={handlePost} />}
    </div>
  );
}

function PostLFModal({ onClose, onPost }) {
  const [form, setForm]     = useState({ type: "Lost", title: "", location: "", description: "", image: "📦" });
  const [errors, setErrors] = useState({});
  const icons = ["📚", "⌚", "🪪", "📔", "🎧", "👜", "💻", "📱", "📦"];

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Item name is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e); return !Object.keys(e).length;
  };

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mbox" onClick={e => e.stopPropagation()}>
        <div className="mhd">
          <span className="mtitle">Report Lost / Found Item</span>
          <button className="cbtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mbd">
          <div className="fg">
            <label className="flb">Type</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["Lost", "Found"].map(t => (
                <button key={t}
                  className={`btn btn-sm ${form.type === t ? "btn-p" : "btn-g"}`}
                  onClick={() => setForm(p => ({ ...p, type: t }))}>{t}</button>
              ))}
            </div>
          </div>
          <div className="fg">
            <label className="flb">Icon</label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {icons.map(e => (
                <button key={e} onClick={() => setForm(p => ({ ...p, image: e }))}
                  style={{ fontSize: "1.2rem", background: form.image === e ? "var(--ad)" : "transparent",
                    border: `1.5px solid ${form.image === e ? "var(--a)" : "transparent"}`,
                    borderRadius: "var(--r1)", padding: ".2rem .35rem", cursor: "pointer" }}
                  aria-pressed={form.image === e}>{e}</button>
              ))}
            </div>
          </div>
          <div className="fg">
            <label htmlFor="lf-title" className="flb">Item Name *</label>
            <input id="lf-title" className="fi" placeholder="e.g. Blue Casio Watch"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            {errors.title && <span className="ferr">{errors.title}</span>}
          </div>
          <div className="fg">
            <label htmlFor="lf-loc" className="flb">Location *</label>
            <input id="lf-loc" className="fi" placeholder="e.g. Library Block, Canteen"
              value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            {errors.location && <span className="ferr">{errors.location}</span>}
          </div>
          <div className="fg">
            <label htmlFor="lf-desc" className="flb">Description</label>
            <textarea id="lf-desc" className="fi" rows={3}
              placeholder="Add details to help identify the item…"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-g" onClick={onClose}>Cancel</button>
            <button className="btn btn-p" onClick={() => { if (validate()) onPost(form); }}>Post Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────
function LoginPage() {
  const { login }    = useContext(AuthContext);
  const { navigate } = useRouter();
  const [form, setF] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const fill = (email, password) => setF({ email, password });

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) { toast("Welcome back! 👋"); navigate("dashboard"); }
    else setError(res.error);
  };

  return (
    <div className="auth-pg">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-lm">CC</div>
          <span className="auth-lt">CampusConnect</span>
        </div>
        <h1 className="auth-h1">Welcome back</h1>
        <p className="auth-sub">Sign in to your campus account.</p>

        {error && <div className="alert a-err" style={{ marginBottom: "1rem" }} role="alert">{error}</div>}

        <div className="auth-form">
          <div className="fg">
            <label htmlFor="l-email" className="flb">Email</label>
            <input id="l-email" className="fi" type="email" placeholder="you@campus.edu"
              value={form.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} autoComplete="email" />
          </div>
          <div className="fg">
            <label htmlFor="l-pw" className="flb">Password</label>
            <input id="l-pw" className="fi" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setF(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} autoComplete="current-password" />
          </div>
          <button className="btn btn-p btn-fw" style={{ padding: ".6875rem", marginTop: 2 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </div>

        <div className="auth-foot">
          No account?{" "}
          <button className="auth-lnk" onClick={() => navigate("register")}>Create one</button>
        </div>

        <div className="demo-box">
          <strong>Demo accounts:</strong><br />
          Student:{" "}
          <button className="demo-fill" onClick={() => fill("ravi@campus.edu", "ravi123")}>
            ravi@campus.edu / ravi123
          </button><br />
          Admin:{" "}
          <button className="demo-fill" onClick={() => fill("admin@campus.edu", "admin123")}>
            admin@campus.edu / admin123
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const { navigate } = useRouter();
  const [form, setF] = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name     = "Name is required";
    if (!form.email.includes("@"))  e.email    = "Valid email required";
    if (form.password.length < 6)   e.password = "Password must be 6+ characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await register(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (res.success) { toast("Account created! 🎉"); navigate("dashboard"); }
    else setErrors({ email: res.error });
  };

  const fields = [
    { key: "name",     label: "Full Name",        type: "text",     ph: "Ravi Kumar",         ac: "name" },
    { key: "email",    label: "Email",             type: "email",    ph: "you@campus.edu",     ac: "email" },
    { key: "password", label: "Password",          type: "password", ph: "Min 6 characters",   ac: "new-password" },
    { key: "confirm",  label: "Confirm Password",  type: "password", ph: "Repeat password",    ac: "new-password" },
  ];

  return (
    <div className="auth-pg">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-lm">CC</div>
          <span className="auth-lt">CampusConnect</span>
        </div>
        <h1 className="auth-h1">Create account</h1>
        <p className="auth-sub">Join your campus community today.</p>

        <div className="auth-form">
          {fields.map(({ key, label, type, ph, ac }) => (
            <div key={key} className="fg">
              <label htmlFor={`r-${key}`} className="flb">{label}</label>
              <input id={`r-${key}`} className="fi" type={type} placeholder={ph}
                value={form[key]} autoComplete={ac}
                onChange={e => setF(p => ({ ...p, [key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              {errors[key] && <span className="ferr">{errors[key]}</span>}
            </div>
          ))}
          <div className="fg">
            <label htmlFor="r-role" className="flb">Role</label>
            <select id="r-role" className="fi" value={form.role}
              onChange={e => setF(p => ({ ...p, role: e.target.value }))}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-p btn-fw" style={{ padding: ".6875rem", marginTop: 2 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </div>

        <div className="auth-foot">
          Already have an account?{" "}
          <button className="auth-lnk" onClick={() => navigate("login")}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────
function CartPage() {
  const { cart, cartDispatch } = useContext(CartContext);
  const { navigate }           = useRouter();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--ff-display)", letterSpacing: "-.025em" }}>
        My Cart {cart.length > 0 && <span style={{ fontSize: ".875rem", color: "var(--t2)", fontFamily: "var(--ff-body)", fontWeight: 500 }}>· {cart.length} items</span>}
      </h1>
      {cart.length === 0 ? (
        <div className="empty card">
          <div className="cb" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
            <div className="empty-ic">🛒</div>
            <h3 className="empty-h">Your cart is empty</h3>
            <p className="empty-p" style={{ marginBottom: "1.25rem" }}>Add items from the marketplace</p>
            <button className="btn btn-p" onClick={() => navigate("marketplace")}>Browse Marketplace</button>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
            {cart.map(item => (
              <div key={item.id} className="ci">
                <span className="ci-ic">{item.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: ".9375rem" }}>{item.title}</div>
                  <div style={{ color: "var(--t2)", fontSize: ".75rem" }}>{item.seller}</div>
                </div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: "1rem", marginRight: 8 }}>₹{item.price}</div>
                <button className="btn btn-d btn-sm"
                  onClick={() => { cartDispatch({ type: "REMOVE", id: item.id }); toast("Removed"); }}>✕</button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="cb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "var(--t2)", fontSize: ".75rem", marginBottom: 2 }}>Total</div>
                <div className="ctot">₹{total}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-g"
                  onClick={() => { cartDispatch({ type: "CLEAR" }); toast("Cart cleared"); }}>
                  Clear all
                </button>
                <button className="btn btn-p"
                  onClick={() => { cartDispatch({ type: "CLEAR" }); toast("Request placed! 🎉"); navigate("marketplace"); }}>
                  Place Request ✓
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function DashboardPage() {
  const { user }   = useContext(AuthContext);
  const [tab, setTab] = useState("overview");

  const studentTabs = [
    { key: "overview",    icon: "⊞", label: "Overview"    },
    { key: "mylistings",  icon: "🏷", label: "My Listings"  },
    { key: "myclaims",    icon: "🔍", label: "My Claims"    },
    { key: "wishlist",    icon: "♡", label: "Wishlist"     },
    { key: "cart",        icon: "🛒", label: "My Requests"  },
  ];
  const adminTabs = [...studentTabs, { key: "admin", icon: "⛨", label: "Admin Panel" }];
  const tabs = user?.role === "admin" ? adminTabs : studentTabs;

  return (
    <div className="dash">
      <div>
        <div className="pcard">
          <div className="pav">{getInitials(user?.name)}</div>
          <div>
            <div className="pname">{user?.name}</div>
            <div className="prole">{user?.role}</div>
            <div className="pemail">{user?.email}</div>
          </div>
        </div>
        <div className="dsb card" style={{ padding: ".375rem" }}>
          {tabs.map(t => (
            <button key={t.key} className={`sbl ${tab === t.key ? "on" : ""}`} onClick={() => setTab(t.key)}>
              <span style={{ fontSize: ".9rem" }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        {tab === "overview"   && <DashOverview />}
        {tab === "mylistings" && <MyListings />}
        {tab === "myclaims"   && <MyClaims />}
        {tab === "wishlist"   && <MyWishlist />}
        {tab === "cart"       && <CartPage />}
        {tab === "admin"      && user?.role === "admin" && <AdminPanel />}
      </div>
    </div>
  );
}

function DashOverview() {
  const { cart }    = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { user }    = useContext(AuthContext);

  const stats = [
    { icon: "🛒", label: "Cart Items",  value: cart.length },
    { icon: "♡",  label: "Wishlist",    value: wishlist.length },
    { icon: "🏷",  label: "My Listings", value: user?.role === "admin" ? "∞" : 2 },
    { icon: "🔍",  label: "Claims",      value: 1 },
  ];
  return (
    <div>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.125rem", fontFamily: "var(--ff-display)", letterSpacing: "-.025em" }}>Overview</h2>
      <div className="ogrid">
        {stats.map(s => (
          <div key={s.label} className="ostat">
            <div className="osta-ic">{s.icon}</div>
            <div className="osta-n">{s.value}</div>
            <div className="osta-l">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="cb">
          <div style={{ fontWeight: 700, fontSize: ".9375rem", marginBottom: ".75rem", fontFamily: "var(--ff-display)" }}>Recent Activity</div>
          {[
            { icon: "✅", text: "Listed 'Engineering Maths Vol 2'",          time: "2 days ago" },
            { icon: "🔔", text: "Claim for 'Blue Watch' is under review",     time: "1 day ago"  },
            { icon: "♡",  text: "Saved 'FX-991 Calculator' to wishlist",      time: "Today"      },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: ".75rem", padding: ".5rem 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
              <span style={{ fontSize: ".9375rem", marginTop: 1 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".875rem" }}>{a.text}</div>
                <div style={{ fontSize: ".6875rem", color: "var(--t3)", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyListings() {
  const { user }             = useContext(AuthContext);
  const [listings, setL]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]    = useState(false);

  useEffect(() => {
    API.getListings().then(data => { setL(data.filter(l => l.seller === user?.name)); setLoading(false); });
  }, [user]);

  const handleDelete = id => { setL(p => p.filter(l => l.id !== id)); toast("Listing removed"); };
  const handleAdd    = item => {
    const n = { ...item, id: `u${Date.now()}`, seller: user?.name, date: new Date().toISOString().slice(0, 10) };
    setL(p => [n, ...p]); setModal(false); toast("Listing added!");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.125rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--ff-display)" }}>My Listings</h2>
        <button className="btn btn-p btn-sm" onClick={() => setModal(true)}>+ Add new</button>
      </div>
      {loading
        ? <div className="sw"><div className="sp" /></div>
        : listings.length === 0
          ? <div className="empty"><div className="empty-ic">🏷</div><p className="empty-h">No listings yet.</p></div>
          : <div className="g2">{listings.map(l => <ProductCard key={l.id} item={l} onDelete={handleDelete} />)}</div>
      }
      {modal && <AddListingModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </div>
  );
}

function MyClaims() {
  const [claims] = useState([
    { id: 1, item: "Blue Casio Watch",  date: "2024-12-10", status: "Under Review" },
    { id: 2, item: "Tata Sky ID Card",  date: "2024-12-12", status: "Approved"     },
  ]);
  return (
    <div>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.125rem", fontFamily: "var(--ff-display)" }}>My Claims</h2>
      <div className="card">
        <table>
          <thead>
            <tr><th>Item</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id}>
                <td>{c.item}</td>
                <td style={{ color: "var(--t2)" }}>{c.date}</td>
                <td><span className={`tag ${c.status === "Approved" ? "t-gr" : "t-yw"}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MyWishlist() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  return (
    <div>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.125rem", fontFamily: "var(--ff-display)" }}>Wishlist</h2>
      {wishlist.length === 0
        ? <div className="empty"><div className="empty-ic">♡</div><h3 className="empty-h">Nothing saved yet.</h3></div>
        : <div className="g2">{wishlist.map(i => <ProductCard key={i.id} item={i} />)}</div>
      }
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────
function AdminPanel() {
  const [listings, setListings] = useState([]);
  const [lf, setLF]             = useState([]);
  const [tab, setTab]           = useState("listings");

  useEffect(() => {
    Promise.all([API.getListings(), API.getLostFound()]).then(([l, lf]) => { setListings(l); setLF(lf); });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: "1.125rem" }}>
        <span style={{ fontSize: "1.125rem" }}>⛨</span>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--ff-display)" }}>Admin Panel</h2>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: "1.25rem" }}>
        {[["listings","Listings"],["lostfound","Lost & Found"],["users","Users"]].map(([k, l]) => (
          <button key={k} className={`fc ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "listings" && (
        <div className="card">
          <table>
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Seller</th><th>Action</th></tr></thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id}>
                  <td>{l.image} {l.title}</td>
                  <td><span className="tag t-am">{l.category}</span></td>
                  <td style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>₹{l.price}</td>
                  <td style={{ color: "var(--t2)" }}>{l.seller}</td>
                  <td><button className="btn btn-d btn-sm" onClick={() => { setListings(p => p.filter(x => x.id !== l.id)); toast("Removed"); }}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "lostfound" && (
        <div className="card">
          <table>
            <thead><tr><th>Item</th><th>Type</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {lf.map(i => (
                <tr key={i.id}>
                  <td>{i.image} {i.title}</td>
                  <td><span className={`tag ${i.type === "Lost" ? "t-rd" : "t-gr"}`}>{i.type}</span></td>
                  <td style={{ color: "var(--t2)" }}>{i.location}</td>
                  <td>{i.claimedBy ? <span className="tag t-yw">Resolved</span> : <span className="tag t-bl">Open</span>}</td>
                  <td>{!i.claimedBy && <button className="btn btn-ok btn-sm" onClick={() => { setLF(p => p.map(x => x.id === i.id ? { ...x, claimedBy: "Admin" } : x)); toast("Resolved ✓"); }}>Resolve</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="card">
          <table>
            <thead><tr><th>Initials</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {userStore.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--ad)", border: "1.5px solid rgba(232,25,44,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".625rem", fontWeight: 700, color: "var(--a)", fontFamily: "var(--ff-display)" }}>
                      {getInitials(u.name)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: "var(--t2)" }}>{u.email}</td>
                  <td><span className={`tag ${u.role === "admin" ? "t-am" : "t-bl"}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── PAGE SWITCHER ────────────────────────────────────────────
function PageSwitcher() {
  const { page } = useRouter();
  const map = {
    home:        <HomePage />,
    marketplace: <MarketplacePage />,
    lostfound:   <LostFoundPage />,
    product:     <ProductDetailPage />,
    login:       <LoginPage />,
    register:    <RegisterPage />,
    cart:        <ProtectedRoute><CartPage /></ProtectedRoute>,
    dashboard:   <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  };
  return map[page] || <HomePage />;
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div className="f-logo">
          <div className="f-mark">CC</div>
          CampusConnect
        </div>
        <p className="f-meta">
          Smart Student Marketplace &amp; Lost-and-Found Platform<br />
          React · Context API · Custom Router · JWT Auth Flow
        </p>
        <div className="f-tags">
          {["React","Context API","Custom Router","useEffect","useReducer","JWT Sim"].map(t => (
            <span key={t} className="ftag">{t}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProviders>
      <Router>
        <GlobalStyles />
        <div className="app">
          <Navbar />
          <main className="main">
            <PageSwitcher />
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </Router>
    </AppProviders>
  );
}
