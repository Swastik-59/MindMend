"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pointer } from "@/components/magicui/pointer";
import { TextAnimate } from "@/components/magicui/text-animate";
import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/zustand";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoggingIn, uid, authUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const storedUid = localStorage.getItem("user_uid");

        if (token && storedUid) {
          console.log(
            "User already authenticated, redirecting to:",
            `/${storedUid}/chat`
          );
          router.replace(`/${storedUid}/chat`);
          return;
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_uid");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  // Handle successful auth after sign in
  useEffect(() => {
    if (authUser && uid) {
      console.log("Sign in successful, redirecting to:", `/${uid}/chat`);
      router.replace(`/${uid}/chat`);
    }
  }, [authUser, uid, router]);

  const animatedTitle = useMemo(
    () => (
      <TextAnimate
        as="span"
        by="word"
        animation="fadeIn"
        duration={1}
        className="text-primary"
      >
        Welcome Back
      </TextAnimate>
    ),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      console.log("Starting sign in...");
      await signIn({ email, password });
      // Clear form on successful sign in
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Sign in error:", error);
      // Error handling is done in the store
    }
  };

  // Show loading while checking existing auth or during sign in
  if (isCheckingAuth || isLoggingIn) {
    return <Loader />;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <Pointer>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 12px var(--accent)",
          }}
        />
      </Pointer>

      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-xl border-none bg-muted/50 backdrop-blur-lg">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-center text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
            {animatedTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8">
          <form
            className="space-y-4 sm:space-y-5 lg:space-y-6"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              placeholder="Email"
              className="bg-background/80 text-text border-border focus:ring-2 focus:ring-accent h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoggingIn}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-background/80 text-text border-border focus:ring-2 focus:ring-accent h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggingIn}
            />

            <Button
              type="submit"
              variant="default"
              className="w-full bg-accent text-background hover:bg-accent/80 transition-all duration-300 h-10 sm:h-11 lg:h-12 text-sm sm:text-base font-medium"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-xs sm:text-sm text-center text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                href="/SignUp"
                className="text-accent hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
