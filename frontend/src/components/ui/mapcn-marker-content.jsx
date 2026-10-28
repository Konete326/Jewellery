import * as MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const defaultStyles = {
  light: {
    version: 8,
    sources: {
      "carto-raster": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      }
    },
    layers: [
      {
        id: "carto-raster-layer",
        type: "raster",
        source: "carto-raster",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  dark: {
    version: 8,
    sources: {
      "carto-raster": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      }
    },
    layers: [
      {
        id: "carto-raster-layer",
        type: "raster",
        source: "carto-raster",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  }
};

const MapContext = createContext(null);

function useResolvedTheme(themeProp) {
  return "light";
}

function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

function DefaultLoader({ visible = true }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 backdrop-blur-xs transition-opacity duration-300 pointer-events-none">
      <div className="flex gap-1">
        <span className="size-1.5 animate-pulse rounded-full bg-foreground/60" />
        <span className="size-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:150ms]" />
        <span className="size-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function getViewport(map) {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

const Map = forwardRef(function Map(
  { children, className, theme: themeProp, styles, viewport, onViewportChange, loading = false, ...props },
  ref,
) {
  const containerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const styleTimeoutRef = useRef(null);
  const internalUpdateRef = useRef(false);
  const resolvedTheme = useResolvedTheme(themeProp);
  const currentThemeRef = useRef(resolvedTheme);
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  const mapStyles = useMemo(
    () => ({ dark: styles?.dark ?? defaultStyles.dark, light: styles?.light ?? defaultStyles.light }),
    [styles],
  );

  useImperativeHandle(ref, () => mapInstance, [mapInstance]);

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current);
      styleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const initialStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    currentThemeRef.current = resolvedTheme;

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: { compact: true },
      ...props,
      ...viewport,
    });

    const markLoaded = () => {
      clearStyleTimeout();
      setIsLoaded(true);
      setIsStyleLoaded(true);
    };

    const styleDataHandler = () => {
      clearStyleTimeout();
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true);
        setIsLoaded(true);
      }, 50);
    };

    const loadHandler = () => {
      setIsLoaded(true);
      setIsStyleLoaded(true);
    };

    const moveHandler = () => {
      if (!internalUpdateRef.current) onViewportChangeRef.current?.(getViewport(map));
    };

    map.on("load", loadHandler);
    map.on("styledata", styleDataHandler);
    map.on("idle", markLoaded);
    map.on("move", moveHandler);
    setMapInstance(map);

    const safetyTimeout = setTimeout(markLoaded, 350);

    return () => {
      clearTimeout(safetyTimeout);
      clearStyleTimeout();
      map.off("load", loadHandler);
      map.off("styledata", styleDataHandler);
      map.off("idle", markLoaded);
      map.off("move", moveHandler);
      map.remove();
      setMapInstance(null);
      setIsLoaded(false);
      setIsStyleLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!mapInstance) return;
    if (currentThemeRef.current === resolvedTheme) return;
    currentThemeRef.current = resolvedTheme;

    const nextStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
    setIsStyleLoaded(false);
    mapInstance.setStyle(nextStyle);
  }, [resolvedTheme, mapStyles, mapInstance]);

  useEffect(() => {
    if (!mapInstance || !viewport) return;
    internalUpdateRef.current = true;
    mapInstance.jumpTo(viewport);
    requestAnimationFrame(() => {
      internalUpdateRef.current = false;
    });
  }, [mapInstance, viewport]);

  const isFullyReady = isLoaded || isStyleLoaded;
  const contextValue = useMemo(() => ({ map: mapInstance, isLoaded: isFullyReady }), [mapInstance, isFullyReady]);

  return (
    <MapContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn("relative h-full w-full", className)}>
        <DefaultLoader visible={!isFullyReady || loading} />
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  );
});

const MarkerContext = createContext(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("Marker components must be used within MapMarker");
  return context;
}

function MapMarker({ longitude, latitude, children, onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd, draggable = false, ...markerOptions }) {
  const { map } = useMap();
  const callbacksRef = useRef({ onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd });
  callbacksRef.current = { onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd };

  const marker = useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({ ...markerOptions, element: document.createElement("div"), draggable }).setLngLat([longitude, latitude]);
    const handleClick = (event) => callbacksRef.current.onClick?.(event);
    const handleMouseEnter = (event) => callbacksRef.current.onMouseEnter?.(event);
    const handleMouseLeave = (event) => callbacksRef.current.onMouseLeave?.(event);
    markerInstance.getElement()?.addEventListener("click", handleClick);
    markerInstance.getElement()?.addEventListener("mouseenter", handleMouseEnter);
    markerInstance.getElement()?.addEventListener("mouseleave", handleMouseLeave);
    markerInstance.on("dragstart", () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
    });
    markerInstance.on("drag", () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
    });
    markerInstance.on("dragend", () => {
      const lngLat = markerInstance.getLngLat();
      callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
    });
    return markerInstance;
  }, []);

  useEffect(() => {
    if (!map) return;
    marker.addTo(map);
    return () => marker.remove();
  }, [map, marker]);

  if (marker.getLngLat().lng !== longitude || marker.getLngLat().lat !== latitude) marker.setLngLat([longitude, latitude]);
  if (marker.isDraggable() !== draggable) marker.setDraggable(draggable);

  return <MarkerContext.Provider value={{ marker, map }}>{children}</MarkerContext.Provider>;
}

function MarkerContent({ children, className }) {
  const { marker } = useMarkerContext();
  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>{children || <DefaultMarkerIcon />}</div>,
    marker.getElement(),
  );
}

function DefaultMarkerIcon() {
  return <div className="relative h-4 w-4 rounded-full border-2 border-white bg-amber-500 shadow-lg" />;
}

function MarkerTooltip({ children, className, ...popupOptions }) {
  const { marker, map } = useMarkerContext();
  const container = useMemo(() => document.createElement("div"), []);
  const prevTooltipOptions = useRef(popupOptions);
  const tooltip = useMemo(() => {
    return new MapLibreGL.Popup({ offset: 16, ...popupOptions, closeOnClick: true, closeButton: false }).setMaxWidth("none");
  }, []);

  useEffect(() => {
    if (!map) return;
    tooltip.setDOMContent(container);
    const handleMouseEnter = () => tooltip.setLngLat(marker.getLngLat()).addTo(map);
    const handleMouseLeave = () => tooltip.remove();
    marker.getElement()?.addEventListener("mouseenter", handleMouseEnter);
    marker.getElement()?.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      marker.getElement()?.removeEventListener("mouseenter", handleMouseEnter);
      marker.getElement()?.removeEventListener("mouseleave", handleMouseLeave);
      tooltip.remove();
    };
  }, [container, map, marker, tooltip]);

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current;
    if (prev.offset !== popupOptions.offset) tooltip.setOffset(popupOptions.offset ?? 16);
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) tooltip.setMaxWidth(popupOptions.maxWidth ?? "none");
    prevTooltipOptions.current = popupOptions;
  }

  return createPortal(
    <div className={cn("pointer-events-none rounded-md bg-foreground px-2 py-1 text-xs text-balance text-background shadow-md animate-in fade-in-0 zoom-in-95 duration-200 ease-out", className)}>
      {children}
    </div>,
    container,
  );
}

function MarkerLabel({ children, className, position = "top" }) {
  const positionClasses = { top: "bottom-full mb-1", bottom: "top-full mt-1" };
  return (
    <div className={cn("absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-foreground", positionClasses[position], className)}>
      {children}
    </div>
  );
}

export { Map, useMap, MapMarker, MarkerContent, MarkerTooltip, MarkerLabel };
export default Map;
