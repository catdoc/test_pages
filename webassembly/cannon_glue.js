
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// Ref
/** @suppress {undefinedVars, duplicate} @this{Object} */function Ref() { throw "cannot construct a Ref, no constructor in IDL" }
Ref.prototype = Object.create(WrapperObject.prototype);
Ref.prototype.constructor = Ref;
Ref.prototype.__class__ = Ref;
Ref.__cache__ = {};
Module['Ref'] = Ref;

Ref.prototype['release'] = Ref.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Ref_release_0(self);
};;

// Constraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function Constraint() { throw "cannot construct a Constraint, no constructor in IDL" }
Constraint.prototype = Object.create(Ref.prototype);
Constraint.prototype.constructor = Constraint;
Constraint.prototype.__class__ = Constraint;
Constraint.__cache__ = {};
Module['Constraint'] = Constraint;

Constraint.prototype['enable'] = Constraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Constraint_enable_0(self);
};;

Constraint.prototype['disable'] = Constraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Constraint_disable_0(self);
};;

Constraint.prototype['getEquationCount'] = Constraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Constraint_getEquationCount_0(self);
};;

Constraint.prototype['getEquation'] = Constraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Constraint_getEquation_1(self, index), Equation);
};;

Constraint.prototype['release'] = Constraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Constraint_release_0(self);
};;

// Shape
/** @suppress {undefinedVars, duplicate} @this{Object} */function Shape() { throw "cannot construct a Shape, no constructor in IDL" }
Shape.prototype = Object.create(Ref.prototype);
Shape.prototype.constructor = Shape;
Shape.prototype.__class__ = Shape;
Shape.__cache__ = {};
Module['Shape'] = Shape;

Shape.prototype['updateBoundingSphereRadius'] = Shape.prototype.updateBoundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Shape_updateBoundingSphereRadius_0(self);
};;

Shape.prototype['volume'] = Shape.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_volume_0(self);
};;

Shape.prototype['get_id'] = Shape.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_get_id_0(self);
};;

Shape.prototype['type'] = Shape.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_type_0(self);
};;

Shape.prototype['get_boundingSphereRadius'] = Shape.prototype.get_boundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_get_boundingSphereRadius_0(self);
};;

Shape.prototype['get_collisionResponse'] = Shape.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Shape_get_collisionResponse_0(self));
};;

Shape.prototype['set_collisionResponse'] = Shape.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Shape_set_collisionResponse_1(self, val);
};;

Shape.prototype['get_collisionFilterGroup'] = Shape.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_get_collisionFilterGroup_0(self);
};;

Shape.prototype['set_collisionFilterGroup'] = Shape.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Shape_set_collisionFilterGroup_1(self, value);
};;

Shape.prototype['get_collisionFilterMask'] = Shape.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Shape_get_collisionFilterMask_0(self);
};;

Shape.prototype['set_collisionFilterMask'] = Shape.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Shape_set_collisionFilterMask_1(self, value);
};;

Shape.prototype['get_body'] = Shape.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Shape_get_body_0(self), Body);
};;

Shape.prototype['set_body'] = Shape.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Shape_set_body_1(self, body);
};;

Shape.prototype['get_material'] = Shape.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Shape_get_material_0(self), Material);
};;

Shape.prototype['set_material'] = Shape.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Shape_set_material_1(self, value);
};;

Shape.prototype['release'] = Shape.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Shape_release_0(self);
};;

// Broadphase
/** @suppress {undefinedVars, duplicate} @this{Object} */function Broadphase() { throw "cannot construct a Broadphase, no constructor in IDL" }
Broadphase.prototype = Object.create(Ref.prototype);
Broadphase.prototype.constructor = Broadphase;
Broadphase.prototype.__class__ = Broadphase;
Broadphase.__cache__ = {};
Module['Broadphase'] = Broadphase;

Broadphase.prototype['get_useBoundingBoxes'] = Broadphase.prototype.get_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Broadphase_get_useBoundingBoxes_0(self));
};;

Broadphase.prototype['set_useBoundingBoxes'] = Broadphase.prototype.set_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Broadphase_set_useBoundingBoxes_1(self, value);
};;

Broadphase.prototype['release'] = Broadphase.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Broadphase_release_0(self);
};;

// EventCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function EventCallback() { throw "cannot construct a EventCallback, no constructor in IDL" }
EventCallback.prototype = Object.create(WrapperObject.prototype);
EventCallback.prototype.constructor = EventCallback;
EventCallback.prototype.__class__ = EventCallback;
EventCallback.__cache__ = {};
Module['EventCallback'] = EventCallback;

EventCallback.prototype['setTarget'] = EventCallback.prototype.setTarget = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  _emscripten_bind_EventCallback_setTarget_1(self, target);
};;

EventCallback.prototype['target'] = EventCallback.prototype.target = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_EventCallback_target_0(self), VoidPtr);
};;

  EventCallback.prototype['__destroy__'] = EventCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_EventCallback___destroy___0(self);
};
// RayCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function RayCallback() { throw "cannot construct a RayCallback, no constructor in IDL" }
RayCallback.prototype = Object.create(WrapperObject.prototype);
RayCallback.prototype.constructor = RayCallback;
RayCallback.prototype.__class__ = RayCallback;
RayCallback.__cache__ = {};
Module['RayCallback'] = RayCallback;

  RayCallback.prototype['__destroy__'] = RayCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RayCallback___destroy___0(self);
};
// ISystem
/** @suppress {undefinedVars, duplicate} @this{Object} */function ISystem() { throw "cannot construct a ISystem, no constructor in IDL" }
ISystem.prototype = Object.create(WrapperObject.prototype);
ISystem.prototype.constructor = ISystem;
ISystem.prototype.__class__ = ISystem;
ISystem.__cache__ = {};
Module['ISystem'] = ISystem;

// ConvexPolyhedron
/** @suppress {undefinedVars, duplicate} @this{Object} */function ConvexPolyhedron(id) {
  if (id && typeof id === 'object') id = id.ptr;
  this.ptr = _emscripten_bind_ConvexPolyhedron_ConvexPolyhedron_1(id);
  getCache(ConvexPolyhedron)[this.ptr] = this;
};;
ConvexPolyhedron.prototype = Object.create(Shape.prototype);
ConvexPolyhedron.prototype.constructor = ConvexPolyhedron;
ConvexPolyhedron.prototype.__class__ = ConvexPolyhedron;
ConvexPolyhedron.__cache__ = {};
Module['ConvexPolyhedron'] = ConvexPolyhedron;

ConvexPolyhedron.prototype['computeEdges'] = ConvexPolyhedron.prototype.computeEdges = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConvexPolyhedron_computeEdges_0(self);
};;

ConvexPolyhedron.prototype['computeNormals'] = ConvexPolyhedron.prototype.computeNormals = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConvexPolyhedron_computeNormals_0(self);
};;

ConvexPolyhedron.prototype['updateBoundingSphereRadius'] = ConvexPolyhedron.prototype.updateBoundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConvexPolyhedron_updateBoundingSphereRadius_0(self);
};;

ConvexPolyhedron.prototype['volume'] = ConvexPolyhedron.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_volume_0(self);
};;

ConvexPolyhedron.prototype['transformAllPoints'] = ConvexPolyhedron.prototype.transformAllPoints = /** @suppress {undefinedVars, duplicate} @this{Object} */function(offset, quat) {
  var self = this.ptr;
  if (offset && typeof offset === 'object') offset = offset.ptr;
  if (quat && typeof quat === 'object') quat = quat.ptr;
  _emscripten_bind_ConvexPolyhedron_transformAllPoints_2(self, offset, quat);
};;

ConvexPolyhedron.prototype['get_worldVerticesNeedsUpdate'] = ConvexPolyhedron.prototype.get_worldVerticesNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexPolyhedron_get_worldVerticesNeedsUpdate_0(self));
};;

ConvexPolyhedron.prototype['set_worldVerticesNeedsUpdate'] = ConvexPolyhedron.prototype.set_worldVerticesNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ConvexPolyhedron_set_worldVerticesNeedsUpdate_1(self, val);
};;

ConvexPolyhedron.prototype['get_worldFaceNormalsNeedsUpdate'] = ConvexPolyhedron.prototype.get_worldFaceNormalsNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexPolyhedron_get_worldFaceNormalsNeedsUpdate_0(self));
};;

ConvexPolyhedron.prototype['set_worldFaceNormalsNeedsUpdate'] = ConvexPolyhedron.prototype.set_worldFaceNormalsNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ConvexPolyhedron_set_worldFaceNormalsNeedsUpdate_1(self, val);
};;

ConvexPolyhedron.prototype['set_vertices'] = ConvexPolyhedron.prototype.set_vertices = /** @suppress {undefinedVars, duplicate} @this{Object} */function(vertices, verticeCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof vertices == 'object') { vertices = ensureFloat32(vertices); }
  if (verticeCount && typeof verticeCount === 'object') verticeCount = verticeCount.ptr;
  _emscripten_bind_ConvexPolyhedron_set_vertices_2(self, vertices, verticeCount);
};;

ConvexPolyhedron.prototype['set_faces'] = ConvexPolyhedron.prototype.set_faces = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faces, faceCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof faces == 'object') { faces = ensureInt32(faces); }
  if (faceCount && typeof faceCount === 'object') faceCount = faceCount.ptr;
  _emscripten_bind_ConvexPolyhedron_set_faces_2(self, faces, faceCount);
};;

ConvexPolyhedron.prototype['set_uniqueAxes'] = ConvexPolyhedron.prototype.set_uniqueAxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(vertices, verticeCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof vertices == 'object') { vertices = ensureFloat32(vertices); }
  if (verticeCount && typeof verticeCount === 'object') verticeCount = verticeCount.ptr;
  _emscripten_bind_ConvexPolyhedron_set_uniqueAxes_2(self, vertices, verticeCount);
};;

ConvexPolyhedron.prototype['getVerticeCount'] = ConvexPolyhedron.prototype.getVerticeCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_getVerticeCount_0(self);
};;

ConvexPolyhedron.prototype['getVertice'] = ConvexPolyhedron.prototype.getVertice = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_ConvexPolyhedron_getVertice_1(self, index), Vec3);
};;

ConvexPolyhedron.prototype['getFaceCount'] = ConvexPolyhedron.prototype.getFaceCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_getFaceCount_0(self);
};;

ConvexPolyhedron.prototype['getFacePointCount'] = ConvexPolyhedron.prototype.getFacePointCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faceIndex) {
  var self = this.ptr;
  if (faceIndex && typeof faceIndex === 'object') faceIndex = faceIndex.ptr;
  return _emscripten_bind_ConvexPolyhedron_getFacePointCount_1(self, faceIndex);
};;

ConvexPolyhedron.prototype['getFacePoint'] = ConvexPolyhedron.prototype.getFacePoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faceIndex, pointIndex) {
  var self = this.ptr;
  if (faceIndex && typeof faceIndex === 'object') faceIndex = faceIndex.ptr;
  if (pointIndex && typeof pointIndex === 'object') pointIndex = pointIndex.ptr;
  return _emscripten_bind_ConvexPolyhedron_getFacePoint_2(self, faceIndex, pointIndex);
};;

ConvexPolyhedron.prototype['getUniqueAxesCount'] = ConvexPolyhedron.prototype.getUniqueAxesCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_getUniqueAxesCount_0(self);
};;

ConvexPolyhedron.prototype['getUniqueAxes'] = ConvexPolyhedron.prototype.getUniqueAxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_ConvexPolyhedron_getUniqueAxes_1(self, index), Vec3);
};;

ConvexPolyhedron.prototype['release'] = ConvexPolyhedron.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConvexPolyhedron_release_0(self);
};;

ConvexPolyhedron.prototype['get_id'] = ConvexPolyhedron.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_get_id_0(self);
};;

ConvexPolyhedron.prototype['type'] = ConvexPolyhedron.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_type_0(self);
};;

ConvexPolyhedron.prototype['get_collisionResponse'] = ConvexPolyhedron.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexPolyhedron_get_collisionResponse_0(self));
};;

ConvexPolyhedron.prototype['set_collisionResponse'] = ConvexPolyhedron.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ConvexPolyhedron_set_collisionResponse_1(self, val);
};;

ConvexPolyhedron.prototype['get_collisionFilterGroup'] = ConvexPolyhedron.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_get_collisionFilterGroup_0(self);
};;

ConvexPolyhedron.prototype['set_collisionFilterGroup'] = ConvexPolyhedron.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_ConvexPolyhedron_set_collisionFilterGroup_1(self, value);
};;

ConvexPolyhedron.prototype['get_collisionFilterMask'] = ConvexPolyhedron.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexPolyhedron_get_collisionFilterMask_0(self);
};;

ConvexPolyhedron.prototype['set_collisionFilterMask'] = ConvexPolyhedron.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_ConvexPolyhedron_set_collisionFilterMask_1(self, value);
};;

ConvexPolyhedron.prototype['get_body'] = ConvexPolyhedron.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ConvexPolyhedron_get_body_0(self), Body);
};;

ConvexPolyhedron.prototype['set_body'] = ConvexPolyhedron.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_ConvexPolyhedron_set_body_1(self, body);
};;

ConvexPolyhedron.prototype['get_material'] = ConvexPolyhedron.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ConvexPolyhedron_get_material_0(self), Material);
};;

ConvexPolyhedron.prototype['set_material'] = ConvexPolyhedron.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_ConvexPolyhedron_set_material_1(self, value);
};;

// Equation
/** @suppress {undefinedVars, duplicate} @this{Object} */function Equation() { throw "cannot construct a Equation, no constructor in IDL" }
Equation.prototype = Object.create(Ref.prototype);
Equation.prototype.constructor = Equation;
Equation.prototype.__class__ = Equation;
Equation.__cache__ = {};
Module['Equation'] = Equation;

Equation.prototype['get_bi'] = Equation.prototype.get_bi = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Equation_get_bi_0(self), Body);
};;

Equation.prototype['get_bj'] = Equation.prototype.get_bj = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Equation_get_bj_0(self), Body);
};;

Equation.prototype['release'] = Equation.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Equation_release_0(self);
};;

// Solver
/** @suppress {undefinedVars, duplicate} @this{Object} */function Solver() { throw "cannot construct a Solver, no constructor in IDL" }
Solver.prototype = Object.create(WrapperObject.prototype);
Solver.prototype.constructor = Solver;
Solver.prototype.__class__ = Solver;
Solver.__cache__ = {};
Module['Solver'] = Solver;

Solver.prototype['get_iterations'] = Solver.prototype.get_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Solver_get_iterations_0(self);
};;

Solver.prototype['set_iterations'] = Solver.prototype.set_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Solver_set_iterations_1(self, value);
};;

Solver.prototype['get_tolerance'] = Solver.prototype.get_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Solver_get_tolerance_0(self);
};;

Solver.prototype['set_tolerance'] = Solver.prototype.set_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Solver_set_tolerance_1(self, value);
};;

// PointToPointConstraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function PointToPointConstraint(id, bodyA, bodyB, pivotA, pivotB, maxForce, collideConnected, wakeUpBodies) {
  if (id && typeof id === 'object') id = id.ptr;
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (pivotA && typeof pivotA === 'object') pivotA = pivotA.ptr;
  if (pivotB && typeof pivotB === 'object') pivotB = pivotB.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  if (collideConnected && typeof collideConnected === 'object') collideConnected = collideConnected.ptr;
  if (wakeUpBodies && typeof wakeUpBodies === 'object') wakeUpBodies = wakeUpBodies.ptr;
  if (pivotA === undefined) { this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_3(id, bodyA, bodyB); getCache(PointToPointConstraint)[this.ptr] = this;return }
  if (pivotB === undefined) { this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_4(id, bodyA, bodyB, pivotA); getCache(PointToPointConstraint)[this.ptr] = this;return }
  if (maxForce === undefined) { this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_5(id, bodyA, bodyB, pivotA, pivotB); getCache(PointToPointConstraint)[this.ptr] = this;return }
  if (collideConnected === undefined) { this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_6(id, bodyA, bodyB, pivotA, pivotB, maxForce); getCache(PointToPointConstraint)[this.ptr] = this;return }
  if (wakeUpBodies === undefined) { this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_7(id, bodyA, bodyB, pivotA, pivotB, maxForce, collideConnected); getCache(PointToPointConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_PointToPointConstraint_PointToPointConstraint_8(id, bodyA, bodyB, pivotA, pivotB, maxForce, collideConnected, wakeUpBodies);
  getCache(PointToPointConstraint)[this.ptr] = this;
};;
PointToPointConstraint.prototype = Object.create(Constraint.prototype);
PointToPointConstraint.prototype.constructor = PointToPointConstraint;
PointToPointConstraint.prototype.__class__ = PointToPointConstraint;
PointToPointConstraint.__cache__ = {};
Module['PointToPointConstraint'] = PointToPointConstraint;

PointToPointConstraint.prototype['enable'] = PointToPointConstraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_PointToPointConstraint_enable_0(self);
};;

PointToPointConstraint.prototype['disable'] = PointToPointConstraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_PointToPointConstraint_disable_0(self);
};;

PointToPointConstraint.prototype['getEquationCount'] = PointToPointConstraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_PointToPointConstraint_getEquationCount_0(self);
};;

PointToPointConstraint.prototype['getEquation'] = PointToPointConstraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_PointToPointConstraint_getEquation_1(self, index), Equation);
};;

PointToPointConstraint.prototype['release'] = PointToPointConstraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_PointToPointConstraint_release_0(self);
};;

// NaiveBroadphase
/** @suppress {undefinedVars, duplicate} @this{Object} */function NaiveBroadphase() {
  this.ptr = _emscripten_bind_NaiveBroadphase_NaiveBroadphase_0();
  getCache(NaiveBroadphase)[this.ptr] = this;
};;
NaiveBroadphase.prototype = Object.create(Broadphase.prototype);
NaiveBroadphase.prototype.constructor = NaiveBroadphase;
NaiveBroadphase.prototype.__class__ = NaiveBroadphase;
NaiveBroadphase.__cache__ = {};
Module['NaiveBroadphase'] = NaiveBroadphase;

NaiveBroadphase.prototype['get_useBoundingBoxes'] = NaiveBroadphase.prototype.get_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_NaiveBroadphase_get_useBoundingBoxes_0(self));
};;

NaiveBroadphase.prototype['set_useBoundingBoxes'] = NaiveBroadphase.prototype.set_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_NaiveBroadphase_set_useBoundingBoxes_1(self, value);
};;

NaiveBroadphase.prototype['release'] = NaiveBroadphase.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NaiveBroadphase_release_0(self);
};;

// LockConstraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function LockConstraint(id, bodyA, bodyB, maxForce, axisA, axisB, collideConnected, wakeUpBodies) {
  if (id && typeof id === 'object') id = id.ptr;
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  if (axisA && typeof axisA === 'object') axisA = axisA.ptr;
  if (axisB && typeof axisB === 'object') axisB = axisB.ptr;
  if (collideConnected && typeof collideConnected === 'object') collideConnected = collideConnected.ptr;
  if (wakeUpBodies && typeof wakeUpBodies === 'object') wakeUpBodies = wakeUpBodies.ptr;
  if (maxForce === undefined) { this.ptr = _emscripten_bind_LockConstraint_LockConstraint_3(id, bodyA, bodyB); getCache(LockConstraint)[this.ptr] = this;return }
  if (axisA === undefined) { this.ptr = _emscripten_bind_LockConstraint_LockConstraint_4(id, bodyA, bodyB, maxForce); getCache(LockConstraint)[this.ptr] = this;return }
  if (axisB === undefined) { this.ptr = _emscripten_bind_LockConstraint_LockConstraint_5(id, bodyA, bodyB, maxForce, axisA); getCache(LockConstraint)[this.ptr] = this;return }
  if (collideConnected === undefined) { this.ptr = _emscripten_bind_LockConstraint_LockConstraint_6(id, bodyA, bodyB, maxForce, axisA, axisB); getCache(LockConstraint)[this.ptr] = this;return }
  if (wakeUpBodies === undefined) { this.ptr = _emscripten_bind_LockConstraint_LockConstraint_7(id, bodyA, bodyB, maxForce, axisA, axisB, collideConnected); getCache(LockConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_LockConstraint_LockConstraint_8(id, bodyA, bodyB, maxForce, axisA, axisB, collideConnected, wakeUpBodies);
  getCache(LockConstraint)[this.ptr] = this;
};;
LockConstraint.prototype = Object.create(PointToPointConstraint.prototype);
LockConstraint.prototype.constructor = LockConstraint;
LockConstraint.prototype.__class__ = LockConstraint;
LockConstraint.__cache__ = {};
Module['LockConstraint'] = LockConstraint;

LockConstraint.prototype['enable'] = LockConstraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_LockConstraint_enable_0(self);
};;

LockConstraint.prototype['disable'] = LockConstraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_LockConstraint_disable_0(self);
};;

LockConstraint.prototype['getEquationCount'] = LockConstraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_LockConstraint_getEquationCount_0(self);
};;

LockConstraint.prototype['getEquation'] = LockConstraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_LockConstraint_getEquation_1(self, index), Equation);
};;

LockConstraint.prototype['release'] = LockConstraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_LockConstraint_release_0(self);
};;

// DistanceConstraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function DistanceConstraint(id, bodyA, bodyB, distance, maxForce, collideConnected, wakeUpBodies) {
  if (id && typeof id === 'object') id = id.ptr;
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (distance && typeof distance === 'object') distance = distance.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  if (collideConnected && typeof collideConnected === 'object') collideConnected = collideConnected.ptr;
  if (wakeUpBodies && typeof wakeUpBodies === 'object') wakeUpBodies = wakeUpBodies.ptr;
  if (distance === undefined) { this.ptr = _emscripten_bind_DistanceConstraint_DistanceConstraint_3(id, bodyA, bodyB); getCache(DistanceConstraint)[this.ptr] = this;return }
  if (maxForce === undefined) { this.ptr = _emscripten_bind_DistanceConstraint_DistanceConstraint_4(id, bodyA, bodyB, distance); getCache(DistanceConstraint)[this.ptr] = this;return }
  if (collideConnected === undefined) { this.ptr = _emscripten_bind_DistanceConstraint_DistanceConstraint_5(id, bodyA, bodyB, distance, maxForce); getCache(DistanceConstraint)[this.ptr] = this;return }
  if (wakeUpBodies === undefined) { this.ptr = _emscripten_bind_DistanceConstraint_DistanceConstraint_6(id, bodyA, bodyB, distance, maxForce, collideConnected); getCache(DistanceConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_DistanceConstraint_DistanceConstraint_7(id, bodyA, bodyB, distance, maxForce, collideConnected, wakeUpBodies);
  getCache(DistanceConstraint)[this.ptr] = this;
};;
DistanceConstraint.prototype = Object.create(Constraint.prototype);
DistanceConstraint.prototype.constructor = DistanceConstraint;
DistanceConstraint.prototype.__class__ = DistanceConstraint;
DistanceConstraint.__cache__ = {};
Module['DistanceConstraint'] = DistanceConstraint;

DistanceConstraint.prototype['enable'] = DistanceConstraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_DistanceConstraint_enable_0(self);
};;

DistanceConstraint.prototype['disable'] = DistanceConstraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_DistanceConstraint_disable_0(self);
};;

DistanceConstraint.prototype['getEquationCount'] = DistanceConstraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_DistanceConstraint_getEquationCount_0(self);
};;

DistanceConstraint.prototype['getEquation'] = DistanceConstraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_DistanceConstraint_getEquation_1(self, index), Equation);
};;

DistanceConstraint.prototype['release'] = DistanceConstraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_DistanceConstraint_release_0(self);
};;

// GSSolver
/** @suppress {undefinedVars, duplicate} @this{Object} */function GSSolver() {
  this.ptr = _emscripten_bind_GSSolver_GSSolver_0();
  getCache(GSSolver)[this.ptr] = this;
};;
GSSolver.prototype = Object.create(Solver.prototype);
GSSolver.prototype.constructor = GSSolver;
GSSolver.prototype.__class__ = GSSolver;
GSSolver.__cache__ = {};
Module['GSSolver'] = GSSolver;

GSSolver.prototype['get_iterations'] = GSSolver.prototype.get_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_GSSolver_get_iterations_0(self);
};;

GSSolver.prototype['set_iterations'] = GSSolver.prototype.set_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_GSSolver_set_iterations_1(self, value);
};;

GSSolver.prototype['get_tolerance'] = GSSolver.prototype.get_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_GSSolver_get_tolerance_0(self);
};;

GSSolver.prototype['set_tolerance'] = GSSolver.prototype.set_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_GSSolver_set_tolerance_1(self, value);
};;

// Transform
/** @suppress {undefinedVars, duplicate} @this{Object} */function Transform(position, quaternion) {
  if (position && typeof position === 'object') position = position.ptr;
  if (quaternion && typeof quaternion === 'object') quaternion = quaternion.ptr;
  if (position === undefined) { this.ptr = _emscripten_bind_Transform_Transform_0(); getCache(Transform)[this.ptr] = this;return }
  if (quaternion === undefined) { this.ptr = _emscripten_bind_Transform_Transform_1(position); getCache(Transform)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Transform_Transform_2(position, quaternion);
  getCache(Transform)[this.ptr] = this;
};;
Transform.prototype = Object.create(WrapperObject.prototype);
Transform.prototype.constructor = Transform;
Transform.prototype.__class__ = Transform;
Transform.__cache__ = {};
Module['Transform'] = Transform;

  Transform.prototype['get_position'] = Transform.prototype.get_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Transform_get_position_0(self), Vec3);
};
    Transform.prototype['set_position'] = Transform.prototype.set_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Transform_set_position_1(self, arg0);
};
    Object.defineProperty(Transform.prototype, 'position', { get: Transform.prototype.get_position, set: Transform.prototype.set_position });
  Transform.prototype['get_quaternion'] = Transform.prototype.get_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Transform_get_quaternion_0(self), Quaternion);
};
    Transform.prototype['set_quaternion'] = Transform.prototype.set_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Transform_set_quaternion_1(self, arg0);
};
    Object.defineProperty(Transform.prototype, 'quaternion', { get: Transform.prototype.get_quaternion, set: Transform.prototype.set_quaternion });
  Transform.prototype['__destroy__'] = Transform.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Transform___destroy___0(self);
};
// ConeTwistConstraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function ConeTwistConstraint(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, angle, collideConnected, twistAngle) {
  if (id && typeof id === 'object') id = id.ptr;
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (pivotA && typeof pivotA === 'object') pivotA = pivotA.ptr;
  if (pivotB && typeof pivotB === 'object') pivotB = pivotB.ptr;
  if (axisA && typeof axisA === 'object') axisA = axisA.ptr;
  if (axisB && typeof axisB === 'object') axisB = axisB.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  if (collideConnected && typeof collideConnected === 'object') collideConnected = collideConnected.ptr;
  if (twistAngle && typeof twistAngle === 'object') twistAngle = twistAngle.ptr;
  if (pivotA === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_3(id, bodyA, bodyB); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (pivotB === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_4(id, bodyA, bodyB, pivotA); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (axisA === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_5(id, bodyA, bodyB, pivotA, pivotB); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (axisB === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_6(id, bodyA, bodyB, pivotA, pivotB, axisA); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (maxForce === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_7(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (angle === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_8(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (collideConnected === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_9(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, angle); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  if (twistAngle === undefined) { this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_10(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, angle, collideConnected); getCache(ConeTwistConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_11(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, angle, collideConnected, twistAngle);
  getCache(ConeTwistConstraint)[this.ptr] = this;
};;
ConeTwistConstraint.prototype = Object.create(PointToPointConstraint.prototype);
ConeTwistConstraint.prototype.constructor = ConeTwistConstraint;
ConeTwistConstraint.prototype.__class__ = ConeTwistConstraint;
ConeTwistConstraint.__cache__ = {};
Module['ConeTwistConstraint'] = ConeTwistConstraint;

ConeTwistConstraint.prototype['enable'] = ConeTwistConstraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConeTwistConstraint_enable_0(self);
};;

ConeTwistConstraint.prototype['disable'] = ConeTwistConstraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConeTwistConstraint_disable_0(self);
};;

ConeTwistConstraint.prototype['getEquationCount'] = ConeTwistConstraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConeTwistConstraint_getEquationCount_0(self);
};;

ConeTwistConstraint.prototype['getEquation'] = ConeTwistConstraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_ConeTwistConstraint_getEquation_1(self, index), Equation);
};;

ConeTwistConstraint.prototype['release'] = ConeTwistConstraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ConeTwistConstraint_release_0(self);
};;

// SpringOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function SpringOptions() {
  this.ptr = _emscripten_bind_SpringOptions_SpringOptions_0();
  getCache(SpringOptions)[this.ptr] = this;
};;
SpringOptions.prototype = Object.create(WrapperObject.prototype);
SpringOptions.prototype.constructor = SpringOptions;
SpringOptions.prototype.__class__ = SpringOptions;
SpringOptions.__cache__ = {};
Module['SpringOptions'] = SpringOptions;

SpringOptions.prototype['setWorldAnchorA'] = SpringOptions.prototype.setWorldAnchorA = /** @suppress {undefinedVars, duplicate} @this{Object} */function(worldAnchorA) {
  var self = this.ptr;
  if (worldAnchorA && typeof worldAnchorA === 'object') worldAnchorA = worldAnchorA.ptr;
  _emscripten_bind_SpringOptions_setWorldAnchorA_1(self, worldAnchorA);
};;

SpringOptions.prototype['setWorldAnchorB'] = SpringOptions.prototype.setWorldAnchorB = /** @suppress {undefinedVars, duplicate} @this{Object} */function(worldAnchorB) {
  var self = this.ptr;
  if (worldAnchorB && typeof worldAnchorB === 'object') worldAnchorB = worldAnchorB.ptr;
  _emscripten_bind_SpringOptions_setWorldAnchorB_1(self, worldAnchorB);
};;

SpringOptions.prototype['setLocalAnchorA'] = SpringOptions.prototype.setLocalAnchorA = /** @suppress {undefinedVars, duplicate} @this{Object} */function(localAnchorA) {
  var self = this.ptr;
  if (localAnchorA && typeof localAnchorA === 'object') localAnchorA = localAnchorA.ptr;
  _emscripten_bind_SpringOptions_setLocalAnchorA_1(self, localAnchorA);
};;

SpringOptions.prototype['setLocalAnchorB'] = SpringOptions.prototype.setLocalAnchorB = /** @suppress {undefinedVars, duplicate} @this{Object} */function(localAnchorB) {
  var self = this.ptr;
  if (localAnchorB && typeof localAnchorB === 'object') localAnchorB = localAnchorB.ptr;
  _emscripten_bind_SpringOptions_setLocalAnchorB_1(self, localAnchorB);
};;

  SpringOptions.prototype['__destroy__'] = SpringOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_SpringOptions___destroy___0(self);
};
// GridBroadphase
/** @suppress {undefinedVars, duplicate} @this{Object} */function GridBroadphase() {
  this.ptr = _emscripten_bind_GridBroadphase_GridBroadphase_0();
  getCache(GridBroadphase)[this.ptr] = this;
};;
GridBroadphase.prototype = Object.create(Broadphase.prototype);
GridBroadphase.prototype.constructor = GridBroadphase;
GridBroadphase.prototype.__class__ = GridBroadphase;
GridBroadphase.__cache__ = {};
Module['GridBroadphase'] = GridBroadphase;

GridBroadphase.prototype['get_useBoundingBoxes'] = GridBroadphase.prototype.get_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_GridBroadphase_get_useBoundingBoxes_0(self));
};;

GridBroadphase.prototype['set_useBoundingBoxes'] = GridBroadphase.prototype.set_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_GridBroadphase_set_useBoundingBoxes_1(self, value);
};;

GridBroadphase.prototype['release'] = GridBroadphase.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_GridBroadphase_release_0(self);
};;

// ContactMaterial
/** @suppress {undefinedVars, duplicate} @this{Object} */function ContactMaterial(m1, m2, id, options) {
  if (m1 && typeof m1 === 'object') m1 = m1.ptr;
  if (m2 && typeof m2 === 'object') m2 = m2.ptr;
  if (id && typeof id === 'object') id = id.ptr;
  if (options && typeof options === 'object') options = options.ptr;
  if (options === undefined) { this.ptr = _emscripten_bind_ContactMaterial_ContactMaterial_3(m1, m2, id); getCache(ContactMaterial)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_ContactMaterial_ContactMaterial_4(m1, m2, id, options);
  getCache(ContactMaterial)[this.ptr] = this;
};;
ContactMaterial.prototype = Object.create(Ref.prototype);
ContactMaterial.prototype.constructor = ContactMaterial;
ContactMaterial.prototype.__class__ = ContactMaterial;
ContactMaterial.__cache__ = {};
Module['ContactMaterial'] = ContactMaterial;

ContactMaterial.prototype['m1'] = ContactMaterial.prototype.m1 = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactMaterial_m1_0(self), Material);
};;

ContactMaterial.prototype['m2'] = ContactMaterial.prototype.m2 = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactMaterial_m2_0(self), Material);
};;

ContactMaterial.prototype['get_friction'] = ContactMaterial.prototype.get_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_friction_0(self);
};;

ContactMaterial.prototype['get_restitution'] = ContactMaterial.prototype.get_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_restitution_0(self);
};;

ContactMaterial.prototype['get_contactEquationStiffness'] = ContactMaterial.prototype.get_contactEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_contactEquationStiffness_0(self);
};;

ContactMaterial.prototype['get_contactEquationRelaxation'] = ContactMaterial.prototype.get_contactEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_contactEquationRelaxation_0(self);
};;

ContactMaterial.prototype['get_frictionEquationStiffness'] = ContactMaterial.prototype.get_frictionEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_frictionEquationStiffness_0(self);
};;

ContactMaterial.prototype['get_frictionEquationRelaxation'] = ContactMaterial.prototype.get_frictionEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterial_get_frictionEquationRelaxation_0(self);
};;

ContactMaterial.prototype['set_friction'] = ContactMaterial.prototype.set_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_friction_1(self, val);
};;

ContactMaterial.prototype['set_restitution'] = ContactMaterial.prototype.set_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_restitution_1(self, val);
};;

ContactMaterial.prototype['set_contactEquationStiffness'] = ContactMaterial.prototype.set_contactEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_contactEquationStiffness_1(self, val);
};;

ContactMaterial.prototype['set_contactEquationRelaxation'] = ContactMaterial.prototype.set_contactEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_contactEquationRelaxation_1(self, val);
};;

ContactMaterial.prototype['set_frictionEquationStiffness'] = ContactMaterial.prototype.set_frictionEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_frictionEquationStiffness_1(self, val);
};;

ContactMaterial.prototype['set_frictionEquationRelaxation'] = ContactMaterial.prototype.set_frictionEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_ContactMaterial_set_frictionEquationRelaxation_1(self, val);
};;

ContactMaterial.prototype['release'] = ContactMaterial.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ContactMaterial_release_0(self);
};;

// ShapeOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function ShapeOptions(id, type, collisionResponse, collisionFilterGroup, collisionFilterMask, material) {
  if (id && typeof id === 'object') id = id.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  if (collisionResponse && typeof collisionResponse === 'object') collisionResponse = collisionResponse.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (material && typeof material === 'object') material = material.ptr;
  if (id === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_0(); getCache(ShapeOptions)[this.ptr] = this;return }
  if (type === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_1(id); getCache(ShapeOptions)[this.ptr] = this;return }
  if (collisionResponse === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_2(id, type); getCache(ShapeOptions)[this.ptr] = this;return }
  if (collisionFilterGroup === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_3(id, type, collisionResponse); getCache(ShapeOptions)[this.ptr] = this;return }
  if (collisionFilterMask === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_4(id, type, collisionResponse, collisionFilterGroup); getCache(ShapeOptions)[this.ptr] = this;return }
  if (material === undefined) { this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_5(id, type, collisionResponse, collisionFilterGroup, collisionFilterMask); getCache(ShapeOptions)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_ShapeOptions_ShapeOptions_6(id, type, collisionResponse, collisionFilterGroup, collisionFilterMask, material);
  getCache(ShapeOptions)[this.ptr] = this;
};;
ShapeOptions.prototype = Object.create(WrapperObject.prototype);
ShapeOptions.prototype.constructor = ShapeOptions;
ShapeOptions.prototype.__class__ = ShapeOptions;
ShapeOptions.__cache__ = {};
Module['ShapeOptions'] = ShapeOptions;

  ShapeOptions.prototype['__destroy__'] = ShapeOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ShapeOptions___destroy___0(self);
};
// Body
/** @suppress {undefinedVars, duplicate} @this{Object} */function Body(options) {
  if (options && typeof options === 'object') options = options.ptr;
  this.ptr = _emscripten_bind_Body_Body_1(options);
  getCache(Body)[this.ptr] = this;
};;
Body.prototype = Object.create(Ref.prototype);
Body.prototype.constructor = Body;
Body.prototype.__class__ = Body;
Body.__cache__ = {};
Module['Body'] = Body;

Body.prototype['wakeUp'] = Body.prototype.wakeUp = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_wakeUp_0(self);
};;

Body.prototype['sleep'] = Body.prototype.sleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_sleep_0(self);
};;

Body.prototype['addShape'] = Body.prototype.addShape = /** @suppress {undefinedVars, duplicate} @this{Object} */function(shape, offset, orientation) {
  var self = this.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (offset && typeof offset === 'object') offset = offset.ptr;
  if (orientation && typeof orientation === 'object') orientation = orientation.ptr;
  if (offset === undefined) { _emscripten_bind_Body_addShape_1(self, shape);  return }
  if (orientation === undefined) { _emscripten_bind_Body_addShape_2(self, shape, offset);  return }
  _emscripten_bind_Body_addShape_3(self, shape, offset, orientation);
};;

Body.prototype['removeShape'] = Body.prototype.removeShape = /** @suppress {undefinedVars, duplicate} @this{Object} */function(shape) {
  var self = this.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  _emscripten_bind_Body_removeShape_1(self, shape);
};;

Body.prototype['updateBoundingRadius'] = Body.prototype.updateBoundingRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_updateBoundingRadius_0(self);
};;

Body.prototype['computeAABB'] = Body.prototype.computeAABB = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_computeAABB_0(self);
};;

Body.prototype['updateInertiaWorld'] = Body.prototype.updateInertiaWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(force) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  _emscripten_bind_Body_updateInertiaWorld_1(self, force);
};;

Body.prototype['applyForce'] = Body.prototype.applyForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(force, relativePoint) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  if (relativePoint && typeof relativePoint === 'object') relativePoint = relativePoint.ptr;
  _emscripten_bind_Body_applyForce_2(self, force, relativePoint);
};;

Body.prototype['applyLocalForce'] = Body.prototype.applyLocalForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(localForce, localPoint) {
  var self = this.ptr;
  if (localForce && typeof localForce === 'object') localForce = localForce.ptr;
  if (localPoint && typeof localPoint === 'object') localPoint = localPoint.ptr;
  _emscripten_bind_Body_applyLocalForce_2(self, localForce, localPoint);
};;

Body.prototype['applyImpulse'] = Body.prototype.applyImpulse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(impulse, relativePoint) {
  var self = this.ptr;
  if (impulse && typeof impulse === 'object') impulse = impulse.ptr;
  if (relativePoint && typeof relativePoint === 'object') relativePoint = relativePoint.ptr;
  _emscripten_bind_Body_applyImpulse_2(self, impulse, relativePoint);
};;

Body.prototype['applyLocalImpulse'] = Body.prototype.applyLocalImpulse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(localImpulse, localPoint) {
  var self = this.ptr;
  if (localImpulse && typeof localImpulse === 'object') localImpulse = localImpulse.ptr;
  if (localPoint && typeof localPoint === 'object') localPoint = localPoint.ptr;
  _emscripten_bind_Body_applyLocalImpulse_2(self, localImpulse, localPoint);
};;

Body.prototype['updateMassProperties'] = Body.prototype.updateMassProperties = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_updateMassProperties_0(self);
};;

Body.prototype['getVelocityAtWorldPoint'] = Body.prototype.getVelocityAtWorldPoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(worldPoint, result) {
  var self = this.ptr;
  if (worldPoint && typeof worldPoint === 'object') worldPoint = worldPoint.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  return wrapPointer(_emscripten_bind_Body_getVelocityAtWorldPoint_2(self, worldPoint, result), Vec3);
};;

Body.prototype['vectorToWorldFrame'] = Body.prototype.vectorToWorldFrame = /** @suppress {undefinedVars, duplicate} @this{Object} */function(localVector, result) {
  var self = this.ptr;
  if (localVector && typeof localVector === 'object') localVector = localVector.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  return wrapPointer(_emscripten_bind_Body_vectorToWorldFrame_2(self, localVector, result), Vec3);
};;

Body.prototype['isSleeping'] = Body.prototype.isSleeping = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_isSleeping_0(self));
};;

Body.prototype['isSleepy'] = Body.prototype.isSleepy = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_isSleepy_0(self));
};;

Body.prototype['isAwake'] = Body.prototype.isAwake = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_isAwake_0(self));
};;

Body.prototype['get_id'] = Body.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_id_0(self);
};;

Body.prototype['world'] = Body.prototype.world = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_world_0(self), World);
};;

Body.prototype['setWorld'] = Body.prototype.setWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(world) {
  var self = this.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  _emscripten_bind_Body_setWorld_1(self, world);
};;

Body.prototype['updateHasTrigger'] = Body.prototype.updateHasTrigger = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_updateHasTrigger_0(self);
};;

Body.prototype['get_material'] = Body.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_material_0(self), Material);
};;

Body.prototype['set_material'] = Body.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_material_1(self, value);
};;

Body.prototype['get_mass'] = Body.prototype.get_mass = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_mass_0(self);
};;

Body.prototype['set_mass'] = Body.prototype.set_mass = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_mass_1(self, value);
};;

Body.prototype['get_type'] = Body.prototype.get_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_type_0(self);
};;

Body.prototype['set_type'] = Body.prototype.set_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_type_1(self, value);
};;

Body.prototype['get_allowSleep'] = Body.prototype.get_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_get_allowSleep_0(self));
};;

Body.prototype['set_allowSleep'] = Body.prototype.set_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_allowSleep_1(self, value);
};;

Body.prototype['shapesLength'] = Body.prototype.shapesLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_shapesLength_0(self);
};;

Body.prototype['getShape'] = Body.prototype.getShape = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Body_getShape_1(self, index), Shape);
};;

Body.prototype['getShapeOffset'] = Body.prototype.getShapeOffset = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Body_getShapeOffset_1(self, index), Vec3);
};;

Body.prototype['getShapeOrientation'] = Body.prototype.getShapeOrientation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Body_getShapeOrientation_1(self, index), Quaternion);
};;

Body.prototype['get_position'] = Body.prototype.get_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_position_0(self), Vec3);
};;

Body.prototype['set_position'] = Body.prototype.set_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_position_1(self, value);
};;

Body.prototype['get_quaternion'] = Body.prototype.get_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_quaternion_0(self), Quaternion);
};;

Body.prototype['set_quaternion'] = Body.prototype.set_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_quaternion_1(self, value);
};;

Body.prototype['get_velocity'] = Body.prototype.get_velocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_velocity_0(self), Vec3);
};;

Body.prototype['set_velocity'] = Body.prototype.set_velocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_velocity_1(self, value);
};;

Body.prototype['get_torque'] = Body.prototype.get_torque = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_torque_0(self), Vec3);
};;

Body.prototype['set_torque'] = Body.prototype.set_torque = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_torque_1(self, value);
};;

Body.prototype['get_force'] = Body.prototype.get_force = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_force_0(self), Vec3);
};;

