import { Provider, RefProvider } from '@/pages/area/areaF9/context';

import Main from './main';

const AreaF9 = () => {
  return (
    <Provider>
      <RefProvider>
        <Main />
      </RefProvider>
    </Provider>
  );
};

export default AreaF9;
