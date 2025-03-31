import { Screen } from '@/components/screen';

import S from './style.module.less';

export default function ScreenForm({ screenConfig, screenValues, handleMenuChange }: any) {
  return (
    <div className={S.container}>
      {screenConfig.map((o: any, i: number) => {
        return (
          <div key={i} className={S.itemWrapper}>
            <div className={S.label}>{o.label}:</div>
            <div>
              <Screen
                values={[screenValues[i]]}
                options={[o]}
                onChange={(selectedData: Record<string, any>[], allData: Record<string, any>[]) => {
                  handleMenuChange(allData, i);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
