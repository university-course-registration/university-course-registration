function AuthLayout({ children, badgeText, badgePill }) {
  return (
    <div className="min-h-screen w-full text-ink-900">
      <div className="flex min-h-screen w-full items-stretch">
        <div className="grid w-full overflow-hidden md:grid-cols-[1.05fr_1.2fr]">
          <div className="flex flex-col justify-center bg-white px-7 py-10 md:px-12 md:py-14">
            {children}
          </div>

          <div className="relative min-h-screen overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient-shift" />
            
            {/* Overlay pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            {/* Floating shapes */}
            <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl animate-pulse-slow" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white">
              <div className="fade-up max-w-md text-center">
                <h2 className="font-display text-4xl font-bold mb-4">
                  Course Registration Made Simple
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Manage your academic journey with ease. Register for courses, track your progress, and stay organized.
                </p>
                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold">40+</div>
                    <div className="text-white/80">Courses</div>
                  </div>
                  <div className="h-12 w-px bg-white/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold">5</div>
                    <div className="text-white/80">Levels</div>
                  </div>
                  <div className="h-12 w-px bg-white/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold">36</div>
                    <div className="text-white/80">Max Units</div>
                  </div>
                </div>
              </div>
            </div>
            
            {badgeText ? (
              <div className="absolute bottom-10 left-10 fade-up delay-2 flex flex-wrap items-center gap-3 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-slate-800 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {badgeText}
                {badgePill ? (
                  <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {badgePill}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
