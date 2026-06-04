'use client';

import { useEffect, useRef, useState } from 'react';
import type { Day } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/colors';

const STOP_COORDS: Record<string, [number, number]> = {
  'd1-s1': [-3.3725, 55.9501],
  'd1-s2': [-3.1941, 55.9521],
  'd1-s3': [-3.1896, 55.9503],
  'd1-s4': [-3.1949, 55.9494],
  'd2-s1': [-3.1995, 55.9486],
  'd2-s2': [-3.1932, 55.9495],
  'd2-s3': [-3.1617, 55.9442],
  'd2-s4': [-3.1942, 55.9488],
  'd3-s1': [-4.6279, 56.0232],
  'd3-s2': [-4.6287, 56.0239],
  'd3-s3': [-4.6837, 56.0078],
  'd3-s4': [-4.6840, 56.0075],
  'd3-s5': [-4.6839, 56.0076],
  'd4-s1': [-5.1020, 56.6800],
  'd4-s2': [-5.1024, 56.6793],
  'd4-s3': [-5.0400, 56.6650],
  'd4-s4': [-5.1018, 56.6802],
  'd4-s5': [-5.1019, 56.6801],
  'd5-s1': [-5.0031, 56.7969],
  'd5-s2': [-5.0600, 56.8270],
  'd5-s3': [-5.0601, 56.8271],
  'd6-s1': [-5.7156, 57.2740],
  'd6-s2': [-5.5148, 57.2743],
  'd6-s3': [-6.1996, 57.2782],
  'd6-s4': [-6.1690, 57.2913],
  'd6-s5': [-6.1691, 57.2914],
  'd7-s1': [-6.1862, 57.5019],
  'd7-s2': [-6.1932, 57.4148],
  'd7-s3': [-6.2956, 57.2548],
  'd7-s4': [-6.3547, 57.3010],
  'd7-s5': [-6.5913, 57.4478],
  'd8-s1': [-4.6400, 57.4630],
  'd8-s2': [-4.4577, 57.3286],
  'd8-s3': [-4.2280, 57.4742],
  'd8-s4': [-4.2254, 57.4773],
  'd8-s5': [-4.2271, 57.4779],
  'd9-s1': [-3.6249, 57.4761],
  'd9-s2': [-3.3638, 57.4054],
  'd9-s3': [-3.2177, 57.4598],
  'd9-s4': [-3.2200, 57.4801],
  'd9-s5': [-3.2175, 57.4600],
  'd9-s6': [-3.2176, 57.4601],
  'd10-s1': [-3.0568, 57.0355],
  'd10-s2': [-2.2050, 56.9625],
  'd10-s3': [-2.2104, 56.9647],
  'd10-s4': [-2.1788, 57.1267],
  'd10-s5': [-2.1789, 57.1268],
  'd11-s1': [-2.7964, 56.3408],
  'd11-s2': [-2.7965, 56.3413],
  'd11-s3': [-2.7997, 56.3430],
  'd11-s4': [-2.8197, 56.3421],
  'd11-s5': [-2.8050, 56.3427],
  'd11-s6': [-2.8051, 56.3428],
  'd12-s1': [-3.9369, 56.1197],
  'd12-s2': [-3.9468, 56.1238],
  'd12-s3': [-3.9390, 56.1205],
  'd12-s4': [-4.2147, 56.2425],
  'd12-s5': [-4.2167, 56.2432],
  'd12-s6': [-4.2168, 56.2433],
  'd13-s1': [-4.2518, 55.8617],
  'd13-s2': [-4.2918, 55.8673],
  'd13-s3': [-4.2930, 55.8705],
  'd13-s4': [-4.2597, 55.8628],
  'd13-s5': [-4.2390, 55.8617],
  'd13-s6': [-4.2748, 55.8651],
  'd14-s1': [-4.2816, 55.8617],
  'd14-s2': [-4.2551, 55.8628],
  'd14-s3': [-4.4330, 55.8694],
  'd14-s4': [-4.4331, 55.8695],
};

interface Props {
  days: Day[];
  onSelectDay?: (day: Day) => void;
}

interface PinInfo {
  title: string;
  dayNumber: number;
  location: string;
  categoryLabel: string;
  color: string;
}

export default function MapView({ days }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<PinInfo | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setError('Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;

    import('mapbox-gl').then((mapboxgl) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MB: any = mapboxgl.default || mapboxgl;
      MB.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (!mapContainer.current) return;

      map = new MB.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-4.5, 57.0],
        zoom: 6.2,
        attributionControl: false,
      });

      map.on('load', () => {
        setLoaded(true);

        const features: GeoJSON.Feature<GeoJSON.Point>[] = [];
        days.forEach((day) => {
          day.stops.forEach((stop) => {
            // Prefer coordinates stored on the stop, fall back to legacy lookup table
            const coords: [number, number] | undefined =
              stop.lng != null && stop.lat != null
                ? [stop.lng, stop.lat]
                : STOP_COORDS[stop.id];
            if (!coords) return;
            const config = CATEGORY_CONFIG[stop.category];
            features.push({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: coords },
              properties: {
                id: stop.id,
                dayNumber: day.dayNumber,
                title: stop.title,
                categoryLabel: config.label,
                color: config.color,
                location: day.location,
              },
            });
          });
        });

        map.addSource('stops', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        });

        map.addLayer({
          id: 'stops-circles',
          type: 'circle',
          source: 'stops',
          paint: {
            'circle-radius': 7,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        map.on('click', 'stops-circles', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
          if (!e.features?.length) return;
          const props = e.features[0].properties as Record<string, string>;
          setSelected({
            title: props.title,
            dayNumber: Number(props.dayNumber),
            location: props.location,
            categoryLabel: props.categoryLabel,
            color: props.color,
          });
        });

        map.on('click', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
          if (!e.features?.length) setSelected(null);
        });

        map.on('mouseenter', 'stops-circles', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'stops-circles', () => {
          map.getCanvas().style.cursor = '';
        });
      });
    }).catch(() => {
      setError('Failed to load the map. Check your Mapbox token.');
    });

    return () => { if (map) map.remove(); };
  }, [days]);

  return (
    <div className="pt-4 pb-6">
      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 h-[calc(100vh-220px)]">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-center px-6 z-10">
            <div>
              <div className="text-2xl mb-3">🗺️</div>
              <p className="text-stone-500 text-sm">{error}</p>
            </div>
          </div>
        )}
        {!loaded && !error && (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center z-10">
            <div className="text-stone-400 text-sm">Loading map…</div>
          </div>
        )}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Bottom info panel — replaces floating popup */}
        {selected && (
          <div className="absolute bottom-3 left-3 right-3 z-20 bg-white rounded-xl shadow-lg border border-stone-100 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div
                className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                style={{ color: selected.color }}
              >
                {selected.categoryLabel}
              </div>
              <div className="text-sm font-semibold text-stone-800 truncate">{selected.title}</div>
              <div className="text-xs text-stone-400 mt-0.5">Day {selected.dayNumber} · {selected.location}</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="flex-shrink-0 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
