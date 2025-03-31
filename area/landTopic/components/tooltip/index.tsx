import { CSSProperties, FC, memo, useMemo } from 'react';

import { Tooltip as OriginalTooltip, TooltipProps, Image } from '@dzh/components';

export const OVERLAY_STYLE = { maxWidth: '410px' };
export const OVERLAY_INNER_STYLE = {
  padding: '10px 12px',
  color: '#434343',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '20px',
};
const IMAGE_STYLE = { marginLeft: '4px', marginBottom: '2px', cursor: 'pointer' };

type Props = TooltipProps & {
  innerStyle?: CSSProperties;
};

const Tooltip: FC<Props> = ({ innerStyle, ...restProps }) => {
  const imageStyle = useMemo(() => ({ ...IMAGE_STYLE, ...innerStyle }), [innerStyle]);
  return (
    <OriginalTooltip
      placement="bottomLeft"
      color="#fff"
      arrowPointAtCenter
      overlayStyle={OVERLAY_STYLE}
      overlayInnerStyle={OVERLAY_INNER_STYLE}
      {...restProps}
    >
      <Image size={12} style={imageStyle} src={require('@/assets/images/common/help.png')} alt="" />
    </OriginalTooltip>
  );
};

export default memo(Tooltip);