Body.prototype['set_force'] = Body.prototype.set_force = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_force_1(self, value);
};;

Body.prototype['get_angularVelocity'] = Body.prototype.get_angularVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_angularVelocity_0(self), Vec3);
};;

Body.prototype['set_angularVelocity'] = Body.prototype.set_angularVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_angularVelocity_1(self, value);
};;

Body.prototype['get_angularFactor'] = Body.prototype.get_angularFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_angularFactor_0(self), Vec3);
};;

Body.prototype['set_angularFactor'] = Body.prototype.set_angularFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_angularFactor_1(self, value);
};;

Body.prototype['get_linearFactor'] = Body.prototype.get_linearFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_linearFactor_0(self), Vec3);
};;

Body.prototype['set_linearFactor'] = Body.prototype.set_linearFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_linearFactor_1(self, value);
};;

Body.prototype['get_fixedRotation'] = Body.prototype.get_fixedRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_get_fixedRotation_0(self));
};;

Body.prototype['set_fixedRotation'] = Body.prototype.set_fixedRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Body_set_fixedRotation_1(self, val);
};;

Body.prototype['get_useGravity'] = Body.prototype.get_useGravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_get_useGravity_0(self));
};;

Body.prototype['set_useGravity'] = Body.prototype.set_useGravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_useGravity_1(self, value);
};;

Body.prototype['get_linearDamping'] = Body.prototype.get_linearDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_linearDamping_0(self);
};;

Body.prototype['set_linearDamping'] = Body.prototype.set_linearDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_linearDamping_1(self, value);
};;

Body.prototype['get_collisionResponse'] = Body.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_get_collisionResponse_0(self));
};;

Body.prototype['set_collisionResponse'] = Body.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Body_set_collisionResponse_1(self, val);
};;

Body.prototype['get_collisionFilterGroup'] = Body.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_collisionFilterGroup_0(self);
};;

Body.prototype['set_collisionFilterGroup'] = Body.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_collisionFilterGroup_1(self, value);
};;

Body.prototype['get_collisionFilterMask'] = Body.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Body_get_collisionFilterMask_0(self);
};;

Body.prototype['set_collisionFilterMask'] = Body.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Body_set_collisionFilterMask_1(self, value);
};;

Body.prototype['get_aabb'] = Body.prototype.get_aabb = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Body_get_aabb_0(self), AABB);
};;

Body.prototype['get_aabbNeedsUpdate'] = Body.prototype.get_aabbNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Body_get_aabbNeedsUpdate_0(self));
};;

Body.prototype['set_aabbNeedsUpdate'] = Body.prototype.set_aabbNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  _emscripten_bind_Body_set_aabbNeedsUpdate_1(self, v);
};;

Body.prototype['release'] = Body.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Body_release_0(self);
};;

// ContactEquation
/** @suppress {undefinedVars, duplicate} @this{Object} */function ContactEquation() { throw "cannot construct a ContactEquation, no constructor in IDL" }
ContactEquation.prototype = Object.create(Equation.prototype);
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.__class__ = ContactEquation;
ContactEquation.__cache__ = {};
Module['ContactEquation'] = ContactEquation;

ContactEquation.prototype['get_si'] = ContactEquation.prototype.get_si = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_si_0(self), Shape);
};;

ContactEquation.prototype['get_sj'] = ContactEquation.prototype.get_sj = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_sj_0(self), Shape);
};;

ContactEquation.prototype['get_ni'] = ContactEquation.prototype.get_ni = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_ni_0(self), Vec3);
};;

ContactEquation.prototype['get_ri'] = ContactEquation.prototype.get_ri = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_ri_0(self), Vec3);
};;

ContactEquation.prototype['get_rj'] = ContactEquation.prototype.get_rj = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_rj_0(self), Vec3);
};;

ContactEquation.prototype['get_bi'] = ContactEquation.prototype.get_bi = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_bi_0(self), Body);
};;

ContactEquation.prototype['get_bj'] = ContactEquation.prototype.get_bj = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ContactEquation_get_bj_0(self), Body);
};;

ContactEquation.prototype['release'] = ContactEquation.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ContactEquation_release_0(self);
};;

// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// Material
/** @suppress {undefinedVars, duplicate} @this{Object} */function Material(options) {
  if (options && typeof options === 'object') options = options.ptr;
  this.ptr = _emscripten_bind_Material_Material_1(options);
  getCache(Material)[this.ptr] = this;
};;
Material.prototype = Object.create(Ref.prototype);
Material.prototype.constructor = Material;
Material.prototype.__class__ = Material;
Material.__cache__ = {};
Module['Material'] = Material;

Material.prototype['id'] = Material.prototype.id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_id_0(self);
};;

Material.prototype['get_friction'] = Material.prototype.get_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_friction_0(self);
};;

Material.prototype['get_restitution'] = Material.prototype.get_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_restitution_0(self);
};;

Material.prototype['set_friction'] = Material.prototype.set_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function(friction) {
  var self = this.ptr;
  if (friction && typeof friction === 'object') friction = friction.ptr;
  _emscripten_bind_Material_set_friction_1(self, friction);
};;

Material.prototype['set_restitution'] = Material.prototype.set_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function(restitution) {
  var self = this.ptr;
  if (restitution && typeof restitution === 'object') restitution = restitution.ptr;
  _emscripten_bind_Material_set_restitution_1(self, restitution);
};;

Material.prototype['release'] = Material.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Material_release_0(self);
};;

// WheelInfo
/** @suppress {undefinedVars, duplicate} @this{Object} */function WheelInfo() { throw "cannot construct a WheelInfo, no constructor in IDL" }
WheelInfo.prototype = Object.create(WrapperObject.prototype);
WheelInfo.prototype.constructor = WheelInfo;
WheelInfo.prototype.__class__ = WheelInfo;
WheelInfo.__cache__ = {};
Module['WheelInfo'] = WheelInfo;

WheelInfo.prototype['get_radius'] = WheelInfo.prototype.get_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelInfo_get_radius_0(self);
};;

WheelInfo.prototype['get_worldTransform'] = WheelInfo.prototype.get_worldTransform = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelInfo_get_worldTransform_0(self), Transform);
};;

// Quaternion
/** @suppress {undefinedVars, duplicate} @this{Object} */function Quaternion(x, y, z, w) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  if (x === undefined) { this.ptr = _emscripten_bind_Quaternion_Quaternion_0(); getCache(Quaternion)[this.ptr] = this;return }
  if (y === undefined) { this.ptr = _emscripten_bind_Quaternion_Quaternion_1(x); getCache(Quaternion)[this.ptr] = this;return }
  if (z === undefined) { this.ptr = _emscripten_bind_Quaternion_Quaternion_2(x, y); getCache(Quaternion)[this.ptr] = this;return }
  if (w === undefined) { this.ptr = _emscripten_bind_Quaternion_Quaternion_3(x, y, z); getCache(Quaternion)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Quaternion_Quaternion_4(x, y, z, w);
  getCache(Quaternion)[this.ptr] = this;
};;
Quaternion.prototype = Object.create(WrapperObject.prototype);
Quaternion.prototype.constructor = Quaternion;
Quaternion.prototype.__class__ = Quaternion;
Quaternion.__cache__ = {};
Module['Quaternion'] = Quaternion;

Quaternion.prototype['op_assign'] = Quaternion.prototype.op_assign = /** @suppress {undefinedVars, duplicate} @this{Object} */function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_op_assign_1(self, q), Quaternion);
};;

Quaternion.prototype['setFromAxisAngle'] = Quaternion.prototype.setFromAxisAngle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(axis, angle) {
  var self = this.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_setFromAxisAngle_2(self, axis, angle), Quaternion);
};;

Quaternion.prototype['setFromVectors'] = Quaternion.prototype.setFromVectors = /** @suppress {undefinedVars, duplicate} @this{Object} */function(u, v) {
  var self = this.ptr;
  if (u && typeof u === 'object') u = u.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_setFromVectors_2(self, u, v), Quaternion);
};;

Quaternion.prototype['mult'] = Quaternion.prototype.mult = /** @suppress {undefinedVars, duplicate} @this{Object} */function(q, target) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_mult_2(self, q, target), Quaternion);
};;

Quaternion.prototype['add'] = Quaternion.prototype.add = /** @suppress {undefinedVars, duplicate} @this{Object} */function(q, target) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_add_2(self, q, target), Quaternion);
};;

Quaternion.prototype['sub'] = Quaternion.prototype.sub = /** @suppress {undefinedVars, duplicate} @this{Object} */function(q, target) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_sub_2(self, q, target), Quaternion);
};;

Quaternion.prototype['scale'] = Quaternion.prototype.scale = /** @suppress {undefinedVars, duplicate} @this{Object} */function(s, target) {
  var self = this.ptr;
  if (s && typeof s === 'object') s = s.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_scale_2(self, s, target), Quaternion);
};;

Quaternion.prototype['inverse'] = Quaternion.prototype.inverse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_inverse_1(self, target), Quaternion);
};;

Quaternion.prototype['conjugate'] = Quaternion.prototype.conjugate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_conjugate_1(self, target), Quaternion);
};;

Quaternion.prototype['normalize'] = Quaternion.prototype.normalize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_normalize_0(self), Quaternion);
};;

Quaternion.prototype['normalizeFast'] = Quaternion.prototype.normalizeFast = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_normalizeFast_0(self), Quaternion);
};;

Quaternion.prototype['vmult'] = Quaternion.prototype.vmult = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, target) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_vmult_2(self, v, target), Vec3);
};;

Quaternion.prototype['copy'] = Quaternion.prototype.copy = /** @suppress {undefinedVars, duplicate} @this{Object} */function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_copy_1(self, q), Quaternion);
};;

Quaternion.prototype['toEuler'] = Quaternion.prototype.toEuler = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target, order) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  if (order && typeof order === 'object') order = order.ptr;
  _emscripten_bind_Quaternion_toEuler_2(self, target, order);
};;

Quaternion.prototype['setFromEuler'] = Quaternion.prototype.setFromEuler = /** @suppress {undefinedVars, duplicate} @this{Object} */function(x, y, z, order) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (order && typeof order === 'object') order = order.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_setFromEuler_4(self, x, y, z, order), Quaternion);
};;

Quaternion.prototype['clone'] = Quaternion.prototype.clone = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_clone_0(self), Quaternion);
};;

Quaternion.prototype['slerp'] = Quaternion.prototype.slerp = /** @suppress {undefinedVars, duplicate} @this{Object} */function(toQuat, t, target) {
  var self = this.ptr;
  if (toQuat && typeof toQuat === 'object') toQuat = toQuat.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_slerp_3(self, toQuat, t, target), Quaternion);
};;

Quaternion.prototype['integrate'] = Quaternion.prototype.integrate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(angularVelocity, dt, angularFactor, target) {
  var self = this.ptr;
  if (angularVelocity && typeof angularVelocity === 'object') angularVelocity = angularVelocity.ptr;
  if (dt && typeof dt === 'object') dt = dt.ptr;
  if (angularFactor && typeof angularFactor === 'object') angularFactor = angularFactor.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_integrate_4(self, angularVelocity, dt, angularFactor, target), Quaternion);
};;

Quaternion.prototype['set'] = Quaternion.prototype.set = /** @suppress {undefinedVars, duplicate} @this{Object} */function(x, y, z, w) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  return wrapPointer(_emscripten_bind_Quaternion_set_4(self, x, y, z, w), Quaternion);
};;

  Quaternion.prototype['get_x'] = Quaternion.prototype.get_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Quaternion_get_x_0(self);
};
    Quaternion.prototype['set_x'] = Quaternion.prototype.set_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Quaternion_set_x_1(self, arg0);
};
    Object.defineProperty(Quaternion.prototype, 'x', { get: Quaternion.prototype.get_x, set: Quaternion.prototype.set_x });
  Quaternion.prototype['get_y'] = Quaternion.prototype.get_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Quaternion_get_y_0(self);
};
    Quaternion.prototype['set_y'] = Quaternion.prototype.set_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Quaternion_set_y_1(self, arg0);
};
    Object.defineProperty(Quaternion.prototype, 'y', { get: Quaternion.prototype.get_y, set: Quaternion.prototype.set_y });
  Quaternion.prototype['get_z'] = Quaternion.prototype.get_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Quaternion_get_z_0(self);
};
    Quaternion.prototype['set_z'] = Quaternion.prototype.set_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Quaternion_set_z_1(self, arg0);
};
    Object.defineProperty(Quaternion.prototype, 'z', { get: Quaternion.prototype.get_z, set: Quaternion.prototype.set_z });
  Quaternion.prototype['get_w'] = Quaternion.prototype.get_w = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Quaternion_get_w_0(self);
};
    Quaternion.prototype['set_w'] = Quaternion.prototype.set_w = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Quaternion_set_w_1(self, arg0);
};
    Object.defineProperty(Quaternion.prototype, 'w', { get: Quaternion.prototype.get_w, set: Quaternion.prototype.set_w });
  Quaternion.prototype['__destroy__'] = Quaternion.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Quaternion___destroy___0(self);
};
// Plane
/** @suppress {undefinedVars, duplicate} @this{Object} */function Plane(id) {
  if (id && typeof id === 'object') id = id.ptr;
  this.ptr = _emscripten_bind_Plane_Plane_1(id);
  getCache(Plane)[this.ptr] = this;
};;
Plane.prototype = Object.create(Shape.prototype);
Plane.prototype.constructor = Plane;
Plane.prototype.__class__ = Plane;
Plane.__cache__ = {};
Module['Plane'] = Plane;

Plane.prototype['computeWorldNormal'] = Plane.prototype.computeWorldNormal = /** @suppress {undefinedVars, duplicate} @this{Object} */function(quat) {
  var self = this.ptr;
  if (quat && typeof quat === 'object') quat = quat.ptr;
  _emscripten_bind_Plane_computeWorldNormal_1(self, quat);
};;

Plane.prototype['get_worldNormal'] = Plane.prototype.get_worldNormal = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Plane_get_worldNormal_0(self), Vec3);
};;

Plane.prototype['set_worldNormal'] = Plane.prototype.set_worldNormal = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Plane_set_worldNormal_1(self, val);
};;

Plane.prototype['get_worldNormalNeedsUpdate'] = Plane.prototype.get_worldNormalNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Plane_get_worldNormalNeedsUpdate_0(self));
};;

Plane.prototype['set_worldNormalNeedsUpdate'] = Plane.prototype.set_worldNormalNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Plane_set_worldNormalNeedsUpdate_1(self, val);
};;

Plane.prototype['get_boundingSphereRadius'] = Plane.prototype.get_boundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_get_boundingSphereRadius_0(self);
};;

Plane.prototype['set_boundingSphereRadius'] = Plane.prototype.set_boundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Plane_set_boundingSphereRadius_1(self, val);
};;

Plane.prototype['release'] = Plane.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Plane_release_0(self);
};;

Plane.prototype['volume'] = Plane.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_volume_0(self);
};;

Plane.prototype['get_id'] = Plane.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_get_id_0(self);
};;

Plane.prototype['type'] = Plane.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_type_0(self);
};;

Plane.prototype['get_collisionResponse'] = Plane.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Plane_get_collisionResponse_0(self));
};;

Plane.prototype['set_collisionResponse'] = Plane.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Plane_set_collisionResponse_1(self, val);
};;

Plane.prototype['get_collisionFilterGroup'] = Plane.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_get_collisionFilterGroup_0(self);
};;

Plane.prototype['set_collisionFilterGroup'] = Plane.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Plane_set_collisionFilterGroup_1(self, value);
};;

Plane.prototype['get_collisionFilterMask'] = Plane.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Plane_get_collisionFilterMask_0(self);
};;

Plane.prototype['set_collisionFilterMask'] = Plane.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Plane_set_collisionFilterMask_1(self, value);
};;

Plane.prototype['get_body'] = Plane.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Plane_get_body_0(self), Body);
};;

Plane.prototype['set_body'] = Plane.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Plane_set_body_1(self, body);
};;

Plane.prototype['get_material'] = Plane.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Plane_get_material_0(self), Material);
};;

Plane.prototype['set_material'] = Plane.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Plane_set_material_1(self, value);
};;

// MaterialOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function MaterialOptions(id, name, friction, restitution) {
  ensureCache.prepare();
  if (id && typeof id === 'object') id = id.ptr;
  if (name && typeof name === 'object') name = name.ptr;
  else name = ensureString(name);
  if (friction && typeof friction === 'object') friction = friction.ptr;
  if (restitution && typeof restitution === 'object') restitution = restitution.ptr;
  if (id === undefined) { this.ptr = _emscripten_bind_MaterialOptions_MaterialOptions_0(); getCache(MaterialOptions)[this.ptr] = this;return }
  if (name === undefined) { this.ptr = _emscripten_bind_MaterialOptions_MaterialOptions_1(id); getCache(MaterialOptions)[this.ptr] = this;return }
  if (friction === undefined) { this.ptr = _emscripten_bind_MaterialOptions_MaterialOptions_2(id, name); getCache(MaterialOptions)[this.ptr] = this;return }
  if (restitution === undefined) { this.ptr = _emscripten_bind_MaterialOptions_MaterialOptions_3(id, name, friction); getCache(MaterialOptions)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_MaterialOptions_MaterialOptions_4(id, name, friction, restitution);
  getCache(MaterialOptions)[this.ptr] = this;
};;
MaterialOptions.prototype = Object.create(WrapperObject.prototype);
MaterialOptions.prototype.constructor = MaterialOptions;
MaterialOptions.prototype.__class__ = MaterialOptions;
MaterialOptions.__cache__ = {};
Module['MaterialOptions'] = MaterialOptions;

  MaterialOptions.prototype['get_id'] = MaterialOptions.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_MaterialOptions_get_id_0(self);
};
    MaterialOptions.prototype['set_id'] = MaterialOptions.prototype.set_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_MaterialOptions_set_id_1(self, arg0);
};
    Object.defineProperty(MaterialOptions.prototype, 'id', { get: MaterialOptions.prototype.get_id, set: MaterialOptions.prototype.set_id });
  MaterialOptions.prototype['get_friction'] = MaterialOptions.prototype.get_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_MaterialOptions_get_friction_0(self);
};
    MaterialOptions.prototype['set_friction'] = MaterialOptions.prototype.set_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_MaterialOptions_set_friction_1(self, arg0);
};
    Object.defineProperty(MaterialOptions.prototype, 'friction', { get: MaterialOptions.prototype.get_friction, set: MaterialOptions.prototype.set_friction });
  MaterialOptions.prototype['get_restitution'] = MaterialOptions.prototype.get_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_MaterialOptions_get_restitution_0(self);
};
    MaterialOptions.prototype['set_restitution'] = MaterialOptions.prototype.set_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_MaterialOptions_set_restitution_1(self, arg0);
};
    Object.defineProperty(MaterialOptions.prototype, 'restitution', { get: MaterialOptions.prototype.get_restitution, set: MaterialOptions.prototype.set_restitution });
  MaterialOptions.prototype['get_name'] = MaterialOptions.prototype.get_name = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_MaterialOptions_get_name_0(self));
};
    MaterialOptions.prototype['set_name'] = MaterialOptions.prototype.set_name = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_MaterialOptions_set_name_1(self, arg0);
};
    Object.defineProperty(MaterialOptions.prototype, 'name', { get: MaterialOptions.prototype.get_name, set: MaterialOptions.prototype.set_name });
  MaterialOptions.prototype['__destroy__'] = MaterialOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_MaterialOptions___destroy___0(self);
};
// WheelOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function WheelOptions() {
  this.ptr = _emscripten_bind_WheelOptions_WheelOptions_0();
  getCache(WheelOptions)[this.ptr] = this;
};;
WheelOptions.prototype = Object.create(WrapperObject.prototype);
WheelOptions.prototype.constructor = WheelOptions;
WheelOptions.prototype.__class__ = WheelOptions;
WheelOptions.__cache__ = {};
Module['WheelOptions'] = WheelOptions;

  WheelOptions.prototype['get_chassisConnectionPointLocal'] = WheelOptions.prototype.get_chassisConnectionPointLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_chassisConnectionPointLocal_0(self), Vec3);
};
    WheelOptions.prototype['set_chassisConnectionPointLocal'] = WheelOptions.prototype.set_chassisConnectionPointLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_chassisConnectionPointLocal_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'chassisConnectionPointLocal', { get: WheelOptions.prototype.get_chassisConnectionPointLocal, set: WheelOptions.prototype.set_chassisConnectionPointLocal });
  WheelOptions.prototype['get_chassisConnectionPointWorld'] = WheelOptions.prototype.get_chassisConnectionPointWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_chassisConnectionPointWorld_0(self), Vec3);
};
    WheelOptions.prototype['set_chassisConnectionPointWorld'] = WheelOptions.prototype.set_chassisConnectionPointWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_chassisConnectionPointWorld_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'chassisConnectionPointWorld', { get: WheelOptions.prototype.get_chassisConnectionPointWorld, set: WheelOptions.prototype.set_chassisConnectionPointWorld });
  WheelOptions.prototype['get_directionLocal'] = WheelOptions.prototype.get_directionLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_directionLocal_0(self), Vec3);
};
    WheelOptions.prototype['set_directionLocal'] = WheelOptions.prototype.set_directionLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_directionLocal_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'directionLocal', { get: WheelOptions.prototype.get_directionLocal, set: WheelOptions.prototype.set_directionLocal });
  WheelOptions.prototype['get_directionWorld'] = WheelOptions.prototype.get_directionWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_directionWorld_0(self), Vec3);
};
    WheelOptions.prototype['set_directionWorld'] = WheelOptions.prototype.set_directionWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_directionWorld_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'directionWorld', { get: WheelOptions.prototype.get_directionWorld, set: WheelOptions.prototype.set_directionWorld });
  WheelOptions.prototype['get_axleLocal'] = WheelOptions.prototype.get_axleLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_axleLocal_0(self), Vec3);
};
    WheelOptions.prototype['set_axleLocal'] = WheelOptions.prototype.set_axleLocal = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_axleLocal_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'axleLocal', { get: WheelOptions.prototype.get_axleLocal, set: WheelOptions.prototype.set_axleLocal });
  WheelOptions.prototype['get_axleWorld'] = WheelOptions.prototype.get_axleWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WheelOptions_get_axleWorld_0(self), Vec3);
};
    WheelOptions.prototype['set_axleWorld'] = WheelOptions.prototype.set_axleWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_axleWorld_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'axleWorld', { get: WheelOptions.prototype.get_axleWorld, set: WheelOptions.prototype.set_axleWorld });
  WheelOptions.prototype['get_suspensionRestLength'] = WheelOptions.prototype.get_suspensionRestLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionRestLength_0(self);
};
    WheelOptions.prototype['set_suspensionRestLength'] = WheelOptions.prototype.set_suspensionRestLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionRestLength_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionRestLength', { get: WheelOptions.prototype.get_suspensionRestLength, set: WheelOptions.prototype.set_suspensionRestLength });
  WheelOptions.prototype['get_suspensionMaxLength'] = WheelOptions.prototype.get_suspensionMaxLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionMaxLength_0(self);
};
    WheelOptions.prototype['set_suspensionMaxLength'] = WheelOptions.prototype.set_suspensionMaxLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionMaxLength_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionMaxLength', { get: WheelOptions.prototype.get_suspensionMaxLength, set: WheelOptions.prototype.set_suspensionMaxLength });
  WheelOptions.prototype['get_radius'] = WheelOptions.prototype.get_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_radius_0(self);
};
    WheelOptions.prototype['set_radius'] = WheelOptions.prototype.set_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_radius_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'radius', { get: WheelOptions.prototype.get_radius, set: WheelOptions.prototype.set_radius });
  WheelOptions.prototype['get_suspensionStiffness'] = WheelOptions.prototype.get_suspensionStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionStiffness_0(self);
};
    WheelOptions.prototype['set_suspensionStiffness'] = WheelOptions.prototype.set_suspensionStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionStiffness_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionStiffness', { get: WheelOptions.prototype.get_suspensionStiffness, set: WheelOptions.prototype.set_suspensionStiffness });
  WheelOptions.prototype['get_dampingCompression'] = WheelOptions.prototype.get_dampingCompression = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_dampingCompression_0(self);
};
    WheelOptions.prototype['set_dampingCompression'] = WheelOptions.prototype.set_dampingCompression = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_dampingCompression_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'dampingCompression', { get: WheelOptions.prototype.get_dampingCompression, set: WheelOptions.prototype.set_dampingCompression });
  WheelOptions.prototype['get_dampingRelaxation'] = WheelOptions.prototype.get_dampingRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_dampingRelaxation_0(self);
};
    WheelOptions.prototype['set_dampingRelaxation'] = WheelOptions.prototype.set_dampingRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_dampingRelaxation_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'dampingRelaxation', { get: WheelOptions.prototype.get_dampingRelaxation, set: WheelOptions.prototype.set_dampingRelaxation });
  WheelOptions.prototype['get_frictionSlip'] = WheelOptions.prototype.get_frictionSlip = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_frictionSlip_0(self);
};
    WheelOptions.prototype['set_frictionSlip'] = WheelOptions.prototype.set_frictionSlip = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_frictionSlip_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'frictionSlip', { get: WheelOptions.prototype.get_frictionSlip, set: WheelOptions.prototype.set_frictionSlip });
  WheelOptions.prototype['get_steering'] = WheelOptions.prototype.get_steering = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_steering_0(self);
};
    WheelOptions.prototype['set_steering'] = WheelOptions.prototype.set_steering = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_steering_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'steering', { get: WheelOptions.prototype.get_steering, set: WheelOptions.prototype.set_steering });
  WheelOptions.prototype['get_rotation'] = WheelOptions.prototype.get_rotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_rotation_0(self);
};
    WheelOptions.prototype['set_rotation'] = WheelOptions.prototype.set_rotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_rotation_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'rotation', { get: WheelOptions.prototype.get_rotation, set: WheelOptions.prototype.set_rotation });
  WheelOptions.prototype['get_deltaRotation'] = WheelOptions.prototype.get_deltaRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_deltaRotation_0(self);
};
    WheelOptions.prototype['set_deltaRotation'] = WheelOptions.prototype.set_deltaRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_deltaRotation_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'deltaRotation', { get: WheelOptions.prototype.get_deltaRotation, set: WheelOptions.prototype.set_deltaRotation });
  WheelOptions.prototype['get_rollInfluence'] = WheelOptions.prototype.get_rollInfluence = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_rollInfluence_0(self);
};
    WheelOptions.prototype['set_rollInfluence'] = WheelOptions.prototype.set_rollInfluence = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_rollInfluence_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'rollInfluence', { get: WheelOptions.prototype.get_rollInfluence, set: WheelOptions.prototype.set_rollInfluence });
  WheelOptions.prototype['get_maxSuspensionForce'] = WheelOptions.prototype.get_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_maxSuspensionForce_0(self);
};
    WheelOptions.prototype['set_maxSuspensionForce'] = WheelOptions.prototype.set_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_maxSuspensionForce_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'maxSuspensionForce', { get: WheelOptions.prototype.get_maxSuspensionForce, set: WheelOptions.prototype.set_maxSuspensionForce });
  WheelOptions.prototype['get_isFrontWheel'] = WheelOptions.prototype.get_isFrontWheel = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_WheelOptions_get_isFrontWheel_0(self));
};
    WheelOptions.prototype['set_isFrontWheel'] = WheelOptions.prototype.set_isFrontWheel = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_isFrontWheel_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'isFrontWheel', { get: WheelOptions.prototype.get_isFrontWheel, set: WheelOptions.prototype.set_isFrontWheel });
  WheelOptions.prototype['get_clippedInvContactDotSuspension'] = WheelOptions.prototype.get_clippedInvContactDotSuspension = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_clippedInvContactDotSuspension_0(self);
};
    WheelOptions.prototype['set_clippedInvContactDotSuspension'] = WheelOptions.prototype.set_clippedInvContactDotSuspension = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_clippedInvContactDotSuspension_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'clippedInvContactDotSuspension', { get: WheelOptions.prototype.get_clippedInvContactDotSuspension, set: WheelOptions.prototype.set_clippedInvContactDotSuspension });
  WheelOptions.prototype['get_suspensionRelativeVelocity'] = WheelOptions.prototype.get_suspensionRelativeVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionRelativeVelocity_0(self);
};
    WheelOptions.prototype['set_suspensionRelativeVelocity'] = WheelOptions.prototype.set_suspensionRelativeVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionRelativeVelocity_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionRelativeVelocity', { get: WheelOptions.prototype.get_suspensionRelativeVelocity, set: WheelOptions.prototype.set_suspensionRelativeVelocity });
  WheelOptions.prototype['get_suspensionForce'] = WheelOptions.prototype.get_suspensionForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionForce_0(self);
};
    WheelOptions.prototype['set_suspensionForce'] = WheelOptions.prototype.set_suspensionForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionForce_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionForce', { get: WheelOptions.prototype.get_suspensionForce, set: WheelOptions.prototype.set_suspensionForce });
  WheelOptions.prototype['get_skidInfo'] = WheelOptions.prototype.get_skidInfo = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_skidInfo_0(self);
};
    WheelOptions.prototype['set_skidInfo'] = WheelOptions.prototype.set_skidInfo = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_skidInfo_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'skidInfo', { get: WheelOptions.prototype.get_skidInfo, set: WheelOptions.prototype.set_skidInfo });
  WheelOptions.prototype['get_suspensionLength'] = WheelOptions.prototype.get_suspensionLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_suspensionLength_0(self);
};
    WheelOptions.prototype['set_suspensionLength'] = WheelOptions.prototype.set_suspensionLength = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_suspensionLength_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'suspensionLength', { get: WheelOptions.prototype.get_suspensionLength, set: WheelOptions.prototype.set_suspensionLength });
  WheelOptions.prototype['get_maxSuspensionTravel'] = WheelOptions.prototype.get_maxSuspensionTravel = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_maxSuspensionTravel_0(self);
};
    WheelOptions.prototype['set_maxSuspensionTravel'] = WheelOptions.prototype.set_maxSuspensionTravel = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_maxSuspensionTravel_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'maxSuspensionTravel', { get: WheelOptions.prototype.get_maxSuspensionTravel, set: WheelOptions.prototype.set_maxSuspensionTravel });
  WheelOptions.prototype['get_useCustomSlidingRotationalSpeed'] = WheelOptions.prototype.get_useCustomSlidingRotationalSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_WheelOptions_get_useCustomSlidingRotationalSpeed_0(self));
};
    WheelOptions.prototype['set_useCustomSlidingRotationalSpeed'] = WheelOptions.prototype.set_useCustomSlidingRotationalSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_useCustomSlidingRotationalSpeed_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'useCustomSlidingRotationalSpeed', { get: WheelOptions.prototype.get_useCustomSlidingRotationalSpeed, set: WheelOptions.prototype.set_useCustomSlidingRotationalSpeed });
  WheelOptions.prototype['get_customSlidingRotationalSpeed'] = WheelOptions.prototype.get_customSlidingRotationalSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WheelOptions_get_customSlidingRotationalSpeed_0(self);
};
    WheelOptions.prototype['set_customSlidingRotationalSpeed'] = WheelOptions.prototype.set_customSlidingRotationalSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WheelOptions_set_customSlidingRotationalSpeed_1(self, arg0);
};
    Object.defineProperty(WheelOptions.prototype, 'customSlidingRotationalSpeed', { get: WheelOptions.prototype.get_customSlidingRotationalSpeed, set: WheelOptions.prototype.set_customSlidingRotationalSpeed });
  WheelOptions.prototype['__destroy__'] = WheelOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_WheelOptions___destroy___0(self);
};
// World
/** @suppress {undefinedVars, duplicate} @this{Object} */function World(options) {
  if (options && typeof options === 'object') options = options.ptr;
  if (options === undefined) { this.ptr = _emscripten_bind_World_World_0(); getCache(World)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_World_World_1(options);
  getCache(World)[this.ptr] = this;
};;
World.prototype = Object.create(WrapperObject.prototype);
World.prototype.constructor = World;
World.prototype.__class__ = World;
World.__cache__ = {};
Module['World'] = World;

World.prototype['numObjects'] = World.prototype.numObjects = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_numObjects_0(self);
};;

World.prototype['collisionMatrixTick'] = World.prototype.collisionMatrixTick = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_collisionMatrixTick_0(self);
};;

World.prototype['addBody'] = World.prototype.addBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_World_addBody_1(self, body);
};;

World.prototype['removeBody'] = World.prototype.removeBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_World_removeBody_1(self, body);
};;

World.prototype['getBody'] = World.prototype.getBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_World_getBody_1(self, index), Body);
};;

World.prototype['addConstraint'] = World.prototype.addConstraint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(c) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  _emscripten_bind_World_addConstraint_1(self, c);
};;

World.prototype['removeConstraint'] = World.prototype.removeConstraint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(c) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  _emscripten_bind_World_removeConstraint_1(self, c);
};;

World.prototype['addMaterial'] = World.prototype.addMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function(m) {
  var self = this.ptr;
  if (m && typeof m === 'object') m = m.ptr;
  _emscripten_bind_World_addMaterial_1(self, m);
};;

World.prototype['addContactMaterial'] = World.prototype.addContactMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function(cmat) {
  var self = this.ptr;
  if (cmat && typeof cmat === 'object') cmat = cmat.ptr;
  _emscripten_bind_World_addContactMaterial_1(self, cmat);
};;

World.prototype['addSystem'] = World.prototype.addSystem = /** @suppress {undefinedVars, duplicate} @this{Object} */function(sys) {
  var self = this.ptr;
  if (sys && typeof sys === 'object') sys = sys.ptr;
  return !!(_emscripten_bind_World_addSystem_1(self, sys));
};;

World.prototype['removeSystem'] = World.prototype.removeSystem = /** @suppress {undefinedVars, duplicate} @this{Object} */function(sys) {
  var self = this.ptr;
  if (sys && typeof sys === 'object') sys = sys.ptr;
  return !!(_emscripten_bind_World_removeSystem_1(self, sys));
};;

World.prototype['step'] = World.prototype.step = /** @suppress {undefinedVars, duplicate} @this{Object} */function(dt, timeSinceLastCalled, maxSubSteps) {
  var self = this.ptr;
  if (dt && typeof dt === 'object') dt = dt.ptr;
  if (timeSinceLastCalled && typeof timeSinceLastCalled === 'object') timeSinceLastCalled = timeSinceLastCalled.ptr;
  if (maxSubSteps && typeof maxSubSteps === 'object') maxSubSteps = maxSubSteps.ptr;
  if (timeSinceLastCalled === undefined) { _emscripten_bind_World_step_1(self, dt);  return }
  if (maxSubSteps === undefined) { _emscripten_bind_World_step_2(self, dt, timeSinceLastCalled);  return }
  _emscripten_bind_World_step_3(self, dt, timeSinceLastCalled, maxSubSteps);
};;

World.prototype['emitTriggeredEvents'] = World.prototype.emitTriggeredEvents = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_emitTriggeredEvents_0(self);
};;

World.prototype['emitCollisionEvents'] = World.prototype.emitCollisionEvents = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_emitCollisionEvents_0(self);
};;

World.prototype['clearForces'] = World.prototype.clearForces = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_clearForces_0(self);
};;

World.prototype['raycastClosest'] = World.prototype.raycastClosest = /** @suppress {undefinedVars, duplicate} @this{Object} */function(from, to, options, result) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (options && typeof options === 'object') options = options.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  return !!(_emscripten_bind_World_raycastClosest_4(self, from, to, options, result));
};;

World.prototype['raycastAll'] = World.prototype.raycastAll = /** @suppress {undefinedVars, duplicate} @this{Object} */function(from, to, callback, options) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (callback && typeof callback === 'object') callback = callback.ptr;
  if (options && typeof options === 'object') options = options.ptr;
  if (callback === undefined) { return !!(_emscripten_bind_World_raycastAll_2(self, from, to)) }
  if (options === undefined) { return !!(_emscripten_bind_World_raycastAll_3(self, from, to, callback)) }
  return !!(_emscripten_bind_World_raycastAll_4(self, from, to, callback, options));
};;

World.prototype['get_allowSleep'] = World.prototype.get_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_World_get_allowSleep_0(self));
};;

World.prototype['set_allowSleep'] = World.prototype.set_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_World_set_allowSleep_1(self, val);
};;

World.prototype['get_gravity'] = World.prototype.get_gravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_get_gravity_0(self), Vec3);
};;

World.prototype['set_gravity'] = World.prototype.set_gravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_World_set_gravity_1(self, val);
};;

World.prototype['get_broadphase'] = World.prototype.get_broadphase = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_get_broadphase_0(self), Broadphase);
};;

World.prototype['set_broadphase'] = World.prototype.set_broadphase = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_World_set_broadphase_1(self, val);
};;

World.prototype['get_solver'] = World.prototype.get_solver = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_get_solver_0(self), Solver);
};;

World.prototype['set_solver'] = World.prototype.set_solver = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_World_set_solver_1(self, val);
};;

World.prototype['get_defaultMaterial'] = World.prototype.get_defaultMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_get_defaultMaterial_0(self), Material);
};;

World.prototype['set_defaultMaterial'] = World.prototype.set_defaultMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_World_set_defaultMaterial_1(self, value);
};;

World.prototype['get_defaultContactMaterial'] = World.prototype.get_defaultContactMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_get_defaultContactMaterial_0(self), ContactMaterial);
};;

World.prototype['set_defaultContactMaterial'] = World.prototype.set_defaultContactMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_World_set_defaultContactMaterial_1(self, value);
};;

World.prototype['get_quatNormalizeSkip'] = World.prototype.get_quatNormalizeSkip = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_get_quatNormalizeSkip_0(self);
};;

World.prototype['set_quatNormalizeSkip'] = World.prototype.set_quatNormalizeSkip = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_World_set_quatNormalizeSkip_1(self, value);
};;

World.prototype['get_quatNormalizeFast'] = World.prototype.get_quatNormalizeFast = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_World_get_quatNormalizeFast_0(self));
};;

World.prototype['set_quatNormalizeFast'] = World.prototype.set_quatNormalizeFast = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_World_set_quatNormalizeFast_1(self, value);
};;

World.prototype['get_time'] = World.prototype.get_time = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_get_time_0(self);
};;

World.prototype['dispatcher'] = World.prototype.dispatcher = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_World_dispatcher_0(self), EventTarget);
};;

World.prototype['genBodyId'] = World.prototype.genBodyId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genBodyId_0(self);
};;

World.prototype['genShapeId'] = World.prototype.genShapeId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genShapeId_0(self);
};;

World.prototype['genConstraintId'] = World.prototype.genConstraintId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genConstraintId_0(self);
};;

World.prototype['genEquationId'] = World.prototype.genEquationId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genEquationId_0(self);
};;

World.prototype['genContactMaterialId'] = World.prototype.genContactMaterialId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genContactMaterialId_0(self);
};;

World.prototype['genMaterialId'] = World.prototype.genMaterialId = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_genMaterialId_0(self);
};;

World.prototype['release'] = World.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_release_0(self);
};;

World.prototype['retain'] = World.prototype.retain = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_retain_0(self);
};;

World.prototype['removeAllConstraints'] = World.prototype.removeAllConstraints = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_World_removeAllConstraints_0(self);
};;

World.prototype['getConstraintCount'] = World.prototype.getConstraintCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_getConstraintCount_0(self);
};;

World.prototype['getConstraint'] = World.prototype.getConstraint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_World_getConstraint_1(self, index), Constraint);
};;

World.prototype['getContactMaterialCount'] = World.prototype.getContactMaterialCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_getContactMaterialCount_0(self);
};;

World.prototype['getContactMaterial'] = World.prototype.getContactMaterial = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_World_getContactMaterial_1(self, index), ContactMaterial);
};;

World.prototype['getContactCount'] = World.prototype.getContactCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_World_getContactCount_0(self);
};;

World.prototype['getContact'] = World.prototype.getContact = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_World_getContact_1(self, index), ContactEquation);
};;

// BodyOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity, angularVelocity, linearFactor, angularFactor, quaternion) {
  if (world && typeof world === 'object') world = world.ptr;
  if (id && typeof id === 'object') id = id.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (material && typeof material === 'object') material = material.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  if (fixedRotation && typeof fixedRotation === 'object') fixedRotation = fixedRotation.ptr;
  if (allowSleep && typeof allowSleep === 'object') allowSleep = allowSleep.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (sleepSpeedLimit && typeof sleepSpeedLimit === 'object') sleepSpeedLimit = sleepSpeedLimit.ptr;
  if (sleepTimeLimit && typeof sleepTimeLimit === 'object') sleepTimeLimit = sleepTimeLimit.ptr;
  if (linearDamping && typeof linearDamping === 'object') linearDamping = linearDamping.ptr;
  if (angularDamping && typeof angularDamping === 'object') angularDamping = angularDamping.ptr;
  if (pos && typeof pos === 'object') pos = pos.ptr;
  if (velocity && typeof velocity === 'object') velocity = velocity.ptr;
  if (angularVelocity && typeof angularVelocity === 'object') angularVelocity = angularVelocity.ptr;
  if (linearFactor && typeof linearFactor === 'object') linearFactor = linearFactor.ptr;
  if (angularFactor && typeof angularFactor === 'object') angularFactor = angularFactor.ptr;
  if (quaternion && typeof quaternion === 'object') quaternion = quaternion.ptr;
  if (id === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_1(world); getCache(BodyOptions)[this.ptr] = this;return }
  if (shape === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_2(world, id); getCache(BodyOptions)[this.ptr] = this;return }
  if (mass === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_3(world, id, shape); getCache(BodyOptions)[this.ptr] = this;return }
  if (material === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_4(world, id, shape, mass); getCache(BodyOptions)[this.ptr] = this;return }
  if (type === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_5(world, id, shape, mass, material); getCache(BodyOptions)[this.ptr] = this;return }
  if (fixedRotation === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_6(world, id, shape, mass, material, type); getCache(BodyOptions)[this.ptr] = this;return }
  if (allowSleep === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_7(world, id, shape, mass, material, type, fixedRotation); getCache(BodyOptions)[this.ptr] = this;return }
  if (collisionFilterGroup === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_8(world, id, shape, mass, material, type, fixedRotation, allowSleep); getCache(BodyOptions)[this.ptr] = this;return }
  if (collisionFilterMask === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_9(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup); getCache(BodyOptions)[this.ptr] = this;return }
  if (sleepSpeedLimit === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_10(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask); getCache(BodyOptions)[this.ptr] = this;return }
  if (sleepTimeLimit === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_11(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit); getCache(BodyOptions)[this.ptr] = this;return }
  if (linearDamping === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_12(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit); getCache(BodyOptions)[this.ptr] = this;return }
  if (angularDamping === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_13(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping); getCache(BodyOptions)[this.ptr] = this;return }
  if (pos === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_14(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping); getCache(BodyOptions)[this.ptr] = this;return }
  if (velocity === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_15(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos); getCache(BodyOptions)[this.ptr] = this;return }
  if (angularVelocity === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_16(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity); getCache(BodyOptions)[this.ptr] = this;return }
  if (linearFactor === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_17(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity, angularVelocity); getCache(BodyOptions)[this.ptr] = this;return }
  if (angularFactor === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_18(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity, angularVelocity, linearFactor); getCache(BodyOptions)[this.ptr] = this;return }
  if (quaternion === undefined) { this.ptr = _emscripten_bind_BodyOptions_BodyOptions_19(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity, angularVelocity, linearFactor, angularFactor); getCache(BodyOptions)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_BodyOptions_BodyOptions_20(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, pos, velocity, angularVelocity, linearFactor, angularFactor, quaternion);
  getCache(BodyOptions)[this.ptr] = this;
};;
BodyOptions.prototype = Object.create(WrapperObject.prototype);
BodyOptions.prototype.constructor = BodyOptions;
BodyOptions.prototype.__class__ = BodyOptions;
BodyOptions.__cache__ = {};
Module['BodyOptions'] = BodyOptions;

  BodyOptions.prototype['get_position'] = BodyOptions.prototype.get_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_position_0(self), Vec3);
};
    BodyOptions.prototype['set_position'] = BodyOptions.prototype.set_position = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_position_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'position', { get: BodyOptions.prototype.get_position, set: BodyOptions.prototype.set_position });
  BodyOptions.prototype['get_quaternion'] = BodyOptions.prototype.get_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_quaternion_0(self), Quaternion);
};
    BodyOptions.prototype['set_quaternion'] = BodyOptions.prototype.set_quaternion = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_quaternion_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'quaternion', { get: BodyOptions.prototype.get_quaternion, set: BodyOptions.prototype.set_quaternion });
  BodyOptions.prototype['get_velocity'] = BodyOptions.prototype.get_velocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_velocity_0(self), Vec3);
};
    BodyOptions.prototype['set_velocity'] = BodyOptions.prototype.set_velocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_velocity_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'velocity', { get: BodyOptions.prototype.get_velocity, set: BodyOptions.prototype.set_velocity });
  BodyOptions.prototype['get_angularVelocity'] = BodyOptions.prototype.get_angularVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_angularVelocity_0(self), Vec3);
};
    BodyOptions.prototype['set_angularVelocity'] = BodyOptions.prototype.set_angularVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_angularVelocity_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'angularVelocity', { get: BodyOptions.prototype.get_angularVelocity, set: BodyOptions.prototype.set_angularVelocity });
  BodyOptions.prototype['get_linearFactor'] = BodyOptions.prototype.get_linearFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_linearFactor_0(self), Vec3);
};
    BodyOptions.prototype['set_linearFactor'] = BodyOptions.prototype.set_linearFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_linearFactor_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'linearFactor', { get: BodyOptions.prototype.get_linearFactor, set: BodyOptions.prototype.set_linearFactor });
  BodyOptions.prototype['get_angularFactor'] = BodyOptions.prototype.get_angularFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_angularFactor_0(self), Vec3);
};
    BodyOptions.prototype['set_angularFactor'] = BodyOptions.prototype.set_angularFactor = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_angularFactor_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'angularFactor', { get: BodyOptions.prototype.get_angularFactor, set: BodyOptions.prototype.set_angularFactor });
  BodyOptions.prototype['get_id'] = BodyOptions.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_id_0(self);
};
    BodyOptions.prototype['set_id'] = BodyOptions.prototype.set_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_id_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'id', { get: BodyOptions.prototype.get_id, set: BodyOptions.prototype.set_id });
  BodyOptions.prototype['get_shape'] = BodyOptions.prototype.get_shape = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_shape_0(self), Shape);
};
    BodyOptions.prototype['set_shape'] = BodyOptions.prototype.set_shape = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_shape_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'shape', { get: BodyOptions.prototype.get_shape, set: BodyOptions.prototype.set_shape });
  BodyOptions.prototype['get_mass'] = BodyOptions.prototype.get_mass = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_mass_0(self);
};
    BodyOptions.prototype['set_mass'] = BodyOptions.prototype.set_mass = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_mass_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'mass', { get: BodyOptions.prototype.get_mass, set: BodyOptions.prototype.set_mass });
  BodyOptions.prototype['get_material'] = BodyOptions.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_BodyOptions_get_material_0(self), Material);
};
    BodyOptions.prototype['set_material'] = BodyOptions.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_material_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'material', { get: BodyOptions.prototype.get_material, set: BodyOptions.prototype.set_material });
  BodyOptions.prototype['get_type'] = BodyOptions.prototype.get_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_type_0(self);
};
    BodyOptions.prototype['set_type'] = BodyOptions.prototype.set_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_type_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'type', { get: BodyOptions.prototype.get_type, set: BodyOptions.prototype.set_type });
  BodyOptions.prototype['get_fixedRotation'] = BodyOptions.prototype.get_fixedRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_BodyOptions_get_fixedRotation_0(self));
};
    BodyOptions.prototype['set_fixedRotation'] = BodyOptions.prototype.set_fixedRotation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_fixedRotation_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'fixedRotation', { get: BodyOptions.prototype.get_fixedRotation, set: BodyOptions.prototype.set_fixedRotation });
  BodyOptions.prototype['get_allowSleep'] = BodyOptions.prototype.get_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_BodyOptions_get_allowSleep_0(self));
};
    BodyOptions.prototype['set_allowSleep'] = BodyOptions.prototype.set_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_allowSleep_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'allowSleep', { get: BodyOptions.prototype.get_allowSleep, set: BodyOptions.prototype.set_allowSleep });
  BodyOptions.prototype['get_collisionFilterGroup'] = BodyOptions.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_collisionFilterGroup_0(self);
};
    BodyOptions.prototype['set_collisionFilterGroup'] = BodyOptions.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_collisionFilterGroup_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'collisionFilterGroup', { get: BodyOptions.prototype.get_collisionFilterGroup, set: BodyOptions.prototype.set_collisionFilterGroup });
  BodyOptions.prototype['get_collisionFilterMask'] = BodyOptions.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_collisionFilterMask_0(self);
};
    BodyOptions.prototype['set_collisionFilterMask'] = BodyOptions.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_collisionFilterMask_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'collisionFilterMask', { get: BodyOptions.prototype.get_collisionFilterMask, set: BodyOptions.prototype.set_collisionFilterMask });
  BodyOptions.prototype['get_sleepSpeedLimit'] = BodyOptions.prototype.get_sleepSpeedLimit = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_sleepSpeedLimit_0(self);
};
    BodyOptions.prototype['set_sleepSpeedLimit'] = BodyOptions.prototype.set_sleepSpeedLimit = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_sleepSpeedLimit_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'sleepSpeedLimit', { get: BodyOptions.prototype.get_sleepSpeedLimit, set: BodyOptions.prototype.set_sleepSpeedLimit });
  BodyOptions.prototype['get_sleepTimeLimit'] = BodyOptions.prototype.get_sleepTimeLimit = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_sleepTimeLimit_0(self);
};
    BodyOptions.prototype['set_sleepTimeLimit'] = BodyOptions.prototype.set_sleepTimeLimit = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_sleepTimeLimit_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'sleepTimeLimit', { get: BodyOptions.prototype.get_sleepTimeLimit, set: BodyOptions.prototype.set_sleepTimeLimit });
  BodyOptions.prototype['get_linearDamping'] = BodyOptions.prototype.get_linearDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_linearDamping_0(self);
};
    BodyOptions.prototype['set_linearDamping'] = BodyOptions.prototype.set_linearDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_linearDamping_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'linearDamping', { get: BodyOptions.prototype.get_linearDamping, set: BodyOptions.prototype.set_linearDamping });
  BodyOptions.prototype['get_angularDamping'] = BodyOptions.prototype.get_angularDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_BodyOptions_get_angularDamping_0(self);
};
    BodyOptions.prototype['set_angularDamping'] = BodyOptions.prototype.set_angularDamping = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_BodyOptions_set_angularDamping_1(self, arg0);
};
    Object.defineProperty(BodyOptions.prototype, 'angularDamping', { get: BodyOptions.prototype.get_angularDamping, set: BodyOptions.prototype.set_angularDamping });
  BodyOptions.prototype['__destroy__'] = BodyOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_BodyOptions___destroy___0(self);
};
// Box
/** @suppress {undefinedVars, duplicate} @this{Object} */function Box(id, world, halfExtents) {
  if (id && typeof id === 'object') id = id.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  if (halfExtents && typeof halfExtents === 'object') halfExtents = halfExtents.ptr;
  this.ptr = _emscripten_bind_Box_Box_3(id, world, halfExtents);
  getCache(Box)[this.ptr] = this;
};;
Box.prototype = Object.create(Shape.prototype);
Box.prototype.constructor = Box;
Box.prototype.__class__ = Box;
Box.__cache__ = {};
Module['Box'] = Box;

Box.prototype['updateConvexPolyhedronRepresentation'] = Box.prototype.updateConvexPolyhedronRepresentation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Box_updateConvexPolyhedronRepresentation_0(self);
};;

Box.prototype['get_halfExtents'] = Box.prototype.get_halfExtents = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Box_get_halfExtents_0(self), Vec3);
};;

Box.prototype['set_halfExtents'] = Box.prototype.set_halfExtents = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Box_set_halfExtents_1(self, value);
};;

Box.prototype['get_convexPolyhedronRepresentation'] = Box.prototype.get_convexPolyhedronRepresentation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Box_get_convexPolyhedronRepresentation_0(self), ConvexPolyhedron);
};;

Box.prototype['release'] = Box.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Box_release_0(self);
};;

Box.prototype['updateBoundingSphereRadius'] = Box.prototype.updateBoundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Box_updateBoundingSphereRadius_0(self);
};;

Box.prototype['volume'] = Box.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_volume_0(self);
};;

Box.prototype['get_id'] = Box.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_get_id_0(self);
};;

Box.prototype['type'] = Box.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_type_0(self);
};;

Box.prototype['get_boundingSphereRadius'] = Box.prototype.get_boundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_get_boundingSphereRadius_0(self);
};;

Box.prototype['get_collisionResponse'] = Box.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Box_get_collisionResponse_0(self));
};;

Box.prototype['set_collisionResponse'] = Box.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Box_set_collisionResponse_1(self, val);
};;

Box.prototype['get_collisionFilterGroup'] = Box.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_get_collisionFilterGroup_0(self);
};;

Box.prototype['set_collisionFilterGroup'] = Box.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Box_set_collisionFilterGroup_1(self, value);
};;

Box.prototype['get_collisionFilterMask'] = Box.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Box_get_collisionFilterMask_0(self);
};;

Box.prototype['set_collisionFilterMask'] = Box.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Box_set_collisionFilterMask_1(self, value);
};;

Box.prototype['get_body'] = Box.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Box_get_body_0(self), Body);
};;

Box.prototype['set_body'] = Box.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Box_set_body_1(self, body);
};;

Box.prototype['get_material'] = Box.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Box_get_material_0(self), Material);
};;

Box.prototype['set_material'] = Box.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Box_set_material_1(self, value);
};;

// JSRayCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function JSRayCallback() {
  this.ptr = _emscripten_bind_JSRayCallback_JSRayCallback_0();
  getCache(JSRayCallback)[this.ptr] = this;
};;
JSRayCallback.prototype = Object.create(RayCallback.prototype);
JSRayCallback.prototype.constructor = JSRayCallback;
JSRayCallback.prototype.__class__ = JSRayCallback;
JSRayCallback.__cache__ = {};
Module['JSRayCallback'] = JSRayCallback;

JSRayCallback.prototype['reportRaycastResult'] = JSRayCallback.prototype.reportRaycastResult = /** @suppress {undefinedVars, duplicate} @this{Object} */function(result) {
  var self = this.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  _emscripten_bind_JSRayCallback_reportRaycastResult_1(self, result);
};;

  JSRayCallback.prototype['__destroy__'] = JSRayCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_JSRayCallback___destroy___0(self);
};
// Mat3
/** @suppress {undefinedVars, duplicate} @this{Object} */function Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  if (m00 && typeof m00 === 'object') m00 = m00.ptr;
  if (m01 && typeof m01 === 'object') m01 = m01.ptr;
  if (m02 && typeof m02 === 'object') m02 = m02.ptr;
  if (m10 && typeof m10 === 'object') m10 = m10.ptr;
  if (m11 && typeof m11 === 'object') m11 = m11.ptr;
  if (m12 && typeof m12 === 'object') m12 = m12.ptr;
  if (m20 && typeof m20 === 'object') m20 = m20.ptr;
  if (m21 && typeof m21 === 'object') m21 = m21.ptr;
  if (m22 && typeof m22 === 'object') m22 = m22.ptr;
  if (m00 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_0(); getCache(Mat3)[this.ptr] = this;return }
  if (m01 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_1(m00); getCache(Mat3)[this.ptr] = this;return }
  if (m02 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_2(m00, m01); getCache(Mat3)[this.ptr] = this;return }
  if (m10 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_3(m00, m01, m02); getCache(Mat3)[this.ptr] = this;return }
  if (m11 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_4(m00, m01, m02, m10); getCache(Mat3)[this.ptr] = this;return }
  if (m12 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_5(m00, m01, m02, m10, m11); getCache(Mat3)[this.ptr] = this;return }
  if (m20 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_6(m00, m01, m02, m10, m11, m12); getCache(Mat3)[this.ptr] = this;return }
  if (m21 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_7(m00, m01, m02, m10, m11, m12, m20); getCache(Mat3)[this.ptr] = this;return }
  if (m22 === undefined) { this.ptr = _emscripten_bind_Mat3_Mat3_8(m00, m01, m02, m10, m11, m12, m20, m21); getCache(Mat3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Mat3_Mat3_9(m00, m01, m02, m10, m11, m12, m20, m21, m22);
  getCache(Mat3)[this.ptr] = this;
};;
Mat3.prototype = Object.create(WrapperObject.prototype);
Mat3.prototype.constructor = Mat3;
Mat3.prototype.__class__ = Mat3;
Mat3.__cache__ = {};
Module['Mat3'] = Mat3;

Mat3.prototype['identity'] = Mat3.prototype.identity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Mat3_identity_0(self);
};;

Mat3.prototype['setZero'] = Mat3.prototype.setZero = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Mat3_setZero_0(self);
};;

  Mat3.prototype['__destroy__'] = Mat3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Mat3___destroy___0(self);
};
// Particle
/** @suppress {undefinedVars, duplicate} @this{Object} */function Particle(id) {
  if (id && typeof id === 'object') id = id.ptr;
  this.ptr = _emscripten_bind_Particle_Particle_1(id);
  getCache(Particle)[this.ptr] = this;
};;
Particle.prototype = Object.create(Shape.prototype);
Particle.prototype.constructor = Particle;
Particle.prototype.__class__ = Particle;
Particle.__cache__ = {};
Module['Particle'] = Particle;

Particle.prototype['release'] = Particle.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Particle_release_0(self);
};;

Particle.prototype['volume'] = Particle.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Particle_volume_0(self);
};;

Particle.prototype['get_id'] = Particle.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Particle_get_id_0(self);
};;

Particle.prototype['type'] = Particle.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Particle_type_0(self);
};;

Particle.prototype['get_collisionResponse'] = Particle.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Particle_get_collisionResponse_0(self));
};;

Particle.prototype['set_collisionResponse'] = Particle.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Particle_set_collisionResponse_1(self, val);
};;

Particle.prototype['get_collisionFilterGroup'] = Particle.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Particle_get_collisionFilterGroup_0(self);
};;

Particle.prototype['set_collisionFilterGroup'] = Particle.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Particle_set_collisionFilterGroup_1(self, value);
};;

Particle.prototype['get_collisionFilterMask'] = Particle.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Particle_get_collisionFilterMask_0(self);
};;

Particle.prototype['set_collisionFilterMask'] = Particle.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Particle_set_collisionFilterMask_1(self, value);
};;

Particle.prototype['get_body'] = Particle.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Particle_get_body_0(self), Body);
};;

Particle.prototype['set_body'] = Particle.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Particle_set_body_1(self, body);
};;

Particle.prototype['get_material'] = Particle.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Particle_get_material_0(self), Material);
};;

Particle.prototype['set_material'] = Particle.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Particle_set_material_1(self, value);
};;

// AABB
/** @suppress {undefinedVars, duplicate} @this{Object} */function AABB(lowerBound, upperBound) {
  if (lowerBound && typeof lowerBound === 'object') lowerBound = lowerBound.ptr;
  if (upperBound && typeof upperBound === 'object') upperBound = upperBound.ptr;
  if (lowerBound === undefined) { this.ptr = _emscripten_bind_AABB_AABB_0(); getCache(AABB)[this.ptr] = this;return }
  if (upperBound === undefined) { this.ptr = _emscripten_bind_AABB_AABB_1(lowerBound); getCache(AABB)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_AABB_AABB_2(lowerBound, upperBound);
  getCache(AABB)[this.ptr] = this;
};;
AABB.prototype = Object.create(WrapperObject.prototype);
AABB.prototype.constructor = AABB;
AABB.prototype.__class__ = AABB;
AABB.__cache__ = {};
Module['AABB'] = AABB;

AABB.prototype['get_lowerBound'] = AABB.prototype.get_lowerBound = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AABB_get_lowerBound_0(self), Vec3);
};;

AABB.prototype['get_upperBound'] = AABB.prototype.get_upperBound = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AABB_get_upperBound_0(self), Vec3);
};;

  AABB.prototype['__destroy__'] = AABB.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_AABB___destroy___0(self);
};
// SAPBroadphase
/** @suppress {undefinedVars, duplicate} @this{Object} */function SAPBroadphase(world) {
  if (world && typeof world === 'object') world = world.ptr;
  this.ptr = _emscripten_bind_SAPBroadphase_SAPBroadphase_1(world);
  getCache(SAPBroadphase)[this.ptr] = this;
};;
SAPBroadphase.prototype = Object.create(Broadphase.prototype);
SAPBroadphase.prototype.constructor = SAPBroadphase;
SAPBroadphase.prototype.__class__ = SAPBroadphase;
SAPBroadphase.__cache__ = {};
Module['SAPBroadphase'] = SAPBroadphase;

SAPBroadphase.prototype['get_useBoundingBoxes'] = SAPBroadphase.prototype.get_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_SAPBroadphase_get_useBoundingBoxes_0(self));
};;

SAPBroadphase.prototype['set_useBoundingBoxes'] = SAPBroadphase.prototype.set_useBoundingBoxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SAPBroadphase_set_useBoundingBoxes_1(self, value);
};;

SAPBroadphase.prototype['release'] = SAPBroadphase.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_SAPBroadphase_release_0(self);
};;

// JSEventCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function JSEventCallback() {
  this.ptr = _emscripten_bind_JSEventCallback_JSEventCallback_0();
  getCache(JSEventCallback)[this.ptr] = this;
};;
JSEventCallback.prototype = Object.create(EventCallback.prototype);
JSEventCallback.prototype.constructor = JSEventCallback;
JSEventCallback.prototype.__class__ = JSEventCallback;
JSEventCallback.__cache__ = {};
Module['JSEventCallback'] = JSEventCallback;

JSEventCallback.prototype['notify'] = JSEventCallback.prototype.notify = /** @suppress {undefinedVars, duplicate} @this{Object} */function(e) {
  var self = this.ptr;
  if (e && typeof e === 'object') e = e.ptr;
  _emscripten_bind_JSEventCallback_notify_1(self, e);
};;

  JSEventCallback.prototype['__destroy__'] = JSEventCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_JSEventCallback___destroy___0(self);
};
// EventTarget
/** @suppress {undefinedVars, duplicate} @this{Object} */function EventTarget() {
  this.ptr = _emscripten_bind_EventTarget_EventTarget_0();
  getCache(EventTarget)[this.ptr] = this;
};;
EventTarget.prototype = Object.create(WrapperObject.prototype);
EventTarget.prototype.constructor = EventTarget;
EventTarget.prototype.__class__ = EventTarget;
EventTarget.__cache__ = {};
Module['EventTarget'] = EventTarget;

EventTarget.prototype['addEventListener'] = EventTarget.prototype.addEventListener = /** @suppress {undefinedVars, duplicate} @this{Object} */function(type, listener) {
  var self = this.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  if (listener && typeof listener === 'object') listener = listener.ptr;
  _emscripten_bind_EventTarget_addEventListener_2(self, type, listener);
};;

EventTarget.prototype['hasEventListener'] = EventTarget.prototype.hasEventListener = /** @suppress {undefinedVars, duplicate} @this{Object} */function(type, listener) {
  var self = this.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  if (listener && typeof listener === 'object') listener = listener.ptr;
  return !!(_emscripten_bind_EventTarget_hasEventListener_2(self, type, listener));
};;

EventTarget.prototype['hasAnyEventListener'] = EventTarget.prototype.hasAnyEventListener = /** @suppress {undefinedVars, duplicate} @this{Object} */function(type) {
  var self = this.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  return !!(_emscripten_bind_EventTarget_hasAnyEventListener_1(self, type));
};;

EventTarget.prototype['removeEventListener'] = EventTarget.prototype.removeEventListener = /** @suppress {undefinedVars, duplicate} @this{Object} */function(type, listener) {
  var self = this.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  if (listener && typeof listener === 'object') listener = listener.ptr;
  _emscripten_bind_EventTarget_removeEventListener_2(self, type, listener);
};;

EventTarget.prototype['release'] = EventTarget.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_EventTarget_release_0(self);
};;

EventTarget.prototype['retain'] = EventTarget.prototype.retain = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_EventTarget_retain_0(self);
};;

