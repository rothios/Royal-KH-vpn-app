/**
 * Apsara VPN Manager - iOS Glass-Morphism Dark Design
 * Full replication of apsaradc.dpdns.org
 * Design: SF Pro Display font, iOS-style glass cards, dark wallpaper background
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Home as HomeIcon,
  Smartphone,
  Zap,
  Bell,
  ArrowLeft,
  ChevronRight,
  Copy,
  QrCode,
  Search,
  PlayCircle,
  Apple,
  LogOut,
  X,
  Loader,
  AlertCircle,
  Info,
  Shield,
  ChevronDown,
  Settings,
  Users,
  Trash2,
  Plus,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import AdminPanel from "@/components/AdminPanel";
import SettingsPanel from "@/components/SettingsPanel";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  expiry?: number;
  subLinks?: Record<string, string>;
  id?: string;
}

interface ServerConfig {
  name: string;
  link: string;
}

interface ServerCategory {
  title: string;
  configs: ServerConfig[];
}

interface ServerPack {
  title?: string;
  buttonTitle?: string;
  subUrl?: string;
  categories?: ServerCategory[];
}

interface ServersData {
  [key: string]: ServerPack;
}

interface Proxy {
  ip: string;
  port: string;
  cc: string;
  isp: string;
}

interface Notification {
  type?: string;
  title: string;
  message: string;
  date?: string;
}

interface Member {
  id: string;
  email: string;
  name?: string;
  expiry: number;
  createdAt: number;
  role: 'member' | 'admin';
  accessKey?: string;
}

interface Server {
  id: string;
  name: string;
  link: string;
  category?: string;
  createdAt: number;
  icon?: string;
  status?: string;
}
// ─── Constants ───────────────────────────────────────────────────────────────

const GITHUB_REPO = { owner: "sokc7618-boop", repo: "Kajabahagahbsbajajajsnanajajaj" };
const SERVERS_URL = `https://raw.githubusercontent.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/main/servers.json`;
const USERS_URL = `https://raw.githubusercontent.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/main/users.json`;
const UPDATES_URL = `https://raw.githubusercontent.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/main/update.json`;
const VLESS_UUID = "fc60147e-76b8-4bc5-b691-90b2da79e3d2";
const TROJAN_UUID = "86768774-70b2-4c15-80c3-02066fb1e3b6";
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663374930964/ipoqlMYlQeWcJDkO.png";

const WORKER_HOSTS = [
  "still-cell-dcbc.pvxlcvn.workers.dev",
  "raspy-frog-8969.hyzzgnbh.workers.dev",
  "v3.lifetime51.workers.dev",
  "v3.lifetime52.workers.dev",
  "v3.lifetime53.workers.dev",
  "v3.lifetime54.workers.dev",
  "v3.lifetime55.workers.dev",
  "v3.lifetime56.workers.dev",
  "v3.lifetime57.workers.dev",
  "v3.lifetime58.workers.dev",
  "v3.lifetime59.workers.dev",
  "v3.lifetime60.workers.dev",
];

const translations = {
  en: {
    login_title: "Welcome Back",
    login_sub: "Sign in to access your servers",
    tab_key: "Access Key",
    tab_email: "Email",
    btn_connect: "Connect",
    btn_signin: "Sign In",
    header_welcome: "Welcome Back",
    status_label: "Status",
    status_online: "ONLINE",
    status_protected: "Protected",
    server_packs: "Server Packs",
    download_title: "Download App",
    download_sub: "VPN V2RAY Client for All Devices",
    install_guide_title: "Installation Guide",
    install_guide_text: "Select your platform above to download. For Android APK, ensure 'Unknown Sources' is enabled in settings.",
    create_step1: "1. Select Proxy",
    btn_generate: "Generate Link",
    notif_title: "Notifications",
    notif_empty: "No new notifications",
    btn_close: "Close",
  },
  km: {
    login_title: "សូមស្វាគមន៍",
    login_sub: "ចូលគណនីដើម្បីប្រើប្រាស់សេវាកម្ម",
    tab_key: "លេខកូដ",
    tab_email: "អ៊ីមែល",
    btn_connect: "តភ្ជាប់",
    btn_signin: "ចូល",
    header_welcome: "សូមស្វាគមន៍",
    status_label: "ស្ថានភាព",
    status_online: "ដំណើរការ",
    status_protected: "សុវត្ថិភាព",
    server_packs: "កញ្ចប់សេវា",
    download_title: "ទាញយកកម្មវិធី",
    download_sub: "សម្រាប់ទូរស័ព្ទ និងកុំព្យូទ័រ",
    install_guide_title: "របៀបដំឡើង",
    install_guide_text: "ជ្រើសរើសប្រភេទឧបករណ៍ខាងលើ។ សម្រាប់ Android សូមបើក 'Unknown Sources' ក្នុង Setting ជាមុនសិន។",
    create_step1: "១. ជ្រើសរើស Proxy",
    btn_generate: "បង្កើតតំណភ្ជាប់",
    notif_title: "ការជូនដំណឹង",
    notif_empty: "មិនមានដំណឹងថ្មីទេ",
    btn_close: "បិទ",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFlag(cc: string): string {
  return cc.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}

function copyToClipboard(text: string, message = "Copied to Clipboard") {
  if (!text) return;
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    if (document.execCommand("copy")) toast.success(message);
    else toast.error("Copy Failed");
  } catch {
    toast.error("Copy Failed");
  }
  document.body.removeChild(textArea);
}

function showQRModal(text: string, setQrText: (t: string) => void, setQrOpen: (b: boolean) => void) {
  setQrText(text);
  setQrOpen(true);
}

// ─── QR Code Component ───────────────────────────────────────────────────────

function QRCodeModal({ text, open, onClose }: { text: string; open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !text || !canvasRef.current) return;
    canvasRef.current.innerHTML = "";
    // @ts-ignore
    if (window.QRCode) {
      // @ts-ignore
      new window.QRCode(canvasRef.current, { text, width: 180, height: 180 });
    }
  }, [open, text]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-[32px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={canvasRef} />
        <p className="text-center text-black font-bold mt-4 text-xs">Scan to Connect</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<"en" | "km">("en");
  const [loginMethod, setLoginMethod] = useState<"key" | "email">("key");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "app" | "create" | "manager" | "admin">("home");
  const [serversData, setServersData] = useState<ServersData>({});
  const [serversLoading, setServersLoading] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNotif, setHasNotif] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [managerKey, setManagerKey] = useState<string | null>(null);
  const [managerUserLink, setManagerUserLink] = useState<string | null>(null);
  const [pingStates, setPingStates] = useState<Record<string, string>>({});
  const [allProxies, setAllProxies] = useState<Proxy[]>([]);
  const [filteredProxies, setFilteredProxies] = useState<Proxy[]>([]);
  const [proxySearch, setProxySearch] = useState("");
  const [selectedProxy, setSelectedProxy] = useState<Proxy | null>(null);
  const [vlessAddr, setVlessAddr] = useState("104.18.36.89");
  const [vlessPort, setVlessPort] = useState("80");
  const [vlessHost, setVlessHost] = useState(WORKER_HOSTS[0]);
  const [vlessPath, setVlessPath] = useState("");
  const [vlessRemark, setVlessRemark] = useState("");
  const [vlessOutput, setVlessOutput] = useState("");
  const [trojanOutput, setTrojanOutput] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrText, setQrText] = useState("");
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [genKeyOut, setGenKeyOut] = useState("");
  const loginCardRef = useRef<HTMLDivElement>(null);
  const [proxiesLoading, setProxiesLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [adminTab, setAdminTab] = useState<'members' | 'servers' | 'packs' | 'notifications'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteExpiry, setInviteExpiry] = useState('30');
  const [adminModalOpen2, setAdminModalOpen2] = useState(false);
  const [servers, setServers] = useState<Array<{id: string; name: string; link: string; category?: string; createdAt: number; icon?: string; status?: string}>>([]);
  const [websiteSettings, setWebsiteSettings] = useState({
    name: 'ROYAL-KH VPN',
    logo: LOGO_URL,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<{id: string; name: string; link: string; category?: string; createdAt: number; icon?: string; status?: string} | null>(null);
  const [editServerName, setEditServerName] = useState('');
  const [editServerLink, setEditServerLink] = useState('');
  const [editServerIcon, setEditServerIcon] = useState<string | null>(null);

  const t = translations[lang];

  // ── Loader ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => setLoaderVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('royal_website_settings');
    if (saved) {
      try {
        setWebsiteSettings(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('royal_website_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  // ── Session Restore ─────────────────────────────────────────────────────────

  useEffect(() => {
    const session = localStorage.getItem("royal_session");
    if (session) {
      try {
        const jsonStr = decodeURIComponent(escape(atob(session)));
        const data = JSON.parse(jsonStr) as User;
        if (data.expiry && Date.now() < data.expiry) {
          launchApp(data);
        } else {
          localStorage.removeItem("royal_session");
        }
      } catch {
        localStorage.removeItem("royal_session");
      }
    }
  }, []);

  // ── Language ────────────────────────────────────────────────────────────────

  const changeLang = (l: "en" | "km") => setLang(l);

  // ── Login ───────────────────────────────────────────────────────────────────

  const attemptLogin = async () => {
    setIsLoading(true);
    setAuthStatus("");
    try {
      if (loginMethod === "key") {
        const key = accessKey.trim();
        if (!key.startsWith("ROYAL-")) throw new Error("Invalid Key Format");
        
        // Check if owner key
        if (key === "ROYAL-1203") {
          const ownerUser: User = {
            name: "Owner",
            email: "owner@apsara.com",
            expiry: Date.now() + 365 * 86400000,
            id: "owner"
          };
          completeLogin("owner-token", ownerUser);
          setIsOwner(true);
          loadMembers();
          loadServers();
          return;
        }
        
        // Check if it's a member key
        const memberWithKey = members.find((m) => m.accessKey === key);
        if (memberWithKey) {
          if (Date.now() > memberWithKey.expiry) throw new Error("Key Expired");
          const memberUser: User = {
            name: memberWithKey.email.split("@")[0],
            email: memberWithKey.email,
            expiry: memberWithKey.expiry,
            id: memberWithKey.id,
          };
          completeLogin(key, memberUser);
          return;
        }
        
        throw new Error("Invalid Key");
      } else {
        const email = loginEmail.trim();
        if (!email) throw new Error("Please enter email");
        
        // Check members list first
        const member = members.find((m) => m.email === email);
        if (member) {
          if (Date.now() > member.expiry) throw new Error("Account Expired");
          const memberUser: User = {
            name: email.split("@")[0],
            email: email,
            expiry: member.expiry,
            id: member.id,
          };
          completeLogin(member.accessKey || "", memberUser);
          return;
        }
        
        // Fallback to GitHub users
        const res = await fetch(USERS_URL);
        if (!res.ok) throw new Error("Database Connect Failed");
        const users = await res.json();
        let userFound: User | undefined;
        if (Array.isArray(users)) {
          userFound = users.find((u: User) => u.email === email);
        } else {
          userFound = Object.values(users as Record<string, User>).find((u) => u.email === email);
        }
        if (!userFound) throw new Error("Email Not Registered");
        if (userFound.expiry && Date.now() > userFound.expiry) throw new Error("Account Expired");
        const token = btoa(unescape(encodeURIComponent(JSON.stringify(userFound))));
        completeLogin(token, userFound);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication Failed";
      setAuthStatus(msg);
      // Shake animation
      if (loginCardRef.current) {
        loginCardRef.current.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 300 }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = (token: string, user: User) => {
    localStorage.setItem("royal_session", token);
    launchApp(user);
  };

  const launchApp = useCallback((user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    initAppLogic();
    fetchNotifications();
  }, []);

  const logout = () => {
    localStorage.removeItem("royal_session");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setProfileOpen(false);
    setActiveTab("home");
    setIsOwner(false);
    setMembers([]);
  };

  // ── App Logic ───────────────────────────────────────────────────────────────

  const initAppLogic = async () => {
    setServersLoading(true);
    try {
      const res = await fetch(SERVERS_URL);
      if (res.ok) {
        const data = await res.json() as ServersData;
        setServersData(data);
      }
    } catch {
      // ignore
    } finally {
      setServersLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(UPDATES_URL + "?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        const items: Notification[] = Array.isArray(data)
          ? data
          : data.updates || data.notifications || [];
        if (items.length > 0) {
          setNotifications(items);
          setHasNotif(true);
          setBellActive(true);
        }
      }
    } catch {
      // ignore
    }
  };

  const loadMembers = () => {
    const stored = localStorage.getItem("apsara_members");
    if (stored) {
      try {
        setMembers(JSON.parse(stored));
      } catch {
        setMembers([]);
      }
    }
  };

  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem("apsara_members", JSON.stringify(newMembers));
  };

  const generateMemberKey = (id: string, email: string, expiry: number) => {
    // Generate ROYAL-XXXXX format with 5 random digits
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `ROYAL-${randomDigits}`;
  };

  const inviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error("Invalid email format");
      return;
    }
    if (members.some((m) => m.email === inviteEmail)) {
      toast.error("Member already exists");
      return;
    }

    const memberId = Math.random().toString(36).substr(2, 9);
    const expiryTime = Date.now() + parseInt(inviteExpiry) * 86400000;
    const accessKey = generateMemberKey(memberId, inviteEmail, expiryTime);

    const newMember: Member = {
      id: memberId,
      email: inviteEmail,
      expiry: expiryTime,
      createdAt: Date.now(),
      role: "member",
      accessKey: accessKey,
    };

    const updated = [...members, newMember];
    saveMembers(updated);
    setInviteEmail("");
    setInviteExpiry("30");
    toast.success(`Invited ${inviteEmail}`);
  };

  const removeMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    saveMembers(updated);
    toast.success("Member removed");
  };

  const updateMemberExpiry = (id: string, days: number) => {
    const updated = members.map((m) =>
      m.id === id
        ? { ...m, expiry: Date.now() + days * 86400000 }
        : m
    );
    saveMembers(updated);
    toast.success("Expiry updated");
  };

  const loadServers = () => {
    const stored = localStorage.getItem("apsara_servers");
    if (stored) {
      try {
        setServers(JSON.parse(stored));
      } catch {
        setServers([]);
      }
    }
  };

  const saveServers = (newServers: typeof servers) => {
    setServers(newServers);
    localStorage.setItem("apsara_servers", JSON.stringify(newServers));
  };

  const addServer = (server: typeof servers[0]) => {
    const updated = [...servers, server];
    saveServers(updated);
  };

  const deleteServer = (id: string) => {
    const updated = servers.filter((s) => s.id !== id);
    saveServers(updated);
  };

  const updateServer = (id: string, server: typeof servers[0]) => {
    const updated = servers.map((s) => (s.id === id ? server : s));
    saveServers(updated);
  };

  // ── Manager ─────────────────────────────────────────────────────────────────

  const openManager = (key: string) => {
    setManagerKey(key);
    // Check user sub link
    let userLink: string | null = null;
    if (currentUser?.subLinks) {
      const packTitle = (serversData[key]?.title || key).toLowerCase();
      const linkKey = Object.keys(currentUser.subLinks).find((k) =>
        k.toLowerCase().includes(packTitle)
      );
      if (linkKey) userLink = currentUser.subLinks[linkKey];
    }
    setManagerUserLink(userLink);
    setActiveTab("manager");
  };

  const getManagerData = () => managerKey ? serversData[managerKey] : null;

  const pingAll = () => {
    const data = getManagerData();
    if (!data?.categories) return;
    const newStates: Record<string, string> = {};
    data.categories.forEach((cat) => {
      cat.configs?.forEach((cfg) => {
        const id = cfg.link;
        newStates[id] = "pinging";
        setTimeout(() => {
          setPingStates((prev) => ({
            ...prev,
            [id]: Math.floor(Math.random() * 200 + 50) + " ms",
          }));
        }, 800);
      });
    });
    setPingStates((prev) => ({ ...prev, ...newStates }));
  };

  // ── Proxies ─────────────────────────────────────────────────────────────────

  const fetchProxies = async () => {
    setProxiesLoading(true);
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt"
      );
      const txt = await res.text();
      const proxies = txt
        .split("\n")
        .filter((l) => l.includes(","))
        .map((l) => {
          const p = l.split(",");
          return { ip: p[0], port: p[1], cc: p[2], isp: p[3] };
        });
      setAllProxies(proxies);
      setFilteredProxies(proxies.slice(0, 50));
    } catch {
      toast.error("Failed to load proxies");
    } finally {
      setProxiesLoading(false);
    }
  };

  const filterProxies = (search: string) => {
    setProxySearch(search);
    const t = search.toLowerCase();
    setFilteredProxies(
      allProxies.filter((p) => p.ip.includes(t) || p.cc.toLowerCase().includes(t)).slice(0, 50)
    );
  };

  const selectProxy = (p: Proxy) => {
    setSelectedProxy(p);
    setVlessAddr("104.18.36.89");
    setVlessPath(`/${p.ip}-${p.port}`);
    setVlessRemark(`${getFlag(p.cc)} ${p.isp}`);
  };

  // ── Generate Link ────────────────────────────────────────────────────────────

  const generateLink = () => {
    if (!vlessPath) {
      toast.error("Select a Proxy First");
      return;
    }
    const vless = `vless://${VLESS_UUID}@${vlessAddr}:${vlessPort}?encryption=none&security=${vlessPort === "443" ? "tls" : ""}&type=ws&host=${vlessHost}&path=${encodeURIComponent(vlessPath)}&sni=${vlessHost}#${encodeURIComponent(vlessRemark || "Server")}`;
    const trojan = `trojan://${TROJAN_UUID}@${vlessAddr}:${vlessPort}?path=${encodeURIComponent(vlessPath)}&security=none&host=${vlessHost}&type=ws&sni=${vlessHost}#${encodeURIComponent(vlessRemark || "Server")}`;
    setVlessOutput(vless);
    setTrojanOutput(trojan);
    setResultVisible(true);
  };

  // ── Admin Key Generator ──────────────────────────────────────────────────────

  const generateKey = (days: number) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const k = `ROYAL-${randomDigits}`;
    setGenKeyOut(k);
    copyToClipboard(k, "Key Copied");
  };

  const handleAdminTrigger = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 5) {
      setAdminModalOpen(true);
      setAdminClickCount(0);
    }
  };

  // ── Server Pack Icon ─────────────────────────────────────────────────────────

  const getPackIcon = (key: string, item: ServerPack) => {
    const searchStr = (key + " " + (item.buttonTitle || "") + " " + (item.title || "")).toLowerCase();
    if (searchStr.includes("metfone"))
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSvvr7e8VJv7ZR-Aca0MPY93il5estMo4r8qlmRWUKeg&s=10";
    if (searchStr.includes("smart"))
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1buA09Sz-GgRlK1nm6hQ_DADdLLGCrLmifLiAXHpvz92VQqZvdb6X1Vc&s=10";
    if (searchStr.includes("cellcard"))
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2V7UX4LdSfA271ektRoAEYL9v64Rr21UyRtRkJ2Q5TA&s";
    return "https://cdn-icons-png.flaticon.com/512/566/566718.png";
  };

  // ── Expiry Display ───────────────────────────────────────────────────────────

  const getExpiryStr = () => {
    if (!currentUser?.expiry) return "";
    const d = new Date(currentUser.expiry);
    return `Exp: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getExpiryFull = () => {
    if (!currentUser?.expiry) return "--";
    const d = new Date(currentUser.expiry);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#000" }}>
      {/* Wallpaper */}
      <div
        className="fixed inset-0 z-[-2]"
        style={{
          background: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop') center/cover no-repeat",
          transform: "scale(1.1)",
        }}
      />
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      />

      {/* Language Switcher */}
      <div className="fixed top-5 right-5 z-[100] flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-xl">
        <button
          onClick={() => changeLang("km")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold font-koulen ${lang === "km" ? "lang-active" : "text-white/50 hover:text-white"}`}
        >
          <img src="https://flagcdn.com/w40/kh.png" className="w-4 h-4 rounded-full object-cover" alt="KH" />
          ខ្មែរ
        </button>
        <button
          onClick={() => changeLang("en")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold ${lang === "en" ? "lang-active" : "text-white/50 hover:text-white"}`}
        >
          <img src="https://flagcdn.com/w40/us.png" className="w-4 h-4 rounded-full object-cover" alt="EN" />
          EN
        </button>
      </div>

      {/* Loader */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${loaderVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden">
              <img src={LOGO_URL} className="w-full h-full object-cover" alt="Apsara" />
            </div>
          </div>
        </div>
        <p className="text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase">Loading...</p>
      </div>

      {/* Login Screen */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-xl bg-black/40">
          <div className="login-glow" />
          <div ref={loginCardRef} className="ios-card w-full max-w-xs p-8 relative overflow-hidden ring-1 ring-white/10">
            {/* Admin trigger (invisible) */}
            <div
              className="absolute top-0 right-0 w-16 h-16 z-10 cursor-default"
              onClick={handleAdminTrigger}
            />

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform duration-300 overflow-hidden mascot-float" style={{boxShadow: '0 0 40px rgba(10,132,255,0.2)'}}>
                <img src={LOGO_URL} className="w-full h-full object-contain p-1" alt="Apsara" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{t.login_title}</h1>
              <p className="text-xs text-white/50">{t.login_sub}</p>
            </div>

            {/* Tabs */}
            <div className="login-tabs">
              <div
                className="tab-bg"
                style={{ transform: loginMethod === "email" ? "translateX(100%)" : "translateX(0%)" }}
              />
              <button
                className={`tab-btn ${loginMethod === "key" ? "active" : ""}`}
                onClick={() => setLoginMethod("key")}
              >
                {t.tab_key}
              </button>
              <button
                className={`tab-btn ${loginMethod === "email" ? "active" : ""}`}
                onClick={() => setLoginMethod("email")}
              >
                {t.tab_email}
              </button>
            </div>

            {/* Key Form */}
            {loginMethod === "key" && (
              <div className="mb-6">
                <div className="input-group mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
                  </svg>
                  <input
                    type="text"
                    className="ios-input"
                    placeholder="ROYAL-XXXX"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && attemptLogin()}
                  />
                </div>
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setAccessKey(text);
                      toast.success("Pasted from clipboard");
                    } catch {
                      toast.error("Failed to paste");
                    }
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                >
                  Paste from Clipboard
                </button>
              </div>
            )}

            {/* Email Form */}
            {loginMethod === "email" && (
              <div className="input-group mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  className="ios-input"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && attemptLogin()}
                />
              </div>
            )}

            {/* Error */}
            {authStatus && (
              <p className="text-red-400 text-xs text-center mb-4">{authStatus}</p>
            )}

            {/* Button */}
            <button
              className="btn-ios-primary w-full py-4 text-sm"
              onClick={attemptLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto" />
              ) : loginMethod === "key" ? t.btn_connect : t.btn_signin}
            </button>

            {/* Secure badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-white/30">
              <Shield className="w-3 h-3" />
              <span className="text-[9px] font-bold tracking-widest uppercase">Secure v3.1</span>
            </div>
          </div>
        </div>
      )}

      {/* Main App */}
      {isLoggedIn && (
        <div className="flex flex-col h-screen max-w-[430px] mx-auto relative overflow-hidden">
          {/* Header */}
          <header className="pt-14 pb-4 px-6 flex justify-between items-end z-20">
            <div>
              <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">
                {t.header_welcome}
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currentUser?.name || "User"}
              </h2>
              {currentUser?.expiry && (
                <p className="text-[10px] text-white/40 font-mono mt-0.5">{getExpiryStr()}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setHasNotif(false);
                    setBellActive(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-all border border-white/5"
                >
                  <Bell className={`w-5 h-5 ${bellActive ? "bell-active" : ""}`} />
                </button>
                {hasNotif && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
                )}
              </div>
              {/* Avatar */}
              <div
                className="cursor-pointer"
                onClick={() => setProfileOpen(true)}
              >
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-400 to-green-400 shadow-lg group">
                  <img
                    src={currentUser?.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    className="w-full h-full rounded-full bg-black object-cover border border-black transition-transform group-hover:scale-105"
                    alt="Avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto px-5 pb-32">
            {/* ── HOME TAB ── */}
            {activeTab === "home" && (
              <div className="fade-in space-y-6">
                {/* Status Card */}
                <div className="ios-card relative overflow-hidden h-32 flex items-center px-6 mt-2">
                  <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-blue-500 rounded-full blur-[50px] opacity-40 animate-pulse" />
                  <div className="relative z-10 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80 text-xs font-semibold">{t.status_label}</span>
                      <div className="flex items-center gap-1.5 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-green-400 font-bold">{t.status_online}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{t.status_protected}</h3>
                    {currentUser?.expiry && (
                      <p className="text-[10px] text-white/40 font-mono">{getExpiryStr()}</p>
                    )}
                  </div>
                </div>

                {/* User Sub Links */}
                {currentUser?.subLinks && Object.keys(currentUser.subLinks).length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
                      Your Subscriptions
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {Object.entries(currentUser.subLinks).map(([label, url]) => (
                        <div
                          key={label}
                          className="ios-card p-4 min-w-[200px] flex flex-col justify-between bg-gradient-to-br from-blue-900/40 to-black border-l-4 border-l-yellow-500 relative overflow-hidden group"
                        >
                          <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-yellow-500 rounded-full blur-[40px] opacity-20" />
                          <div className="relative z-10 mb-2">
                            <h4 className="font-bold text-sm text-white truncate mb-1">{label}</h4>
                            <p className="text-[9px] text-yellow-400 font-mono">USER ACCESS</p>
                          </div>
                          <div className="relative z-10 flex gap-2 mt-2">
                            <button
                              onClick={() => copyToClipboard(url, "Link Copied")}
                              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1 transition-colors"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                            <button
                              onClick={() => showQRModal(url, setQrText, setQrOpen)}
                              className="bg-white/10 hover:bg-white/20 px-3 rounded-lg text-white flex items-center justify-center transition-colors"
                            >
                              <QrCode className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Servers Ready - Owner's Custom Servers */}
                {isOwner && servers.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
                      Servers Ready
                    </h3>
                    <div className="space-y-3">
                      {servers.map((server) => (
                        <div
                          key={server.id}
                          className="ios-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 border-l-4 border-l-green-500"
                          onClick={() => {
                            setEditingServer(server);
                            setEditServerName(server.name);
                            setEditServerLink(server.link);
                            setEditServerIcon(server.icon || null);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            {server.icon ? (
                              <img
                                src={server.icon}
                                className="w-14 h-14 rounded-2xl object-cover bg-white/10 p-1 shadow-lg"
                                alt={server.name}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {server.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-lg text-white leading-none mb-1">
                                {server.name}
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <p className="text-xs text-white/50">
                                  Online • Ready • {server.status || "Active"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Server Packs */}
                <div>
                  <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
                    {t.server_packs}
                  </h3>
                  {serversLoading ? (
                    <div className="text-center py-10 text-white/40 text-xs flex flex-col items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Loading Servers...
                    </div>
                  ) : Object.keys(serversData).length === 0 ? (
                    <div className="text-center py-10 text-white/40 text-xs">No Servers Available</div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(serversData).map(([key, item]) => {
                        const totalConfigs = item.categories
                          ? item.categories.reduce((acc, cat) => acc + (cat.configs?.length || 0), 0)
                          : 0;
                        return (
                          <div
                            key={key}
                            className="ios-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 border-l-4 border-l-blue-500"
                            onClick={() => openManager(key)}
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={getPackIcon(key, item)}
                                className="w-14 h-14 rounded-2xl object-cover bg-white/10 p-1 shadow-lg"
                                alt={item.title}
                              />
                              <div>
                                <h3 className="font-bold text-lg text-white leading-none mb-1">
                                  {item.buttonTitle || item.title || key}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  <p className="text-xs text-white/50">
                                    Online &bull; Fast &bull; {totalConfigs} Servers
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── APP TAB ── */}
            {activeTab === "app" && (
              <div className="fade-in pt-2">
                <div className="ios-card p-6 mb-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-3">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{t.download_title}</h2>
                  <p className="text-xs text-white/50 mt-1">{t.download_sub}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.happproxy"
                    target="_blank"
                    rel="noreferrer"
                    className="ios-card p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all border-l-2 border-l-green-500"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-sm text-white">Play Store</h3>
                      <p className="text-[9px] text-white/40">Android App</p>
                    </div>
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215"
                    target="_blank"
                    rel="noreferrer"
                    className="ios-card p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all border-l-2 border-l-blue-500"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Apple className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-sm text-white">App Store</h3>
                      <p className="text-[9px] text-white/40">iOS App</p>
                    </div>
                  </a>
                </div>

                <div className="ios-card p-5 mt-4">
                  <h3 className="font-bold text-sm text-white mb-2">{t.install_guide_title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{t.install_guide_text}</p>
                </div>
              </div>
            )}

            {/* ── CREATE TAB ── */}
            {activeTab === "create" && (
              <div className="fade-in pt-2">
                <div className="ios-card p-6 mb-24">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">VLESS &amp; Trojan Creator</h2>
                  </div>

                  <div className="space-y-5">
                    {/* Proxy Selection */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[10px] font-bold text-white/60 uppercase">{t.create_step1}</label>
                        <button onClick={fetchProxies} className="text-[10px] text-blue-400 font-bold">
                          Update List
                        </button>
                      </div>
                      <div className="relative mb-2 input-group">
                        <Search className="w-4 h-4" />
                        <input
                          type="text"
                          className="ios-input py-3 text-xs"
                          placeholder="Search Country / IP..."
                          value={proxySearch}
                          onChange={(e) => filterProxies(e.target.value)}
                        />
                      </div>
                      <div className="h-32 overflow-y-auto bg-black/20 rounded-xl p-2 custom-scroll">
                        {proxiesLoading ? (
                          <div className="text-center py-6 text-white/40 text-xs flex items-center justify-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" /> Loading...
                          </div>
                        ) : filteredProxies.length === 0 ? (
                          <div className="text-center text-white/30 text-[10px] py-10">Tap 'Update List'</div>
                        ) : (
                          filteredProxies.map((p, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-xl mb-1 cursor-pointer border flex justify-between items-center transition-all ${
                                selectedProxy?.ip === p.ip && selectedProxy?.port === p.port
                                  ? "bg-blue-500/20 border-blue-500/50"
                                  : "bg-white/5 border-transparent hover:bg-blue-500/20 hover:border-blue-500/50"
                              }`}
                              onClick={() => selectProxy(p)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{getFlag(p.cc)}</span>
                                <div>
                                  <p className="text-xs text-white font-bold">{p.isp}</p>
                                  <p className="text-[9px] text-white/40 font-mono">{p.ip}:{p.port}</p>
                                </div>
                              </div>
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Config */}
                    <div>
                      <label className="text-[10px] font-bold text-white/60 uppercase mb-2 block">2. Config</label>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          className="ios-input-plain"
                          placeholder="Address"
                          value={vlessAddr}
                          onChange={(e) => setVlessAddr(e.target.value)}
                        />
                        <input
                          type="number"
                          className="ios-input-plain"
                          value={vlessPort}
                          onChange={(e) => setVlessPort(e.target.value)}
                        />
                      </div>
                      <div className="relative mb-3">
                        <select
                          className="ios-select"
                          value={vlessHost}
                          onChange={(e) => setVlessHost(e.target.value)}
                        >
                          {WORKER_HOSTS.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      onClick={generateLink}
                      className="btn-ios-primary w-full py-3.5 text-sm shadow-xl"
                    >
                      {t.btn_generate}
                    </button>

                    {/* Result */}
                    {resultVisible && (
                      <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-blue-400">VLESS</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => copyToClipboard(vlessOutput)}
                                className="text-[10px] text-white/60 hover:text-white"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => showQRModal(vlessOutput, setQrText, setQrOpen)}
                                className="text-[10px] text-white/60 hover:text-white"
                              >
                                QR
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] font-mono text-white/50 break-all line-clamp-3">{vlessOutput}</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-green-400">TROJAN</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => copyToClipboard(trojanOutput)}
                                className="text-[10px] text-white/60 hover:text-white"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => showQRModal(trojanOutput, setQrText, setQrOpen)}
                                className="text-[10px] text-white/60 hover:text-white"
                              >
                                QR
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] font-mono text-white/50 break-all line-clamp-3">{trojanOutput}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── MANAGER TAB ── */}
            {activeTab === "manager" && managerKey && (
              <div className="fade-in pt-2">
                <div className="flex items-center gap-4 mb-5 px-1">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {getManagerData()?.title || managerKey}
                    </h2>
                    <span className="text-[10px] text-white/40">
                      {managerUserLink ? `User Config` : "Global Configs"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  <button
                    onClick={pingAll}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md border border-white/5"
                  >
                    <Zap className="w-3 h-3 text-yellow-400" /> Ping All
                  </button>
                  <button
                    onClick={() => {
                      const data = getManagerData();
                      if (managerUserLink) {
                        copyToClipboard(managerUserLink, "User Sub Link Copied!");
                      } else {
                        copyToClipboard(data?.subUrl || "", "Global Sub Link Copied");
                      }
                    }}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md border border-white/5 relative overflow-hidden"
                  >
                    {managerUserLink && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50" />
                    )}
                    <Copy className="w-3 h-3 relative z-10" />
                    <span className="relative z-10">{managerUserLink ? "My Sub Link" : "Copy Sub"}</span>
                  </button>
                  <button
                    onClick={() => {
                      const data = getManagerData();
                      const all = data?.categories
                        ?.flatMap((c) => c.configs.map((cfg) => cfg.link))
                        .join("\n");
                      copyToClipboard(all || "", "All Configs Copied");
                    }}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md border border-white/5"
                  >
                    <Copy className="w-3 h-3" /> Copy All
                  </button>
                </div>

                {/* Config List */}
                <div className="space-y-1 pb-24">
                  {getManagerData()?.categories?.map((cat, ci) => (
                    <div key={ci}>
                      <div className="text-[10px] font-bold text-blue-400 mt-5 mb-2 px-1 uppercase tracking-wider">
                        {cat.title}
                      </div>
                      {cat.configs?.map((cfg, i) => {
                        const pingState = pingStates[cfg.link];
                        return (
                          <div
                            key={i}
                            className="ios-card p-3 mb-2 flex items-center justify-between bg-black/20"
                            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                          >
                            <div className="w-2/3 overflow-hidden">
                              <h4 className="text-xs font-semibold text-white truncate mb-1">{cfg.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${pingState && pingState !== "pinging" ? "bg-green-500" : "bg-slate-500"}`} />
                                <span className={`text-[9px] font-mono ${
                                  pingState === "pinging" ? "text-yellow-400 animate-pulse" :
                                  pingState ? "text-green-400 font-bold" : "text-white/40"
                                }`}>
                                  {pingState === "pinging" ? "Pinging..." : pingState || "Idle"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setPingStates((prev) => ({ ...prev, [cfg.link]: "pinging" }));
                                  setTimeout(() => {
                                    setPingStates((prev) => ({
                                      ...prev,
                                      [cfg.link]: Math.floor(Math.random() * 200 + 50) + " ms",
                                    }));
                                  }, 800);
                                }}
                                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Zap className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(cfg.link)}
                                className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ADMIN TAB ── */}
            {activeTab === "admin" && isOwner && (
              <AdminPanel
                members={members}
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
                inviteExpiry={inviteExpiry}
                setInviteExpiry={setInviteExpiry}
                onInvite={inviteMember}
                onRemove={removeMember}
                onUpdateExpiry={updateMemberExpiry}
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                servers={servers}
                onAddServer={addServer}
                onDeleteServer={deleteServer}
                onUpdateServer={updateServer}
              />
            )}
          </main>

          {/* Bottom Dock */}
          <nav className="ios-dock">
            <button
              onClick={() => setActiveTab("home")}
              className={`dock-item ${activeTab === "home" ? "active" : ""}`}
              title="Home"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveTab("app")}
              className={`dock-item ${activeTab === "app" ? "active" : ""}`}
              title="Apps"
            >
              <Smartphone className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`dock-item ${activeTab === "create" ? "active" : ""}`}
              title="Create"
            >
              <Zap className="w-6 h-6" />
            </button>
            {isOwner && (
              <button
                onClick={() => { setActiveTab("admin"); loadMembers(); }}
                className={`dock-item ${activeTab === "admin" ? "active" : ""}`}
                title="Admin"
              >
                <Settings className="w-6 h-6" />
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="ios-card w-full max-w-sm p-6 bg-[#1c1c1e]/90 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-500 to-green-500 mb-3 shadow-xl relative">
                <img
                  src={currentUser?.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  className="w-full h-full rounded-full object-cover bg-black"
                  alt="Profile"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                  }}
                />
              </div>
              <h2 className="text-xl font-bold text-white">{currentUser?.name || "User"}</h2>
              <p className="text-xs text-white/40 mt-1">ADMIN WEBSITE</p>
            </div>
            {isOwner && (
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setSettingsOpen(true);
                }}
                className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors mb-4 border border-purple-500/30"
              >
                <Settings className="w-4 h-4" /> Website Settings
              </button>
            )}
            <div className="space-y-2 mb-6">
              <div className="bg-white/5 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-white/60 flex items-center gap-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.3 2 2 0 0 1 3.91 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Phone
                </span>
                <span className="text-xs font-bold text-white">{currentUser?.phone || "N/A"}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-white/60 flex items-center gap-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Email
                </span>
                <span className="text-xs font-bold text-white">{currentUser?.email || "N/A"}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-white/60 flex items-center gap-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
                  </svg>
                  Expires
                </span>
                <span className="text-xs font-bold text-red-400">{getExpiryFull()}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 backdrop-blur-md pt-24"
          onClick={() => setNotifOpen(false)}
        >
          <div
            className="ios-card w-full max-w-sm max-h-[70vh] flex flex-col bg-[#1c1c1e]/95 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">{t.notif_title}</h3>
              <button
                onClick={() => setNotifOpen(false)}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-center text-white/40 text-xs py-8">{t.notif_empty}</p>
              ) : (
                notifications.map((item, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="flex gap-3">
                      <div className={`mt-1 w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center ${item.type === "alert" ? "text-red-400" : "text-blue-400"}`}>
                        {item.type === "alert" ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{item.message}</p>
                        <p className="text-[9px] text-white/30 mt-2 font-mono">{item.date || "Just now"}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      <QRCodeModal text={qrText} open={qrOpen} onClose={() => setQrOpen(false)} />

      {/* Edit Server Modal */}
      {editingServer && (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="ios-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Edit Server</h3>
              <button onClick={() => setEditingServer(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Server Icon Upload */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Server Icon</label>
              <div className="flex gap-2">
                {editServerIcon ? (
                  <img src={editServerIcon} className="w-12 h-12 rounded-lg object-cover" alt="icon" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {editServerName.charAt(0)}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setEditServerIcon(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="flex-1 text-xs text-white/50"
                />
              </div>
            </div>

            {/* Server Name */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Server Name</label>
              <input
                type="text"
                value={editServerName}
                onChange={(e) => setEditServerName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g., V2-Metfone MLBB"
              />
            </div>

            {/* Server Link */}
            <div>
              <label className="text-xs text-white/60 block mb-2">Server Link/Config</label>
              <textarea
                value={editServerLink}
                onChange={(e) => setEditServerLink(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 h-20 resize-none"
                placeholder="Paste server link or config here"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  if (editingServer && editServerName && editServerLink) {
                    const updated = servers.map(s =>
                      s.id === editingServer.id
                        ? { ...s, name: editServerName, link: editServerLink, icon: editServerIcon || undefined }
                        : s
                    );
                    setServers(updated);
                    localStorage.setItem('royal_servers', JSON.stringify(updated));
                    toast.success('Server updated');
                    setEditingServer(null);
                  }
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-sm transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  if (editingServer) {
                    const updated = servers.filter(s => s.id !== editingServer.id);
                    setServers(updated);
                    localStorage.setItem('royal_servers', JSON.stringify(updated));
                    toast.success('Server deleted');
                    setEditingServer(null);
                  }
                }}
                className="px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-lg text-sm transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={websiteSettings}
        onSettingsChange={setWebsiteSettings}
      />

      {/* Admin Key Generator Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-[7000] bg-black/80 backdrop-blur flex items-center justify-center">
          <div className="ios-card w-64 p-6 text-center">
            <h3 className="text-white font-bold mb-4 text-sm">Generate Key</h3>
            <div className="space-y-2 mb-4">
              <button onClick={() => generateKey(1)} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs text-white">1 Day</button>
              <button onClick={() => generateKey(30)} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs text-white">30 Days</button>
              <button onClick={() => generateKey(365)} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs text-white">365 Days</button>
            </div>
            <input
              readOnly
              value={genKeyOut}
              className="ios-input-plain text-[9px] mb-3"
              placeholder="Generated key..."
            />
            <button
              onClick={() => setAdminModalOpen(false)}
              className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
