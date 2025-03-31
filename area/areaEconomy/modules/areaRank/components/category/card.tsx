import { formatNumber } from '@/utils/format';

import S from './styles.module.less';
interface CardProps {
  activeCategory?: string;
  data: { name: string; number: number; code: string; isInnerType?: string };
  onClick: (v: string) => void;
}
const Card = ({ activeCategory, data, onClick }: CardProps) => {
  return (
    <div
      className={activeCategory === data.code ? S.active : ''}
      onClick={() => {
        onClick(data.code);
      }}
    >
      {data.isInnerType === '1' ? <div className={S.label} /> : null}
      <div className={S.content}>
        <div>{formatNumber(data.number, 0)}</div>
        <div title={data.name}>{data.name}</div>
      </div>
    </div>
  );
};
export default Card;
