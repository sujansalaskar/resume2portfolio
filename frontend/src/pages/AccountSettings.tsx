import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { auth } from "@/services/api";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "delete", label: "Delete Account", icon: Trash2 },
];

const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPasswordProfile, setCurrentPasswordProfile] = useState("");

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await auth.getMe();
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile information.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !currentPasswordProfile) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      const res = await auth.updateProfile({ name, email, currentPassword: currentPasswordProfile });

      // Update local storage user data
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("auth_user", JSON.stringify({ ...u, name: res.name, email: res.email }));
      }

      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setCurrentPasswordProfile(""); // Clear password field
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      await auth.updatePassword({ currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? This will permanently delete your portfolios, analytics, and all associated data. This action cannot be undone.")) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      await auth.deleteAccount();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      navigate("/login");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete account.' });
      setSaving(false);
    }
  };

  // Switch tab helper to clear messages
  const handleTabSwitch = (id: string) => {
    setActiveTab(id);
    setMessage(null);
  };

  const getInitial = () => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-2xl mb-6">Account Settings</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Tabs */}
          <div className="sm:w-48 flex sm:flex-col gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeTab === t.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Global Message Alert */}
            {message && (
              <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${message.type === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-success/10 border-success/20 text-success'
                }`}>
                {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-5 animate-fade-in relative min-h-[300px]">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10 rounded-2xl">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <h2 className="font-semibold">Profile Information</h2>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                        {getInitial()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Profile Avatar
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Full Name</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-10 bg-secondary border-border/50"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Email</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10 bg-secondary border-border/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-4">
                      <p className="text-xs text-muted-foreground">
                        To save changes to your profile, please confirm your current password.
                      </p>
                      <div className="space-y-1.5 max-w-sm">
                        <Label className="text-xs">Current Password</Label>
                        <Input
                          type="password"
                          value={currentPasswordProfile}
                          onChange={(e) => setCurrentPasswordProfile(e.target.value)}
                          className="h-10 bg-secondary border-border/50"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="hero" disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl bg-card border border-border/50 space-y-5 animate-fade-in">
                <h2 className="font-semibold">Change Password</h2>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-10 bg-secondary border-border/50"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-10 bg-secondary border-border/50"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 bg-secondary border-border/50"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Password"}
                </Button>
              </form>
            )}

            {activeTab === "delete" && (
              <div className="p-6 rounded-2xl bg-card border border-destructive/30 space-y-5 animate-fade-in">
                <h2 className="font-semibold text-destructive">Delete Account</h2>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, all your data will be permanently removed. This includes all your portfolios, analytics data, and uploaded images. This action cannot be undone.
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={saving}
                >
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Delete My Account"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
