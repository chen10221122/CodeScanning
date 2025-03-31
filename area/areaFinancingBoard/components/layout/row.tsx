import { Row } from '../moduleWrapper/styles';

const Index = ({ children, isHide }: { children: any; isHide?: boolean }) => {
  return isHide ? null : <Row>{children}</Row>;
};

export default Index;
