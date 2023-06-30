import { useState, useEffect, useContext } from 'react';
//
import Routes from '@/routes';
import ThemeCustomization from '@/themes';
import ScrollTop from '@/components/layouts/ScrollTop';
import { SettingsContext } from '@/context/settings';
import LoadingPage from './pages/Loading';
import { getSettings } from './services/settings.service';
import { useNavigate } from 'react-router-dom';
import paths from './routes/path';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const navigate = useNavigate();
  const [is_loading, setLoading] = useState(true);
  const { updateValue } = useContext(SettingsContext)
  useEffect(() => {
    getSettings()
      .then((data) => {
        if (typeof data === "string") {
          let setting_data = JSON.parse(data);
          updateValue(setting_data);
          navigate(paths.dashboard);
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/setup')
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);
  return (
    <ThemeCustomization>
      <ScrollTop>
        {
          is_loading ? <LoadingPage /> :  <Routes />
        }
      </ScrollTop>
    </ThemeCustomization>
  )
}



export default App
