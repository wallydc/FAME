// Native Vanilla JS implementation of a Circle Mode for Mapbox Draw
const CustomCircleMode = {
  onSetup: function (opts) {
    const circle = this.newFeature({
      type: "Feature",
      // properties: { isCircle: true },
      properties: {
        isCircle: true,
        active: "true",
      },
      // FIX: Provide a dummy coordinate point so the renderer doesn't crash on null [0]
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
      },
    });

    this.addFeature(circle);
    this.clearSelectedFeatures();
    this.updateUIClasses({ mouse: "add" });
    this.setActionableState({ trash: true });

    return {
      circle: circle,
      center: null,
    };
  },

  // ADD HERE
  onStop: function (state) {
    this.updateUIClasses({
      mouse: "none",
    });
  },

  onClick: function (state, e) {
    if (!state.center) {
      // First click locks down the center point
      state.center = [e.lngLat.lng, e.lngLat.lat];
    } else {
      // Second click finalizes the shape and switches to select tool
      this.changeMode("simple_select", { featureIds: [state.circle.id] });
    }
  },

  onMouseMove: function (state, e) {
    if (state.center) {
      const radius = this.calculateRadius(state.center, [
        e.lngLat.lng,
        e.lngLat.lat,
      ]);
      const polygonCoordinates = this.createCirclePolygon(state.center, radius);

      // Mapbox Draw's internal safe method to update live drawing coordinates
      state.circle.incomingCoords([polygonCoordinates]);
    }
  },

  onTap: function (state, e) {
    this.onClick(state, e);
  },

  onTouchMove: function (state, e) {
    this.onMouseMove(state, e);
  },

  onDrag: function (state, e) {
    this.onMouseMove(state, e);
  },

  calculateRadius: function (center, current) {
    const R = 6371; // Earth radius in km
    const dLat = ((current[1] - center[1]) * Math.PI) / 180;
    const dLon = ((current[0] - center[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((center[1] * Math.PI) / 180) *
        Math.cos((current[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /* createCirclePolygon: function (center, radius) {
    const coordinates = [];
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * (2 * Math.PI);
      const dx =
        (radius * Math.cos(angle)) /
        (111.32 * Math.cos((center[1] * Math.PI) / 180));
      const dy = (radius * Math.sin(angle)) / 110.57;
      coordinates.push([center[0] + dx, center[1] + dy]);
    }
    coordinates.push(coordinates[0]); // Close polygon loop perfectly
    return coordinates;
  },
 */

  createCirclePolygon: function (center, radius) {
    const circle = turf.circle(center, radius, {
      steps: 64,
      units: "kilometers",
    });

    return circle.geometry.coordinates[0];
  },

  toDisplayFeatures: function (state, feature, display) {
    display(feature);
  },
};
