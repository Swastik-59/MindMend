"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import Loader from "@/components/Loader";

export default function UserLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { userId } = await params;

        // Get stored uid from localStorage
        const storedUid = localStorage.getItem("user_uid");
        const token = localStorage.getItem("jwt_token");

        // Check if user is authenticated and accessing correct uid route
        if (!token || !storedUid) {
          router.replace("/SignIn");
          return;
        }

        // Check if the URL userId matches the authenticated user's uid
        if (storedUid !== userId) {
          router.replace("/SignIn");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/SignIn");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [params, router]);

  // Show loading while checking authentication
  if (isLoading) {
    <Loader />;
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <div>{children}</div>;
}
