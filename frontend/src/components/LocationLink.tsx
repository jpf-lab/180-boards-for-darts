import type { TournamentLocation } from '../types/Tournament.ts';
import { generateGoogleMapsLink } from '../utils/locationHelper.ts';
import LocationBlock from './LocationBlock.tsx';

type LocationLinkProps = TournamentLocation;

export default function LocationLink(props: LocationLinkProps) {
  const location = props.city && props.street;

  return (
    <div>
      {location && (
        <a href={generateGoogleMapsLink(location)} target={'_blank'}>
          <LocationBlock {...props} />
        </a>
      )}
      {!location && <LocationBlock {...props} />}
    </div>
  );
}
