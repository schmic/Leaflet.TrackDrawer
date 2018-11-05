describe('Main', () => {
  let map;

  beforeEach(() => {
    map = L.map('map', {
      center: L.latLng(44.96777356135154, 6.06822967529297),
      zoom: 13,
    });
  });

  afterEach(async () => {
    sinon.restore();
    await map.removeAsPromise();
  });

  describe('Initialization', () => {
    it('constructor should correctly initialize structures', () => {
      const track = L.TrackDrawer.track().addTo(map);
      const state = track.getState();
      expect(state).to.be.an('array');
      expect(state).to.be.empty;
    });

    it('adding marker', async () => {
      const track = L.TrackDrawer.track().addTo(map);
      const marker1 = L.TrackDrawer.node(L.latLng(44.974635142416496, 6.064453125000001));
      const marker2 = L.TrackDrawer.node(L.latLng(44.96777356135154, 6.06822967529297));

      await track.addNode(marker1);
      await track.addNode(marker2, (previousMarker, currentMarker, done) => {
        done(null, [previousMarker.getLatLng(), currentMarker.getLatLng()]);
      });

      const expectedNewState = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.96777356135154, 6.06822967529297],
            edge: [44.974635142416496, 6.064453125000001, 44.96777356135154, 6.06822967529297],
          },
        ],
      ];

      const newState = track.getState();
      expect(newState).to.deep.equal(expectedNewState);
    });
  });

  describe('Restoring state', () => {
    it('getting restored state should give back same state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          throw new Error('Unexpected call');
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      await drawRoute.restoreState(state, latlng => L.TrackDrawer.node(latlng));

      expect(drawRoute._nodesContainers).to.have.lengthOf(4);
      expect(drawRoute._edgesContainers).to.have.lengthOf(4);
      expect(drawRoute._currentContainerIndex).to.equal(3);

      const newState = drawRoute.getState();
      expect(newState).to.deep.equal(state);
    });
  });

  describe('Cleaning state', () => {
    it('cleaning state should give back initial state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          throw new Error('Unexpected call');
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      await drawRoute.restoreState(state, latlng => L.TrackDrawer.node(latlng));

      drawRoute.clean();

      expect(drawRoute._nodesContainers).to.have.lengthOf(1);
      expect(drawRoute._edgesContainers).to.have.lengthOf(1);
      expect(drawRoute._currentContainerIndex).to.equal(0);

      const newState = drawRoute.getState();
      expect(newState).to.be.an('array');
      expect(newState).to.be.empty;
    });
  });

  describe('Modifying state', () => {
    it('demote to waypoints should flatten state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          throw new Error('Unexpected call');
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const expectedNewState = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const markers = [];
      await drawRoute.restoreState(state, (latlng) => {
        const marker = L.TrackDrawer.node(latlng);
        markers.push(marker);
        return marker;
      });

      markers.forEach((m) => {
        drawRoute.demoteNodeToWaypoint(m);
      });

      expect(drawRoute._nodesContainers).to.have.lengthOf(1);
      expect(drawRoute._edgesContainers).to.have.lengthOf(1);
      expect(drawRoute._currentContainerIndex).to.equal(0);

      const newState = drawRoute.getState();
      expect(newState).to.deep.equal(expectedNewState);
    });

    it('promoting to stopovers should expand state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          throw new Error('Unexpected call');
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const expectedNewState = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
        ],
        [
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
        ],
        [
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
        ],
        [
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
        ],
        [
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const markers = [];
      await drawRoute.restoreState(state, (latlng) => {
        const marker = L.TrackDrawer.node(latlng);
        markers.push(marker);
        return marker;
      });

      markers.forEach((m) => {
        drawRoute.promoteNodeToStopover(m);
      });

      expect(drawRoute._nodesContainers).to.have.lengthOf(9);
      expect(drawRoute._edgesContainers).to.have.lengthOf(9);
      expect(drawRoute._currentContainerIndex).to.equal(8);

      const newState = drawRoute.getState();
      expect(newState).to.deep.equal(expectedNewState);
    });

    it('moving markers should alter state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          done(null, [previousMarker.getLatLng(), marker.getLatLng()]);
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const expectedNewState = [
        [
          {
            start: [45.974635142416496, 5.064453125000001],
            end: [45.95301534523602, 5.098098754882813],
            edge: [45.974635142416496, 5.064453125000001, 45.95301534523602, 5.098098754882813],
          },
        ],
        [
          {
            start: [45.95301534523602, 5.098098754882813],
            end: [45.982406561242584, 5.120929718017578],
            edge: [45.95301534523602, 5.098098754882813, 45.982406561242584, 5.120929718017578],
          },
          {
            start: [45.982406561242584, 5.120929718017578],
            end: [45.98859865651695, 5.075782775878906],
            edge: [45.982406561242584, 5.120929718017578, 45.98859865651695, 5.075782775878906],
          },
          {
            start: [45.98859865651695, 5.075782775878906],
            end: [45.98119234648246, 5.040935516357423],
            edge: [45.98859865651695, 5.075782775878906, 45.98119234648246, 5.040935516357423],
          },
        ],
        [
          {
            start: [45.98119234648246, 5.040935516357423],
            end: [45.962976039238825, 5.023254394531251],
            edge: [45.98119234648246, 5.040935516357423, 45.962976039238825, 5.023254394531251],
          },
        ],
        [
          {
            start: [45.962976039238825, 5.023254394531251],
            end: [45.94924926661153, 5.041107177734376],
            edge: [45.962976039238825, 5.023254394531251, 45.94924926661153, 5.041107177734376],
          },
          {
            start: [45.94924926661153, 5.041107177734376],
            end: [45.943660436460185, 5.06548309326172],
            edge: [45.94924926661153, 5.041107177734376, 45.943660436460185, 5.06548309326172],
          },
          {
            start: [45.943660436460185, 5.06548309326172],
            end: [45.9439034403902, 5.1049652099609375],
            edge: [45.943660436460185, 5.06548309326172, 45.9439034403902, 5.1049652099609375],
          },
        ],
      ];

      const markers = [];
      await drawRoute.restoreState(state, (latlng) => {
        const marker = L.TrackDrawer.node(latlng);
        markers.push(marker);
        return marker;
      });

      const routingCallback = function (previousMarker, marker, done) {
        done(null, [previousMarker.getLatLng(), marker.getLatLng()]);
      };

      markers.forEach(async (m) => {
        const latlng = m.getLatLng();
        m.setLatLng(L.latLng(latlng.lat + 1, latlng.lng - 1));
        await drawRoute.onMoveNode(m, routingCallback);
      });

      const newState = drawRoute.getState();
      expect(newState).to.deep.equal(expectedNewState);
    });

    it('deleting markers should alter state', async () => {
      const drawRoute = L.TrackDrawer.track({
        routingCallback(previousMarker, marker, done) {
          throw new Error('Unexpected call');
        },
      }).addTo(map);

      const state = [
        [
          {
            start: [44.974635142416496, 6.064453125000001],
            end: [44.95301534523602, 6.098098754882813],
            edge: [44.974635142416496, 6.064453125000001, 44.95301534523602, 6.098098754882813],
          },
        ],
        [
          {
            start: [44.95301534523602, 6.098098754882813],
            end: [44.982406561242584, 6.120929718017578],
            edge: [44.95301534523602, 6.098098754882813, 44.982406561242584, 6.120929718017578],
          },
          {
            start: [44.982406561242584, 6.120929718017578],
            end: [44.98859865651695, 6.075782775878906],
            edge: [44.982406561242584, 6.120929718017578, 44.98859865651695, 6.075782775878906],
          },
          {
            start: [44.98859865651695, 6.075782775878906],
            end: [44.98119234648246, 6.040935516357423],
            edge: [44.98859865651695, 6.075782775878906, 44.98119234648246, 6.040935516357423],
          },
        ],
        [
          {
            start: [44.98119234648246, 6.040935516357423],
            end: [44.962976039238825, 6.023254394531251],
            edge: [44.98119234648246, 6.040935516357423, 44.962976039238825, 6.023254394531251],
          },
        ],
        [
          {
            start: [44.962976039238825, 6.023254394531251],
            end: [44.94924926661153, 6.041107177734376],
            edge: [44.962976039238825, 6.023254394531251, 44.94924926661153, 6.041107177734376],
          },
          {
            start: [44.94924926661153, 6.041107177734376],
            end: [44.943660436460185, 6.06548309326172],
            edge: [44.94924926661153, 6.041107177734376, 44.943660436460185, 6.06548309326172],
          },
          {
            start: [44.943660436460185, 6.06548309326172],
            end: [44.9439034403902, 6.1049652099609375],
            edge: [44.943660436460185, 6.06548309326172, 44.9439034403902, 6.1049652099609375],
          },
        ],
      ];

      const markers = [];
      await drawRoute.restoreState(state, (latlng) => {
        const marker = L.TrackDrawer.node(latlng);
        markers.push(marker);
        return marker;
      });

      const routingCallback = function (previousMarker, marker, done) {
        done(null, [previousMarker.getLatLng(), marker.getLatLng()]);
      };

      await drawRoute.removeNode(markers.splice(4, 1)[0], routingCallback);
      await drawRoute.removeNode(markers.splice(5, 1)[0], routingCallback);
      await drawRoute.removeNode(markers.splice(-1, 1)[0], routingCallback);
      await drawRoute.removeNode(markers.splice(0, 1)[0], routingCallback);

      markers.forEach(async (m) => {
        await drawRoute.removeNode(m, routingCallback);
      });

      expect(drawRoute._nodesContainers).to.have.lengthOf(1);
      expect(drawRoute._edgesContainers).to.have.lengthOf(1);
      expect(drawRoute._currentContainerIndex).to.equal(0);

      const newState = drawRoute.getState();
      expect(newState).to.be.an('array');
      expect(newState).to.be.empty;
    });
  });
});
