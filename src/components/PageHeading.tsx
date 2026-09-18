import { BookOpen } from 'lucide-react';

export default function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow"><span className="speed-mark" aria-hidden="true"><i /><i /><i /></span>BELAJAR SAMBIL MELAJU</div>
        <h1 className="display-title">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="learning-label"><BookOpen size={18} /><span>PENGURANGAN <strong>1-100</strong></span><i /><span className="grade-label">KELAS 2 SD</span></div>
    </div>
  );
}