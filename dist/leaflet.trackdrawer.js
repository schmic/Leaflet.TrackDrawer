(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";

var colorMap = {
  red: '#D63E2A',
  orange: '#F59630',
  green: '#72B026',
  blue: '#38AADD',
  purple: '#D252B9',
  darkred: '#A23336',
  darkblue: '#0067A3',
  darkgreen: '#728224',
  darkpurple: '#5B396B',
  cadetblue: '#436978',
  lightred: '#FF8E7F',
  beige: '#FFCB92',
  lightgreen: '#BBF970',
  lightblue: '#8ADAFF',
  pink: '#FF91EA',
  white: '#FBFBFB',
  lightgray: '#A3A3A3',
  gray: '#575757',
  black: '#303030'
};
var colors = ['blue', 'green', 'orange', 'purple', 'red', 'darkblue', 'darkpurple', 'lightblue', 'lightgreen', 'beige', 'pink', 'lightred']; // Colors supported by Leaflet AwesomeMarkers

Object.freeze(colorMap);
Object.freeze(colors);
module.exports = {
  nameOf: function nameOf(idx) {
    return colors[idx % colors.length];
  },
  rgbOf: function rgbOf(idx) {
    return colorMap[this.nameOf(idx)];
  },
  nameToRgb: function nameToRgb(name) {
    return colorMap[name];
  },
  rgbToName: function rgbToName(rgb) {
    return Object.keys(colorMap).find(function (key) {
      return colorMap[key] === rgb;
    });
  }
};

},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";

var L = (typeof window !== "undefined" ? window['L'] : typeof global !== "undefined" ? global['L'] : null);

