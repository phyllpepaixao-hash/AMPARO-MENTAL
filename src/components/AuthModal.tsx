import React, { useState } from 'react';
import { X, Lock, KeyRound, User, Mail, ShieldCheck, Check, LogOut, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserPreferences, UserAccount } from '../types';
import { AmbientSound } from '../services/soundService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  const account = preferences.account || {
    isLoggedIn: false,
    email: null,
    name: preferences.name || '',
    avatarSeed: 'serene-teal',
    pinLockEnabled: false,
    pinCode: null,
    memberSince: 'Outubro de 2026',
    isJournalLocked: false,
  };

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'pin' | 'profile' | 'plans'>(
    account.isLoggedIn ? 'profile' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState(preferences.name || '');
  const [showPassword, setShowPassword] = useState(false);
  const [pinCode, setPinCode] = useState(account.pinCode || '');
  const [pinEnabled, setPinEnabled] = useState(account.pinLockEnabled);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    const updatedAccount: UserAccount = {
      ...account,
      isLoggedIn: true,
      email: email.trim(),
      name: preferences.name || email.split('@')[0],
      memberSince: account.memberSince || 'Outubro de 2026',
    };

    onUpdatePreferences({
      ...preferences,
      account: updatedAccount,
      name: updatedAccount.name,
    });

    AmbientSound.playGentleChime();
    setSuccessMsg('Login realizado com sucesso!');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('profile');
    }, 1200);
  };

  const handleQuickDemoLogin = () => {
    setErrorMsg(null);
    const demoEmail = 'visitante@entre.bemestar';
    const updatedAccount: UserAccount = {
      ...account,
      isLoggedIn: true,
      email: demoEmail,
      name: preferences.name || 'Visitante',
      memberSince: 'Outubro de 2026',
    };

    onUpdatePreferences({
      ...preferences,
      account: updatedAccount,
      name: updatedAccount.name,
    });

    AmbientSound.playGentleChime();
    setSuccessMsg('Conectado como Visitante!');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('profile');
    }, 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    const updatedAccount: UserAccount = {
      ...account,
      isLoggedIn: true,
      email: email.trim(),
      name: signupName.trim() || 'Usuário',
      memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    };

    onUpdatePreferences({
      ...preferences,
      name: updatedAccount.name,
      account: updatedAccount,
    });

    AmbientSound.playGentleChime();
    setSuccessMsg('Conta criada com sucesso e protegida localmente!');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('profile');
    }, 1200);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEnabled && pinCode.length !== 4) {
      setErrorMsg('O código PIN deve conter exatamente 4 números.');
      return;
    }

    const updatedAccount: UserAccount = {
      ...account,
      pinLockEnabled: pinEnabled,
      pinCode: pinEnabled ? pinCode : null,
    };

    onUpdatePreferences({
      ...preferences,
      account: updatedAccount,
    });

    AmbientSound.playGentleChime();
    setSuccessMsg('Preferência de PIN de privacidade atualizada!');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleLogout = () => {
    const updatedAccount: UserAccount = {
      ...account,
      isLoggedIn: false,
      email: null,
    };

    onUpdatePreferences({
      ...preferences,
      account: updatedAccount,
    });

    setActiveTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-lg bg-[#0F1722] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col animate-fadeIn"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#101924] to-slate-900 border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                Acesso & Privacidade
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {account.isLoggedIn ? 'Conta Conectada' : 'Modo Convidado'}
              </span>
            </div>
            <h2 id="auth-modal-title" className="text-lg sm:text-xl font-bold text-slate-100 mt-1 font-serif">
              Painel de Login & Perfil Seguro
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              O login é opcional. Você pode usar tudo gratuitamente no modo anônimo.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar painel de acesso"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-[#0A1017] px-4 gap-1 overflow-x-auto text-xs">
          {!account.isLoggedIn ? (
            <>
              <button
                onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'login'
                    ? 'border-teal-400 text-teal-300 bg-teal-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
                className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                  activeTab === 'signup'
                    ? 'border-teal-400 text-teal-300 bg-teal-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Criar Conta
              </button>
            </>
          ) : (
            <button
              onClick={() => { setActiveTab('profile'); setErrorMsg(null); }}
              className={`py-3 px-3 font-semibold border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-teal-400 text-teal-300 bg-teal-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Meu Perfil
            </button>
          )}

          <button
            onClick={() => { setActiveTab('pin'); setErrorMsg(null); }}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pin'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>PIN do Diário</span>
          </button>

          <button
            onClick={() => { setActiveTab('plans'); setErrorMsg(null); }}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ml-auto ${
              activeTab === 'plans'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Amparo Premium</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-200">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-teal-950/70 border border-teal-800 text-teal-200 text-xs flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 shrink-0 text-teal-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && !account.isLoggedIn && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-800/40 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-teal-300 block mb-0.5">Privacidade Total Garantida:</span>
                Você não precisa de login para usar o app. Ter uma conta permite salvar seu histórico e proteger o diário.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                    <span>Senha</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha segura"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-950"
                >
                  Entrar na Minha Conta
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acesso Rápido de Demonstração (1 Clique)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGNUP */}
          {activeTab === 'signup' && !account.isLoggedIn && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>Como prefere ser chamado(a)?</span>
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                    <span>Criar Senha (mínimo 6 caracteres)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Escolha uma senha segura"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-950"
                >
                  Criar Conta Segura e Gratuita
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PIN LOCK (APP PRIVACY) */}
          {activeTab === 'pin' && (
            <form onSubmit={handleSavePin} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-indigo-300 block mb-0.5">Bloqueio de Privacidade do Diário:</span>
                Ideal para quando você compartilha o celular ou computador com parentes ou colegas. Se ativado, exige um código de 4 dígitos antes de abrir o Diário.
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <p className="font-bold text-slate-200 text-xs">Exigir PIN para abrir o diário</p>
                  <p className="text-[11px] text-slate-400">Protege seus pensamentos contra olhares curiosos</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPinEnabled(!pinEnabled)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                    pinEnabled
                      ? 'bg-teal-900/80 text-teal-200 border border-teal-700'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {pinEnabled ? 'Ativado' : 'Desativado'}
                </button>
              </div>

              {pinEnabled && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label htmlFor="pin-code" className="text-xs font-semibold text-slate-300 font-mono">
                    Definir PIN de 4 dígitos:
                  </label>
                  <input
                    id="pin-code"
                    type="password"
                    maxLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ex.: 1234"
                    className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Salvar Configuração de PIN
              </button>
            </form>
          )}

          {/* TAB 4: PROFILE (WHEN LOGGED IN) */}
          {activeTab === 'profile' && account.isLoggedIn && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {account.name ? account.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm font-serif">
                    {account.name || 'Usuário'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {account.email || 'Conta local conectada'}
                  </p>
                  <span className="text-[10px] text-teal-400">
                    Membro desde {account.memberSince}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Proteção por PIN do diário:</span>
                  <span className="font-mono text-teal-300">{account.pinLockEnabled ? 'Ativada' : 'Desativada'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Armazenamento:</span>
                  <span className="font-mono text-slate-400">Local Privado (LGPD)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('pin')}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Gerenciar PIN de Privacidade</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/50 text-rose-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta (Modo Convidado)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PLANS & PRICING (AMPARO PREMIUM) */}
          {activeTab === 'plans' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                  Apoio Contínuo & Sustentabilidade
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-serif">
                  Planos Amparo Premium
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Ferramentas essenciais e de crise continuam <strong>100% gratuitas</strong> para todos. O plano Premium apoia a manutenção do projeto e desbloqueia recursos avançados.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {/* Free Plan */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-mono">Essencial (Gratuito)</span>
                    <span className="text-xs font-mono font-bold text-teal-400">R$ 0,00</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Check-ins diários, diário privado local, guias de respiração, próximo passo e acesso total de emergência a crises (CVV 188 / SAMU 192).
                  </p>
                  <div className="text-[10px] text-teal-300 font-semibold pt-1">✓ Sempre livre e sem anúncios</div>
                </div>

                {/* Monthly Plan */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/60 space-y-2 relative shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 font-serif">Amparo Premium Mensal</span>
                    <span className="text-sm font-mono font-bold text-amber-300">R$ 19,90 <span className="text-[10px] text-slate-400">/mês</span></span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Histórico avançado de tendências, todas as 4 paisagens sonoras imersivas offline, relatórios estruturados para terapia e ritual de desaceleração noturna.
                  </p>
                  <button
                    onClick={() => alert('Simulação de Assinatura Mensal: No ambiente real, redireciona para o checkout seguro (Stripe/Pix).')}
                    className="w-full mt-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                  >
                    Assinar Mensal
                  </button>
                </div>

                {/* Annual Plan (Best Value) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-900 border border-teal-600/70 space-y-2 relative shadow-lg">
                  <div className="absolute -top-2.5 right-3 bg-teal-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    37% de Desconto
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-200 font-serif">Amparo Premium Anual</span>
                    <span className="text-sm font-mono font-bold text-teal-300">R$ 149,90 <span className="text-[10px] text-slate-400">/ano (~R$ 12,49/mês)</span></span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Todos os benefícios do plano mensal com economia anual garantida e acesso antecipado a novos recursos de bem-estar.
                  </p>
                  <button
                    onClick={() => alert('Simulação de Assinatura Anual: No ambiente real, redireciona para o checkout seguro (Stripe/Pix).')}
                    className="w-full mt-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-md shadow-teal-950"
                  >
                    Assinar Anual (Melhor Valor)
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-500 pt-1">
                Cancelamento a qualquer momento direto pelo painel. Pagamento processado de forma segura.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
