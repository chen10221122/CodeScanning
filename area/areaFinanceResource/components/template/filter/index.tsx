import AreaForm from '@pages/area/areaFinanceResource/components/areaForm';

import { Screen } from '@/components/screen';

import S from './style.module.less';

export default function Filter({ screenConfig, handleScreen, value, areaFormConfig, areaLevelOption, areaValue }: any) {
  return (
    <div className={S.filterWrapper}>
      {areaFormConfig && (
        <AreaForm
          areaData={areaFormConfig[0]}
          onChange={handleScreen}
          areaLevelOption={areaLevelOption}
          areaValue={areaValue}
        />
      )}

      <div id="templateFilterScreen">
        <Screen options={screenConfig} onChange={handleScreen} values={value} />
      </div>
    </div>
  );
}
