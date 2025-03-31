import withComponentMap from '@/pages/ai/components/svg/base';

import Add from './svg/add.svg?react';
import AddHover from './svg/add_hover.svg?react';
import Data from './svg/data.svg?react';
import DataHover from './svg/data_hover.svg?react';
import Finance from './svg/finance.svg?react';
import FinanceHover from './svg/finance_hover.svg?react';
import Function from './svg/function.svg?react';
import FunctionHover from './svg/function_hover.svg?react';
import Notice from './svg/notice.svg?react';
import NoticeHover from './svg/notice_hover.svg?react';

const ComponentMap = {
  add: {
    default: Add,
    hover: AddHover,
  },
  function: {
    default: Function,
    hover: FunctionHover,
  },
  data: {
    default: Data,
    hover: DataHover,
  },
  notice: {
    default: Notice,
    hover: NoticeHover,
  },
  finance: {
    default: Finance,
    hover: FinanceHover,
  },
};
const Image = withComponentMap(ComponentMap);
export default Image;
