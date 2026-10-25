"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { submitInquiry } from "@/api/inquiryApi";
import { toast } from "sonner";

const smoothEase = [0.25, 0.1, 0.25, 1];

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "info@khalilandsonsjewellers.com",
    href: "mailto:info@khalilandsonsjewellers.com",
    subtext: "Archival commissions & appraisals"
  },
  {
    icon: Phone,
    label: "+92 314 2004245",
    href: "tel:+923142004245",
    subtext: "Karachi Atelier Direct Desk"
  },
  {
    icon: MapPin,
    label: "Murshid Sunaar Tower, Saddar, Karachi",
    href: "https://maps.google.com/?q=Murshid+Sunaar+Tower+Karachi",
    subtext: "Historic Private Showroom"
  },
  {
    icon: Clock,
    label: "Mon - Sat: 1:00 PM - 9:30 PM PKT",
    href: "#",
    subtext: "Private viewings & consultations"
  }
];

const cityCoordinates = {
  "florence": [43.7696, 11.2558],
  "paris": [48.8566, 2.3522],
  "london": [51.5074, -0.1278],
  "new york": [40.7128, -74.006],
  "tokyo": [35.6762, 139.6503],
  "dubai": [25.2048, 55.2708],
  "geneva": [46.2044, 6.1432]
};

