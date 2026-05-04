import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Plus, 
  Minus, 
  CreditCard, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Gavel,
  RefreshCw,
  X,
  QrCode,
  ChevronDown,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import {
  getMyWallet,
  getWalletTransactions,
  depositWallet,
  withdrawWallet,
} from '../services/api/walletApi';

const TRANSACTION_TYPES = {
  DEPOSIT_TOPUP: { label: 'Nạp tiền', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  WITHDRAW: { label: 'Rút tiền', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  AUCTION_DEPOSIT: { label: 'Đặt cọc đấu giá', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  AUCTION_REFUND: { label: 'Hoàn tiền cọc', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  AUCTION_FORFEIT: { label: 'Vi phạm/Phạt', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  PAYMENT: { label: 'Thanh toán', color: 'text-purple-400', bg: 'bg-purple-400/10' },
};

const BANKS = [
  { id: 'vcb', name: 'Vietcombank', logo: 'VCB' },
  { id: 'tcb', name: 'Techcombank', logo: 'TCB' },
  { id: 'bidv', name: 'BIDV', logo: 'BIDV' },
  { id: 'mb', name: 'MB Bank', logo: 'MB' },
];

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val) || 0);

const numberToText = (total) => {
  if (!total || total === 0) return '';
  try {
    const formatter = new Intl.NumberFormat('vi-VN');
    return `Khoảng ${formatter.format(total)} đồng`;
  } catch (e) {
    return '';
  }
};

const parseApiError = (err) => {
  if (!err) return 'Đã xảy ra lỗi';
  if (typeof err === 'string') return err;
  return err.message || err.error || err?.data?.message || 'Đã xảy ra lỗi';
};

export default function WalletPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [activeModal, setActiveModal] = useState(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState(0);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const resetModal = () => {
    setActiveModal(null);
    setStep(1);
    setDisplayAmount('');
    setRawAmount(0);
    setSelectedBank('');
    setCardNumber('');
    setSubmitting(false);
  };

  const loadData = useCallback(async () => {
    setLoadError(null);
    setPageLoading(true);
    try {
      const [wRes, tRes] = await Promise.all([
        getMyWallet(),
        getWalletTransactions(0, 50),
      ]);
      const w = wRes?.data;
      if (w) {
        setWallet({
          balance: Number(w.balance) || 0,
          frozenBalance: Number(w.frozenBalance) || 0,
          status: w.walletStatus || 'ACTIVE',
        });
      }
      const page = tRes?.data;
      setTransactions(page?.content || []);
    } catch (err) {
      console.error(err);
      setLoadError(parseApiError(err));
      setWallet(null);
      setTransactions([]);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setDisplayAmount('');
      setRawAmount(0);
      return;
    }
    const numValue = parseInt(value, 10);
    setRawAmount(numValue);
    setDisplayAmount(numValue.toLocaleString('vi-VN'));
  };

  const handleNextStep = () => {
    if (!rawAmount || rawAmount <= 0) return;
    setStep(2);
  };

  const handleCompleteTransaction = async () => {
    const numAmount = rawAmount;
    if (!numAmount || numAmount <= 0) return;

    setSubmitting(true);
    try {
      if (activeModal === 'DEPOSIT') {
        await depositWallet(numAmount);
      } else if (activeModal === 'WITHDRAW') {
        await withdrawWallet({
          amount: numAmount,
          bankCode: selectedBank,
          accountNumber: cardNumber.trim(),
        });
      }
      await loadData();
      resetModal();
      alert(activeModal === 'DEPOSIT' ? 'Nạp tiền thành công' : 'Rút tiền thành công');
    } catch (err) {
      alert(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const availableBalance =
    wallet != null ? Math.max(0, wallet.balance - wallet.frozenBalance) : 0;

  const displayInitial = user?.username?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Header />

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter italic">
              Ví Điện Tử<span className="text-blue-500"> của tôi</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => loadData()}
              disabled={pageLoading}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white disabled:opacity-40"
              aria-label="Làm mới"
            >
              <RefreshCw className={`w-5 h-5 ${pageLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {displayInitial}
            </div>
          </div>
        </div>

        {loadError && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {loadError}
          </div>
        )}

        {pageLoading && !wallet ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Đang tải ví...</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Wallet className="w-64 h-64 text-blue-500 -rotate-12" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Tổng số dư khả dụng</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 animate-in fade-in slide-in-from-left duration-500">
                      {formatCurrency(wallet?.balance ?? 0)}
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Đang đóng băng (Cọc)
                        </p>
                        <p className="text-xl font-black text-amber-400">
                          {formatCurrency(wallet?.frozenBalance ?? 0)}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Trạng thái ví
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full animate-pulse ${
                              wallet?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <p className="text-xl font-black text-white">{wallet?.status ?? '—'}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-wider">
                      Rút tối đa khả dụng: {formatCurrency(availableBalance)}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button
                      type="button"
                      onClick={() => setActiveModal('DEPOSIT')}
                      disabled={wallet?.status !== 'ACTIVE'}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" /> Nạp tiền
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModal('WITHDRAW')}
                      disabled={wallet?.status !== 'ACTIVE'}
                      className="flex-1 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" /> Rút tiền
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 flex flex-col gap-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Tiện ích nhanh</h3>
                <div className="space-y-3">
                  {[
                    { icon: <CreditCard className="w-5 h-5" />, label: 'Liên kết ngân hàng', desc: 'Thêm thẻ ATM/Visa/Master (sắp có)' },
                    { icon: <Info className="w-5 h-5" />, label: 'Hạn mức giao dịch', desc: 'Tối đa 5 tỷ / giao dịch (demo)' },
                    { icon: <ShieldCheck className="w-5 h-5" />, label: 'Bảo mật', desc: 'Giao dịch qua API xác thực JWT' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 text-left"
                    >
                      <div className="p-3 bg-slate-950 rounded-xl text-blue-400">{item.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-200">{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-blue-400">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                    Lịch sử giao dịch
                  </h2>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                  {transactions.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 text-sm">
                      Chưa có giao dịch nào. Hãy nạp tiền hoặc tham gia đấu giá để xem lịch sử tại đây.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Loại giao dịch
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Mã tham chiếu
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Thời gian
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Số tiền
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => {
                          const typeKey = tx.transactionType || tx.type;
                          const typeInfo = TRANSACTION_TYPES[typeKey];
                          const dir = tx.direction;
                          const at = tx.createdAt || tx.date;
                          return (
                            <tr key={tx.transactionId || tx.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      dir === 'IN'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-rose-500/10 text-rose-400'
                                    }`}
                                  >
                                    {dir === 'IN' ? (
                                      <ArrowDownLeft className="w-4 h-4" />
                                    ) : (
                                      <ArrowUpRight className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-black ${typeInfo?.color || 'text-white'}`}>
                                      {typeInfo?.label || typeKey}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-xs font-mono font-bold text-slate-300">
                                  {tx.referenceCode || tx.ref || '—'}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-xs font-medium text-slate-400">
                                {at ? new Date(at).toLocaleString('vi-VN') : '—'}
                              </td>
                              <td className="px-6 py-5">
                                <p
                                  className={`text-sm font-black ${
                                    dir === 'IN' ? 'text-emerald-400' : 'text-slate-200'
                                  }`}
                                >
                                  {dir === 'IN' ? '+' : '-'}
                                  {formatCurrency(tx.amount)}
                                </p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  Thành công
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => !submitting && resetModal()}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                        activeModal === 'DEPOSIT' ? 'bg-blue-600/20 text-blue-400' : 'bg-rose-600/20 text-rose-400'
                      }`}
                    >
                      {activeModal === 'DEPOSIT' ? <Plus className="w-8 h-8" /> : <Minus className="w-8 h-8" />}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                      {activeModal === 'DEPOSIT' ? 'Nạp tiền vào ví' : 'Rút tiền về ngân hàng'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                        Số tiền (VND)
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={displayAmount}
                          onChange={handleAmountChange}
                          placeholder="0"
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 text-xl font-black text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-800"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black italic text-xs uppercase">
                          VND
                        </div>
                      </div>
                      {rawAmount > 0 && (
                        <p className="text-[10px] text-blue-400 font-bold italic px-2 animate-pulse">
                          {numberToText(rawAmount)}
                        </p>
                      )}
                    </div>

                    {activeModal === 'WITHDRAW' && (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                            Chọn ngân hàng
                          </label>
                          <div className="relative">
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none appearance-none focus:border-rose-600 transition-all"
                            >
                              <option value="" disabled>
                                -- Chọn ngân hàng --
                              </option>
                              {BANKS.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                  {bank.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                            Số tài khoản / Số thẻ
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Nhập số tài khoản..."
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-rose-600 transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 px-1">
                          Khả dụng: {formatCurrency(availableBalance)}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {[1000000, 5000000, 10000000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setRawAmount(val);
                            setDisplayAmount(val.toLocaleString('vi-VN'));
                          }}
                          className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all"
                        >
                          +{val / 1000000}M
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={
                      !rawAmount ||
                      rawAmount <= 0 ||
                      (activeModal === 'WITHDRAW' && (!selectedBank || !cardNumber.trim())) ||
                      (activeModal === 'WITHDRAW' && rawAmount > availableBalance)
                    }
                    onClick={handleNextStep}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeModal === 'DEPOSIT'
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30'
                        : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/30'
                    }`}
                  >
                    Tiếp tục xác nhận
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                      {activeModal === 'DEPOSIT' ? 'Xác nhận nạp tiền' : 'Xác nhận rút tiền'}
                    </h3>

                    {activeModal === 'DEPOSIT' ? (
                      <div className="space-y-6">
                        <div className="relative mx-auto w-56 h-56 p-4 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-600/20 flex items-center justify-center">
                          <QrCode className="w-40 h-40 text-slate-800 opacity-90" />
                        </div>
                        <p className="text-[10px] text-slate-500 px-2 leading-relaxed">
                          Đây là bước minh họa. Trong môi trường thật bạn sẽ quét QR chuyển khoản; tại đây bấm &quot;Hoàn tất nạp tiền&quot;
                          để hệ thống ghi nhận qua API (demo).
                        </p>

                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3 text-left">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Số tiền nạp</p>
                            <p className="text-sm font-black text-blue-400">{formatCurrency(rawAmount)}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-8 bg-rose-600/10 border border-rose-500/20 rounded-3xl">
                          <p className="text-3xl font-black text-white">{formatCurrency(rawAmount)}</p>
                          <p className="text-xs font-bold text-slate-500 uppercase mt-2">
                            Về {BANKS.find((b) => b.id === selectedBank)?.name} — STK {cardNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleCompleteTransaction}
                      disabled={submitting}
                      className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 ${
                        activeModal === 'DEPOSIT'
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-rose-600 text-white hover:bg-rose-500'
                      }`}
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      {activeModal === 'DEPOSIT' ? 'Hoàn tất nạp tiền' : 'Xác nhận rút tiền'}
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setStep(1)}
                      className="w-full text-xs font-bold text-slate-500 uppercase"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
