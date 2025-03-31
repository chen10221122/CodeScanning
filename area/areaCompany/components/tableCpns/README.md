# Table Cpn

- `openOrDownloadFiles` 打开表格外链文件

- `textWrap` 文字折行显示，最大三行超出显示`...` (默认三行，不够可以把`clamp`改成可选参数传入)

- `showDetails` 查看弹窗的表格组件，点击触发 `onTrigger` 事件，外部接受，默认显示文字为查看

- `linkToF9` 参数`code`传递空，字段置灰不可跳转，`type` 必传 `'co' | 'company'`,搜索高亮外层包一个 `highlight` 函数
 
- `popoverArrow` 支持 `ReactNode | string` 类型`content`，样式默认最高 `196` 超出滚动，`data`为空则不显示。
