import { X, Upload } from "lucide-react";
import { toast } from "sonner";

interface WebsiteSettings {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  onSettingsChange: (settings: WebsiteSettings) => void;
}

export default function SettingsPanel({
  open,
  onClose,
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  if (!open) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onSettingsChange({ ...settings, logo: base64 });
      toast.success("Logo updated");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-[5000] bg-black/80 backdrop-blur-md flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-800/90 rounded-t-[32px] p-6 max-h-[80vh] overflow-y-auto border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Website Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Website Name */}
          <div>
            <label className="text-xs font-bold text-white/60 uppercase mb-2 block">
              Website Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) =>
                onSettingsChange({ ...settings, name: e.target.value })
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all"
              placeholder="Enter website name"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-xs font-bold text-white/60 uppercase mb-2 block">
              Logo
            </label>
            <div className="flex gap-3 items-center">
              {settings.logo && (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="w-16 h-16 rounded-lg object-cover border border-white/20"
                />
              )}
              <label className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold py-3 px-4 rounded-lg text-xs border border-blue-500/30 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="text-xs font-bold text-white/60 uppercase mb-2 block">
              Primary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, primaryColor: e.target.value })
                }
                className="w-16 h-12 rounded-lg cursor-pointer border border-white/20"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, primaryColor: e.target.value })
                }
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="text-xs font-bold text-white/60 uppercase mb-2 block">
              Secondary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    secondaryColor: e.target.value,
                  })
                }
                className="w-16 h-12 rounded-lg cursor-pointer border border-white/20"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    secondaryColor: e.target.value,
                  })
                }
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-xs font-bold text-white/60 uppercase mb-2 block">
              Accent Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, accentColor: e.target.value })
                }
                className="w-16 h-12 rounded-lg cursor-pointer border border-white/20"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, accentColor: e.target.value })
                }
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => {
              toast.success("Settings saved successfully!");
              onClose();
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all mt-6"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
