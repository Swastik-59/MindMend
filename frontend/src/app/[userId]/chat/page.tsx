  "use client";

  import { useParams, useRouter } from "next/navigation";
  import Sidebar from "@/components/Sidebar";
  import { useEffect } from "react";
  import { useStore } from "@/lib/store/zustand";
  import ChatPage from "@/components/ChatPage";
  import { Pointer } from "@/components/magicui/pointer";
  import { ToastContainer } from "react-toastify";

  function Page() {
    const { userId } = useParams();
    const checkAuth = useStore((state: any) => state.checkAuth);
    const isCheckingAuth = useStore((state: any) => state.isCheckingAuth);
    const authUser = useStore((state: any) => state.authUser);
    const router = useRouter();

    // Run auth check on mount
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    // Redirect to SignIn if not authenticated
    useEffect(() => {
      if (!isCheckingAuth && !authUser) {
        router.push("/SignIn");
      }
    }, [isCheckingAuth, authUser, router]);

    return (
      <div className="relative min-h-screen bg-background text-text overflow-hidden">
        <Pointer className="fill-accent" />
        <ToastContainer />

        <div className="absolute top-6 left-4 z-10">
          <Sidebar />
        </div>

        <main className="flex flex-col items-center px-4 gap-8 w-full">
          <div className="w-full max-w-screen-lg">
            <ChatPage />
          </div>
        </main>
      </div>
    );
  }

  export default Page;
