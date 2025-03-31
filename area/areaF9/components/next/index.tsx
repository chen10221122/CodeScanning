import { memo } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import { useSelector } from '@/pages/area/areaF9/context';
import { useTrack, useParams } from '@/pages/area/areaF9/hooks';
import { transformUrl } from '@/utils/url';

const Next = () => {
  const history = useHistory();

  const { nextNode, viewTimesOver } = useSelector((state) => state);
  const { code } = useParams();
  const [modal, contextHolder] = useModal();
  const track = useTrack();

  const handleJump = () => {
    track(nextNode, 'pageDown');
    if (nextNode?.noAccess && !viewTimesOver) {
      modal.open({
        permission: {
          title: '权限不足',
          description: `成为正式用户即可查看${nextNode?.branchShowName}`,
          exampleImageUrl: transformUrl(nextNode?.noAccessDes.example),
          showVipIcon: true,
        },
      });
      return;
    }
    if (nextNode?.url && code) {
      history.push(`/${code}${nextNode.url}`);
      document.querySelector(`.sub-menu-${nextNode?.rootBranchID} .ant-menu-submenu-title`)?.scrollIntoView(true);
    }
  };

  return (
    <NextStyled className="area-next">
      {nextNode ? (
        <>
          <span>点击切换至</span>
          <span className="jump" onClick={handleJump}>
            {nextNode.title}
          </span>
        </>
      ) : (
        <span>到底了，换个地区看看吧</span>
      )}

      {contextHolder}
    </NextStyled>
  );
};

export default memo(Next);

const NextStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  min-height: 48px;
  background: #f6f6f6;
  font-size: 13px;
  color: #9d9fa0;
  .jump {
    cursor: pointer;
    color: #0171f6;
    &:hover {
      text-decoration: underline;
    }
  }
  > span {
    display: flex;
    align-items: center;
    line-height: 13px;
    transform: translateY(1px);
  }
`;
