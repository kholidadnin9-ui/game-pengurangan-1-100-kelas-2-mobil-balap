import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Gem, Home, LockKeyholeOpen, RotateCcw, Star, Trophy, X } from 'lucide-react';
import { CARS, LEVELS, PASS_SCORE, explainQuestion, getScore, getStars, type Session } from '../game';
import { Coin, RacingFlag } from './GameArt';

interface ResultViewProps {
  session: Session;
  onReplay: () => void;
  onNext: () => void;
  onGarage: () => void;
  onViewCar: (id: number) => void;
}

export default function ResultView({ session, onReplay, onNext, onGarage, onViewCar }: ResultViewProps) {
  const [showReview, setShowReview] = useState(false);
  const score = getScore(session);
  const passed = score >= PASS_SCORE;
  const stars = getStars(score);
  const champion = passed && session.levelId === 4;
  return (
    <main className="main-container result-page page-enter">
      <div className="result-main">
        <div className="eyebrow">LEVEL {String(session.levelId + 1).padStart(2, '0')} / {LEVELS[session.levelId].name.toUpperCase()}</div>
        <div className={`result-trophy ${passed ? '' : 'try-again'}`}><RacingFlag className="result-flag left" />{passed ? <Trophy size={75} strokeWidth={1.35} /> : <FlagArt />}<RacingFlag className="result-flag right" /></div>
        <div className="result-stars" aria-label={`${stars} dari 3 bintang`}>{[1, 2, 3].map(star => <Star key={star} size={39} className={star <= stars ? 'earned' : ''} fill={star <= stars ? 'currentColor' : 'none'} style={{ animationDelay: `${star * 120}ms` }} />)}</div>
        <h1 className="display-title">{champion ? 'JUARA RACE MATH!' : passed ? 'BALAPAN HEBAT!' : 'TERUS SEMANGAT!'}</h1>
        <p className="result-description">{champion ? 'Kelima lintasan sudah kamu taklukkan. Kamu juara pengurangan!' : passed ? 'Kerja bagus, pembalap! Kamu berhasil menaklukkan lintasan ini.' : 'Setiap percobaan membuatmu makin jago. Ayo, kita coba lagi!'}</p>
        <div className="result-stats"><div><span>JAWABAN BENAR</span><strong>{score}<small>/ 10</small></strong></div><div><span>KOIN DIDAPAT</span><strong className="gold-text"><Coin />+{session.coinsEarned}</strong></div><div><span>BERLIAN DIDAPAT</span><strong className="cyan-text"><Gem size={23} />+{session.diamondsEarned}</strong></div></div>
        {!passed && <p className="pass-reminder">Dapatkan minimal <strong>6 jawaban benar</strong> untuk membuka level berikutnya.</p>}
        {session.newlyUnlocked && session.levelId < 4 && <button className="unlock-notice" onClick={() => onViewCar(session.levelId + 1)}><img src={CARS[session.levelId + 1].image} alt={CARS[session.levelId + 1].name} /><span><span className="unlock-eyebrow"><LockKeyholeOpen size={12} />MOBIL BARU TERBUKA</span><strong>{CARS[session.levelId + 1].name.toUpperCase()} MENUNGGUMU!</strong><small>Lihat mobil barumu di garasi</small></span><ArrowRight size={20} /></button>}
        {session.coinsEarned === 0 && <p className="reward-note">Hadiah sudah tersimpan. Tingkatkan rekor untuk mendapat hadiah tambahan.</p>}
        <div className="result-actions"><button className="secondary-button" onClick={passed ? onReplay : onGarage}>{passed ? <RotateCcw size={17} /> : <Home size={17} />}{passed ? 'COBA LAGI' : 'KE GARASI'}</button><button className="primary-button" onClick={passed ? champion ? onGarage : onNext : onReplay}><span>{passed ? champion ? 'KEMBALI KE GARASI' : 'LEVEL BERIKUTNYA' : 'AYO, COBA LAGI'}</span><ArrowRight size={19} /></button></div>
        <button className="review-toggle text-button" onClick={() => setShowReview(value => !value)} aria-expanded={showReview} aria-controls="answer-review">{showReview ? 'Tutup' : 'Lihat'} pembahasan 10 soal<ChevronDown size={16} className={showReview ? 'rotated' : ''} /></button>
        {passed && <button className="result-home-link text-button" onClick={onGarage}><Home size={13} />Kembali ke garasi</button>}
      </div>
      {showReview && <section className="review-section" id="answer-review"><div className="section-heading"><h2><span />BELAJAR DARI BALAPANMU</h2><p>{score} dari 10 jawaban benar</p></div><div className="review-list">{session.questions.map((question, index) => { const correct = session.answers[index] === question.answer; return <div className={`review-row ${correct ? 'correct' : 'incorrect'}`} key={index}><span className="review-number">{String(index + 1).padStart(2, '0')}</span><div className="review-explanation"><strong>{question.a} - {question.b} = {question.answer}</strong>{!correct && <p>{explainQuestion(question)}</p>}</div><span className="review-answer">Jawabanmu: <strong>{session.answers[index]}</strong></span>{correct ? <Check size={19} /> : <X size={19} />}</div>; })}</div></section>}
    </main>
  );
}

function FlagArt() {
  return <RacingFlag className="encouragement-flag" />;
}