import './App.css';
import { useLoadScript } from '@react-google-maps/api';
import Map from './components/Map';
import { LOADING } from './consts';

const libraries: (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[] = ['places'];
function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  if (!isLoaded) return <div>{LOADING}</div>;
  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
