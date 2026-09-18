import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Flag, Keyboard, Lightbulb, X, Zap } from 'lucide-react';
import { CARS, LEVELS, explainQuestion, getRacePositions, getScore, type Session } from '../game';
import { RaceCar } from './GameArt';

interface RaceViewProps {
  session: Session;
  countdown: number | null;
  paused: boolean;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPause: () => void;
}

function RaceTrack({ session, countdown, paused }: Pick<RaceViewProps, 'session' | 'countdown' | 'paused'>) {
  const score = getScore(session);
  const attempts = session.answers.length;
  const { playerPosition, rivalPosition } = getRacePositions(session);
  const boost = attempts > 0 && playerPosition > rivalPosition;
  const rivalBoost = attempts > 0 && rivalPosition > playerPosition;
  const leadDescription = attempts === 0 ? 'Kedua mobil siap di garis mulai.' : rivalBoost ? 'Mobil lawan melaju lebih cepat dan berada di depan mobilmu.' : 'Mobilmu memimpin balapan.';
  const buildings = [23, 48, 32, 57, 35, 28, 67, 42, 31, 50, 73, 44, 29, 53, 38, 61, 26, 47, 35, 58, 43, 31, 64, 48, 24, 55, 37, 69, 45, 32];
  return (
    <div className={`race-track ${boost || rivalBoost ? 'boosting' : ''} ${rivalBoost ? 'rival-boosting' : ''} ${paused ? 'paused' : ''}`} role="group" aria-label={`Mobilmu telah menjawab ${attempts} dari 10 soal, ${score} jawaban benar. ${leadDescription}`}>
      <div className="circuit-label"><Flag size={12} />SIRKUIT {LEVELS[session.levelId].name.toUpperCase()}</div>
      <div className="track-moon" />
      <svg className="city-skyline" viewBox="0 0 1500 95" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 84 120 44 170 62 280 23 380 69 470 42 560 70 690 30 780 60 890 24 960 49 1030 29 1150 70 1240 40 1380 72 1500 31V95H0Z" fill="#122b3a" />
        {buildings.map((height, index) => <g key={index}><rect x={index * 52} y={95 - height} width={29 + index % 3 * 5} height={height} fill="#0b1d2c" /><rect x={index * 52 + 8} y={103 - height} width="3" height="4" fill="#347380" opacity=".6" /><rect x={index * 52 + 19} y={114 - height} width="3" height="4" fill="#347380" opacity=".4" /></g>)}
      </svg>
      <div className="road-surface"><div className="road-top-rail" /><div className="road-lane-line" /><div className="road-bottom-rail" /></div>
      <div className="finish-marker"><span>FINIS</span><div /></div>
      <div className={`racer-position rival-position ${rivalBoost ? 'has-nitro' : ''}`} style={{ left: `${2 + rivalPosition * 94}%`, transform: `translateX(-${rivalPosition * 100}%)` }}>
        <span className="racer-label">{rivalBoost ? 'LAWAN MELAJU!' : 'TEMAN BALAP'}{rivalBoost && <Zap size={11} />}</span>
        {rivalBoost && <span className="nitro-flame" key={attempts} aria-hidden="true" />}
        <RaceCar color="#708797" rival />
      </div>
      <div className={`racer-position player-position ${boost ? 'has-nitro' : ''}`} style={{ left: `${2 + playerPosition * 94}%`, transform: `translateX(-${playerPosition * 100}%)` }}><span className="racer-label">KAMU{boost && <Zap size={11} />}</span>{boost && <span className="nitro-flame" key={attempts} aria-hidden="true" />}<RaceCar color={CARS[session.carId].color} /></div>
      {countdown !== null && <div className="countdown-overlay" role="status"><span>SIAPKAN SEMANGATMU</span><strong key={countdown}>{countdown === 0 ? 'MULAI!' : countdown}</strong></div>}
    </div>
  );
}

