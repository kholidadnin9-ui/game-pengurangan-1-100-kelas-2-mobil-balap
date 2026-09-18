import { CircleHelp, Gauge, Gem, Route, Settings2, Volume2, VolumeX } from 'lucide-react';
import { Coin, RacingFlag } from './GameArt';
import type { Progress, Screen } from '../game';

interface HeaderProps {
  progress: Progress;
  screen: Screen;
  onNavigate: (screen: 'garage' | 'levels') => void;
  onHelp: () => void;
  onSettings: () => void;
  onSound: () => void;
}

export default function Header({ progress, screen, onNavigate, onHelp, onSettings, onSound }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => onNavigate('garage')} aria-label="Race Math, created by: Widodo guru sd, kembali ke garasi">
          <RacingFlag className="brand-flag" />
          <span className="brand-lockup">
            <span className="brand-name">RACE <span>MATH</span><i /></span>
            <span className="brand-credit">created by: Widodo guru sd</span>
            <span className="brand-tagline">HITUNG CEPAT. MELAJU HEBAT.</span>
          </span>
        </button>
        <nav className="main-nav" aria-label="Navigasi utama">
          <button className={screen === 'garage' ? 'nav-item active' : 'nav-item'} aria-current={screen === 'garage' ? 'page' : undefined} onClick={() => onNavigate('garage')}><Gauge size={17} />Garasi</button>
          <button className={screen === 'levels' ? 'nav-item active' : 'nav-item'} aria-current={screen === 'levels' ? 'page' : undefined} onClick={() => onNavigate('levels')}><Route size={17} />Pilih Level</button>
          <button className="nav-item" onClick={onHelp}><CircleHelp size={17} />Cara Bermain</button>
        </nav>
        <div className="header-controls">
          <div className="utility-controls">
            <button className="icon-button" onClick={onSound} aria-label={progress.sound ? 'Matikan suara' : 'Nyalakan suara'} title={progress.sound ? 'Matikan suara' : 'Nyalakan suara'} aria-pressed={progress.sound}>
              {progress.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="icon-button" onClick={onSettings} aria-label="Buka pengaturan" title="Pengaturan"><Settings2 size={18} /></button>
          </div>
          <div className="header-divider" />
          <div className="currency-group">
            <div className="currency" aria-label={`${progress.coins} koin`} title="Koin dari jawaban benar"><Coin /><span>{progress.coins.toLocaleString('id-ID')}</span></div>
            <div className="currency" aria-label={`${progress.diamonds} berlian`} title="Berlian dari bintang level"><Gem className="gem-icon" size={22} /><span>{progress.diamonds.toLocaleString('id-ID')}</span></div>
          </div>
        </div>
      </div>
    </header>
  );
}