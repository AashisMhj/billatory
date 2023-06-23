import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //
interface Props{
  children?: ReactNode
}
const ScrollTop = ({ children }:Props) => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return <>{children}</> || <></>;
};


export default ScrollTop;
