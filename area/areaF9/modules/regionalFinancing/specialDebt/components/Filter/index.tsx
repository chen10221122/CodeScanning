import { useMemo } from 'react';

import { Radio } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { useParams } from '@pages/area/areaF9/hooks';

import { Row } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen } from '@/components/screen';
import * as S from '@/pages/area/areaF9/style';
import { isCounty } from '@/pages/area/areaF9/utils';

export const CONTAINS = '1'; // 含下属辖区
export const SELFS = '0'; // 本级

export default function Filter({
  condition,
  itemCondition,
  menuConfig = [],
  menuChange,
  handleRadioChange,
  levelData,
  hash,
}: any) {
  const { code } = useParams();

  // 判断是否是区县
  const isCodeCounty = useMemo(() => {
    return isCounty(code);
  }, [code]);

  return (
    <Container>
      <S.Container style={{ paddingBottom: 0 }}>
        <div className="screen-wrap custom-area-economy-screen-wrap" id="areaEconomySpecialDebtProjectsScreenContainer">
          <Row className="select-wrap">
            <div key={hash} className="select-right">
              <Radio.Group
                key={`${levelData?.level}${isCodeCounty}`} // 加个key，让defaultValue准确生效
                onChange={handleRadioChange}
                defaultValue={isCodeCounty ? SELFS : CONTAINS}
              >
                {!isCodeCounty ? <Radio value={CONTAINS}>含下属辖区</Radio> : null}
                <Radio value={SELFS}>本级</Radio>
              </Radio.Group>
              {/* <div className="area-menu" style={{ marginRight: '8px' }}> */}
              <Screen
                key={code}
                options={menuConfig}
                onChange={menuChange}
                getPopContainer={() =>
                  document.getElementById('areaEconomySpecialDebtProjectsScreenContainer') || document.body
                }
              />
              {/* </div> */}
              <ExportDoc
                condition={{
                  module_type: 'area_economy_special_bond',
                  underlingFlag: true,
                  ...condition,
                  ...itemCondition,
                }}
                filename={`专项债项目${dayjs(new Date()).format('YYYYMMDD')}`}
                style={{
                  marginLeft: '24px',
                }}
              />
            </div>
          </Row>
        </div>
      </S.Container>
    </Container>
  );
}

const Container = styled.div`
  .custom-area-economy-screen-wrap {
  }
`;