// HingeConstraint
/** @suppress {undefinedVars, duplicate} @this{Object} */function HingeConstraint(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, collideConnected, wakeUpBodies) {
  if (id && typeof id === 'object') id = id.ptr;
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (pivotA && typeof pivotA === 'object') pivotA = pivotA.ptr;
  if (pivotB && typeof pivotB === 'object') pivotB = pivotB.ptr;
  if (axisA && typeof axisA === 'object') axisA = axisA.ptr;
  if (axisB && typeof axisB === 'object') axisB = axisB.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  if (collideConnected && typeof collideConnected === 'object') collideConnected = collideConnected.ptr;
  if (wakeUpBodies && typeof wakeUpBodies === 'object') wakeUpBodies = wakeUpBodies.ptr;
  if (pivotA === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_3(id, bodyA, bodyB); getCache(HingeConstraint)[this.ptr] = this;return }
  if (pivotB === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_4(id, bodyA, bodyB, pivotA); getCache(HingeConstraint)[this.ptr] = this;return }
  if (axisA === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_5(id, bodyA, bodyB, pivotA, pivotB); getCache(HingeConstraint)[this.ptr] = this;return }
  if (axisB === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_6(id, bodyA, bodyB, pivotA, pivotB, axisA); getCache(HingeConstraint)[this.ptr] = this;return }
  if (maxForce === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_7(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB); getCache(HingeConstraint)[this.ptr] = this;return }
  if (collideConnected === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_8(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce); getCache(HingeConstraint)[this.ptr] = this;return }
  if (wakeUpBodies === undefined) { this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_9(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, collideConnected); getCache(HingeConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_HingeConstraint_HingeConstraint_10(id, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, collideConnected, wakeUpBodies);
  getCache(HingeConstraint)[this.ptr] = this;
};;
HingeConstraint.prototype = Object.create(PointToPointConstraint.prototype);
HingeConstraint.prototype.constructor = HingeConstraint;
HingeConstraint.prototype.__class__ = HingeConstraint;
HingeConstraint.__cache__ = {};
Module['HingeConstraint'] = HingeConstraint;

HingeConstraint.prototype['enableMotor'] = HingeConstraint.prototype.enableMotor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_HingeConstraint_enableMotor_0(self);
};;

HingeConstraint.prototype['disableMotor'] = HingeConstraint.prototype.disableMotor = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_HingeConstraint_disableMotor_0(self);
};;

HingeConstraint.prototype['setMotorSpeed'] = HingeConstraint.prototype.setMotorSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function(speed) {
  var self = this.ptr;
  if (speed && typeof speed === 'object') speed = speed.ptr;
  _emscripten_bind_HingeConstraint_setMotorSpeed_1(self, speed);
};;

HingeConstraint.prototype['setMotorMaxForce'] = HingeConstraint.prototype.setMotorMaxForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(maxForce) {
  var self = this.ptr;
  if (maxForce && typeof maxForce === 'object') maxForce = maxForce.ptr;
  _emscripten_bind_HingeConstraint_setMotorMaxForce_1(self, maxForce);
};;

HingeConstraint.prototype['enable'] = HingeConstraint.prototype.enable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_HingeConstraint_enable_0(self);
};;

HingeConstraint.prototype['disable'] = HingeConstraint.prototype.disable = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_HingeConstraint_disable_0(self);
};;

HingeConstraint.prototype['getEquationCount'] = HingeConstraint.prototype.getEquationCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_HingeConstraint_getEquationCount_0(self);
};;

HingeConstraint.prototype['getEquation'] = HingeConstraint.prototype.getEquation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_HingeConstraint_getEquation_1(self, index), Equation);
};;

HingeConstraint.prototype['release'] = HingeConstraint.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_HingeConstraint_release_0(self);
};;

// RayOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function RayOptions(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, from, to, callback) {
  if (skipBackfaces && typeof skipBackfaces === 'object') skipBackfaces = skipBackfaces.ptr;
  if (mode && typeof mode === 'object') mode = mode.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (callback && typeof callback === 'object') callback = callback.ptr;
  if (skipBackfaces === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_0(); getCache(RayOptions)[this.ptr] = this;return }
  if (mode === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_1(skipBackfaces); getCache(RayOptions)[this.ptr] = this;return }
  if (result === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_2(skipBackfaces, mode); getCache(RayOptions)[this.ptr] = this;return }
  if (collisionFilterMask === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_3(skipBackfaces, mode, result); getCache(RayOptions)[this.ptr] = this;return }
  if (collisionFilterGroup === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_4(skipBackfaces, mode, result, collisionFilterMask); getCache(RayOptions)[this.ptr] = this;return }
  if (from === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_5(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup); getCache(RayOptions)[this.ptr] = this;return }
  if (to === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_6(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, from); getCache(RayOptions)[this.ptr] = this;return }
  if (callback === undefined) { this.ptr = _emscripten_bind_RayOptions_RayOptions_7(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, from, to); getCache(RayOptions)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_RayOptions_RayOptions_8(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, from, to, callback);
  getCache(RayOptions)[this.ptr] = this;
};;
RayOptions.prototype = Object.create(WrapperObject.prototype);
RayOptions.prototype.constructor = RayOptions;
RayOptions.prototype.__class__ = RayOptions;
RayOptions.__cache__ = {};
Module['RayOptions'] = RayOptions;

  RayOptions.prototype['get_from'] = RayOptions.prototype.get_from = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayOptions_get_from_0(self), Vec3);
};
    RayOptions.prototype['set_from'] = RayOptions.prototype.set_from = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_from_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'from', { get: RayOptions.prototype.get_from, set: RayOptions.prototype.set_from });
  RayOptions.prototype['get_to'] = RayOptions.prototype.get_to = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayOptions_get_to_0(self), Vec3);
};
    RayOptions.prototype['set_to'] = RayOptions.prototype.set_to = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_to_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'to', { get: RayOptions.prototype.get_to, set: RayOptions.prototype.set_to });
  RayOptions.prototype['get_result'] = RayOptions.prototype.get_result = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayOptions_get_result_0(self), RaycastResult);
};
    RayOptions.prototype['set_result'] = RayOptions.prototype.set_result = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_result_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'result', { get: RayOptions.prototype.get_result, set: RayOptions.prototype.set_result });
  RayOptions.prototype['get_mode'] = RayOptions.prototype.get_mode = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayOptions_get_mode_0(self);
};
    RayOptions.prototype['set_mode'] = RayOptions.prototype.set_mode = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_mode_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'mode', { get: RayOptions.prototype.get_mode, set: RayOptions.prototype.set_mode });
  RayOptions.prototype['get_skipBackfaces'] = RayOptions.prototype.get_skipBackfaces = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RayOptions_get_skipBackfaces_0(self));
};
    RayOptions.prototype['set_skipBackfaces'] = RayOptions.prototype.set_skipBackfaces = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_skipBackfaces_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'skipBackfaces', { get: RayOptions.prototype.get_skipBackfaces, set: RayOptions.prototype.set_skipBackfaces });
  RayOptions.prototype['get_collisionFilterMask'] = RayOptions.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayOptions_get_collisionFilterMask_0(self);
};
    RayOptions.prototype['set_collisionFilterMask'] = RayOptions.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_collisionFilterMask_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'collisionFilterMask', { get: RayOptions.prototype.get_collisionFilterMask, set: RayOptions.prototype.set_collisionFilterMask });
  RayOptions.prototype['get_collisionFilterGroup'] = RayOptions.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayOptions_get_collisionFilterGroup_0(self);
};
    RayOptions.prototype['set_collisionFilterGroup'] = RayOptions.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayOptions_set_collisionFilterGroup_1(self, arg0);
};
    Object.defineProperty(RayOptions.prototype, 'collisionFilterGroup', { get: RayOptions.prototype.get_collisionFilterGroup, set: RayOptions.prototype.set_collisionFilterGroup });
  RayOptions.prototype['__destroy__'] = RayOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RayOptions___destroy___0(self);
};
// Trimesh
/** @suppress {undefinedVars, duplicate} @this{Object} */function Trimesh(id, radius, tube, radialSegments, tubularSegments, arc) {
  if (id && typeof id === 'object') id = id.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (tube && typeof tube === 'object') tube = tube.ptr;
  if (radialSegments && typeof radialSegments === 'object') radialSegments = radialSegments.ptr;
  if (tubularSegments && typeof tubularSegments === 'object') tubularSegments = tubularSegments.ptr;
  if (arc && typeof arc === 'object') arc = arc.ptr;
  if (arc === undefined) { this.ptr = _emscripten_bind_Trimesh_Trimesh_5(id, radius, tube, radialSegments, tubularSegments); getCache(Trimesh)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Trimesh_Trimesh_6(id, radius, tube, radialSegments, tubularSegments, arc);
  getCache(Trimesh)[this.ptr] = this;
};;
Trimesh.prototype = Object.create(Shape.prototype);
Trimesh.prototype.constructor = Trimesh;
Trimesh.prototype.__class__ = Trimesh;
Trimesh.__cache__ = {};
Module['Trimesh'] = Trimesh;

Trimesh.prototype['setScale'] = Trimesh.prototype.setScale = /** @suppress {undefinedVars, duplicate} @this{Object} */function(scale) {
  var self = this.ptr;
  if (scale && typeof scale === 'object') scale = scale.ptr;
  _emscripten_bind_Trimesh_setScale_1(self, scale);
};;

Trimesh.prototype['updateTree'] = Trimesh.prototype.updateTree = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Trimesh_updateTree_0(self);
};;

Trimesh.prototype['updateAABB'] = Trimesh.prototype.updateAABB = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Trimesh_updateAABB_0(self);
};;

Trimesh.prototype['updateEdges'] = Trimesh.prototype.updateEdges = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Trimesh_updateEdges_0(self);
};;

Trimesh.prototype['updateNormals'] = Trimesh.prototype.updateNormals = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Trimesh_updateNormals_0(self);
};;

Trimesh.prototype['get_aabb'] = Trimesh.prototype.get_aabb = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Trimesh_get_aabb_0(self), AABB);
};;

Trimesh.prototype['set_aabb'] = Trimesh.prototype.set_aabb = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Trimesh_set_aabb_1(self, val);
};;

Trimesh.prototype['get_scale'] = Trimesh.prototype.get_scale = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Trimesh_get_scale_0(self), Vec3);
};;

Trimesh.prototype['set_scale'] = Trimesh.prototype.set_scale = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Trimesh_set_scale_1(self, val);
};;

Trimesh.prototype['getTriangleVertices'] = Trimesh.prototype.getTriangleVertices = /** @suppress {undefinedVars, duplicate} @this{Object} */function(i, a, b, c) {
  var self = this.ptr;
  if (i && typeof i === 'object') i = i.ptr;
  if (a && typeof a === 'object') a = a.ptr;
  if (b && typeof b === 'object') b = b.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  _emscripten_bind_Trimesh_getTriangleVertices_4(self, i, a, b, c);
};;

Trimesh.prototype['getVerticeCount'] = Trimesh.prototype.getVerticeCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_getVerticeCount_0(self);
};;

Trimesh.prototype['getVertice'] = Trimesh.prototype.getVertice = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return _emscripten_bind_Trimesh_getVertice_1(self, index);
};;

Trimesh.prototype['getIndiceCount'] = Trimesh.prototype.getIndiceCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_getIndiceCount_0(self);
};;

Trimesh.prototype['getIndice'] = Trimesh.prototype.getIndice = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return _emscripten_bind_Trimesh_getIndice_1(self, index);
};;

Trimesh.prototype['release'] = Trimesh.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Trimesh_release_0(self);
};;

Trimesh.prototype['get_id'] = Trimesh.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_get_id_0(self);
};;

Trimesh.prototype['type'] = Trimesh.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_type_0(self);
};;

Trimesh.prototype['get_collisionResponse'] = Trimesh.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Trimesh_get_collisionResponse_0(self));
};;

Trimesh.prototype['set_collisionResponse'] = Trimesh.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Trimesh_set_collisionResponse_1(self, val);
};;

Trimesh.prototype['get_collisionFilterGroup'] = Trimesh.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_get_collisionFilterGroup_0(self);
};;

Trimesh.prototype['set_collisionFilterGroup'] = Trimesh.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Trimesh_set_collisionFilterGroup_1(self, value);
};;

Trimesh.prototype['get_collisionFilterMask'] = Trimesh.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Trimesh_get_collisionFilterMask_0(self);
};;

Trimesh.prototype['set_collisionFilterMask'] = Trimesh.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Trimesh_set_collisionFilterMask_1(self, value);
};;

Trimesh.prototype['get_body'] = Trimesh.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Trimesh_get_body_0(self), Body);
};;

Trimesh.prototype['set_body'] = Trimesh.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Trimesh_set_body_1(self, body);
};;

Trimesh.prototype['get_material'] = Trimesh.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Trimesh_get_material_0(self), Material);
};;

Trimesh.prototype['set_material'] = Trimesh.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Trimesh_set_material_1(self, value);
};;

// SPHSystem
/** @suppress {undefinedVars, duplicate} @this{Object} */function SPHSystem() {
  this.ptr = _emscripten_bind_SPHSystem_SPHSystem_0();
  getCache(SPHSystem)[this.ptr] = this;
};;
SPHSystem.prototype = Object.create(ISystem.prototype);
SPHSystem.prototype.constructor = SPHSystem;
SPHSystem.prototype.__class__ = SPHSystem;
SPHSystem.__cache__ = {};
Module['SPHSystem'] = SPHSystem;

SPHSystem.prototype['add'] = SPHSystem.prototype.add = /** @suppress {undefinedVars, duplicate} @this{Object} */function(particle) {
  var self = this.ptr;
  if (particle && typeof particle === 'object') particle = particle.ptr;
  _emscripten_bind_SPHSystem_add_1(self, particle);
};;

SPHSystem.prototype['remove'] = SPHSystem.prototype.remove = /** @suppress {undefinedVars, duplicate} @this{Object} */function(particle) {
  var self = this.ptr;
  if (particle && typeof particle === 'object') particle = particle.ptr;
  _emscripten_bind_SPHSystem_remove_1(self, particle);
};;

SPHSystem.prototype['get_density'] = SPHSystem.prototype.get_density = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SPHSystem_get_density_0(self);
};;

SPHSystem.prototype['set_density'] = SPHSystem.prototype.set_density = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SPHSystem_set_density_1(self, value);
};;

SPHSystem.prototype['get_smoothingRadius'] = SPHSystem.prototype.get_smoothingRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SPHSystem_get_smoothingRadius_0(self);
};;

SPHSystem.prototype['set_smoothingRadius'] = SPHSystem.prototype.set_smoothingRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SPHSystem_set_smoothingRadius_1(self, value);
};;

SPHSystem.prototype['get_speedOfSound'] = SPHSystem.prototype.get_speedOfSound = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SPHSystem_get_speedOfSound_0(self);
};;

SPHSystem.prototype['set_speedOfSound'] = SPHSystem.prototype.set_speedOfSound = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SPHSystem_set_speedOfSound_1(self, value);
};;

SPHSystem.prototype['get_viscosity'] = SPHSystem.prototype.get_viscosity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SPHSystem_get_viscosity_0(self);
};;

SPHSystem.prototype['set_viscosity'] = SPHSystem.prototype.set_viscosity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SPHSystem_set_viscosity_1(self, value);
};;

SPHSystem.prototype['get_eps'] = SPHSystem.prototype.get_eps = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SPHSystem_get_eps_0(self);
};;

SPHSystem.prototype['set_eps'] = SPHSystem.prototype.set_eps = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SPHSystem_set_eps_1(self, value);
};;

// RaycastVehicle
/** @suppress {undefinedVars, duplicate} @this{Object} */function RaycastVehicle(chassisBody, indexRightAxis, indexLeftAxis, indexUpAxis) {
  if (chassisBody && typeof chassisBody === 'object') chassisBody = chassisBody.ptr;
  if (indexRightAxis && typeof indexRightAxis === 'object') indexRightAxis = indexRightAxis.ptr;
  if (indexLeftAxis && typeof indexLeftAxis === 'object') indexLeftAxis = indexLeftAxis.ptr;
  if (indexUpAxis && typeof indexUpAxis === 'object') indexUpAxis = indexUpAxis.ptr;
  this.ptr = _emscripten_bind_RaycastVehicle_RaycastVehicle_4(chassisBody, indexRightAxis, indexLeftAxis, indexUpAxis);
  getCache(RaycastVehicle)[this.ptr] = this;
};;
RaycastVehicle.prototype = Object.create(Ref.prototype);
RaycastVehicle.prototype.constructor = RaycastVehicle;
RaycastVehicle.prototype.__class__ = RaycastVehicle;
RaycastVehicle.__cache__ = {};
Module['RaycastVehicle'] = RaycastVehicle;

RaycastVehicle.prototype['addWheel'] = RaycastVehicle.prototype.addWheel = /** @suppress {undefinedVars, duplicate} @this{Object} */function(options) {
  var self = this.ptr;
  if (options && typeof options === 'object') options = options.ptr;
  _emscripten_bind_RaycastVehicle_addWheel_1(self, options);
};;

RaycastVehicle.prototype['setSteeringValue'] = RaycastVehicle.prototype.setSteeringValue = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RaycastVehicle_setSteeringValue_2(self, value, wheelIndex);
};;

RaycastVehicle.prototype['applyEngineForce'] = RaycastVehicle.prototype.applyEngineForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RaycastVehicle_applyEngineForce_2(self, value, wheelIndex);
};;

RaycastVehicle.prototype['setBrake'] = RaycastVehicle.prototype.setBrake = /** @suppress {undefinedVars, duplicate} @this{Object} */function(brake, wheelIndex) {
  var self = this.ptr;
  if (brake && typeof brake === 'object') brake = brake.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RaycastVehicle_setBrake_2(self, brake, wheelIndex);
};;

RaycastVehicle.prototype['addToWorld'] = RaycastVehicle.prototype.addToWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(world) {
  var self = this.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  _emscripten_bind_RaycastVehicle_addToWorld_1(self, world);
};;

RaycastVehicle.prototype['removeFromWorld'] = RaycastVehicle.prototype.removeFromWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(world) {
  var self = this.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  _emscripten_bind_RaycastVehicle_removeFromWorld_1(self, world);
};;

RaycastVehicle.prototype['updateWheelTransform'] = RaycastVehicle.prototype.updateWheelTransform = /** @suppress {undefinedVars, duplicate} @this{Object} */function(wheelIndex) {
  var self = this.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RaycastVehicle_updateWheelTransform_1(self, wheelIndex);
};;

RaycastVehicle.prototype['getWheelCount'] = RaycastVehicle.prototype.getWheelCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastVehicle_getWheelCount_0(self);
};;

RaycastVehicle.prototype['getWheel'] = RaycastVehicle.prototype.getWheel = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_RaycastVehicle_getWheel_1(self, index), WheelInfo);
};;

RaycastVehicle.prototype['release'] = RaycastVehicle.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RaycastVehicle_release_0(self);
};;

// ContactMaterialOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function ContactMaterialOptions(friction, restitution, contactEquationStiffness, contactEquationRelaxation, frictionEquationStiffness, frictionEquationRelaxation) {
  if (friction && typeof friction === 'object') friction = friction.ptr;
  if (restitution && typeof restitution === 'object') restitution = restitution.ptr;
  if (contactEquationStiffness && typeof contactEquationStiffness === 'object') contactEquationStiffness = contactEquationStiffness.ptr;
  if (contactEquationRelaxation && typeof contactEquationRelaxation === 'object') contactEquationRelaxation = contactEquationRelaxation.ptr;
  if (frictionEquationStiffness && typeof frictionEquationStiffness === 'object') frictionEquationStiffness = frictionEquationStiffness.ptr;
  if (frictionEquationRelaxation && typeof frictionEquationRelaxation === 'object') frictionEquationRelaxation = frictionEquationRelaxation.ptr;
  if (friction === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_0(); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  if (restitution === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_1(friction); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  if (contactEquationStiffness === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_2(friction, restitution); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  if (contactEquationRelaxation === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_3(friction, restitution, contactEquationStiffness); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  if (frictionEquationStiffness === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_4(friction, restitution, contactEquationStiffness, contactEquationRelaxation); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  if (frictionEquationRelaxation === undefined) { this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_5(friction, restitution, contactEquationStiffness, contactEquationRelaxation, frictionEquationStiffness); getCache(ContactMaterialOptions)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_6(friction, restitution, contactEquationStiffness, contactEquationRelaxation, frictionEquationStiffness, frictionEquationRelaxation);
  getCache(ContactMaterialOptions)[this.ptr] = this;
};;
ContactMaterialOptions.prototype = Object.create(WrapperObject.prototype);
ContactMaterialOptions.prototype.constructor = ContactMaterialOptions;
ContactMaterialOptions.prototype.__class__ = ContactMaterialOptions;
ContactMaterialOptions.__cache__ = {};
Module['ContactMaterialOptions'] = ContactMaterialOptions;

  ContactMaterialOptions.prototype['get_friction'] = ContactMaterialOptions.prototype.get_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_friction_0(self);
};
    ContactMaterialOptions.prototype['set_friction'] = ContactMaterialOptions.prototype.set_friction = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_friction_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'friction', { get: ContactMaterialOptions.prototype.get_friction, set: ContactMaterialOptions.prototype.set_friction });
  ContactMaterialOptions.prototype['get_restitution'] = ContactMaterialOptions.prototype.get_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_restitution_0(self);
};
    ContactMaterialOptions.prototype['set_restitution'] = ContactMaterialOptions.prototype.set_restitution = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_restitution_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'restitution', { get: ContactMaterialOptions.prototype.get_restitution, set: ContactMaterialOptions.prototype.set_restitution });
  ContactMaterialOptions.prototype['get_contactEquationStiffness'] = ContactMaterialOptions.prototype.get_contactEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_contactEquationStiffness_0(self);
};
    ContactMaterialOptions.prototype['set_contactEquationStiffness'] = ContactMaterialOptions.prototype.set_contactEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_contactEquationStiffness_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'contactEquationStiffness', { get: ContactMaterialOptions.prototype.get_contactEquationStiffness, set: ContactMaterialOptions.prototype.set_contactEquationStiffness });
  ContactMaterialOptions.prototype['get_contactEquationRelaxation'] = ContactMaterialOptions.prototype.get_contactEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_contactEquationRelaxation_0(self);
};
    ContactMaterialOptions.prototype['set_contactEquationRelaxation'] = ContactMaterialOptions.prototype.set_contactEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_contactEquationRelaxation_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'contactEquationRelaxation', { get: ContactMaterialOptions.prototype.get_contactEquationRelaxation, set: ContactMaterialOptions.prototype.set_contactEquationRelaxation });
  ContactMaterialOptions.prototype['get_frictionEquationStiffness'] = ContactMaterialOptions.prototype.get_frictionEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_frictionEquationStiffness_0(self);
};
    ContactMaterialOptions.prototype['set_frictionEquationStiffness'] = ContactMaterialOptions.prototype.set_frictionEquationStiffness = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_frictionEquationStiffness_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'frictionEquationStiffness', { get: ContactMaterialOptions.prototype.get_frictionEquationStiffness, set: ContactMaterialOptions.prototype.set_frictionEquationStiffness });
  ContactMaterialOptions.prototype['get_frictionEquationRelaxation'] = ContactMaterialOptions.prototype.get_frictionEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ContactMaterialOptions_get_frictionEquationRelaxation_0(self);
};
    ContactMaterialOptions.prototype['set_frictionEquationRelaxation'] = ContactMaterialOptions.prototype.set_frictionEquationRelaxation = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ContactMaterialOptions_set_frictionEquationRelaxation_1(self, arg0);
};
    Object.defineProperty(ContactMaterialOptions.prototype, 'frictionEquationRelaxation', { get: ContactMaterialOptions.prototype.get_frictionEquationRelaxation, set: ContactMaterialOptions.prototype.set_frictionEquationRelaxation });
  ContactMaterialOptions.prototype['__destroy__'] = ContactMaterialOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ContactMaterialOptions___destroy___0(self);
};
// Cylinder
/** @suppress {undefinedVars, duplicate} @this{Object} */function Cylinder(id, radiusTop, radiusBottom, height, numSegments) {
  if (id && typeof id === 'object') id = id.ptr;
  if (radiusTop && typeof radiusTop === 'object') radiusTop = radiusTop.ptr;
  if (radiusBottom && typeof radiusBottom === 'object') radiusBottom = radiusBottom.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  if (numSegments && typeof numSegments === 'object') numSegments = numSegments.ptr;
  this.ptr = _emscripten_bind_Cylinder_Cylinder_5(id, radiusTop, radiusBottom, height, numSegments);
  getCache(Cylinder)[this.ptr] = this;
};;
Cylinder.prototype = Object.create(ConvexPolyhedron.prototype);
Cylinder.prototype.constructor = Cylinder;
Cylinder.prototype.__class__ = Cylinder;
Cylinder.__cache__ = {};
Module['Cylinder'] = Cylinder;

