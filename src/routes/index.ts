import { useRoutes } from 'react-router-dom';

// project import
import OtherRoutes from './other.routes';
import MainRoutes from './main.routes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, OtherRoutes]);
}
