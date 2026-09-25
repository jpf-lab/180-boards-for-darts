import type { TournamentLocation } from '../types/Tournament.ts';
import { generateGoogleMapsLink } from '../utils/locationHelper.ts';
import LocationBlock, { type LocationBlockVariant } from './LocationBlock.tsx';

type LocationLinkProps = TournamentLocation & {
  variant?: LocationBlockVariant;
};

export default function LocationLink(props: Readonly<LocationLinkProps>) {
  const location = props.city && props.street;

  const linkString =
    props.street + ' ' + (props.number || '') + ',' + (props.postalcode || '') + ' ' + props.city;

  return (
    <div>
      {location && (
        <a href={generateGoogleMapsLink(linkString)} target={'_blank'} className={'underline'}>
          <LocationBlock {...props} />
        </a>
      )}
      {!location && <LocationBlock {...props} />}
    </div>
  );
}
