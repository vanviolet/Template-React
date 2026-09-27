import { LoginHeroCard } from './hero.card';
import { LoginForm } from './form';

export function LoginView() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl lg:rounded-[2rem] border border-border/80 bg-card shadow-2xl overflow-hidden p-2.5 sm:p-3.5 lg:p-4 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px] lg:min-h-[640px]">
        {/* Left Side: Hero Education Card */}
        <div className="lg:col-span-6 h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[600px]">
          <LoginHeroCard />
        </div>

        {/* Right Side: Login Form Area */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginView;
