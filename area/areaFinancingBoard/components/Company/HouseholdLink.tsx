import { memo } from 'react';

import classNames from 'classnames';

import { LINK_GROUP_INFO_MEMBER } from '@/configs/routerMap';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  code: string;
  text: string;
}

const HouseholdLink = ({ code, text }: Props) => {
  const history = useHistory();
  return (
    <div
      onClick={() => {
        if (code) {
          history.push(
            urlJoin(
              dynamicLink(LINK_GROUP_INFO_MEMBER, {
                key: '',
              }),
              urlQueriesSerialize({ subid: code }),
            ),
          );
        }
      }}
    >
      <span className={classNames({ 'link pointer': code })}>{text || '-'}</span>
    </div>
  );
};

export default memo(HouseholdLink);
