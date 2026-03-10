import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit register");
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAleBvlH-8DumUFqq7ChJ8032PfQKW7aEihSJylwD5pWfjzuELaKZiMIpoGfgEeLvqM8loFRQpJkY8EKbqDyXVKjUyDi4zFey5wkfBe4B6Fh093Blo8AEyKH1v26foeZxQRLbckcbWPhbr3nd2_ravJm76r1_za1JdzvVuhYSSicAM7p_movBKXCEgQhlbC0eEjl0wmMPY8UDC9V5tMU_iz8dXKUmTj8py-HCqMLYSfpHe1VMxxVUIaZaaGVEh-LeQ9XmYEZ5Sh70AF')",
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>

        <div className="relative z-20 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">
                gavel
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase">
              Elite Auction
            </h2>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-black leading-tight mb-6">
              Access the world's most exclusive assets.
            </h1>

            <p className="text-xl text-slate-300">
              Join a community of elite collectors. Bid on rare timepieces,
              classic automobiles, and fine art.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            © 2024 Elite Auction Platform. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="max-w-md w-full mx-auto">

          <div className="mb-10">
            <h2 className="text-3xl font-black mb-2">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Join the auction floor and start bidding today.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  person
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>

                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone Number
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  smartphone
                </span>

                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-500">
                Required for SMS bidding verification
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="size-5 cursor-pointer" />

              <label className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{" "}
                <span className="text-primary">Terms of Service</span> and{" "}
                <span className="text-primary">Privacy Policy</span>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Create Account
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>

          </form>

          <p className="mt-10 text-center text-slate-500 dark:text-slate-400">
            Already have an account?
            <span className="text-primary font-bold ml-1 cursor-pointer">
              Log in
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}