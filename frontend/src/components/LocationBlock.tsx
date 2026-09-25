import type { TournamentLocation } from '../types/Tournament.ts';

export type LocationBlockVariant = 'default' | 'name';

type LocationBlockProps = TournamentLocation & {
  variant?: LocationBlockVariant;
};

export default function LocationBlock(props: Readonly<LocationBlockProps>) {
  const locationAvailable = props.city && props.street;

  const nameOnly = props.variant === 'name';

  return (
    <>
      {props.name ? <span>{props.name}</span> : 'Name not found'}

      {!nameOnly && props.owner && <span>{props.owner}</span>}
      {!nameOnly && props.contactPhone && <span>{props.contactPhone}</span>}
      {!nameOnly && props.contactMail && <span>{props.contactMail}</span>}
      {!nameOnly && locationAvailable && (
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
      {!nameOnly && !locationAvailable && <span>No location data available</span>}
    </>
  );
}
