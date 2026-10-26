import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/mapcn-marker-content";
import { Gem, MapPin } from "lucide-react";

const boutiqueLocations = [
  {
    id: 1,
    name: "Khalil & Sons Jewellers Flagship Atelier",
    address: "Murshid Sunaar Tower, Saddar, Karachi",
    lng: 67.025203,
    lat: 24.859513
  }
];

export function MarkerContentDemo() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      <div className="h-[420px] w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-sm">
        <Map center={[67.025203, 24.859513]} zoom={15}>
          {boutiqueLocations.map((location) => (
            <MapMarker key={location.id} longitude={location.lng} latitude={location.lat}>
              <MarkerContent>
                <div className="size-8 rounded-full border-2 border-white bg-amber-600 shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                  <Gem className="size-4" />
                </div>
              </MarkerContent>
              <MarkerTooltip>
                <div className="text-left py-1">
                  <p className="font-semibold text-xs text-amber-300">{location.name}</p>
                  <p className="text-[10px] text-neutral-300">{location.address}</p>
                </div>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}

export default function MarkerContentDefaultDemo() {
  return <MarkerContentDemo />;
}
