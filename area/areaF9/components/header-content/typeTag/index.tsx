import dayjs from 'dayjs';
import styled from 'styled-components';

import Tag from '@/pages/area/areaF9/components/header-content/Tag';
import { useTypeTag } from '@/pages/area/areaF9/components/header-content/typeTag/useTypeTag';

const TypeTag = ({ data }: { data: any }) => {
  const { list } = useTypeTag({ data });

  return list?.length > 0 ? (
    <Container>
      {list?.map((item: any, index: number) => (
        <Tag
          data={item.data}
          title={item.title}
          tabConfig={item.children}
          condition={{ condition: item?.condition, module_type: 'area_circle_detail' }}
          noPopver={item?.noPopver}
          filename={`${item.title}_GDP_${dayjs().format('YYYYMMDD')}`}
        />
      ))}
    </Container>
  ) : null;
};
export default TypeTag;
const Container = styled.div`
  display: flex;
  align-items: center;
`;