function orthographicRaw(x, y) {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

function interpolateProjection(raw0, raw1) {
  let t = 0;

  const createRawProjection = (alpha) => {
    return (lambda, phi) => {
      const [x0, y0] = raw0(lambda, phi);
      const [x1, y1] = raw1(lambda, phi);
      return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
    };
  };

  const projection = d3.geoProjection(createRawProjection(t));

  const alphaMethod = (value) => {
    if (value !== undefined) {
      t = +value;
      const newProjection = d3.geoProjection(createRawProjection(t));

      if (projection.scale()) newProjection.scale(projection.scale());
      if (projection.translate()) newProjection.translate(projection.translate());
      if (projection.rotate()) newProjection.rotate(projection.rotate());
      if (projection.precision()) newProjection.precision(projection.precision());

      newProjection.alpha = alphaMethod;
      return newProjection;
    }
    return t;
  };

  projection.alpha = alphaMethod;
  return projection;
}

export function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor",
  strokeWidth = 1.0,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.45,
  rotateToLocation,
  rotateCities = ["florence", "paris", "london", "geneva", "new york", "dubai", "tokyo"],
  rotationSpeed = 3500,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframesolid",
  scale = 1,
  backgroundColor
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [progress] = useState(0);
  const [worldData, setWorldData] = useState([]);
  const [rotation, setRotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const rotationInterval = useRef(null);
  const rotationAnimFrame = useRef(null);
  const rotationStartTime = useRef(null);
  const rotationFrom = useRef([0, 0]);
  const rotationTo = useRef([0, 0]);
  const animationFrame = useRef(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef(null);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || "currentColor";
  const defaultGraticuleColor = graticuleColor || "currentColor";
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor";
  const defaultCountryFillColor = countryFillColor || (variant === "solid" ? "currentColor" : "none");
  const defaultBackgroundColor = backgroundColor || "transparent";

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const updateDimensions = () => {
      if (container && useResponsive) {
        const measuredWidth = container.offsetWidth || 300;
        setDimensions({ width: measuredWidth, height: measuredWidth });
      }
    };

    updateDimensions();

    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      observer.unobserve(container);
    };
  }, [useResponsive]);

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("/countries-110m.json").catch(() =>
          fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        );
        const world = await response.json();
        const countries = feature(world, world.objects.countries).features;
        setWorldData(countries);
      } catch {
        setWorldData([]);
      }
    };
    loadWorldData();
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };

    animationFrame.current = requestAnimationFrame(rotate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback((target, duration = 1200) => {
    if (rotationAnimFrame.current) {
      cancelAnimationFrame(rotationAnimFrame.current);
    }

    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();

    const animate = (time) => {
      const elapsed = time - (rotationStartTime.current || 0);
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const lon = rotationFrom.current[0] + (rotationTo.current[0] - rotationFrom.current[0]) * eased;
      const lat = rotationFrom.current[1] + (rotationTo.current[1] - rotationFrom.current[1]) * eased;

      setRotation([lon, lat]);

      if (t < 1) {
        rotationAnimFrame.current = requestAnimationFrame(animate);
      }
    };

    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;

    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const city = rotateCities[nextIndex].toLowerCase();
      const coordinates = cityCoordinates[city];

      if (coordinates) {
        animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
        setCurrentCityIndex(nextIndex);
      }
    };

    const city = rotateCities[currentCityIndex].toLowerCase();
    const coordinates = cityCoordinates[city];

    if (coordinates) {
      animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
    }

    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);

    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  useEffect(() => {
    if (!rotateToLocation) return;
    let coordinates;
    if (typeof rotateToLocation === "string") {
      const city = rotateToLocation.toLowerCase();
      coordinates = cityCoordinates[city] || [0, 0];
    } else {
      coordinates = rotateToLocation;
    }
    setRotation([-coordinates[1], -coordinates[0]]);
  }, [rotateToLocation]);

  const handleMouseDown = (event) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];

    setRotation((prev) => [
      prev[0] + dx * 0.5,
      Math.max(-90, Math.min(90, prev[1] - dy * 0.5))
    ]);

    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible) return;
    if (useResponsive && dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let finalCountryFill = "none";
    let finalStrokeWidth = strokeWidth;
    let finalOpacity = 1.0;
    let renderGraticule = showGraticule;
    let finalGraticuleOpacity = graticuleOpacity;
    let finalSphereOutlineWidth = sphereOutlineWidth;

    if (variant === "wireframe") {
      finalCountryFill = "none";
      finalStrokeWidth = strokeWidth;
      finalOpacity = 1.0;
      renderGraticule = showGraticule;
      finalGraticuleOpacity = graticuleOpacity;
      finalSphereOutlineWidth = sphereOutlineWidth;
    } else if (variant === "wireframesolid") {
      finalCountryFill = "none";
      finalStrokeWidth = strokeWidth;
      finalOpacity = 1.0;
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    } else if (variant === "solid") {
      finalCountryFill = defaultCountryFillColor;
      finalStrokeWidth = strokeWidth * 0.5;
      finalOpacity = 0.3;
      renderGraticule = false;
      finalGraticuleOpacity = 0;
      finalSphereOutlineWidth = 1.5;
    }

    if (defaultBackgroundColor !== "transparent") {
      const radius = (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9;
      svg
        .append("circle")
        .attr("cx", finalWidth / 2)
        .attr("cy", finalHeight / 2)
        .attr("r", radius)
        .attr("fill", defaultBackgroundColor);
    }

    let projection;
    const path = d3.geoPath();

    if (variant === "wireframe") {
      const t = progress / 100;
      const alpha = Math.pow(t, 0.5);
      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3.scaleLinear().domain([0, 1]).range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      const baseRotate = d3.scaleLinear().domain([0, 1]).range([0, 0]);

      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha))
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([baseRotate(alpha) + rotation[0], rotation[1]])
        .precision(0.1);

      projection.alpha(alpha);
      path.projection(projection);
    } else {
      projection = d3
        .geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1);

      path.projection(projection);
    }

    if (renderGraticule && finalGraticuleOpacity > 0) {
      try {
        const graticule = d3.geoGraticule();
        const graticulePath = path(graticule());
        if (graticulePath) {
          svg
            .append("path")
            .datum(graticule())
            .attr("d", graticulePath)
            .attr("fill", "none")
            .attr("stroke", defaultGraticuleColor)
            .attr("stroke-width", 1)
            .attr("opacity", finalGraticuleOpacity);
        }
      } catch {}
    }

    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d) => {
        try {
          const pathString = path(d);
          if (!pathString || pathString.includes("NaN") || pathString.includes("Infinity")) {
            return "";
          }
          return pathString;
        } catch {
          return "";
        }
      })
      .attr("fill", finalCountryFill)
      .attr("stroke", defaultStrokeColor)
      .attr("stroke-width", finalStrokeWidth)
      .attr("opacity", finalOpacity)
      .style("visibility", function () {
        const pathData = d3.select(this).attr("d");
        return pathData && pathData.length > 0 && !pathData.includes("NaN") ? "visible" : "hidden";
      })
      .on("mouseenter", function () {
        if (countryHoverColor && variant === "solid") {
          d3.select(this).attr("fill", countryHoverColor);
        }
      })
      .on("mouseleave", function () {
        if (variant === "solid") {
          d3.select(this).attr("fill", finalCountryFill);
        }
      });

    try {
      const sphereOutline = path({ type: "Sphere" });
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", defaultSphereOutlineColor)
          .attr("stroke-width", finalSphereOutlineWidth)
          .attr("opacity", variant === "wireframe" ? 1.0 : 0.8);
      }
    } catch {}
  }, [
    worldData,
    progress,
    rotation,
    isVisible,
    finalWidth,
    finalHeight,
    defaultStrokeColor,
    strokeWidth,
    defaultGraticuleColor,
    graticuleOpacity,
    defaultSphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    defaultCountryFillColor,
    countryHoverColor,
    variant,
    scale,
    defaultBackgroundColor,
    useResponsive,
    dimensions.width
  ]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={useResponsive ? "w-full h-full opacity-0 transition-opacity duration-1000" : ""}
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1
        }}
      />
    </div>
  );
}

