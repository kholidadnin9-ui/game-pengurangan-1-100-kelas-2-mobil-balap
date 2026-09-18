import { ArrowRight, Check, Flag, LockKeyhole, Route, Star } from 'lucide-react';
import { LEVELS, PASS_SCORE, getStars, getUnlockedLevel, type Progress } from '../game';
import PageHeading from './PageHeading';
import { RacingFlag } from './GameArt';

interface LevelsViewProps {
  progress: Progress;
  selectedLevel: number;
  onSelect: (id: number) => void;
  onStart: (id: number) => void;
  onHelp: () => void;
}

export default function LevelsView({ progress, selectedLevel, onSelect, onStart, onHelp }: LevelsViewProps) {
  const unlocked = getUnlockedLevel(progress);
  const completed = progress.bestScores.filter(score => (score ?? 0) >= PASS_SCORE).length;
  return (
    <main className="main-container levels-page page-enter">
      <PageHeading title="LINTASAN MENUJU JUARA" description="Lima lintasan, lima tantangan. Petualangan hebatmu dimulai di sini." />
      <div className="journey-overview"><span><Route size={17} />PETUALANGAN ANGKAMU</span><p><strong>{completed}</strong> / 5 level ditaklukkan</p></div>
      <section className="journey-board" aria-label="Lima level pengurangan">
        <div className="journey-road" aria-hidden="true" />
        <div className="level-grid">
          {LEVELS.map(level => {
            const locked = level.id > unlocked;
            const score = progress.bestScores[level.id];
            const passed = (score ?? 0) >= PASS_SCORE;
            return (
              <button key={level.id} className={`level-tile ${locked ? 'locked' : ''} ${selectedLevel === level.id ? 'selected' : ''} ${passed ? 'completed' : ''}`} onClick={() => onSelect(level.id)} aria-label={`Level ${level.id + 1}: ${level.name}, pengurangan ${level.range}${locked ? ', terkunci' : score !== null ? `, rekor ${score} dari 10` : ', tersedia'}`} aria-pressed={selectedLevel === level.id}>
                <div className="level-tile-top"><span>LEVEL</span>{locked ? <LockKeyhole size={17} /> : passed ? <Check size={18} /> : <Flag size={17} />}</div>
                <span className="level-tile-number">0{level.id + 1}</span>
                <h2>{level.name}</h2><p>Pengurangan {level.range}</p>
                <div className="level-stars" aria-label={`${getStars(score ?? 0)} dari 3 bintang`}>{[1, 2, 3].map(star => <Star key={star} size={19} className={getStars(score ?? 0) >= star ? 'earned' : ''} fill={getStars(score ?? 0) >= star ? 'currentColor' : 'none'} />)}</div>
                <div className="level-tile-state">{locked ? `Selesaikan Level ${level.id}` : score !== null ? `REKOR TERBAIK: ${score}/10` : 'SIAP DIMULAI'}{!locked && <ArrowRight size={14} />}</div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="journey-selected"><div><div className="eyebrow">LEVEL {String(selectedLevel + 1).padStart(2, '0')} / PILIHANMU</div><h2 className="display-title">{LEVELS[selectedLevel].name}</h2><p>{LEVELS[selectedLevel].description}</p></div><button className="primary-button" onClick={() => onStart(selectedLevel)}><RacingFlag /><span>BALAP LEVEL {selectedLevel + 1}</span><ArrowRight size={21} /></button></section>
      <footer className="journey-footer"><p><Star size={15} />Minimal 6 jawaban benar untuk membuka level dan mobil berikutnya.</p><button className="text-button" onClick={onHelp}>Cara mendapatkan bintang <ArrowRight size={14} /></button></footer>
    </main>
  );
}