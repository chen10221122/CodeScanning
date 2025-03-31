import { Screen } from '@/components/screen';

import styles from './style.module.less';

export default function ScreenForm({ screenConfig, screenValues, handleMenuChange }: any) {
  return (
    <div className={styles.container}>
      {screenConfig.map((o: any, i: number) => {
        return (
          <div key={i} className={styles.itemWrapper}>
            <div className={styles.label}>{o.label}:</div>
            <div className={styles.selectWrapper}>
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
