import { LITER_COST_KM } from "../../consts";

interface DistanceProps {
  leg: google.maps.DirectionsLeg;
}

const Distance = (props: DistanceProps) => {
  const leg = props.leg;
  if (!leg.distance || !leg.duration) return null;

  const cost = Math.floor(leg.distance.value / 1000) * LITER_COST_KM;

  return (
    <>
      <div className="distance-wrapper">
        <div className="distance-info">
          <div>You're going to travel from {leg.start_address}:</div>
          <div>GPS coordinates:</div>
          <div> lat - {leg.start_location.lat().toFixed(2)}</div>
          <div>lng - {leg.start_location.lng().toFixed(2)}</div>
        </div>

        <div className="distance-info">
          <div>The destination is {leg.end_address}.</div>
          <div>GPS coordinates:</div>
          <div>lat - {leg.end_location.lat().toFixed(2)}</div>
          <div>lng - {leg.end_location.lng().toFixed(2)}</div>
        </div>
        <div className="distance-info">
          The destination is {leg.distance.text} from your location.
        </div>
        <div className="distance-info">
          It would cost (5$ per liter): {cost}$.
        </div>
        <div className="distance-info">It would take: {leg.duration.text}</div>
      </div>
    </>
  );
};

export default Distance;