export default function RaceView({ session, countdown, paused, onAnswer, onNext, onPause }: RaceViewProps) {
  const equationRef = useRef<HTMLHeadingElement>(null);
  const question = session.questions[session.currentIndex];
  const selected = session.answers[session.currentIndex];
  const answered = selected !== undefined;
  const correct = selected === question.answer;
  const score = getScore(session);

  useEffect(() => {
    if (countdown === null && !paused) equationRef.current?.focus({ preventScroll: true });
  }, [session.currentIndex, countdown, paused]);

  return (
    <main className="main-container race-page page-enter">
      <div className="race-heading"><div className="race-heading-left"><button className="icon-button back-button" onClick={onPause} aria-label="Jeda dan kembali ke garasi"><ArrowLeft size={20} /></button><div><div className="eyebrow">LEVEL {String(session.levelId + 1).padStart(2, '0')} / 05</div><h1 className="display-title">{LEVELS[session.levelId].name}</h1></div></div><div className="race-hud"><div><span>JAWABAN BENAR</span><strong><CheckCircle2 size={18} />{score}<small>/ 10</small></strong></div><i /><div><span>SOAL</span><strong>{String(session.currentIndex + 1).padStart(2, '0')}<small>/ 10</small></strong></div></div></div>
      <RaceTrack session={session} countdown={countdown} paused={paused} />
      <div className="answer-milestones" aria-label="Progres sepuluh soal">{session.questions.map((item, index) => { const answer = session.answers[index]; return <div key={index} className={`milestone ${answer !== undefined ? answer === item.answer ? 'correct' : 'incorrect' : index === session.currentIndex ? 'current' : ''}`} aria-label={`Soal ${index + 1}: ${answer !== undefined ? answer === item.answer ? 'benar' : 'belum tepat' : 'belum dijawab'}`}>{answer !== undefined ? answer === item.answer ? <Check size={11} /> : <X size={11} /> : <span>{index + 1}</span>}</div>; })}</div>
      <section className="question-area" aria-labelledby="question-label">
        <div id="question-label" className="question-instruction">PILIH JAWABAN YANG BENAR</div>
        <h2 ref={equationRef} tabIndex={-1} className="equation" key={`${session.levelId}-${session.currentIndex}`} aria-label={`${question.a} dikurangi ${question.b}, sama dengan berapa?`}>{question.a}<span>-</span>{question.b}<span>=</span><span className="question-mark">?</span></h2>
        <div className="answer-options" role="group" aria-label="Tiga pilihan jawaban">
          {question.options.map((option, index) => <button key={`${session.currentIndex}-${option}`} className={`answer-button ${answered && option === question.answer ? 'correct' : ''} ${answered && option === selected && !correct ? 'incorrect' : ''} ${answered && option !== selected && option !== question.answer ? 'dimmed' : ''}`} onClick={() => onAnswer(option)} disabled={answered || countdown !== null || paused} aria-label={`Pilihan ${index + 1}: ${option}${answered && option === question.answer ? ', jawaban benar' : answered && option === selected ? ', jawabanmu belum tepat' : ''}`}><span className="answer-shortcut">{index + 1}</span><strong>{option}</strong>{answered && option === question.answer ? <CheckCircle2 className="answer-icon" size={23} /> : answered && option === selected ? <X className="answer-icon" size={23} /> : null}</button>)}
        </div>
        <div className={`answer-feedback ${answered ? 'visible' : ''}`} aria-live="polite" aria-atomic="true">
          {answered ? <>
            <div className={`feedback-content ${correct ? 'correct' : 'incorrect'}`}>
              <div className="feedback-heading">{correct ? <Zap size={18} /> : <Lightbulb size={18} />}<strong>{correct ? ['Hebat! Terus melaju!', 'Tepat sekali! Kamu makin jago!', 'Luar biasa! Tambah kecepatan!', 'Keren! Teruskan semangatmu!'][session.currentIndex % 4] : `Belum tepat. Jawaban yang benar adalah ${question.answer}.`}</strong></div>
              <p>{correct ? `${question.a} - ${question.b} = ${question.answer}. Satu langkah lagi menuju juara!` : explainQuestion(question)}</p>
              {!correct && <p className="race-consequence"><Zap size={13} /><span>{session.currentIndex === 9 ? 'Mobil lawan melaju lebih cepat dan finis di depan. Tetap semangat belajar!' : 'Mobil lawan melaju lebih cepat dan berada di depan. Ayo, kejar di soal berikutnya!'}</span></p>}
            </div>
            <button className="primary-button next-question-button" onClick={onNext}><span>{session.currentIndex === 9 ? 'LIHAT HASIL BALAP' : 'SOAL SELANJUTNYA'}</span><ArrowRight size={19} /></button>
          </> : <p className="unanswered-hint"><Lightbulb size={15} />Hitung pelan-pelan. Tidak ada batas waktu!</p>}
        </div>
      </section>
      <footer className="race-footer"><span><Keyboard size={15} />Pilih dengan tombol <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><span className="footer-key-separator" />Lanjut dengan <kbd>Enter</kbd></span><p>Yang penting berani mencoba.</p></footer>
    </main>
  );
}