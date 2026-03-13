import { useRef } from "react";

export default function VerifyOtp() {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold">Premium Collectibles</h1>
        </div>

        <button className="hidden md:block min-w-[100px] rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:brightness-110">
          Sign In
        </button>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] space-y-8">

          {/* Title */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">
                shield_person
              </span>
            </div>

            <h2 className="text-3xl font-black">Verify Your Identity</h2>

            <p className="text-slate-500 dark:text-slate-400 text-base max-w-[320px]">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold">
                +84 *** *** 89
              </span>
            </p>
          </div>

          {/* OTP INPUT */}
          <div className="space-y-6">
            <div className="flex justify-between gap-2 md:gap-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  onChange={(e) => handleChange(e, index)}
                  className="w-full aspect-square md:w-16 md:h-16 text-center text-2xl font-bold bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary rounded-xl text-slate-900 dark:text-white"
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98]">
                Verify and Continue
              </button>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  <p className="text-xs font-bold">00:59</p>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Didn't receive the code?{" "}
                  <button className="text-primary font-semibold opacity-50 cursor-not-allowed">
                    Resend Code
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Secure SSL
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                verified_user
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-10 text-center">
        <p className="text-slate-400 text-xs">
          © 2024 Premium Collectibles Auction Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}