Cylinder.prototype['computeEdges'] = Cylinder.prototype.computeEdges = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Cylinder_computeEdges_0(self);
};;

Cylinder.prototype['computeNormals'] = Cylinder.prototype.computeNormals = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Cylinder_computeNormals_0(self);
};;

Cylinder.prototype['updateBoundingSphereRadius'] = Cylinder.prototype.updateBoundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Cylinder_updateBoundingSphereRadius_0(self);
};;

Cylinder.prototype['volume'] = Cylinder.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_volume_0(self);
};;

Cylinder.prototype['transformAllPoints'] = Cylinder.prototype.transformAllPoints = /** @suppress {undefinedVars, duplicate} @this{Object} */function(offset, quat) {
  var self = this.ptr;
  if (offset && typeof offset === 'object') offset = offset.ptr;
  if (quat && typeof quat === 'object') quat = quat.ptr;
  _emscripten_bind_Cylinder_transformAllPoints_2(self, offset, quat);
};;

Cylinder.prototype['get_worldVerticesNeedsUpdate'] = Cylinder.prototype.get_worldVerticesNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Cylinder_get_worldVerticesNeedsUpdate_0(self));
};;

Cylinder.prototype['set_worldVerticesNeedsUpdate'] = Cylinder.prototype.set_worldVerticesNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Cylinder_set_worldVerticesNeedsUpdate_1(self, val);
};;

Cylinder.prototype['get_worldFaceNormalsNeedsUpdate'] = Cylinder.prototype.get_worldFaceNormalsNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Cylinder_get_worldFaceNormalsNeedsUpdate_0(self));
};;

Cylinder.prototype['set_worldFaceNormalsNeedsUpdate'] = Cylinder.prototype.set_worldFaceNormalsNeedsUpdate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Cylinder_set_worldFaceNormalsNeedsUpdate_1(self, val);
};;

Cylinder.prototype['set_vertices'] = Cylinder.prototype.set_vertices = /** @suppress {undefinedVars, duplicate} @this{Object} */function(vertices, verticeCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof vertices == 'object') { vertices = ensureFloat32(vertices); }
  if (verticeCount && typeof verticeCount === 'object') verticeCount = verticeCount.ptr;
  _emscripten_bind_Cylinder_set_vertices_2(self, vertices, verticeCount);
};;

Cylinder.prototype['set_faces'] = Cylinder.prototype.set_faces = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faces, faceCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof faces == 'object') { faces = ensureInt32(faces); }
  if (faceCount && typeof faceCount === 'object') faceCount = faceCount.ptr;
  _emscripten_bind_Cylinder_set_faces_2(self, faces, faceCount);
};;

Cylinder.prototype['set_uniqueAxes'] = Cylinder.prototype.set_uniqueAxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(vertices, verticeCount) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof vertices == 'object') { vertices = ensureFloat32(vertices); }
  if (verticeCount && typeof verticeCount === 'object') verticeCount = verticeCount.ptr;
  _emscripten_bind_Cylinder_set_uniqueAxes_2(self, vertices, verticeCount);
};;

Cylinder.prototype['getVerticeCount'] = Cylinder.prototype.getVerticeCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_getVerticeCount_0(self);
};;

Cylinder.prototype['getVertice'] = Cylinder.prototype.getVertice = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Cylinder_getVertice_1(self, index), Vec3);
};;

Cylinder.prototype['getFaceCount'] = Cylinder.prototype.getFaceCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_getFaceCount_0(self);
};;

Cylinder.prototype['getFacePointCount'] = Cylinder.prototype.getFacePointCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faceIndex) {
  var self = this.ptr;
  if (faceIndex && typeof faceIndex === 'object') faceIndex = faceIndex.ptr;
  return _emscripten_bind_Cylinder_getFacePointCount_1(self, faceIndex);
};;

Cylinder.prototype['getFacePoint'] = Cylinder.prototype.getFacePoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(faceIndex, pointIndex) {
  var self = this.ptr;
  if (faceIndex && typeof faceIndex === 'object') faceIndex = faceIndex.ptr;
  if (pointIndex && typeof pointIndex === 'object') pointIndex = pointIndex.ptr;
  return _emscripten_bind_Cylinder_getFacePoint_2(self, faceIndex, pointIndex);
};;

Cylinder.prototype['getUniqueAxesCount'] = Cylinder.prototype.getUniqueAxesCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_getUniqueAxesCount_0(self);
};;

Cylinder.prototype['getUniqueAxes'] = Cylinder.prototype.getUniqueAxes = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Cylinder_getUniqueAxes_1(self, index), Vec3);
};;

Cylinder.prototype['release'] = Cylinder.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Cylinder_release_0(self);
};;

Cylinder.prototype['get_id'] = Cylinder.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_get_id_0(self);
};;

Cylinder.prototype['type'] = Cylinder.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_type_0(self);
};;

Cylinder.prototype['get_collisionResponse'] = Cylinder.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Cylinder_get_collisionResponse_0(self));
};;

Cylinder.prototype['set_collisionResponse'] = Cylinder.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Cylinder_set_collisionResponse_1(self, val);
};;

Cylinder.prototype['get_collisionFilterGroup'] = Cylinder.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_get_collisionFilterGroup_0(self);
};;

Cylinder.prototype['set_collisionFilterGroup'] = Cylinder.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Cylinder_set_collisionFilterGroup_1(self, value);
};;

Cylinder.prototype['get_collisionFilterMask'] = Cylinder.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Cylinder_get_collisionFilterMask_0(self);
};;

Cylinder.prototype['set_collisionFilterMask'] = Cylinder.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Cylinder_set_collisionFilterMask_1(self, value);
};;

Cylinder.prototype['get_body'] = Cylinder.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Cylinder_get_body_0(self), Body);
};;

Cylinder.prototype['set_body'] = Cylinder.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Cylinder_set_body_1(self, body);
};;

Cylinder.prototype['get_material'] = Cylinder.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Cylinder_get_material_0(self), Material);
};;

Cylinder.prototype['set_material'] = Cylinder.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Cylinder_set_material_1(self, value);
};;

// Spring
/** @suppress {undefinedVars, duplicate} @this{Object} */function Spring(bodyA, bodyB, options) {
  if (bodyA && typeof bodyA === 'object') bodyA = bodyA.ptr;
  if (bodyB && typeof bodyB === 'object') bodyB = bodyB.ptr;
  if (options && typeof options === 'object') options = options.ptr;
  if (options === undefined) { this.ptr = _emscripten_bind_Spring_Spring_2(bodyA, bodyB); getCache(Spring)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Spring_Spring_3(bodyA, bodyB, options);
  getCache(Spring)[this.ptr] = this;
};;
Spring.prototype = Object.create(Ref.prototype);
Spring.prototype.constructor = Spring;
Spring.prototype.__class__ = Spring;
Spring.__cache__ = {};
Module['Spring'] = Spring;

Spring.prototype['applyForce'] = Spring.prototype.applyForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Spring_applyForce_0(self);
};;

Spring.prototype['release'] = Spring.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Spring_release_0(self);
};;

// RaycastResult
/** @suppress {undefinedVars, duplicate} @this{Object} */function RaycastResult() {
  this.ptr = _emscripten_bind_RaycastResult_RaycastResult_0();
  getCache(RaycastResult)[this.ptr] = this;
};;
RaycastResult.prototype = Object.create(WrapperObject.prototype);
RaycastResult.prototype.constructor = RaycastResult;
RaycastResult.prototype.__class__ = RaycastResult;
RaycastResult.__cache__ = {};
Module['RaycastResult'] = RaycastResult;

RaycastResult.prototype['reset'] = RaycastResult.prototype.reset = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RaycastResult_reset_0(self);
};;

RaycastResult.prototype['abort'] = RaycastResult.prototype.abort = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RaycastResult_abort_0(self);
};;

RaycastResult.prototype['get_shape'] = RaycastResult.prototype.get_shape = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_shape_0(self), Shape);
};;

RaycastResult.prototype['get_body'] = RaycastResult.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_body_0(self), Body);
};;

  RaycastResult.prototype['get_rayFromWorld'] = RaycastResult.prototype.get_rayFromWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_rayFromWorld_0(self), Vec3);
};
    RaycastResult.prototype['set_rayFromWorld'] = RaycastResult.prototype.set_rayFromWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_rayFromWorld_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'rayFromWorld', { get: RaycastResult.prototype.get_rayFromWorld, set: RaycastResult.prototype.set_rayFromWorld });
  RaycastResult.prototype['get_rayToWorld'] = RaycastResult.prototype.get_rayToWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_rayToWorld_0(self), Vec3);
};
    RaycastResult.prototype['set_rayToWorld'] = RaycastResult.prototype.set_rayToWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_rayToWorld_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'rayToWorld', { get: RaycastResult.prototype.get_rayToWorld, set: RaycastResult.prototype.set_rayToWorld });
  RaycastResult.prototype['get_hitNormalWorld'] = RaycastResult.prototype.get_hitNormalWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_hitNormalWorld_0(self), Vec3);
};
    RaycastResult.prototype['set_hitNormalWorld'] = RaycastResult.prototype.set_hitNormalWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_hitNormalWorld_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'hitNormalWorld', { get: RaycastResult.prototype.get_hitNormalWorld, set: RaycastResult.prototype.set_hitNormalWorld });
  RaycastResult.prototype['get_hitPointWorld'] = RaycastResult.prototype.get_hitPointWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastResult_get_hitPointWorld_0(self), Vec3);
};
    RaycastResult.prototype['set_hitPointWorld'] = RaycastResult.prototype.set_hitPointWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_hitPointWorld_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'hitPointWorld', { get: RaycastResult.prototype.get_hitPointWorld, set: RaycastResult.prototype.set_hitPointWorld });
  RaycastResult.prototype['get_hasHit'] = RaycastResult.prototype.get_hasHit = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RaycastResult_get_hasHit_0(self));
};
    RaycastResult.prototype['set_hasHit'] = RaycastResult.prototype.set_hasHit = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_hasHit_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'hasHit', { get: RaycastResult.prototype.get_hasHit, set: RaycastResult.prototype.set_hasHit });
  RaycastResult.prototype['get_hitFaceIndex'] = RaycastResult.prototype.get_hitFaceIndex = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastResult_get_hitFaceIndex_0(self);
};
    RaycastResult.prototype['set_hitFaceIndex'] = RaycastResult.prototype.set_hitFaceIndex = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_hitFaceIndex_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'hitFaceIndex', { get: RaycastResult.prototype.get_hitFaceIndex, set: RaycastResult.prototype.set_hitFaceIndex });
  RaycastResult.prototype['get_distance'] = RaycastResult.prototype.get_distance = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastResult_get_distance_0(self);
};
    RaycastResult.prototype['set_distance'] = RaycastResult.prototype.set_distance = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastResult_set_distance_1(self, arg0);
};
    Object.defineProperty(RaycastResult.prototype, 'distance', { get: RaycastResult.prototype.get_distance, set: RaycastResult.prototype.set_distance });
  RaycastResult.prototype['__destroy__'] = RaycastResult.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_RaycastResult___destroy___0(self);
};
// WorldOptions
/** @suppress {undefinedVars, duplicate} @this{Object} */function WorldOptions() {
  this.ptr = _emscripten_bind_WorldOptions_WorldOptions_0();
  getCache(WorldOptions)[this.ptr] = this;
};;
WorldOptions.prototype = Object.create(WrapperObject.prototype);
WorldOptions.prototype.constructor = WorldOptions;
WorldOptions.prototype.__class__ = WorldOptions;
WorldOptions.__cache__ = {};
Module['WorldOptions'] = WorldOptions;

  WorldOptions.prototype['get_gravity'] = WorldOptions.prototype.get_gravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WorldOptions_get_gravity_0(self), Vec3);
};
    WorldOptions.prototype['set_gravity'] = WorldOptions.prototype.set_gravity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_gravity_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'gravity', { get: WorldOptions.prototype.get_gravity, set: WorldOptions.prototype.set_gravity });
  WorldOptions.prototype['get_broadphase'] = WorldOptions.prototype.get_broadphase = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WorldOptions_get_broadphase_0(self), Broadphase);
};
    WorldOptions.prototype['set_broadphase'] = WorldOptions.prototype.set_broadphase = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_broadphase_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'broadphase', { get: WorldOptions.prototype.get_broadphase, set: WorldOptions.prototype.set_broadphase });
  WorldOptions.prototype['get_solver'] = WorldOptions.prototype.get_solver = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_WorldOptions_get_solver_0(self), Solver);
};
    WorldOptions.prototype['set_solver'] = WorldOptions.prototype.set_solver = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_solver_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'solver', { get: WorldOptions.prototype.get_solver, set: WorldOptions.prototype.set_solver });
  WorldOptions.prototype['get_allowSleep'] = WorldOptions.prototype.get_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_WorldOptions_get_allowSleep_0(self));
};
    WorldOptions.prototype['set_allowSleep'] = WorldOptions.prototype.set_allowSleep = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_allowSleep_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'allowSleep', { get: WorldOptions.prototype.get_allowSleep, set: WorldOptions.prototype.set_allowSleep });
  WorldOptions.prototype['get_quatNormalizeSkip'] = WorldOptions.prototype.get_quatNormalizeSkip = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_WorldOptions_get_quatNormalizeSkip_0(self);
};
    WorldOptions.prototype['set_quatNormalizeSkip'] = WorldOptions.prototype.set_quatNormalizeSkip = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_quatNormalizeSkip_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'quatNormalizeSkip', { get: WorldOptions.prototype.get_quatNormalizeSkip, set: WorldOptions.prototype.set_quatNormalizeSkip });
  WorldOptions.prototype['get_quatNormalizeFast'] = WorldOptions.prototype.get_quatNormalizeFast = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_WorldOptions_get_quatNormalizeFast_0(self));
};
    WorldOptions.prototype['set_quatNormalizeFast'] = WorldOptions.prototype.set_quatNormalizeFast = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_WorldOptions_set_quatNormalizeFast_1(self, arg0);
};
    Object.defineProperty(WorldOptions.prototype, 'quatNormalizeFast', { get: WorldOptions.prototype.get_quatNormalizeFast, set: WorldOptions.prototype.set_quatNormalizeFast });
  WorldOptions.prototype['__destroy__'] = WorldOptions.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_WorldOptions___destroy___0(self);
};
// Sphere
/** @suppress {undefinedVars, duplicate} @this{Object} */function Sphere(id, radius) {
  if (id && typeof id === 'object') id = id.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  this.ptr = _emscripten_bind_Sphere_Sphere_2(id, radius);
  getCache(Sphere)[this.ptr] = this;
};;
Sphere.prototype = Object.create(Shape.prototype);
Sphere.prototype.constructor = Sphere;
Sphere.prototype.__class__ = Sphere;
Sphere.__cache__ = {};
Module['Sphere'] = Sphere;

Sphere.prototype['get_radius'] = Sphere.prototype.get_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_get_radius_0(self);
};;

Sphere.prototype['set_radius'] = Sphere.prototype.set_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Sphere_set_radius_1(self, value);
};;

Sphere.prototype['updateBoundingSphereRadius'] = Sphere.prototype.updateBoundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Sphere_updateBoundingSphereRadius_0(self);
};;

Sphere.prototype['release'] = Sphere.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Sphere_release_0(self);
};;

Sphere.prototype['volume'] = Sphere.prototype.volume = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_volume_0(self);
};;

Sphere.prototype['get_id'] = Sphere.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_get_id_0(self);
};;

Sphere.prototype['type'] = Sphere.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_type_0(self);
};;

Sphere.prototype['get_boundingSphereRadius'] = Sphere.prototype.get_boundingSphereRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_get_boundingSphereRadius_0(self);
};;

Sphere.prototype['get_collisionResponse'] = Sphere.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Sphere_get_collisionResponse_0(self));
};;

Sphere.prototype['set_collisionResponse'] = Sphere.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Sphere_set_collisionResponse_1(self, val);
};;

Sphere.prototype['get_collisionFilterGroup'] = Sphere.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_get_collisionFilterGroup_0(self);
};;

Sphere.prototype['set_collisionFilterGroup'] = Sphere.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Sphere_set_collisionFilterGroup_1(self, value);
};;

Sphere.prototype['get_collisionFilterMask'] = Sphere.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Sphere_get_collisionFilterMask_0(self);
};;

Sphere.prototype['set_collisionFilterMask'] = Sphere.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Sphere_set_collisionFilterMask_1(self, value);
};;

Sphere.prototype['get_body'] = Sphere.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Sphere_get_body_0(self), Body);
};;

Sphere.prototype['set_body'] = Sphere.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Sphere_set_body_1(self, body);
};;

Sphere.prototype['get_material'] = Sphere.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Sphere_get_material_0(self), Material);
};;

Sphere.prototype['set_material'] = Sphere.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Sphere_set_material_1(self, value);
};;

// Octree
/** @suppress {undefinedVars, duplicate} @this{Object} */function Octree(maxDepth) {
  if (maxDepth && typeof maxDepth === 'object') maxDepth = maxDepth.ptr;
  if (maxDepth === undefined) { this.ptr = _emscripten_bind_Octree_Octree_0(); getCache(Octree)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Octree_Octree_1(maxDepth);
  getCache(Octree)[this.ptr] = this;
};;
Octree.prototype = Object.create(WrapperObject.prototype);
Octree.prototype.constructor = Octree;
Octree.prototype.__class__ = Octree;
Octree.__cache__ = {};
Module['Octree'] = Octree;

  Octree.prototype['__destroy__'] = Octree.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Octree___destroy___0(self);
};
// Vec3
/** @suppress {undefinedVars, duplicate} @this{Object} */function Vec3(x, y, z) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (x === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_0(); getCache(Vec3)[this.ptr] = this;return }
  if (y === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_1(x); getCache(Vec3)[this.ptr] = this;return }
  if (z === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_2(x, y); getCache(Vec3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Vec3_Vec3_3(x, y, z);
  getCache(Vec3)[this.ptr] = this;
};;
Vec3.prototype = Object.create(WrapperObject.prototype);
Vec3.prototype.constructor = Vec3;
Vec3.prototype.__class__ = Vec3;
Vec3.__cache__ = {};
Module['Vec3'] = Vec3;

Vec3.prototype['op_assign'] = Vec3.prototype.op_assign = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_Vec3_op_assign_1(self, v), Vec3);
};;

Vec3.prototype['vsub'] = Vec3.prototype.vsub = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, target) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_vsub_2(self, v, target), Vec3);
};;

Vec3.prototype['cross'] = Vec3.prototype.cross = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, target) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_cross_2(self, v, target), Vec3);
};;

Vec3.prototype['setZero'] = Vec3.prototype.setZero = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Vec3_setZero_0(self);
};;

Vec3.prototype['crossmat'] = Vec3.prototype.crossmat = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Vec3_crossmat_0(self), Mat3);
};;

Vec3.prototype['normalize'] = Vec3.prototype.normalize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_normalize_0(self);
};;

Vec3.prototype['unit'] = Vec3.prototype.unit = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_unit_1(self, target), Vec3);
};;

Vec3.prototype['norm'] = Vec3.prototype.norm = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_norm_0(self);
};;

Vec3.prototype['length'] = Vec3.prototype.length = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_length_0(self);
};;

Vec3.prototype['norm2'] = Vec3.prototype.norm2 = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_norm2_0(self);
};;

Vec3.prototype['lengthSquared'] = Vec3.prototype.lengthSquared = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_lengthSquared_0(self);
};;

Vec3.prototype['distanceTo'] = Vec3.prototype.distanceTo = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return _emscripten_bind_Vec3_distanceTo_1(self, v);
};;

Vec3.prototype['distanceSquared'] = Vec3.prototype.distanceSquared = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return _emscripten_bind_Vec3_distanceSquared_1(self, v);
};;

