import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CircleHelp, Gem, HardDrive, Info, ListRestart, LockKeyhole, RotateCcw, Settings2, ShieldCheck, Sparkles, Star, Volume2, X } from 'lucide-react';
import Garage from './components/Garage';
import Header from './components/Header';
import LevelsView from './components/LevelsView';
import Modal from './components/Modal';
import RaceView from './components/RaceView';
import ResultView from './components/ResultView';
import { RacingFlag } from './components/GameArt';
import { CARS, DEFAULT_PROGRESS, PASS_SCORE, STORAGE_KEY, createQuestions, getScore, getStars, getUnlockedLevel, playSound, readProgress, type Progress, type Screen, type Session } from './game';

type ModalType = 'help' | 'settings' | 'leave' | 'reset' | null;

export default function App() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [screen, setScreen] = useState<Screen>('garage');
  const [selectedLevel, setSelectedLevel] = useState(() => getUnlockedLevel(progress));
  const [previewCar, setPreviewCar] = useState(progress.equippedCar);
  const [session, setSession] = useState<Session | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [pendingScreen, setPendingScreen] = useState<'garage' | 'levels'>('garage');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [toast, setToast] = useState<{ message: string; time: number } | null>(null);
  const finishGuard = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (countdown === null || modal || screen !== 'race') return;
    const timer = window.setTimeout(() => setCountdown(countdown > 0 ? countdown - 1 : null), countdown === 0 ? 450 : 750);
    return () => window.clearTimeout(timer);
  }, [countdown, modal, screen]);

  useEffect(() => {
    if (screen !== 'race' || !session?.answers.length) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [screen, session?.answers.length]);

  function notify(message: string) {
    setToast({ message, time: Date.now() });
  }

  function navigate(target: 'garage' | 'levels') {
    if (screen === 'race') {
      setPendingScreen(target);
      setModal('leave');
      return;
    }
    setScreen(target);
  }

  function selectLevel(id: number) {
    if (id > getUnlockedLevel(progress)) {
      notify(`Level ${id + 1} masih terkunci. Selesaikan level sebelumnya dengan minimal 6 jawaban benar.`);
      return;
    }
    setSelectedLevel(id);
    playSound('click', progress.sound);
  }

  function previewVehicle(id: number) {
    setPreviewCar(id);
    if (id <= getUnlockedLevel(progress)) setProgress(current => ({ ...current, equippedCar: id }));
    playSound('click', progress.sound);
  }

  function toggleSound() {
    setProgress(current => ({ ...current, sound: !current.sound }));
    if (!progress.sound) playSound('click', true);
  }

  function startRace(id: number) {
    if (id < 0 || id > getUnlockedLevel(progress)) {
      notify('Selesaikan level sebelumnya terlebih dahulu. Kamu pasti bisa!');
      return;
    }
    finishGuard.current = false;
    setSelectedLevel(id);
    setPreviewCar(progress.equippedCar);
    setSession({ levelId: id, carId: progress.equippedCar, questions: createQuestions(id), answers: [], currentIndex: 0, coinsEarned: 0, diamondsEarned: 0, newlyUnlocked: false });
    setCountdown(3);
    setModal(null);
    setToast(null);
    setScreen('race');
    playSound('start', progress.sound);
  }

  function answerQuestion(answer: number) {
    if (!session || screen !== 'race' || modal || countdown !== null || session.answers[session.currentIndex] !== undefined) return;
    if (!session.questions[session.currentIndex].options.includes(answer)) return;
    playSound(answer === session.questions[session.currentIndex].answer ? 'correct' : 'incorrect', progress.sound);
    setSession(current => {
      if (!current || current.answers[current.currentIndex] !== undefined) return current;
      return { ...current, answers: [...current.answers, answer] };
    });
  }

  function nextQuestion() {
    if (!session || screen !== 'race' || modal || session.answers[session.currentIndex] === undefined) return;
    if (session.currentIndex < 9) {
      setSession(current => current ? { ...current, currentIndex: current.currentIndex + 1 } : null);
      return;
    }
    if (finishGuard.current) return;
    finishGuard.current = true;
    const score = getScore(session);
    const previousBest = progress.bestScores[session.levelId] ?? 0;
    const newlyUnlocked = score >= PASS_SCORE && previousBest < PASS_SCORE;
    // Only a better personal record earns more rewards, so replays cannot duplicate them.
    const coinsEarned = Math.max(0, score - previousBest) * 10 + (newlyUnlocked ? 50 : 0);
    const diamondsEarned = Math.max(0, getStars(score) - getStars(previousBest)) * 5;
    setProgress(current => ({
      ...current,
      bestScores: current.bestScores.map((best, index) => index === session.levelId ? Math.max(best ?? 0, score) : best),
      coins: current.coins + coinsEarned,
      diamonds: current.diamonds + diamondsEarned,
    }));
    setSession(current => current ? { ...current, coinsEarned, diamondsEarned, newlyUnlocked } : null);
    setScreen('result');
    playSound('finish', progress.sound);
  }

  function leaveRace() {
    setModal(null);
    setCountdown(null);
    setSession(null);
    setScreen(pendingScreen);
  }

  function resetProgress() {
    setProgress(current => ({ ...DEFAULT_PROGRESS, bestScores: [...DEFAULT_PROGRESS.bestScores], sound: current.sound, reducedMotion: current.reducedMotion }));
    setSelectedLevel(0);
    setPreviewCar(0);
    setSession(null);
    setCountdown(null);
    setModal(null);
    setScreen('garage');
    notify('Petualangan baru dimulai! Scarlet siap menemanimu dari Level 1.');
  }

  function viewNewCar(id: number) {
    previewVehicle(id);
    setSelectedLevel(Math.min(id, 4));
    setScreen('garage');
    notify(`${CARS[id].name} siap kamu kendarai. Ayo, lanjutkan petualanganmu!`);
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (modal || event.repeat || event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;
      if (screen === 'race') {
        if (event.key === 'Escape') { event.preventDefault(); navigate('garage'); }
        if (countdown !== null || !session) return;
        if (['1', '2', '3'].includes(event.key)) { event.preventDefault(); answerQuestion(session.questions[session.currentIndex].options[Number(event.key) - 1]); }
        const focusedButton = target.closest('button');
        const canAdvance = !focusedButton || focusedButton.matches('.answer-button, .next-question-button');
        if (event.key === 'Enter' && canAdvance && session.answers[session.currentIndex] !== undefined) { event.preventDefault(); nextQuestion(); }
      } else if ((screen === 'garage' || screen === 'levels') && event.key === 'Enter' && !['BUTTON', 'A'].includes(target.tagName)) {
        event.preventDefault();
        startRace(selectedLevel);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className={`app-shell ${progress.reducedMotion ? 'reduce-motion' : ''}`}>
      <Header progress={progress} screen={screen} onNavigate={navigate} onHelp={() => setModal('help')} onSettings={() => setModal('settings')} onSound={toggleSound} />
      {screen === 'garage' && <Garage progress={progress} selectedLevel={selectedLevel} previewCar={previewCar} onPreview={previewVehicle} onSelectLevel={selectLevel} onStart={startRace} onLevels={() => navigate('levels')} storageAvailable={storageAvailable} />}
      {screen === 'levels' && <LevelsView progress={progress} selectedLevel={selectedLevel} onSelect={selectLevel} onStart={startRace} onHelp={() => setModal('help')} />}
      {screen === 'race' && session && <RaceView session={session} countdown={countdown} paused={modal !== null} onAnswer={answerQuestion} onNext={nextQuestion} onPause={() => navigate('garage')} />}
      {screen === 'result' && session && <ResultView session={session} onReplay={() => startRace(session.levelId)} onNext={() => startRace(session.levelId + 1)} onGarage={() => navigate('garage')} onViewCar={viewNewCar} />}

      {modal === 'help' && <Modal title="SIAP, HITUNG, MELAJU!" eyebrow="PANDUAN PEMBALAP KECIL" onClose={() => setModal(null)} wide>
        <p className="modal-description">Belajar pengurangan jadi petualangan yang seru. Tidak perlu buru-buru, yang penting terus mencoba!</p>
        <div className="how-to-steps">
          <div><span className="step-number">01</span><div><h3>Pilih mobil & lintasanmu</h3><p>Mulai dengan Scarlet di Level 1. Ada 5 level dengan angka yang makin menantang, dari 1 sampai 100.</p></div></div>
          <div><span className="step-number">02</span><div><h3>Hitung, lalu pilih jawaban</h3><p>Setiap level punya 10 soal dan 3 pilihan jawaban. Jawaban benar membuat mobilmu melaju di depan. Jika salah, mobil lawan mendapat dorongan kecepatan dan menyalipmu. Kamu bisa mengejarnya dengan jawaban benar berikutnya!</p></div></div>
          <div><span className="step-number">03</span><div><h3>Jadilah juara pengurangan</h3><p>Raih minimal 6 jawaban benar untuk membuka level dan mobil berikutnya. Kelulusan ditentukan oleh jawaban benar, bukan posisi finis. Kalau belum berhasil, kamu boleh mencoba lagi.</p></div></div>
        </div>
        <div className="help-example" aria-label="Contoh: 12 dikurangi 5 sama dengan 7"><span>12 - 5 = <strong>?</strong></span><div><span>6</span><span className="correct">7 <Check size={14} /></span><span>8</span></div></div>
        <div className="star-guide"><span><Star size={15} fill="currentColor" />6-7 benar</span><span><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" />8 benar</span><span><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" />9-10 benar</span></div>
        <p className="help-reward-note"><Gem size={14} />Setiap bintang baru memberi 5 berlian. Tingkatkan rekor untuk mendapat lebih banyak koin!</p>
        <button className="primary-button modal-primary" onClick={() => setModal(null)}><RacingFlag /><span>AKU SIAP!</span><ArrowRight size={20} /></button>
      </Modal>}

      {modal === 'settings' && <Modal title="PENGATURAN" eyebrow="BUAT BALAPANMU NYAMAN" onClose={() => setModal(null)}>
        <div className="settings-list">
          <div className="setting-row"><div><Volume2 size={20} /><span><strong>Efek suara</strong><small>Suara jawaban dan kemenangan</small></span></div><button className={`toggle-switch ${progress.sound ? 'on' : ''}`} role="switch" aria-checked={progress.sound} aria-label="Efek suara" onClick={toggleSound}><span /></button></div>
          <div className="setting-row"><div><Sparkles size={20} /><span><strong>Animasi minimal</strong><small>Kurangi gerakan pada layar</small></span></div><button className={`toggle-switch ${progress.reducedMotion ? 'on' : ''}`} role="switch" aria-checked={progress.reducedMotion} aria-label="Animasi minimal" onClick={() => setProgress(current => ({ ...current, reducedMotion: !current.reducedMotion }))}><span /></button></div>
          <div className="setting-row progress-setting"><div><HardDrive size={20} /><span><strong>Progres tersimpan</strong><small>{progress.bestScores.filter(score => (score ?? 0) >= PASS_SCORE).length} dari 5 level ditaklukkan</small></span></div><ShieldCheck size={21} /></div>
        </div>
        <p className="save-explanation">{storageAvailable ? 'Progres dan koleksi mobilmu disimpan otomatis di browser ini. Kamu bisa melanjutkan kapan saja.' : 'Browser tidak mengizinkan penyimpanan. Progres akan hilang setelah halaman ditutup.'}</p>
        <button className="reset-button" onClick={() => setModal('reset')}><RotateCcw size={16} />Mulai ulang seluruh petualangan</button>
        <button className="secondary-button modal-primary" onClick={() => setModal(null)}><Check size={17} />SIMPAN & KEMBALI</button>
      </Modal>}

      {modal === 'leave' && <Modal title="MAU ISTIRAHAT DULU?" eyebrow="BALAPAN DIJEDA" onClose={() => setModal(null)}>
        <div className="confirm-icon"><CircleHelp size={34} /></div><p className="modal-description">Jawaban pada balapan ini belum disimpan. Jika keluar, kamu akan mengulang level ini dari soal pertama. Level yang sudah selesai tetap aman.</p>
        <button className="primary-button modal-primary" onClick={() => setModal(null)}><span>LANJUTKAN BALAPAN</span><ArrowRight size={19} /></button><button className="text-button confirm-secondary" onClick={leaveRace}>Keluar ke {pendingScreen === 'garage' ? 'garasi' : 'pilihan level'}</button>
      </Modal>}

      {modal === 'reset' && <Modal title="MULAI DARI AWAL?" eyebrow="RESET PETUALANGAN" onClose={() => setModal('settings')}>
        <div className="confirm-icon warning"><ListRestart size={34} /></div><p className="modal-description">Semua rekor, koin, berlian, dan mobil yang sudah terbuka akan dihapus dari perangkat ini. Tindakan ini tidak bisa dibatalkan.</p>
        <button className="secondary-button modal-primary" onClick={() => setModal('settings')}><Settings2 size={17} />BATAL, SIMPAN PROGRESKU</button><button className="danger-button modal-primary" onClick={resetProgress}><RotateCcw size={16} />YA, MULAI DARI AWAL</button>
      </Modal>}

      {toast && <div className="toast" role="status" aria-live="polite">{toast.message.includes('terkunci') ? <LockKeyhole size={19} /> : <Info size={19} />}<p>{toast.message}</p><button aria-label="Tutup pemberitahuan" onClick={() => setToast(null)}><X size={16} /></button></div>}
    </div>
  );
}
