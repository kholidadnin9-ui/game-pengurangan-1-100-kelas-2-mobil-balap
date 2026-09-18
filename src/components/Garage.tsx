import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Flag, Lightbulb, ListChecks, LockKeyhole, MousePointer2, Zap } from 'lucide-react';
import { CARS, LEVELS, getUnlockedLevel, PASS_SCORE, type Progress } from '../game';
import { Coin, RacingFlag } from './GameArt';
import PageHeading from './PageHeading';

interface GarageProps {
  progress: Progress;
  selectedLevel: number;
  previewCar: number;
  onPreview: (id: number) => void;
  onSelectLevel: (id: number) => void;
  onStart: (id: number) => void;
  onLevels: () => void;
  storageAvailable: boolean;
}

export default function Garage({ progress, selectedLevel, previewCar, onPreview, onSelectLevel, onStart, onLevels, storageAvailable }: GarageProps) {
  const car = CARS[previewCar];
  const level = LEVELS[selectedLevel];
  const unlocked = getUnlockedLevel(progress);
  const locked = previewCar > unlocked;
  const best = progress.bestScores[selectedLevel] ?? 0;
  const remainingReward = (10 - best) * 10 + (best < PASS_SCORE ? 50 : 0);

  return (
    <main className="main-container garage-page page-enter">
      <PageHeading title="GARASI PEMBALAP" description="Pilih mobil andalanmu. Taklukkan soal. Jadilah juara!" />

      <section className="garage-stage" aria-label="Garasi dan persiapan balapan">
        <div className="car-showcase">
          <div className="showcase-glow" />
          <img key={car.image} className="hero-car-image" src={car.image} alt={`Mobil sport ${car.name} di atas podium berlampu biru neon`} fetchPriority="high" />
          <div className="car-name-header" key={car.name}>
            <div className="car-series"><span>{String(car.id + 1).padStart(2, '0')}</span><i />{car.series.toUpperCase()} SERIES</div>
            <h2 className="display-title">{car.name.toUpperCase()}<span className="name-stripes" aria-hidden="true">//</span></h2>
            <p>{locked ? `Selesaikan Level ${previewCar} untuk membuka mobil ini.` : car.description}</p>
          </div>
          <div className={`showcase-status ${locked ? 'is-locked' : ''}`}>
            {locked ? <LockKeyhole size={13} /> : <Check size={14} />}
            <span>{locked ? 'TERKUNCI' : 'MOBIL PILIHANMU'}</span>
          </div>
          <button className="car-arrow previous" aria-label="Lihat mobil sebelumnya" onClick={() => onPreview((previewCar + 4) % 5)}><ChevronLeft size={24} /></button>
          <button className="car-arrow next" aria-label="Lihat mobil berikutnya" onClick={() => onPreview((previewCar + 1) % 5)}><ChevronRight size={24} /></button>
          <div className="car-pagination" aria-label="Pratinjau mobil">
            {CARS.map(item => <button key={item.id} className={item.id === previewCar ? 'active' : ''} aria-label={`Lihat ${item.name}`} aria-pressed={item.id === previewCar} onClick={() => onPreview(item.id)} />)}
          </div>
        </div>

        <aside className="mission-panel">
          <div className="mission-caption"><Flag size={14} /><span>MISI BALAPMU</span><span className="live-dot" /></div>
          <div className="mission-title-row"><span className="mission-level">LEVEL {String(selectedLevel + 1).padStart(2, '0')}</span><span className="mission-fraction">{String(selectedLevel + 1).padStart(2, '0')} <span>/ 05</span></span></div>
          <h2 className="mission-name">{level.name}</h2>
          <p className="mission-description">Taklukkan pengurangan {level.range}!</p>
          <div className="mission-details">
            <div><ListChecks size={16} /><span>Jumlah soal</span><strong>10 soal</strong></div>
            <div><MousePointer2 size={16} /><span>Pilihan jawaban</span><strong>3 opsi</strong></div>
            <div><Coin /><span>Hadiah tersedia</span><strong className="gold-text">{remainingReward} koin</strong></div>
          </div>
          <div className="level-selector-heading"><span>PILIH LEVEL</span><button onClick={onLevels} aria-label="Lihat semua level">Lihat semua <ArrowUpRight size={12} /></button></div>
          <div className="level-selector" aria-label="Pilih level balapan">
            {LEVELS.map(item => (
              <button key={item.id} className={`level-select-button ${item.id === selectedLevel ? 'selected' : ''} ${item.id > unlocked ? 'locked' : ''}`} onClick={() => onSelectLevel(item.id)} aria-label={`Level ${item.id + 1}, ${item.name}${item.id > unlocked ? ', terkunci' : ''}`} aria-pressed={item.id === selectedLevel}>
                <span>{item.id + 1}</span>{item.id > unlocked ? <LockKeyhole size={10} /> : (progress.bestScores[item.id] ?? 0) >= PASS_SCORE ? <Check size={11} /> : null}
              </button>
            ))}
          </div>
          <button className="primary-button start-button" onClick={() => onStart(selectedLevel)}><RacingFlag /><span>MULAI BALAP</span><ChevronRight size={23} /></button>
          <div className="mission-footnote"><Zap size={12} />{locked ? `Balapan memakai ${CARS[progress.equippedCar].name}.` : 'Jawab benar. Melaju lebih cepat.'}</div>
        </aside>
      </section>

      <section className="car-collection" aria-labelledby="car-collection-title">
        <div className="section-heading"><h2 id="car-collection-title"><span aria-hidden="true" />PILIH MOBILMU</h2><p><strong>{unlocked + 1}</strong> / 5 mobil terbuka</p></div>
        <div className="car-grid">
          {CARS.map(item => {
            const isLocked = item.id > unlocked;
            const equipped = item.id === progress.equippedCar;
            return (
              <button key={item.id} className={`car-card ${item.id === previewCar ? 'selected' : ''} ${isLocked ? 'locked' : ''}`} onClick={() => onPreview(item.id)} aria-label={`${item.name}, ${isLocked ? `pratinjau mobil, terbuka setelah Level ${item.id}` : equipped ? 'sedang dipakai' : 'pilih mobil'}`} aria-pressed={item.id === previewCar} style={{ animationDelay: `${item.id * 55}ms` }}>
                <img src={item.image} alt={`Mobil ${item.name}`} loading="eager" />
                <div className="car-card-shade" />
                <div className="car-card-top">{equipped ? <span className="equipped-label"><Check size={10} />DIPAKAI</span> : <span className="car-index">0{item.id + 1}</span>}{isLocked && <LockKeyhole size={13} />}</div>
                <div className="car-card-info"><div><h3>{item.name}</h3><span>{item.series}</span></div><p>{isLocked ? <><LockKeyhole size={10} /> Selesaikan Level {item.id}</> : <><Check size={11} /> {item.id === 0 ? 'Mobil pertamamu' : 'Siap melaju'}</>}</p></div>
                {item.id === previewCar && <span className="card-selection-corner"><Check size={10} /></span>}
              </button>
            );
          })}
        </div>
      </section>

      <footer className="garage-footer"><p><Lightbulb size={15} /><span>{storageAvailable ? 'Pembalap hebat tidak takut salah. Ayo, coba dan belajar lagi!' : 'Penyimpanan perangkat tidak tersedia. Progres hanya tersimpan selama sesi ini.'}</span></p><span className="keyboard-hint">Tekan <kbd>Enter</kbd> untuk mulai balap</span></footer>
    </main>
  );
}