module.exports = L.Evented.extend({
  initialize: function initialize(parent) {
    this._parent = parent;
    var f = L.featureGroup().addTo(parent).addEventParent(this);
    this._elements = [f];
    this.length = 1;
  },
  get: function get(i) {
    var idx = i < 0 ? this._elements.length + i : i;
    return this._elements[idx];
  },

  /* eslint-disable prefer-rest-params */
  splice: function splice() {
    var _this$_elements,
        _this = this;

    var ret = (_this$_elements = this._elements).splice.apply(_this$_elements, arguments);

    ret.forEach(function (x) {
      return x.removeFrom(_this._parent).removeEventParent(_this);
    });

    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      args.forEach(function (x) {
        x.addTo(_this._parent).addEventParent(_this);
      });
    }

    this.length = this._elements.length;
    return ret;
  },

  /* eslint-enable prefer-rest-params */
  forEach: function forEach(cb) {
    return this._elements.forEach(cb);
  },
  clean: function clean() {
    this._elements[0].clearLayers();

    this.splice(1);
  },
  getLayer: function getLayer(id) {
    var parentLayer = this._elements.find(function (x) {
      return x.getLayer(id) !== undefined;
    });

    return parentLayer !== undefined ? parentLayer.getLayer(id) : undefined;
  },
  getLayerId: function getLayerId(layer) {
    var parentLayer = this._elements.find(function (x) {
      return x.hasLayer(layer);
    });

    return parentLayer !== undefined ? parentLayer.getLayerId(layer) : undefined;
  },
  getLayerIndex: function getLayerIndex(layer) {
    return this._elements.findIndex(function (x) {
      return x.hasLayer(layer);
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
(function (global){
"use strict";

var L = (typeof window !== "undefined" ? window['L'] : typeof global !== "undefined" ? global['L'] : null);

module.exports = L.Marker.extend({
  _routeIdPrevious: undefined,
  _routeIdNext: undefined,
  _promoted: false,
  _demoted: true,
  options: {
    type: 'waypoint',
    // Or 'stopover',
    colorName: 'blue',
    opacity: 1,
    draggable: true
  },
  initialize: function initialize(latlng, options) {
    L.Marker.prototype.initialize.call(this, latlng, options);
    L.setOptions(this, options);
    this.setType(this.options.type);
  },
  setType: function setType(type) {
    this.options.type = type;

    if (type === 'stopover') {
      this.setIcon(L.AwesomeMarkers.icon({
        icon: 'pause-circle',
        markerColor: this.options.colorName,
        prefix: 'fa'
      }));
    } else {
      this.setIcon(L.AwesomeMarkers.icon({
        icon: 'map-signs',
        markerColor: this.options.colorName,
        prefix: 'fa'
      }));
    }

    return this;
  },
  setStyle: function setStyle(style) {
    L.Util.setOptions(this, style);

    if ('colorName' in style) {
      // Colors is set only via the icon and there's no setter on L.AwesomeMarkers
      this.setType(this.options.type);
    }

    if ('opacity' in style) {
      this.setOpacity(this.options.opacity);
    }

    return this;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (global){
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var L = (typeof window !== "undefined" ? window['L'] : typeof global !== "undefined" ? global['L'] : null);

var Colors = _dereq_('./Colors');

var LayerContainer = _dereq_('./LayerContainer');

function encodeLatLngs(latlngs) {
  var array = [];
  var size = latlngs.length;

  for (var i = 0; i < size; i += 1) {
    array.push(latlngs[i].lat);
    array.push(latlngs[i].lng);
  }

  return array;
  /* polyline with precision of 8 seems broken
     var array = latlngs.map(function(x) {
      return [x.lat, x.lng];
    });
     return polyline.encode(array, 8); //
    */
}

function decodeLatLngs(latlngs) {
  var array = [];
  var size = latlngs.length;

  for (var i = 0; i < size; i += 2) {
    array.push(L.latLng(latlngs[i], latlngs[i + 1]));
  }

  return array;
  /* polyline with precision of 8 seems broken
     var decoded = polyline.decode(latlngs, 8);
     return decoded.map(function(x) {
      return L.latLng(x[0], x[1]);
    });
    */
}

function encodeLatLng(latlng) {
  return [latlng.lat, latlng.lng];
}

function decodeLatLng(latlng) {
  return L.latLng(latlng[0], latlng[1]);
}

module.exports = L.LayerGroup.extend({
  options: {
    routingCallback: undefined,
    router: undefined,
    debug: true
  },
  _getPrevious: function _getPrevious(node) {
    var previousEdge = node !== undefined ? this._getEdge(node._routeIdPrevious) : undefined;
    var previousNode = previousEdge !== undefined ? this._getNode(previousEdge._startMarkerId) : undefined;
    return {
      previousEdge: previousEdge,
      previousNode: previousNode
    };
  },
  _getNext: function _getNext(node) {
    var nextEdge = node !== undefined ? this._getEdge(node._routeIdNext) : undefined;
    var nextNode = nextEdge !== undefined ? this._getNode(nextEdge._endMarkerId) : undefined;
    return {
      nextEdge: nextEdge,
      nextNode: nextNode
    };
  },
  _getNodeId: function _getNodeId(node) {
    return this._nodesContainers.getLayerId(node);
  },
  _getEdgeId: function _getEdgeId(edge) {
    return this._edgesContainers.getLayerId(edge);
  },
  _getNode: function _getNode(id) {
    return this._nodesContainers.getLayer(id);
  },
  _getEdge: function _getEdge(id) {
    return this._edgesContainers.getLayer(id);
  },
  _getNodeContainerIndex: function _getNodeContainerIndex(node) {
    return this._nodesContainers.getLayerIndex(node);
  },
  _getNodeContainer: function _getNodeContainer(node) {
    return this._nodesContainers.get(this._getNodeContainerIndex(node));
  },
  _getEdgeContainerIndex: function _getEdgeContainerIndex(edge) {
    return this._edgesContainers.getLayerIndex(edge);
  },
  _getEdgeContainer: function _getEdgeContainer(edge) {
    return this._edgesContainers.get(this._getEdgeContainerIndex(edge));
  },
  initialize: function initialize(options) {
    var _this = this;

    L.setOptions(this, options);
    L.LayerGroup.prototype.initialize.call(this);
    this._nodesContainers = new LayerContainer(this);
    this._edgesContainers = new LayerContainer(this);
    this._firstNodeId = undefined;
    this._lastNodeId = undefined;
    this._currentColorIndex = 0;
    this._fireEvents = true;
    this._computing = 0;

    if (this.options.router !== undefined) {
      this.options.routingCallback = function (previousMarker, marker, done) {
        _this.options.router.route([L.Routing.waypoint(previousMarker.getLatLng()), L.Routing.waypoint(marker.getLatLng())], function (err, result) {
          done(err, result ? result[0].coordinates : null);
        });
      };
    }
  },
  getNodes: function getNodes() {
    var nodes = [];

    this._nodesContainers.forEach(function (container) {
      var group = container.getLayers();
      if (group.length > 0) nodes.push({
        container: container,
        markers: group
      });
    });

    return nodes;
  },
  getNodesContainer: function getNodesContainer() {
    return this._nodesContainers;
  },
  getSteps: function getSteps() {
    var steps = [];

    this._edgesContainers.forEach(function (container) {
      var group = container.getLayers();
      if (group.length > 0) steps.push({
        container: container,
        edges: group
      });
    });

    return steps;
  },
  getStepsContainer: function getStepsContainer() {
    return this._edgesContainers;
  },
  getBounds: function getBounds() {
    var bounds = L.latLngBounds([]);

    this._nodesContainers.forEach(function (container) {
      bounds.extend(container.getBounds());
    });

    this._edgesContainers.forEach(function (container) {
      bounds.extend(container.getBounds());
    });

    return bounds;
  },
  getLatLngs: function getLatLngs() {
    var _this2 = this;

    var hasTrackStats = L.TrackStats !== undefined;
    var latlngs = [];

    var currentNode = this._getNode(this._firstNodeId);

    this._nodesContainers.forEach(function () {
      var l = [];

      do {
        var _this2$_getNext = _this2._getNext(currentNode),
            nextEdge = _this2$_getNext.nextEdge,
            nextNode = _this2$_getNext.nextNode;

        if (currentNode === undefined || nextEdge === undefined) {
          break;
        }

        nextEdge.getLatLngs().forEach(function (e) {
          l.push(hasTrackStats ? L.TrackStats.cache.getAll(e) : e);
        });
        currentNode = nextNode;
      } while (currentNode.options.type !== 'stopover');

      latlngs.push(JSON.parse(JSON.stringify(l)));
    });

    return latlngs;
  },
  toGeoJSON: function toGeoJSON() {
    var geojson = {
      type: 'FeatureCollection',
      features: []
    };

    this._nodesContainers.forEach(function (container) {
      var _geojson$features;

      (_geojson$features = geojson.features).push.apply(_geojson$features, _toConsumableArray(container.toGeoJSON().features));
    });

    var latlngs = this.getLatLngs();
    latlngs.forEach(function (l, idx) {
      var feature = {
        type: 'Feature',
        properties: {
          index: idx
        },
        geometry: {
          type: 'LineString',
          coordinates: l.map(function (e) {
            return 'z' in e && e.z !== null ? [e.lng, e.lat, e.z] : [e.lng, e.lat];
          })
        }
      };
      geojson.features.push(feature);
    });
    return geojson;
  },
  getState: function getState() {
    var _this3 = this;

    var state = [];

    var currentNode = this._getNode(this._firstNodeId);

    this._nodesContainers.forEach(function () {
      var group = [];

      do {
        var _this3$_getNext = _this3._getNext(currentNode),
            nextEdge = _this3$_getNext.nextEdge,
            nextNode = _this3$_getNext.nextNode;

        if (currentNode === undefined || nextEdge === undefined) {
          break;
        }

        group.push({
          start: encodeLatLng(currentNode.getLatLng()),
          end: encodeLatLng(nextNode.getLatLng()),
          edge: encodeLatLngs(nextEdge.getLatLngs())
        });
        currentNode = nextNode;
      } while (currentNode.options.type !== 'stopover');

      if (group.length > 0) state.push(group);
    });

    return state;
  },
  clean: function clean() {
    this._edgesContainers.clean();

    this._nodesContainers.clean();

    this._firstNodeId = undefined;
    this._lastNodeId = undefined;
    this._currentColorIndex = 0;
    if (this._fireEvents) this.fire('TrackDrawer:done', {});
    return this;
  },
  restoreState: function () {
    var _restoreState = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(state, nodeCallback) {
      var _this4 = this;

      var oldValue, stopovers, routes, promises, previousSegment, lastState, marker;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              oldValue = this._fireEvents;
              this._fireEvents = false;
              this.clean();
              stopovers = [];
              routes = [];
              promises = [];
              state.forEach(function (group, i) {
                group.forEach(function (segment, j) {
                  var marker = nodeCallback.call(null, decodeLatLng(segment.start));

                  if (j === 0 && i > 0) {
                    stopovers.push(marker);
                  }

                  promises.push(_this4.addNode(marker, function (from, to, done) {
                    var edge = decodeLatLngs(previousSegment.edge);
                    routes.push({
                      from: from,
                      to: to,
                      edge: edge
                    });
                    done(null, edge);
                  }));
                  previousSegment = segment;
                });
              });
              lastState = state[state.length - 1][state[state.length - 1].length - 1];
              marker = nodeCallback.call(null, decodeLatLng(lastState.end));
              promises.push(this.addNode(marker, function (from, to, done) {
                var edge = decodeLatLngs(lastState.edge);
                routes.push({
                  from: from,
                  to: to,
                  edge: edge
                });
                done(null, edge);
              }));
              _context.next = 12;
              return Promise.all(promises);

            case 12:
              stopovers.forEach(function (m) {
                return _this4.promoteNodeToStopover(m);
              });
              this._fireEvents = oldValue;
              if (this._fireEvents) this.fire('TrackDrawer:done', {
                routes: routes
              });
              return _context.abrupt("return", this);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function restoreState(_x, _x2) {
      return _restoreState.apply(this, arguments);
    };
  }(),
  addLayer: function addLayer(layer) {
    if (layer instanceof L.Marker) {
      this.addNode(layer);
    } else {
      L.LayerGroup.prototype.addLayer.call(this, layer);
    }
  },
  _createEdge: function _createEdge(previousNode, node) {
    var _this5 = this;

    var edgesContainer = this._edgesContainers.get(this._getNodeContainerIndex(previousNode));

    var edge = L.polyline([previousNode.getLatLng(), node.getLatLng()], {
      color: Colors.nameToRgb(previousNode.options.colorName),
      dashArray: '4'
    }).addTo(edgesContainer);
    var id = edgesContainer.getLayerId(edge);
    previousNode._routeIdNext = id;
    node._routeIdPrevious = id;
    edge._startMarkerId = this._getNodeId(previousNode);
    edge._endMarkerId = this._getNodeId(node);
    edge._computation = 0;

    if (this.options.debug) {
      edge.on('tooltipopen', function () {
        var startNodeId = edge._startMarkerId;
        var endNodeId = edge._endMarkerId;
        edge.setTooltipContent("id: ".concat(_this5._getEdgeId(edge), " (on #").concat(_this5._getEdgeContainerIndex(edge), ")<br>") + "previous node: ".concat(startNodeId) + " (on #".concat(_this5._getNodeContainerIndex(_this5._getNode(startNodeId)), ")<br>") + "next node: ".concat(endNodeId) + " (on #".concat(_this5._getNodeContainerIndex(_this5._getNode(endNodeId)), ")"));
      });
      edge.bindTooltip('<>');
    }

    return edge;
  },
  _prepareNode: function _prepareNode(node, nodesContainer) {
    var _this6 = this;

    if (this.options.debug) {
      node.on('tooltipopen', function () {
        var _this6$_getPrevious = _this6._getPrevious(node),
            previousEdge = _this6$_getPrevious.previousEdge,
            previousNode = _this6$_getPrevious.previousNode;

        var _this6$_getNext = _this6._getNext(node),
            nextEdge = _this6$_getNext.nextEdge,
            nextNode = _this6$_getNext.nextNode;

        node.setTooltipContent("id: ".concat(_this6._getNodeId(node), " (on #").concat(_this6._getNodeContainerIndex(node), ")<br>") + "previous edge: ".concat(_this6._getEdgeId(previousEdge)) + " (on #".concat(_this6._getEdgeContainerIndex(previousEdge), ") to ").concat(_this6._getNodeId(previousNode), "<br>") + "next edge: ".concat(_this6._getEdgeId(nextEdge)) + " (on #".concat(_this6._getEdgeContainerIndex(nextEdge), ") to ").concat(_this6._getNodeId(nextNode)));
      });
      node.bindTooltip('<>');
    }

    if (nodesContainer.getLayers().length > 0) {
      var previousNode = nodesContainer.getLayers()[0];
      node.setStyle({
        colorName: previousNode.options.colorName
      });
    } else {
      node.setStyle({
        colorName: Colors.nameOf(this._currentColorIndex)
      });
    }

    node.addTo(nodesContainer);
  },
  addNode: function addNode(node, routingCallback) {
    var _this7 = this;

    var callback = routingCallback || this.options.routingCallback;

    if (this._lastNodeId !== undefined) {
      var _previousNode = this._getNode(this._lastNodeId);

      if (_previousNode.getLatLng().equals(node.getLatLng())) {
        return new Promise(function (resolve) {
          resolve();
        });
      }
    }

    var nodesContainer = this._nodesContainers.get(-1);

    this._prepareNode(node, nodesContainer);

    if (this._lastNodeId !== undefined) {
      var _previousNode2 = this._getNode(this._lastNodeId);

      this._createEdge(_previousNode2, node);

      if (this._fireEvents && this._computing === 0) {
        this.fire('TrackDrawer:start', {});
      }
    }

    var lastNodeId = this._lastNodeId;
    this._lastNodeId = this._getNodeId(node);

    if (this._firstNodeId === undefined) {
      this._firstNodeId = this._lastNodeId;
    }

    var oldValue = this._fireEvents;
    this._fireEvents = false;

    if (node.options.type === 'stopover') {
      this.promoteNodeToStopover(node);
    }

    this._fireEvents = oldValue;

    if (lastNodeId === undefined) {
      return new Promise(function (resolve) {
        resolve();
      });
    }

    this._computing += 1;

    var _this$_getPrevious = this._getPrevious(node),
        previousEdge = _this$_getPrevious.previousEdge,
        previousNode = _this$_getPrevious.previousNode;

    previousEdge._computation += 1;
    var currentComputation = previousEdge._computation;
    return new Promise(function (resolve, reject) {
      callback.call(null, previousNode, node, function (err, route) {
        _this7._computing -= 1;

        if (err !== null) {
          reject(err);
          return;
        }

        if (previousEdge._computation === currentComputation) {
          // Route can give different precision than initial markers
          // Use precision given by the route to be consistent
          previousNode.setLatLng(L.latLng(route[0]));
          node.setLatLng(L.latLng(route[route.length - 1]));
          previousEdge.setLatLngs(route);
          previousEdge.setStyle({
            dashArray: null
          });
        }

        if (_this7._fireEvents && _this7._computing === 0) {
          _this7.fire('TrackDrawer:done', {
            routes: [{
              from: previousNode,
              to: node,
              previousEdge: previousEdge
            }]
          });
        }

        resolve();
      });
    });
  },
  insertNode: function insertNode(node, route, routingCallback) {
    var _this8 = this;

    var callback = routingCallback || this.options.routingCallback;

    var startMarker = this._getNode(route._startMarkerId);

    var endMarker = this._getNode(route._endMarkerId);

    route.removeFrom(this._getEdgeContainer(route));

    this._prepareNode(node, this._getNodeContainer(startMarker));

    var edge1 = this._createEdge(startMarker, node);

    var edge2 = this._createEdge(node, endMarker);

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:start', {});
    }

    this._computing += 1;
    edge1._computation += 1;
    edge2._computation += 1;
    var currentComputation1 = edge1._computation;
    var currentComputation2 = edge2._computation;
    var promise1 = new Promise(function (resolve, reject) {
      callback.call(null, startMarker, node, function (err, route1) {
        if (err !== null) {
          reject(err);
          return;
        }

        if (edge1._computation === currentComputation1) {
          startMarker.setLatLng(L.latLng(route1[0]));
          node.setLatLng(L.latLng(route1[route1.length - 1]));
          edge1.setLatLngs(route1);
          edge1.setStyle({
            dashArray: null
          });
        }

        resolve({
          from: startMarker,
          to: node,
          edge: edge1
        });
      });
    });
    var promise2 = new Promise(function (resolve, reject) {
      callback.call(null, node, endMarker, function (err, route2) {
        if (err !== null) {
          reject(err);
          return;
        }

        if (edge2._computation === currentComputation2) {
          node.setLatLng(L.latLng(route2[0]));
          endMarker.setLatLng(L.latLng(route2[route2.length - 1]));
          edge2.setLatLngs(route2);
          edge2.setStyle({
            dashArray: null
          });
        }

        resolve({
          from: node,
          to: endMarker,
          edge: edge2
        });
      });
    });
    return Promise.all([promise1, promise2]).finally(function () {
      _this8._computing -= 1;
    }).then(function (routes) {
      if (_this8._fireEvents && _this8._computing === 0) {
        _this8.fire('TrackDrawer:done', {
          routes: routes
        });
      }
    });
  },
  onMoveNode: function onMoveNode(marker, routingCallback) {
    var _this9 = this;

    var callback = routingCallback || this.options.routingCallback;
    var promises = [];

    var _this$_getPrevious2 = this._getPrevious(marker),
        previousEdge = _this$_getPrevious2.previousEdge,
        previousNode = _this$_getPrevious2.previousNode;

    var _this$_getNext = this._getNext(marker),
        nextEdge = _this$_getNext.nextEdge,
        nextNode = _this$_getNext.nextNode;

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:start', {});
    }

    this._computing += 1;

    if (previousEdge !== undefined) {
      previousEdge._computation += 1;
      var currentComputation = previousEdge._computation;
      promises.push(new Promise(function (resolve, reject) {
        callback.call(null, previousNode, marker, function (err, route) {
          if (err !== null) {
            reject(err);
            return;
          }

          if (previousEdge._computation === currentComputation) {
            marker.setLatLng(L.latLng(route[route.length - 1]));
            previousEdge.setLatLngs(route);
          }

          resolve({
            from: previousNode,
            to: marker,
            edge: previousEdge
          });
        });
      }));
    }

    if (nextEdge !== undefined) {
      nextEdge._computation += 1;
      var _currentComputation = nextEdge._computation;
      promises.push(new Promise(function (resolve, reject) {
        callback.call(null, marker, nextNode, function (err, route) {
          if (err !== null) {
            reject(err);
            return;
          }

          if (nextEdge._computation === _currentComputation) {
            marker.setLatLng(L.latLng(route[0]));
            nextEdge.setLatLngs(route);
          }

          resolve({
            from: marker,
            to: nextNode,
            edge: nextEdge
          });
        });
      }));
    }

    return Promise.all(promises).finally(function () {
      _this9._computing -= 1;
    }).then(function (values) {
      if (_this9._fireEvents && values.length > 0 && _this9._computing === 0) {
        _this9.fire('TrackDrawer:done', {
          routes: values
        });
      }
    });
  },
  removeNode: function removeNode(node, routingCallback) {
    var _this10 = this;

    var callback = routingCallback || this.options.routingCallback;
    var promises = [];

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:start', {});
    }

    this._computing += 1;
    var oldValue = this._fireEvents;
    this._fireEvents = false;
    this.demoteNodeToWaypoint(node);
    this._fireEvents = oldValue;

    var nodeContainer = this._getNodeContainer(node);

    var _this$_getPrevious3 = this._getPrevious(node),
        previousEdge = _this$_getPrevious3.previousEdge,
        previousNode = _this$_getPrevious3.previousNode;

    var _this$_getNext2 = this._getNext(node),
        nextEdge = _this$_getNext2.nextEdge,
        nextNode = _this$_getNext2.nextNode;

    if (previousEdge !== undefined && nextEdge !== undefined) {
      // Intermediate marker
      nextNode._routeIdPrevious = node._routeIdPrevious;
      previousEdge._endMarkerId = nextEdge._endMarkerId;
      nextEdge.removeFrom(this._getEdgeContainer(nextEdge));
      node.removeFrom(nodeContainer);
      previousEdge.setLatLngs([previousNode.getLatLng(), nextNode.getLatLng()]).setStyle({
        dashArray: '4'
      });
      previousEdge._computation += 1;
      var currentComputation = previousEdge._computation;
      promises.push(new Promise(function (resolve, reject) {
        callback.call(null, previousNode, nextNode, function (err, route) {
          if (err !== null) {
            reject(err);
            return;
          }

          if (previousEdge._computation === currentComputation) {
            previousEdge.setLatLngs(route).setStyle({
              dashArray: null
            });
          }

          resolve({
            from: previousNode,
            to: nextNode,
            edge: previousEdge
          });
        });
      }));
    } else if (previousEdge !== undefined) {
      // Last marker of path
      previousNode._routeIdNext = undefined;
      this._lastNodeId = previousEdge._startMarkerId;
      previousEdge.removeFrom(this._getEdgeContainer(previousEdge));
      node.removeFrom(nodeContainer);
    } else if (nextEdge !== undefined) {
      // First marker of path
      nextNode._routeIdPrevious = undefined;
      this._firstNodeId = nextEdge._endMarkerId;
      nextEdge.removeFrom(this._getEdgeContainer(nextEdge));
      node.removeFrom(nodeContainer);
    } else {
      // Lonely marker
      this._lastNodeId = undefined;
      this._firstNodeId = undefined;
      node.removeFrom(nodeContainer);
    }

    return Promise.all(promises).finally(function () {
      _this10._computing -= 1;
    }).then(function (routes) {
      if (_this10._fireEvents && _this10._computing === 0) {
        _this10.fire('TrackDrawer:done', {
          routes: routes
        });
      }
    });
  },
  promoteNodeToStopover: function promoteNodeToStopover(node) {
    var _this11 = this;

    if (node._promoted) {
      return this;
    }

    if (this._getNodeId(node) === this._firstNodeId) {
      node.setType('stopover');
      node._promoted = true;
      node._demoted = false;
      return this;
    }

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:start', {});
    }

    var index = this._getNodeContainerIndex(node);

    var nodes = [];
    var edges = [];
    var currentNode = node;

    do {
      nodes.push(currentNode);

      var _this$_getNext3 = this._getNext(currentNode),
          nextEdge = _this$_getNext3.nextEdge,
          nextNode = _this$_getNext3.nextNode;

      if (nextEdge === undefined) {
        break;
      }

      nodes.push(currentNode);
      edges.push(nextEdge);
      currentNode = nextNode;
    } while (currentNode.options.type !== 'stopover');

    var newNodesContainer = L.featureGroup();
    var newEdgesContainer = L.featureGroup();

    this._nodesContainers.splice(index + 1, 0, newNodesContainer);

    this._edgesContainers.splice(index + 1, 0, newEdgesContainer);

    this._currentColorIndex += 1;
    nodes.forEach(function (e) {
      e.removeFrom(_this11._getNodeContainer(e)).addTo(newNodesContainer);
    });
    edges.forEach(function (e) {
      e.removeFrom(_this11._getEdgeContainer(e)).addTo(newEdgesContainer);
    });
    newNodesContainer.setStyle({
      colorName: Colors.nameOf(this._currentColorIndex)
    });
    newEdgesContainer.setStyle({
      color: Colors.rgbOf(this._currentColorIndex)
    });
    node.setType('stopover');
    node._promoted = true;
    node._demoted = false;

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:done', {});
    }

    return this;
  },
  demoteNodeToWaypoint: function demoteNodeToWaypoint(node) {
    var _this12 = this;

    if (node._demoted) {
      return this;
    }

    var index = this._getNodeContainerIndex(node);

    if (index === 0) {
      return this;
    }

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:start', {});
    }

    var nodes = [];
    var edges = [];
    var currentNode = node;

    do {
      nodes.push(currentNode);

      var _this$_getNext4 = this._getNext(currentNode),
          nextEdge = _this$_getNext4.nextEdge,
          nextNode = _this$_getNext4.nextNode;

      if (nextEdge === undefined) {
        break;
      }

      nodes.push(currentNode);
      edges.push(nextEdge);
      currentNode = nextNode;
    } while (currentNode.options.type !== 'stopover');

    var previousNodesContainer = this._nodesContainers.get(index - 1);

    var previousEdgesContainer = this._edgesContainers.get(index - 1);

    this._nodesContainers.splice(index, 1);

    this._edgesContainers.splice(index, 1);

    nodes.forEach(function (e) {
      e.removeFrom(_this12._getNodeContainer(e)).addTo(previousNodesContainer);
    });
    edges.forEach(function (e) {
      e.removeFrom(_this12._getEdgeContainer(e)).addTo(previousEdgesContainer);
    });

    var _this$_getPrevious4 = this._getPrevious(nodes[0]),
        previousEdge = _this$_getPrevious4.previousEdge,
        previousNode = _this$_getPrevious4.previousNode;

    if (previousEdge !== undefined) {
      previousNodesContainer.setStyle({
        colorName: previousNode.options.colorName
      });
      previousEdgesContainer.setStyle({
        color: previousEdge.options.color
      });
    }

    node.setType('waypoint');
    node._promoted = false;
    node._demoted = true;

    if (this._fireEvents && this._computing === 0) {
      this.fire('TrackDrawer:done', {});
    }

    return this;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Colors":1,"./LayerContainer":2}],5:[function(_dereq_,module,exports){
(function (global){
"use strict";

var L = (typeof window !== "undefined" ? window['L'] : typeof global !== "undefined" ? global['L'] : null);

var Track = _dereq_('./Track');

var LayerContainer = _dereq_('./LayerContainer');

var Node = _dereq_('./Node');

var colors = _dereq_('./Colors');

L.TrackDrawer = {
  Track: Track,
  LayerContainer: LayerContainer,
  Node: Node,
  colors: colors,
  track: function track(options) {
    return new Track(options);
  },
  node: function node(latlng, options) {
    return new Node(latlng, options);
  }
};
module.exports = L.TrackDrawer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Colors":1,"./LayerContainer":2,"./Node":3,"./Track":4}]},{},[5]);
