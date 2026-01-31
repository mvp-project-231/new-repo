
"use client";

import React, {useEffect, useState} from "react";
import { apiFetch, getAccessToken } from "@/lib/api";

type Profile = {
  id: string;
  email: string;
  username: string;
  dateOfBirth: string;
  createdAt: string;
};

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError("You are not signed in. Please sign in to view your profile.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await apiFetch<{ success: boolean; data?: { profile: Profile } }>(
          "/auth/profile",
          { method: "GET" },
          true
        );
        if (res?.success && res.data?.profile) {
          setProfile(res.data.profile);
        } else {
          setError("Failed to load profile");
        }
      } catch (e: any) {
        setError(e?.payload?.error || e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="flex pt-10 justify-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <h1 className=" text-2xl md:text-4xl text-black">Your Profile</h1>
        <div className="mt-6">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && profile && (
            <div className="space-y-2">
              <h2 className="text-2xl">Email: {profile.email}</h2>
              <p className="text-xl">Username: {profile.username}</p>
              <p className="text-sm text-gray-600">User ID: {profile.id}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