Vec3.prototype['mult'] = Vec3.prototype.mult = /** @suppress {undefinedVars, duplicate} @this{Object} */function(scalar, target) {
  var self = this.ptr;
  if (scalar && typeof scalar === 'object') scalar = scalar.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_mult_2(self, scalar, target), Vec3);
};;

Vec3.prototype['scale'] = Vec3.prototype.scale = /** @suppress {undefinedVars, duplicate} @this{Object} */function(scalar, target) {
  var self = this.ptr;
  if (scalar && typeof scalar === 'object') scalar = scalar.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_scale_2(self, scalar, target), Vec3);
};;

Vec3.prototype['vmul'] = Vec3.prototype.vmul = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, target) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_vmul_2(self, v, target), Vec3);
};;

Vec3.prototype['addScaledVector'] = Vec3.prototype.addScaledVector = /** @suppress {undefinedVars, duplicate} @this{Object} */function(scalar, v, target) {
  var self = this.ptr;
  if (scalar && typeof scalar === 'object') scalar = scalar.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_addScaledVector_3(self, scalar, v, target), Vec3);
};;

Vec3.prototype['dot'] = Vec3.prototype.dot = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return _emscripten_bind_Vec3_dot_1(self, v);
};;

Vec3.prototype['isZero'] = Vec3.prototype.isZero = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Vec3_isZero_0(self));
};;

Vec3.prototype['negate'] = Vec3.prototype.negate = /** @suppress {undefinedVars, duplicate} @this{Object} */function(target) {
  var self = this.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_negate_1(self, target), Vec3);
};;

Vec3.prototype['tangents'] = Vec3.prototype.tangents = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v1, v2) {
  var self = this.ptr;
  if (v1 && typeof v1 === 'object') v1 = v1.ptr;
  if (v2 && typeof v2 === 'object') v2 = v2.ptr;
  _emscripten_bind_Vec3_tangents_2(self, v1, v2);
};;

Vec3.prototype['copy'] = Vec3.prototype.copy = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_Vec3_copy_1(self, v), Vec3);
};;

Vec3.prototype['lerp'] = Vec3.prototype.lerp = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, t, target) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  if (target && typeof target === 'object') target = target.ptr;
  return wrapPointer(_emscripten_bind_Vec3_lerp_3(self, v, t, target), Vec3);
};;

Vec3.prototype['almostEquals'] = Vec3.prototype.almostEquals = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, precision) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (precision && typeof precision === 'object') precision = precision.ptr;
  return !!(_emscripten_bind_Vec3_almostEquals_2(self, v, precision));
};;

Vec3.prototype['almostZero'] = Vec3.prototype.almostZero = /** @suppress {undefinedVars, duplicate} @this{Object} */function(precision) {
  var self = this.ptr;
  if (precision && typeof precision === 'object') precision = precision.ptr;
  return !!(_emscripten_bind_Vec3_almostZero_1(self, precision));
};;

Vec3.prototype['isAntiparallelTo'] = Vec3.prototype.isAntiparallelTo = /** @suppress {undefinedVars, duplicate} @this{Object} */function(v, precision) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (precision && typeof precision === 'object') precision = precision.ptr;
  return !!(_emscripten_bind_Vec3_isAntiparallelTo_2(self, v, precision));
};;

Vec3.prototype['set'] = Vec3.prototype.set = /** @suppress {undefinedVars, duplicate} @this{Object} */function(x, y, z) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  return wrapPointer(_emscripten_bind_Vec3_set_3(self, x, y, z), Vec3);
};;

  Vec3.prototype['get_x'] = Vec3.prototype.get_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_x_0(self);
};
    Vec3.prototype['set_x'] = Vec3.prototype.set_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_x_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'x', { get: Vec3.prototype.get_x, set: Vec3.prototype.set_x });
  Vec3.prototype['get_y'] = Vec3.prototype.get_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_y_0(self);
};
    Vec3.prototype['set_y'] = Vec3.prototype.set_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_y_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'y', { get: Vec3.prototype.get_y, set: Vec3.prototype.set_y });
  Vec3.prototype['get_z'] = Vec3.prototype.get_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_z_0(self);
};
    Vec3.prototype['set_z'] = Vec3.prototype.set_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_z_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'z', { get: Vec3.prototype.get_z, set: Vec3.prototype.set_z });
  Vec3.prototype['__destroy__'] = Vec3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Vec3___destroy___0(self);
};
// RigidVehicle
/** @suppress {undefinedVars, duplicate} @this{Object} */function RigidVehicle(world, chassisBody, coordinateSystem) {
  if (world && typeof world === 'object') world = world.ptr;
  if (chassisBody && typeof chassisBody === 'object') chassisBody = chassisBody.ptr;
  if (coordinateSystem && typeof coordinateSystem === 'object') coordinateSystem = coordinateSystem.ptr;
  if (coordinateSystem === undefined) { this.ptr = _emscripten_bind_RigidVehicle_RigidVehicle_2(world, chassisBody); getCache(RigidVehicle)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_RigidVehicle_RigidVehicle_3(world, chassisBody, coordinateSystem);
  getCache(RigidVehicle)[this.ptr] = this;
};;
RigidVehicle.prototype = Object.create(WrapperObject.prototype);
RigidVehicle.prototype.constructor = RigidVehicle;
RigidVehicle.prototype.__class__ = RigidVehicle;
RigidVehicle.__cache__ = {};
Module['RigidVehicle'] = RigidVehicle;

RigidVehicle.prototype['setSteeringValue'] = RigidVehicle.prototype.setSteeringValue = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RigidVehicle_setSteeringValue_2(self, value, wheelIndex);
};;

RigidVehicle.prototype['setMotorSpeed'] = RigidVehicle.prototype.setMotorSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RigidVehicle_setMotorSpeed_2(self, value, wheelIndex);
};;

RigidVehicle.prototype['disableMotor'] = RigidVehicle.prototype.disableMotor = /** @suppress {undefinedVars, duplicate} @this{Object} */function(wheelIndex) {
  var self = this.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RigidVehicle_disableMotor_1(self, wheelIndex);
};;

RigidVehicle.prototype['setWheelForce'] = RigidVehicle.prototype.setWheelForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RigidVehicle_setWheelForce_2(self, value, wheelIndex);
};;

RigidVehicle.prototype['applyWheelForce'] = RigidVehicle.prototype.applyWheelForce = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value, wheelIndex) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_RigidVehicle_applyWheelForce_2(self, value, wheelIndex);
};;

RigidVehicle.prototype['addWheel'] = RigidVehicle.prototype.addWheel = /** @suppress {undefinedVars, duplicate} @this{Object} */function(wheelBody, position, axis) {
  var self = this.ptr;
  if (wheelBody && typeof wheelBody === 'object') wheelBody = wheelBody.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  if (position === undefined) { return _emscripten_bind_RigidVehicle_addWheel_1(self, wheelBody) }
  if (axis === undefined) { return _emscripten_bind_RigidVehicle_addWheel_2(self, wheelBody, position) }
  return _emscripten_bind_RigidVehicle_addWheel_3(self, wheelBody, position, axis);
};;

RigidVehicle.prototype['getWheelBodyCount'] = RigidVehicle.prototype.getWheelBodyCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_RigidVehicle_getWheelBodyCount_0(self);
};;

RigidVehicle.prototype['getWheelBody'] = RigidVehicle.prototype.getWheelBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_RigidVehicle_getWheelBody_1(self, index), Body);
};;

RigidVehicle.prototype['addToWorld'] = RigidVehicle.prototype.addToWorld = /** @suppress {undefinedVars, duplicate} @this{Object} */function(world) {
  var self = this.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  _emscripten_bind_RigidVehicle_addToWorld_1(self, world);
};;

RigidVehicle.prototype['get_chassisBody'] = RigidVehicle.prototype.get_chassisBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RigidVehicle_get_chassisBody_0(self), Body);
};;

// SplitSolver
/** @suppress {undefinedVars, duplicate} @this{Object} */function SplitSolver(subsolver) {
  if (subsolver && typeof subsolver === 'object') subsolver = subsolver.ptr;
  this.ptr = _emscripten_bind_SplitSolver_SplitSolver_1(subsolver);
  getCache(SplitSolver)[this.ptr] = this;
};;
SplitSolver.prototype = Object.create(Solver.prototype);
SplitSolver.prototype.constructor = SplitSolver;
SplitSolver.prototype.__class__ = SplitSolver;
SplitSolver.__cache__ = {};
Module['SplitSolver'] = SplitSolver;

SplitSolver.prototype['get_iterations'] = SplitSolver.prototype.get_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SplitSolver_get_iterations_0(self);
};;

SplitSolver.prototype['set_iterations'] = SplitSolver.prototype.set_iterations = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SplitSolver_set_iterations_1(self, value);
};;

SplitSolver.prototype['get_tolerance'] = SplitSolver.prototype.get_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_SplitSolver_get_tolerance_0(self);
};;

SplitSolver.prototype['set_tolerance'] = SplitSolver.prototype.set_tolerance = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_SplitSolver_set_tolerance_1(self, value);
};;

// Heightfield
/** @suppress {undefinedVars, duplicate} @this{Object} */function Heightfield(id, world, dataPtr, width, height, maxValue, minValue, elementSize, needUpdateMax, needUpdateMin) {
  ensureCache.prepare();
  if (id && typeof id === 'object') id = id.ptr;
  if (world && typeof world === 'object') world = world.ptr;
  if (typeof dataPtr == 'object') { dataPtr = ensureFloat32(dataPtr); }
  if (width && typeof width === 'object') width = width.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  if (maxValue && typeof maxValue === 'object') maxValue = maxValue.ptr;
  if (minValue && typeof minValue === 'object') minValue = minValue.ptr;
  if (elementSize && typeof elementSize === 'object') elementSize = elementSize.ptr;
  if (needUpdateMax && typeof needUpdateMax === 'object') needUpdateMax = needUpdateMax.ptr;
  if (needUpdateMin && typeof needUpdateMin === 'object') needUpdateMin = needUpdateMin.ptr;
  if (maxValue === undefined) { this.ptr = _emscripten_bind_Heightfield_Heightfield_5(id, world, dataPtr, width, height); getCache(Heightfield)[this.ptr] = this;return }
  if (minValue === undefined) { this.ptr = _emscripten_bind_Heightfield_Heightfield_6(id, world, dataPtr, width, height, maxValue); getCache(Heightfield)[this.ptr] = this;return }
  if (elementSize === undefined) { this.ptr = _emscripten_bind_Heightfield_Heightfield_7(id, world, dataPtr, width, height, maxValue, minValue); getCache(Heightfield)[this.ptr] = this;return }
  if (needUpdateMax === undefined) { this.ptr = _emscripten_bind_Heightfield_Heightfield_8(id, world, dataPtr, width, height, maxValue, minValue, elementSize); getCache(Heightfield)[this.ptr] = this;return }
  if (needUpdateMin === undefined) { this.ptr = _emscripten_bind_Heightfield_Heightfield_9(id, world, dataPtr, width, height, maxValue, minValue, elementSize, needUpdateMax); getCache(Heightfield)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Heightfield_Heightfield_10(id, world, dataPtr, width, height, maxValue, minValue, elementSize, needUpdateMax, needUpdateMin);
  getCache(Heightfield)[this.ptr] = this;
};;
Heightfield.prototype = Object.create(Shape.prototype);
Heightfield.prototype.constructor = Heightfield;
Heightfield.prototype.__class__ = Heightfield;
Heightfield.__cache__ = {};
Module['Heightfield'] = Heightfield;

Heightfield.prototype['getConvexTrianglePillar'] = Heightfield.prototype.getConvexTrianglePillar = /** @suppress {undefinedVars, duplicate} @this{Object} */function(xi, yi, getUpperTriangle) {
  var self = this.ptr;
  if (xi && typeof xi === 'object') xi = xi.ptr;
  if (yi && typeof yi === 'object') yi = yi.ptr;
  if (getUpperTriangle && typeof getUpperTriangle === 'object') getUpperTriangle = getUpperTriangle.ptr;
  return !!(_emscripten_bind_Heightfield_getConvexTrianglePillar_3(self, xi, yi, getUpperTriangle));
};;

Heightfield.prototype['get_pillarConvex'] = Heightfield.prototype.get_pillarConvex = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Heightfield_get_pillarConvex_0(self), ConvexPolyhedron);
};;

Heightfield.prototype['get_pillarOffset'] = Heightfield.prototype.get_pillarOffset = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Heightfield_get_pillarOffset_0(self), Vec3);
};;

Heightfield.prototype['get_elementSize'] = Heightfield.prototype.get_elementSize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_get_elementSize_0(self);
};;

Heightfield.prototype['getFirstArraySize'] = Heightfield.prototype.getFirstArraySize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_getFirstArraySize_0(self);
};;

Heightfield.prototype['getSecondArraySize'] = Heightfield.prototype.getSecondArraySize = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return _emscripten_bind_Heightfield_getSecondArraySize_1(self, index);
};;

Heightfield.prototype['release'] = Heightfield.prototype.release = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Heightfield_release_0(self);
};;

Heightfield.prototype['get_id'] = Heightfield.prototype.get_id = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_get_id_0(self);
};;

Heightfield.prototype['type'] = Heightfield.prototype.type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_type_0(self);
};;

Heightfield.prototype['get_collisionResponse'] = Heightfield.prototype.get_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Heightfield_get_collisionResponse_0(self));
};;

Heightfield.prototype['set_collisionResponse'] = Heightfield.prototype.set_collisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_Heightfield_set_collisionResponse_1(self, val);
};;

Heightfield.prototype['get_collisionFilterGroup'] = Heightfield.prototype.get_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_get_collisionFilterGroup_0(self);
};;

Heightfield.prototype['set_collisionFilterGroup'] = Heightfield.prototype.set_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Heightfield_set_collisionFilterGroup_1(self, value);
};;

Heightfield.prototype['get_collisionFilterMask'] = Heightfield.prototype.get_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Heightfield_get_collisionFilterMask_0(self);
};;

Heightfield.prototype['set_collisionFilterMask'] = Heightfield.prototype.set_collisionFilterMask = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Heightfield_set_collisionFilterMask_1(self, value);
};;

Heightfield.prototype['get_body'] = Heightfield.prototype.get_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Heightfield_get_body_0(self), Body);
};;

Heightfield.prototype['set_body'] = Heightfield.prototype.set_body = /** @suppress {undefinedVars, duplicate} @this{Object} */function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_Heightfield_set_body_1(self, body);
};;

Heightfield.prototype['get_material'] = Heightfield.prototype.get_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Heightfield_get_material_0(self), Material);
};;

Heightfield.prototype['set_material'] = Heightfield.prototype.set_material = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Heightfield_set_material_1(self, value);
};;

// Event
/** @suppress {undefinedVars, duplicate} @this{Object} */function Event() {
  this.ptr = _emscripten_bind_Event_Event_0();
  getCache(Event)[this.ptr] = this;
};;
Event.prototype = Object.create(WrapperObject.prototype);
Event.prototype.constructor = Event;
Event.prototype.__class__ = Event;
Event.__cache__ = {};
Module['Event'] = Event;

Event.prototype['contactCount'] = Event.prototype.contactCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Event_contactCount_0(self);
};;

Event.prototype['getContact'] = Event.prototype.getContact = /** @suppress {undefinedVars, duplicate} @this{Object} */function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_Event_getContact_1(self, index), ContactEquation);
};;

  Event.prototype['get_type'] = Event.prototype.get_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Event_get_type_0(self);
};
    Object.defineProperty(Event.prototype, 'type', { get: Event.prototype.get_type });
  Event.prototype['get_event'] = Event.prototype.get_event = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_Event_get_event_0(self));
};
    Object.defineProperty(Event.prototype, 'event', { get: Event.prototype.get_event });
  Event.prototype['get_targetID'] = Event.prototype.get_targetID = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Event_get_targetID_0(self);
};
    Object.defineProperty(Event.prototype, 'targetID', { get: Event.prototype.get_targetID });
  Event.prototype['get_selfShape'] = Event.prototype.get_selfShape = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Event_get_selfShape_0(self), Shape);
};
    Object.defineProperty(Event.prototype, 'selfShape', { get: Event.prototype.get_selfShape });
  Event.prototype['get_otherShape'] = Event.prototype.get_otherShape = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Event_get_otherShape_0(self), Shape);
};
    Object.defineProperty(Event.prototype, 'otherShape', { get: Event.prototype.get_otherShape });
  Event.prototype['get_selfBody'] = Event.prototype.get_selfBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Event_get_selfBody_0(self), Body);
};
    Object.defineProperty(Event.prototype, 'selfBody', { get: Event.prototype.get_selfBody });
  Event.prototype['get_otherBody'] = Event.prototype.get_otherBody = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Event_get_otherBody_0(self), Body);
};
    Object.defineProperty(Event.prototype, 'otherBody', { get: Event.prototype.get_otherBody });
  Event.prototype['__destroy__'] = Event.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Event___destroy___0(self);
};
// Ray
/** @suppress {undefinedVars, duplicate} @this{Object} */function Ray(from, to) {
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  this.ptr = _emscripten_bind_Ray_Ray_2(from, to);
  getCache(Ray)[this.ptr] = this;
};;
Ray.prototype = Object.create(WrapperObject.prototype);
Ray.prototype.constructor = Ray;
Ray.prototype.__class__ = Ray;
Ray.__cache__ = {};
Module['Ray'] = Ray;

Ray.prototype['from'] = Ray.prototype.from = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Ray_from_0(self), Vec3);
};;

Ray.prototype['setFrom'] = Ray.prototype.setFrom = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Ray_setFrom_1(self, value);
};;

Ray.prototype['to'] = Ray.prototype.to = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Ray_to_0(self), Vec3);
};;

Ray.prototype['setTo'] = Ray.prototype.setTo = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Ray_setTo_1(self, value);
};;

Ray.prototype['direction'] = Ray.prototype.direction = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Ray_direction_0(self), Vec3);
};;

Ray.prototype['updateDirection'] = Ray.prototype.updateDirection = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Ray_updateDirection_0(self);
};;

Ray.prototype['skipBackfaces'] = Ray.prototype.skipBackfaces = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Ray_skipBackfaces_0(self));
};;

Ray.prototype['setSkipBackfaces'] = Ray.prototype.setSkipBackfaces = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Ray_setSkipBackfaces_1(self, value);
};;

Ray.prototype['get_checkCollisionResponse'] = Ray.prototype.get_checkCollisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Ray_get_checkCollisionResponse_0(self));
};;

Ray.prototype['set_checkCollisionResponse'] = Ray.prototype.set_checkCollisionResponse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_Ray_set_checkCollisionResponse_1(self, value);
};;

Ray.prototype['result'] = Ray.prototype.result = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Ray_result_0(self), RaycastResult);
};;

  Ray.prototype['__destroy__'] = Ray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Ray___destroy___0(self);
};
(function() {
  function setupEnums() {
    

    // BodyState

    Module['AWAKE'] = _emscripten_enum_BodyState_AWAKE();

    Module['SLEEPY'] = _emscripten_enum_BodyState_SLEEPY();

    Module['SLEEPING'] = _emscripten_enum_BodyState_SLEEPING();

    

    // BodyType

    Module['DYNAMIC'] = _emscripten_enum_BodyType_DYNAMIC();

    Module['STATIC'] = _emscripten_enum_BodyType_STATIC();

    Module['KINEMATIC'] = _emscripten_enum_BodyType_KINEMATIC();

    

    // ShapeType

    Module['NONE'] = _emscripten_enum_ShapeType_NONE();

    Module['SPHERE'] = _emscripten_enum_ShapeType_SPHERE();

    Module['PLANE'] = _emscripten_enum_ShapeType_PLANE();

    Module['BOX'] = _emscripten_enum_ShapeType_BOX();

    Module['COMPOUND'] = _emscripten_enum_ShapeType_COMPOUND();

    Module['CONVEXPOLYHEDRON'] = _emscripten_enum_ShapeType_CONVEXPOLYHEDRON();

    Module['HEIGHTFIELD'] = _emscripten_enum_ShapeType_HEIGHTFIELD();

    Module['PARTICLE'] = _emscripten_enum_ShapeType_PARTICLE();

    Module['CYLINDER'] = _emscripten_enum_ShapeType_CYLINDER();

    Module['TRIMESH'] = _emscripten_enum_ShapeType_TRIMESH();

    

    // EventType

    Module['WAKEUP'] = _emscripten_enum_EventType_WAKEUP();

    Module['SLEEPY'] = _emscripten_enum_EventType_SLEEPY();

    Module['SLEEP'] = _emscripten_enum_EventType_SLEEP();

    Module['ADDBODY'] = _emscripten_enum_EventType_ADDBODY();

    Module['REMOVEBODY'] = _emscripten_enum_EventType_REMOVEBODY();

    Module['COLLIDE'] = _emscripten_enum_EventType_COLLIDE();

    Module['TRIGGERED'] = _emscripten_enum_EventType_TRIGGERED();

    Module['PRESTEP'] = _emscripten_enum_EventType_PRESTEP();

    Module['POSTSTEP'] = _emscripten_enum_EventType_POSTSTEP();

    

    // EulerOrder

    Module['XYZ'] = _emscripten_enum_EulerOrder_XYZ();

    Module['YZX'] = _emscripten_enum_EulerOrder_YZX();

    Module['ZXY'] = _emscripten_enum_EulerOrder_ZXY();

    Module['ZYX'] = _emscripten_enum_EulerOrder_ZYX();

    Module['YXZ'] = _emscripten_enum_EulerOrder_YXZ();

    Module['XZY'] = _emscripten_enum_EulerOrder_XZY();

    

    // RayIntersectionMode

    Module['CLOSEST'] = _emscripten_enum_RayIntersectionMode_CLOSEST();

    Module['ANY'] = _emscripten_enum_RayIntersectionMode_ANY();

    Module['ALL'] = _emscripten_enum_RayIntersectionMode_ALL();

  }
  if (runtimeInitialized) setupEnums();
  else addOnPreMain(setupEnums);
})();
