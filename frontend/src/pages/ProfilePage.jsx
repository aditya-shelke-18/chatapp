import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi - हिंदी" },
  { code: "mr", label: "Marathi - मराठी" },
  { code: "es", label: "Spanish - Español" },
  { code: "fr", label: "French - Français" },
  { code: "de", label: "German - Deutsch" },
  { code: "zh", label: "Chinese - 中文" },
  { code: "ar", label: "Arabic - العربية" },
  { code: "pt", label: "Portuguese - Português" },
  { code: "ru", label: "Russian - Русский" },
  { code: "ja", label: "Japanese - 日本語" },
  { code: "ko", label: "Korean - 한국어" },
];

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateLanguage } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [savingLang, setSavingLang] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  const handleLanguageChange = async (e) => {
    setSavingLang(true);
    await updateLanguage(e.target.value);
    setSavingLang(false);
  };

  return (
    <div className="chat-bg min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto py-8 space-y-4">

        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-sm text-base-content/50 mt-1">Manage your account settings</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 size-9 bg-primary text-primary-content rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-70" : ""}`}
              >
                <Camera className="size-4" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-xs text-base-content/40">
              {isUpdatingProfile ? "Uploading..." : "Click camera to update photo"}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200/50 border border-base-300/30">
              <User className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-base-content/40">Full Name</p>
                <p className="text-sm font-medium">{authUser?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200/50 border border-base-300/30">
              <Mail className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-base-content/40">Email</p>
                <p className="text-sm font-medium">{authUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="px-4 py-3 rounded-xl bg-base-200/30 border border-base-300/20 space-y-2 text-sm">
            <div className="flex justify-between text-base-content/50">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/50">Account Status</span>
              <span className="text-success font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Language Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Preferred Language</h2>
              <p className="text-xs text-base-content/40">Incoming messages will be translated to this language</p>
            </div>
          </div>

          <select
            className="select select-bordered w-full text-sm"
            value={authUser?.preferredLanguage || "en"}
            onChange={handleLanguageChange}
            disabled={savingLang}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          {savingLang && (
            <p className="text-xs text-primary animate-pulse">Saving preference...</p>
          )}

          <div className="px-4 py-3 rounded-xl bg-base-200/40 border border-base-300/20">
            <p className="text-xs text-base-content/50 leading-relaxed">
              <span className="font-medium text-base-content/70">How it works: </span>
              When someone sends you a message in a different language, AI automatically translates it to your preferred language in real-time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProfilePage;
