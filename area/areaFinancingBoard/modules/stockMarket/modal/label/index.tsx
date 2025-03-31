import cn from 'classnames';

import S from './style.module.less';
export enum LabelType {
  unListed, // 退市
  TopCounty, // 百强县
}
interface LabelProps {
  labelText: string;
  type?: LabelType;
}
const Label = ({ labelText, type }: LabelProps) => {
  return <div className={cn(S.wrapper, { [S.topCounty]: type === LabelType.TopCounty })}>{labelText}</div>;
};
export default Label;
