import { Users, Plus, Mail, Trash2, Calendar, Bell, Zap } from "lucide-react";
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
                      <div className="text-[9px] bg-black/40 p-2 rounded border border-white/10 font-mono text-blue-300 break-all">
                        {member.accessKey}
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
        <div className="ios-card p-6 text-center text-white/40 text-sm">
          Server management coming soon...
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
