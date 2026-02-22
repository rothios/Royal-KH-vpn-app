import { Users, Plus, Mail, Trash2, Calendar, Bell, Zap, Copy } from "lucide-react";
import { toast } from "sonner";

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

interface AdminPanelProps {
  members: Member[];
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteExpiry: string;
  setInviteExpiry: (days: string) => void;
  onInvite: () => void;
  onRemove: (id: string) => void;
  onUpdateExpiry: (id: string, days: number) => void;
  adminTab: 'members' | 'servers' | 'notifications';
  setAdminTab: (tab: 'members' | 'servers' | 'notifications') => void;
  servers?: Server[];
  onAddServer?: (server: Server) => void;
  onDeleteServer?: (id: string) => void;
  onUpdateServer?: (id: string, server: Server) => void;
}

export default function AdminPanel({
  members,
  inviteEmail,
  setInviteEmail,
  inviteExpiry,
  setInviteExpiry,
  onInvite,
  onRemove,
  onUpdateExpiry,
  adminTab,
  setAdminTab,
  servers = [],
  onAddServer,
  onDeleteServer,
  onUpdateServer,
}: AdminPanelProps) {
  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getDaysLeft = (expiry: number) => {
    const days = Math.ceil((expiry - Date.now()) / 86400000);
    return days > 0 ? days : 0;
  };

  return (
    <div className="fade-in pt-2 pb-24">
      <div className="px-1 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Admin Panel</h2>
        <p className="text-[10px] text-white/40">Manage members and website</p>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto px-1 pb-2">
        <button
          onClick={() => setAdminTab("members")}
          className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
            adminTab === "members"
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Users className="w-3 h-3 inline mr-1" /> Members
        </button>
        <button
          onClick={() => setAdminTab("servers")}
          className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
            adminTab === "servers"
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Zap className="w-3 h-3 inline mr-1" /> Servers
        </button>
        <button
          onClick={() => setAdminTab("notifications")}
          className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
            adminTab === "notifications"
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Bell className="w-3 h-3 inline mr-1" /> Notifications
        </button>
      </div>

      {/* Members Tab */}
      {adminTab === "members" && (
        <div className="space-y-4">
          {/* Invite Form */}
          <div className="ios-card p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" /> Add Gmail Member
            </h3>
            <div className="space-y-3">
              <div className="relative input-group">
                <Mail className="w-4 h-4" />
                <input
                  type="email"
                  className="ios-input"
                  placeholder="member@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onInvite()}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/60 uppercase mb-2 block">Expiry (Days)</label>
                <select
                  className="ios-select"
                  value={inviteExpiry}
                  onChange={(e) => setInviteExpiry(e.target.value)}
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="365">365 Days</option>
                </select>
              </div>
              <button
                onClick={onInvite}
                className="btn-ios-primary w-full py-3 text-sm"
              >
                Send Invite
              </button>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
              Total Members: {members.length}
            </h3>
            {members.length === 0 ? (
              <div className="ios-card p-6 text-center text-white/40 text-xs">
                No members yet. Invite your first member!
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="ios-card p-4 flex items-center justify-between bg-black/20">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white mb-1">{member.email}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-white/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Exp: {formatDate(member.expiry)}
                        </span>
                        <span className={`font-bold ${getDaysLeft(member.expiry) < 7 ? "text-red-400" : "text-green-400"}`}>
                          {getDaysLeft(member.expiry)} days left
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <div className="flex gap-2 items-center">
                        <div className="text-[9px] bg-black/40 p-2 rounded border border-white/10 font-mono text-blue-300 break-all flex-1">
                          {member.accessKey}
                        </div>
                        <button
                          onClick={() => {
                            if (member.accessKey) {
                              navigator.clipboard.writeText(member.accessKey);
                              toast.success("Copied to clipboard");
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-colors flex-shrink-0"
                          title="Copy access key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <select
                          defaultValue="0"
                          onChange={(e) => {
                            if (e.target.value !== "0") {
                              onUpdateExpiry(member.id, parseInt(e.target.value));
                              e.target.value = "0";
                            }
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white text-[9px] px-2 py-1 rounded-lg border border-white/10 cursor-pointer flex-1"
                        >
                          <option value="0">Extend</option>
                          <option value="7">+7 Days</option>
                          <option value="30">+30 Days</option>
                          <option value="90">+90 Days</option>
                        </select>
                        <button
                          onClick={() => onRemove(member.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Servers Tab */}
      {adminTab === "servers" && (
        <div className="space-y-4">
          {/* Export/Import Section */}
          <div className="ios-card p-5 bg-gradient-to-br from-green-900/20 to-blue-900/20 border-l-4 border-l-green-500">
            <h3 className="font-bold text-white mb-4">Backup & Restore</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (servers.length === 0) {
                    toast.error("No servers to export");
                    return;
                  }
                  const dataStr = JSON.stringify(servers, null, 2);
                  const dataBlob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `apsara-servers-backup-${new Date().toISOString().split("T")[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  toast.success(`Exported ${servers.length} servers`);
                }}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-2 px-3 rounded-lg text-xs border border-green-500/30 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".json";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const imported = JSON.parse(event.target?.result as string);
                        if (!Array.isArray(imported)) throw new Error("Invalid format");
                        const validServers = imported.filter((s: any) => s.id && s.name && s.link);
                        if (validServers.length === 0) throw new Error("No valid servers found");
                        validServers.forEach((server: Server) => onAddServer?.(server));
                        toast.success(`Imported ${validServers.length} servers`);
                      } catch (err) {
                        toast.error("Invalid JSON file");
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold py-2 px-3 rounded-lg text-xs border border-blue-500/30 transition-colors"
              >
                Import JSON
              </button>
            </div>
          </div>

          {/* Add Server Form */}
          <div className="ios-card p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" /> Add New Server
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                className="ios-input"
                placeholder="Server Name"
                id="serverName"
              />
              <textarea
                className="ios-input resize-none"
                placeholder="Server Link/Config"
                rows={3}
                id="serverLink"
              />
              <input
                type="text"
                className="ios-input"
                placeholder="Category (optional)"
                id="serverCategory"
              />
              <div>
                <label className="text-[10px] font-bold text-white/60 uppercase mb-2 block">Server Icon (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="ios-input text-white/50 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  id="serverIcon"
                />
              </div>
              <button
                onClick={async () => {
                  const name = (document.getElementById("serverName") as HTMLInputElement)?.value;
                  const link = (document.getElementById("serverLink") as HTMLTextAreaElement)?.value;
                  const category = (document.getElementById("serverCategory") as HTMLInputElement)?.value;
                  const iconFile = (document.getElementById("serverIcon") as HTMLInputElement)?.files?.[0];
                  
                  if (!name.trim() || !link.trim()) {
                    toast.error("Name and Link required");
                    return;
                  }
                  
                  let icon: string | undefined = undefined;
                  if (iconFile) {
                    const reader = new FileReader();
                    icon = await new Promise((resolve) => {
                      reader.onload = (e) => resolve(e.target?.result as string);
                      reader.readAsDataURL(iconFile);
                    });
                  }
                  
                  const newServer: Server = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: name.trim(),
                    link: link.trim(),
                    category: category.trim() || undefined,
                    createdAt: Date.now(),
                    icon: icon,
                    status: "Active",
                  };
                  onAddServer?.(newServer);
                  (document.getElementById("serverName") as HTMLInputElement).value = "";
                  (document.getElementById("serverLink") as HTMLTextAreaElement).value = "";
                  (document.getElementById("serverCategory") as HTMLInputElement).value = "";
                  (document.getElementById("serverIcon") as HTMLInputElement).value = "";
                  toast.success(icon ? "Server added with icon" : "Server added");
                }}
                className="btn-ios-primary w-full py-3 text-sm"
              >
                Add Server
              </button>
            </div>
          </div>

          {/* Servers List */}
          <div>
            <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
              Total: {servers.length}
            </h3>
            {servers.length === 0 ? (
              <div className="ios-card p-6 text-center text-white/40 text-xs">
                No servers yet
              </div>
            ) : (
              <div className="space-y-2">
                {servers.map((server) => (
                  <div key={server.id} className="ios-card p-4 bg-black/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{server.name}</h4>
                        {server.category && (
                          <p className="text-[9px] text-blue-400 mb-2">{server.category}</p>
                        )}
                        <p className="text-[9px] text-white/50 font-mono break-all">{server.link}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => {
                            const newName = prompt("Edit name:", server.name);
                            if (newName) {
                              onUpdateServer?.(server.id, { ...server, name: newName });
                              toast.success("Updated");
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${server.name}"?`)) {
                              onDeleteServer?.(server.id);
                              toast.success("Deleted");
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {adminTab === "notifications" && (
        <div className="ios-card p-6 text-center text-white/40 text-sm">
          Notification management coming soon...
        </div>
      )}
    </div>
  );
}
