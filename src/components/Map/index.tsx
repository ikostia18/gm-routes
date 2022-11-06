import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  Circle,
  DirectionsRenderer,
} from '@react-google-maps/api';
import Places from '../Places';
import Distance from '../Distance';
import '../../styles/global.css';
import { CAR_ICON, FLAG_ICON, MAP_ID, OK } from '../../consts';

type LatLngType = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type DirectionsSteps = google.maps.DirectionsStep;
type MapOptions = google.maps.MapOptions;

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  draggable: true,
};

const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: '#FBC02D',
  fillColor: '#FBC02D',
};

const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: '#FF5252',
  fillColor: '#FF5252',
};

const Map = () => {
  const [origin, setOrigin] = useState<LatLngType>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const [steps, setSteps] = useState<DirectionsSteps[]>();
  const [stepsToDisplay, setStepsToDisplay] = useState<LatLngType[]>();
  const [curStep, setCurStep] = useState<LatLngType>();
  const [intervalIndex, setIntervalIndex] = useState(0);

  const [isDestinationSelected, setIsDestinationSelected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const mapRef = useRef<GoogleMap | null>();
  const center = useMemo<LatLngType>(() => ({ lat: 32, lng: 35 }), []);

  const options = useMemo<MapOptions>(
    () => ({
      mapId: MAP_ID,
      disableDoubleClickZoom: true,
    }),
    []
  );

  const generateDestinations = (position: LatLngType) => {
    const destinations: Array<LatLngType> = [];
    for (let i = 0; i < 15; i++) {
      const direction = Math.random() < 0.5 ? -2 : 2;
      destinations.push({
        lat: position.lat + Math.random() / direction,
        lng: position.lng + Math.random() / direction,
      });
    }
    return destinations;
  };

  const destinations = useMemo(() => {
    if (origin) {
      return generateDestinations(origin);
    }
  }, [origin]);

  const fetchDirections = (dest: LatLngType) => {
    if (!origin) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === OK && result) {
          setDirections(result);
          setSteps(result.routes[0].legs[0].steps);
        }
      }
    );
  };

  const handleDestinationSelected = (dest: google.maps.LatLngLiteral) => {
    setIsDestinationSelected(true);
    fetchDirections(dest);
  };

  const handleClearButton = () => {
    setIsDestinationSelected(false);
    setIsSimulating(false);

    if (origin) {
      mapRef.current?.panTo(origin);
    }
  };

  const handleSimulation = () => {
    let gpsSim: LatLngType[] = [];
    if (steps) {
      for (let i = 0; i < steps.length; i++) {
        gpsSim[i] = { lat: 0, lng: 0 };
        gpsSim[i].lat = steps[i].end_location.lat();
        gpsSim[i].lng = steps[i].end_location.lng();
        console.log('Distance: ' + steps[i].distance?.text);
        console.log('Duration: ' + steps[i].duration?.text);
      }
    }
    setStepsToDisplay(gpsSim);
    setIsSimulating(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isSimulating) {
      interval = setInterval(updateStep, 1000);
    } else if (!isSimulating) {
      // @ts-ignore
      clearInterval(interval);
      setIntervalIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const updateStep = () => {
    if (stepsToDisplay && intervalIndex < stepsToDisplay.length) {
      setIntervalIndex((prev) => prev + 1);
      setCurStep(stepsToDisplay[intervalIndex]);
    }
  };

  const onLoad = useCallback((map: GoogleMap) => (mapRef.current = map), []);

  const onUnmount = () => {
    mapRef.current = null;
  };

  console.log(stepsToDisplay);

  return (
    <div className="container">
      <div className="controls">
        <h1>Routs</h1>

        {!origin && (
          <p className="info-text">Search for a location to navigate from</p>
        )}

        <Places
          setOffice={(position) => {
            setOrigin(position);
            mapRef.current?.panTo(position);
          }}
        />

        {!origin && (
          <p className="info-text">
            You will receive 15 random optional POI to drive
          </p>
        )}

        {isDestinationSelected && (
          <div className="clear-button">
            <button onClick={handleClearButton}>
              Clear selected destination
            </button>
          </div>
        )}

        {isDestinationSelected && (
          <div className="demo-button">
            <button onClick={handleSimulation}>Simulate driving</button>
          </div>
        )}

        {/* There is a bug with first selection from the left list.
        The first selection has to be on the map and afterwards click on the list should work */}
        {!isDestinationSelected && destinations && (
          <div className="destinations-panel-wrapper">
            {destinations.map((dest, index) => (
              <div
                key={dest.lat}
                className="destination-gps"
                onClick={() => handleDestinationSelected(dest)}
              >
                Destination #{index + 1}: lat:
                {dest.lat.toFixed(2)}
                &nbsp; lng:
                {dest.lng.toFixed(2)}
              </div>
            ))}
          </div>
        )}

        {isDestinationSelected && directions && (
          <Distance leg={directions.routes[0].legs[0]} />
        )}

        {/* TEMPORARY CODE, DUE A BUG WHICH STUCK THE CAR ICON ON FIRST POINT (INTERVAL IMPLEMENTATION ISSUES) */}
        {isDestinationSelected && isSimulating && (
          <div className="temp-section">
            Temporary indication (GPS) for car moving:
            {stepsToDisplay &&
            intervalIndex < stepsToDisplay.length &&
            stepsToDisplay[intervalIndex].lat ? (
              <>
                <div>Lat:{stepsToDisplay[intervalIndex].lat.toFixed(2)}</div>
                <div>Lng:{stepsToDisplay[intervalIndex].lng.toFixed(2)}</div>
              </>
            ) : (
              <div>Simulation is over</div>
            )}
          </div>
        )}
      </div>

      <div className="map">
        <GoogleMap
          zoom={8}
          center={center}
          options={options}
          mapContainerClassName="map-container"
          // @ts-ignore
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {isDestinationSelected && directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 100,
                  strokeColor: '#1976D2',
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {/* {isSimulating && curStep && ( */}
          {isSimulating && curStep && stepsToDisplay && (
            <Marker
              icon={{
                url: CAR_ICON,
                scaledSize: new google.maps.Size(40, 40),
              }}
              position={curStep}
              animation={google.maps.Animation.DROP}
            />
          )}

          {origin && (
            <>
              <Marker
                icon={{
                  url: FLAG_ICON,
                  scaledSize: new google.maps.Size(100, 100),
                }}
                position={origin}
              />

              {destinations &&
                destinations.map((dest) => (
                  <Marker
                    key={dest.lat}
                    position={dest}
                    onClick={() => handleDestinationSelected(dest)}
                    zIndex={99999}
                  />
                ))}

              {/* It was an initial effort to render POI within these areas */}
              <Circle center={origin} radius={10000} options={middleOptions} />
              <Circle center={origin} radius={20000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
