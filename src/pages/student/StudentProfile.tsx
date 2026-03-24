import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Hash,
  Code2,
  Edit3,
  Trophy,
  Brain,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Profile {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  registerNumber: string;
  codingProfileUrl: string;
  codingPoints: number;
  aptitudePoints: number;
}

const StudentProfile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const profileId = id ? Number(id) : user?.id;
  const isOwnProfile = profileId === user?.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://demo-deployment-latest-dfxy.onrender.com/api/profile/${profileId}`
        );
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleSave = async () => {
    try {
      const res = await api.put("/api/profile/me", formData);
      setProfile(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* HERO */}
      <Card className="border-0 shadow-card" style={{ background: "var(--gradient-hero)" }}>
        <CardContent className="p-8 text-primary-foreground flex justify-between items-center">

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl font-bold border border-primary-foreground/30">
              {profile.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <p className="text-primary-foreground/80 mt-1">
                {profile.department || "Department not set"} • Year {profile.year || "-"}
              </p>

              <div className="flex gap-6 mt-5">
                <Stat icon={Trophy} label="Coding Points" value={profile.codingPoints} />
                <Stat icon={Brain} label="Aptitude Points" value={profile.aptitudePoints} />
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Button
              variant="secondary"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* DETAILS */}
      <Card className="shadow-card border-0">
        <CardContent className="p-8 grid md:grid-cols-2 gap-8">

          <ProfileField icon={User} label="Full Name"
            value={profile.name} editMode={editMode}
            name="name" formData={formData} setFormData={setFormData}
          />

          <StaticField icon={Mail} label="Email" value={profile.email} />

          <ProfileField icon={GraduationCap} label="Department"
            value={profile.department} editMode={editMode}
            name="department" formData={formData} setFormData={setFormData}
          />

          <ProfileField icon={Hash} label="Year"
            value={profile.year} editMode={editMode}
            name="year" formData={formData} setFormData={setFormData}
          />

          <ProfileField icon={Hash} label="Register Number"
            value={profile.registerNumber} editMode={editMode}
            name="registerNumber" formData={formData} setFormData={setFormData}
          />

          <ProfileField icon={Code2} label="Coding Profile URL"
            value={profile.codingProfileUrl} editMode={editMode}
            name="codingProfileUrl" formData={formData} setFormData={setFormData}
          />

        </CardContent>
      </Card>

      {editMode && isOwnProfile && (
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      )}
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3 bg-primary-foreground/10 px-5 py-4 rounded-xl">
    <Icon className="w-5 h-5" />
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  </div>
);

const ProfileField = ({
  icon: Icon,
  label,
  value,
  editMode,
  name,
  formData,
  setFormData,
}: any) => (
  <div className="flex items-start gap-4 group">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>

      {editMode ? (
        <Input
          value={formData[name] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [name]: e.target.value })
          }
        />
      ) : label === "Coding Profile URL" && value ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:underline break-all"
        >
          {value}
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <p className="font-medium">{value || "-"}</p>
      )}
    </div>
  </div>
);

const StaticField = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default StudentProfile;
