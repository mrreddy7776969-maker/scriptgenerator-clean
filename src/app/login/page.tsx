"use client";

import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-premium-light dark:bg-premium-dark">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 border-r border-border">
        <div className="max-w-md">
          <div className="mb-6 flex items-center">
            <img src="./logo.png" alt="PlotLine Logo" className="h-16 w-auto object-contain rounded-xl border border-gold/10" />
          </div>
          <h1 className="font-serif text-4xl leading-tight mb-4">
            Visual scripts that bring stories to life
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            PlotLine generates detailed, scene-by-scene visual action scripts for
            dialogue-free 3D animated cartoons — crafted with positive values for
            young children.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-gold">
            <Sparkles className="h-4 w-4" />
            Powered by Google Gemini AI
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <img src="./logo.png" alt="PlotLine Logo" className="h-14 w-auto object-contain rounded-lg mb-4 border border-gold/10" />
            <p className="text-sm text-muted-foreground">Sign in to start creating</p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn-primary w-full !py-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Free plan includes 5 script generations. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