const FormDots = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 flex items-center justify-center overflow-hidden",
          isHorizontal ? "w-full" : "h-full",
          className
        )}
        {...props}
      >
        <div className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}>
          <div
            className={cn("absolute inset-0 bg-repeat", "text-amber-500/40 dark:text-amber-400/30")}
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 0.9px, transparent 0.9px)",
              backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal
                ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
                : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    );
  }
);
FormDots.displayName = "FormDots";

export default function ContactWithGlobe({
  title = "Inquire With Our Atelier",
  subtitle = "Concierge & Heritage Direct",
  description = "Connect with our master goldsmiths in Karachi for bespoke commissions, heirloom restoration, or private viewing appointments.",
  className
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    subject: "Bespoke Jewelry Commission",
    message: ""
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameRegex = /^[a-zA-Z\s'.]{2,60}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^(\+?[0-9\s\-()]{7,25})?$/;

  const errors = {
    customerName:
      !formData.customerName.trim()
        ? "Full name is required"
        : !nameRegex.test(formData.customerName.trim())
          ? "Please enter a valid full name (letters only)"
          : null,
    email:
      !formData.email.trim()
        ? "Email address is required"
        : !emailRegex.test(formData.email.trim())
          ? "Please enter a valid email (e.g. name@domain.com)"
          : null,
    phone:
      formData.phone.trim() && !phoneRegex.test(formData.phone.trim())
        ? "Please enter a valid phone number"
        : null,
    message:
      !formData.message.trim()
        ? "Please provide details for your inquiry"
        : formData.message.trim().length < 8
          ? "Message should be at least 8 characters"
          : null
  };

  const isFormValid = !errors.customerName && !errors.email && !errors.phone && !errors.message;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      customerName: true,
      email: true,
      phone: true,
      message: true
    });

    if (!isFormValid) {
      toast.error("Please verify the highlighted fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        jewelryType: formData.subject === "Bespoke Jewelry Commission" ? "Bridal Set" : "Other",
        preferredMetal: "22K Gold",
        estimatedBudget: "Consultation"
      });

      setSubmitted(true);
      toast.success("Your inquiry has been relayed directly to our Karachi Atelier concierge.");
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        subject: "Bespoke Jewelry Commission",
        message: ""
      });
      setTouched({});
    } catch (err) {
      toast.error(err.message || "Failed to submit inquiry. Please try again or telephone our atelier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn("relative w-full bg-[#f9f9f9] dark:bg-[#121212] overflow-hidden py-16 sm:py-20 lg:py-24", className)}>
      <div className="relative mx-auto w-full max-w-[1880px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center text-center gap-3.5 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400 font-medium font-mono">
              {subtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground tracking-tight"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-sm sm:text-base text-muted-foreground max-w-xl font-light leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 max-w-6xl mx-auto items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono font-medium">
                Atelier Directory
              </span>
              <h3 className="text-2xl font-serif font-medium text-foreground">
                Private Consultation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-light">
                Every bespoke piece begins with a dialogue. Our master artisans respond to every personal request within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              {CONTACT_LINKS.map(({ icon: Icon, label, href, subtext }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.08,
                    ease: smoothEase
                  }}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl border border-border/70 bg-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-300 shadow-xs"
                >
                  <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/25 group-hover:border-amber-500/50 group-hover:bg-amber-500/20 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Icon className="size-4 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {label}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-light">
                      {subtext}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="relative overflow-hidden h-56 rounded-2xl border border-border/80 bg-card/60 p-2 shadow-xs">
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-background/80 border border-border text-muted-foreground backdrop-blur-xs">
                  Global Atelier Network
                </span>
              </div>
              <GlobeWireframe
                className="w-full aspect-square max-w-full absolute -top-8 left-0 text-amber-600 dark:text-amber-400"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.4}
                strokeWidth={0.7}
                graticuleOpacity={0.15}
                strokeColor="currentColor"
                sphereOutlineColor="currentColor"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/70 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs flex flex-col gap-6"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-amber-700 dark:text-amber-400 font-medium block mb-1">
                Direct Transmission
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground">
                Relay Your Request
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-light mt-0.5">
                Complete the fields below to initiate your consultation with our concierge team.
              </p>
            </div>

            <FormDots />

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3 bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6">
                <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="font-serif text-xl font-medium text-foreground">
                  Inquiry Received With Honor
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md">
                  Thank you. Your consultation dispatch has reached our Karachi desk. A dedicated concierge will respond via email within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-3 text-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                        Full Name *
                      </label>
                      {touched.customerName && (
                        errors.customerName ? (
                          <span className="text-[10px] text-rose-500 flex items-center gap-1">
                            <AlertCircle className="size-3" /> Required
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Valid
                          </span>
                        )
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      onBlur={() => handleBlur("customerName")}
                      placeholder="e.g. Eleanor Vance"
                      className={cn(
                        "w-full bg-muted/40 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200",
                        touched.customerName && errors.customerName
                          ? "border-rose-400 focus:ring-2 focus:ring-rose-500/15"
                          : "border-input focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15"
                      )}
                    />
                    {touched.customerName && errors.customerName && (
                      <p className="text-[11px] text-rose-500">{errors.customerName}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                        Email Address *
                      </label>
                      {touched.email && (
                        errors.email ? (
                          <span className="text-[10px] text-rose-500 flex items-center gap-1">
                            <AlertCircle className="size-3" /> Required
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Valid
                          </span>
                        )
                      )}
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="eleanor@example.com"
                      className={cn(
                        "w-full bg-muted/40 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200",
                        touched.email && errors.email
                          ? "border-rose-400 focus:ring-2 focus:ring-rose-500/15"
                          : "border-input focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15"
                      )}
                    />
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-rose-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                        Telephone / WhatsApp
                      </label>
                      {touched.phone && formData.phone.trim() && (
                        errors.phone ? (
                          <span className="text-[10px] text-rose-500 flex items-center gap-1">
                            <AlertCircle className="size-3" /> Invalid
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Valid
                          </span>
                        )
                      )}
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+1 (555) 019-2834"
                      className={cn(
                        "w-full bg-muted/40 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200",
                        touched.phone && errors.phone
                          ? "border-rose-400 focus:ring-2 focus:ring-rose-500/15"
                          : "border-input focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15"
                      )}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] text-rose-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                      Inquiry Nature
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="w-full bg-muted/40 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15 transition-all duration-200 cursor-pointer"
                    >
                      <option value="Bespoke Jewelry Commission">Bespoke Jewelry Commission</option>
                      <option value="Gallery Masterpiece Acquisition">Gallery Masterpiece Acquisition</option>
                      <option value="Private Atelier Appointment">Private Atelier Appointment</option>
                      <option value="Heirloom Restoration & Appraisal">Heirloom Restoration & Appraisal</option>
                      <option value="General Concierge Assistance">General Concierge Assistance</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                      Your Message *
                    </label>
                    {touched.message && (
                      errors.message ? (
                        <span className="text-[10px] text-rose-500 flex items-center gap-1">
                          <AlertCircle className="size-3" /> Min 8 chars
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Valid
                        </span>
                      )
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    placeholder="Describe your desired precious stones, precious metals, design preferences, or appointment timeframe..."
                    className={cn(
                      "w-full bg-muted/40 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none resize-none transition-all duration-200",
                      touched.message && errors.message
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-500/15"
                        : "border-input focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15"
                    )}
                  />
                  {touched.message && errors.message && (
                    <p className="text-[11px] text-rose-500">{errors.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-light">
                    <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                    <span>Protected under Atelier Privacy Protocols. No spam.</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-7 rounded-xl font-medium text-xs uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 cursor-pointer shadow-sm group inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-amber-500" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
