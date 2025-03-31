// function jsonTo dom
interface IFunctionJson {
  area: string;
  company: string;
  time: string;
  params: any;
  field: any;
  specialSubject: string;
  topThreeSubject: string;
  answerFlag: string;
  recommendReason: string;
}
export const functionJsonToDom = (json: IFunctionJson) => {
  if (!json) return null;
  const { area, company, time, params, field, specialSubject, topThreeSubject, answerFlag, recommendReason } = json;
  return (
    <>
      {answerFlag === '0' ? <div>没有找到相关专题，以下为您可能喜欢的内容。</div> : null}
      <table>
        <tbody>
          <tr>
            <th>专题：</th>
            <td>{specialSubject}</td>
          </tr>
          <tr>
            <th>参数：</th>
            <td>{JSON.stringify(params)}</td>
          </tr>
          <tr>
            <th>字段：</th>
            <td>{JSON.stringify(field)}</td>
          </tr>
          <tr>
            <th>地区：</th>
            <td>{JSON.stringify(area)}</td>
          </tr>
          <tr>
            <th>公司：</th>
            <td>{company}</td>
          </tr>
          <tr>
            <th>时间：</th>
            <td>{time}</td>
          </tr>
          <tr>
            <th>前三匹配的专题：</th>
            <td>{JSON.stringify(topThreeSubject)}</td>
          </tr>
          <tr>
            <th>推荐理由：</th>
            <td>{recommendReason}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

// 解析json
export const jsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
};
