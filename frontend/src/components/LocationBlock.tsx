import type { TournamentLocation } from '../types/Tournament.ts';

type LocationBlockProps = TournamentLocation;

export default function LocationBlock(props: LocationBlockProps) {
  const locationAvailable = props.city && props.street;

  return (
    <>
      {props.name && <span>{props.name}</span>}
      {props.owner && <span>{props.owner}</span>}
      {props.contactPhone && <span>{props.contactPhone}</span>}
      {props.contactMail && <span>{props.contactMail}</span>}
      {locationAvailable && (
        <>
          {props.street && (
            <span>
              {props.street || 'street not found'} {props.number || 'number not found'}
            </span>
          )}
          {props.city ||
            (props.postalcode && (
              <span>
                {props.postalcode || 'postalcode not found'} {props.city || 'city not found'}
              </span>
            ))}
        </>
      )}
      {!locationAvailable && (
        <>
          <span>No location data available</span>
        </>
      )}
    </>
  );
}
