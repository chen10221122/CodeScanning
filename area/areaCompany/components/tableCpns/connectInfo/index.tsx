import { useCreation } from 'ahooks';
import { isArray } from 'lodash';

type TProps = {
  data?: string[];
  placeHolder?: string;
};

export default ({ data, placeHolder }: TProps) => {
  return useCreation(() => {
    if (isArray(data)) {
      const _str = data.filter(Boolean).join(placeHolder ?? '-');
      return <>{_str}</>;
    } else {
      return <>-</>;
    }
  }, [data, placeHolder]);
};
