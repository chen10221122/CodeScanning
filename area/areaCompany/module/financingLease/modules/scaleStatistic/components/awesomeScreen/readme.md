
### Conf

```typescript

interface IScreen {
  /** 筛选是否改变 */
  changeFlag: boolean; 

  /** 是否显示label，如果两个筛选在一起，只显示一个label，那么第二个筛选的label不填 */
  label?: string;

  /** 对应字段的key/name */
  key: string;

  /** 微调筛选项样式 */
  style: React.CSSProperties;

  /** 该筛选项的配置，完全兼容screen */
  itemConf: Options;

  /** 受控数据，配置同screen的受控 */
  values: [];


}


```