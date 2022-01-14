import store from '@/store';
import { useEffect } from 'react';

export default function Home({ history }) {
  const [userState] = store.useModel('user');
  const { menuList } = (userState?.userInfo as any) || {};
  useEffect(() => {
    if (menuList) {
      history.replace(menuList[0].url);
    }
  }, [menuList, history]);

  return <div>home</div>;
}
