import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account" },
  ];
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUrl = location.search.split("next=")[1];

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [auth.isAuthenticated, redirectUrl]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white roudned-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log in to continue your job search journey</h2>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                Signing you in...
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    Log Out
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    Log in
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
