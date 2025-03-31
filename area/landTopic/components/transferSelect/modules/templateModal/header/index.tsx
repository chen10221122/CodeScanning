import { memo, FC } from 'react';

import styled from 'styled-components';

// import AddHeader from './addHeader';
// import EditHeader from './editHeader';
import UpdateHeader from './updateHeader';

interface Props {
  isAddModal: boolean;
  setNewPlanName: React.Dispatch<React.SetStateAction<string>>;
}

const Header: FC<Props> = ({ isAddModal, setNewPlanName }) => {
  return (
    <HeaderContainer isAddModal={isAddModal}>
      {/* {isAddModal ? <AddHeader setNewPlanName={setNewPlanName} /> : <EditHeader />} */}
      <UpdateHeader setNewPlanName={setNewPlanName} isAddModal={isAddModal} />
    </HeaderContainer>
  );
};
export default memo(Header);

const HeaderContainer = styled.div<{ isAddModal: boolean }>`
  /* height: ${({ isAddModal }) => (isAddModal ? '58px' : '48px')};
  padding: ${({ isAddModal }) => (isAddModal ? '13px 24px 12px' : '12px 24px 11px')};
  border-bottom: 1px solid #f0f0f0; */
`;
