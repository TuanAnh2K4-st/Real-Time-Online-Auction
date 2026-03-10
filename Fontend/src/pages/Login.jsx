import React from "react";

function Login() {
  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 xl:px-24 bg-slate-900 overflow-hidden">

        <div
          className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD81v3mbktVk8TGneyj-mjqarKo6FLjBU88TMGi3w0-jnlhEANc5YpPxxzlH4vFK2mTYlRQsIebBrguh8muvKxj1iHI8Z9-n09smau_Xd5pM3sFmVYsV1Hb7WqUBRhwxsKHRRhaf3TvQyMiEX42xjwXi58XFy5Cj1eaeQjeodeUy5whbmquP994H75vZn_vWbhK6px-Nj8swHSCgijiJYD9KKyU3lqFZy4wliPDn5uCRsfmA4mIJGFQhbT4vmbDZWB8I2r3BOaXQYaj')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>

        <div className="relative z-20 flex flex-col gap-6">

          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                gavel
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">
              Luxury Auction
            </h2>
          </div>

          <div className="max-w-lg">
            <h1 className="text-white text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
              The thrill of the auction
            </h1>

            <p className="text-slate-300 text-lg xl:text-xl italic border-l-4 border-primary pl-6">
              "Victory belongs to the most persevering." Experience the
              excitement of bidding on premium collectibles from around the
              world.
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-background-light dark:bg-background-dark">

        <div className="max-w-md w-full mx-auto">

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Welcome Back
            </h2>

            <p className="text-slate-500 dark:text-slate-400">
              Please enter your details to access your account.
            </p>
          </div>

          <form className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* PASSWORD */}
            <div>

              <div className="flex justify-between mb-2">

                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </label>

                <a
                  href="#"
                  className="text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Forgot password?
                </a>

              </div>

              <div className="relative">

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-14 px-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined">
                    visibility
                  </span>
                </button>

              </div>

            </div>

            {/* REMEMBER */}
            <div className="flex items-center">

              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
              />

              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-600 dark:text-slate-400"
              >
                Remember me for 30 days
              </label>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Login to Account
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;