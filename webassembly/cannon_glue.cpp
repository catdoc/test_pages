
#include <emscripten.h>

class JSRayCallback : public RayCallback {
public:
  void reportRaycastResult(RaycastResult* result)  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSRayCallback'])[$0];
      if (!self.hasOwnProperty('reportRaycastResult')) throw 'a JSImplementation must implement all functions, you forgot JSRayCallback::reportRaycastResult.';
      self['reportRaycastResult']($1);
    }, (int)this, (int)result);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSRayCallback'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot JSRayCallback::__destroy__.';
      self['__destroy__']();
    }, (int)this);
  }
};

class JSEventCallback : public EventCallback {
public:
  void notify(Event& e)  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSEventCallback'])[$0];
      if (!self.hasOwnProperty('notify')) throw 'a JSImplementation must implement all functions, you forgot JSEventCallback::notify.';
      self['notify']($1);
    }, (int)this, (int)&e);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['JSEventCallback'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot JSEventCallback::__destroy__.';
      self['__destroy__']();
    }, (int)this);
  }
};

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// Ref

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ref_release_0(Ref* self) {
  self->release();
}

// Constraint

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Constraint_enable_0(Constraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Constraint_disable_0(Constraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Constraint_getEquationCount_0(Constraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_Constraint_getEquation_1(Constraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Constraint_release_0(Constraint* self) {
  self->release();
}

// Shape

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_updateBoundingSphereRadius_0(Shape* self) {
  self->updateBoundingSphereRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_volume_0(Shape* self) {
  return self->volume();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_id_0(Shape* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_type_0(Shape* self) {
  return self->type();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_boundingSphereRadius_0(Shape* self) {
  return self->get_boundingSphereRadius();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_collisionResponse_0(Shape* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_set_collisionResponse_1(Shape* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_collisionFilterGroup_0(Shape* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_set_collisionFilterGroup_1(Shape* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_collisionFilterMask_0(Shape* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_set_collisionFilterMask_1(Shape* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_body_0(Shape* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_set_body_1(Shape* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_get_material_0(Shape* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_set_material_1(Shape* self, Material* value) {
  self->set_material(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Shape_release_0(Shape* self) {
  self->release();
}

// Broadphase

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Broadphase_get_useBoundingBoxes_0(Broadphase* self) {
  return self->get_useBoundingBoxes();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Broadphase_set_useBoundingBoxes_1(Broadphase* self, bool value) {
  self->set_useBoundingBoxes(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Broadphase_release_0(Broadphase* self) {
  self->release();
}

// EventCallback

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventCallback_setTarget_1(EventCallback* self, void* target) {
  self->setTarget(target);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_EventCallback_target_0(EventCallback* self) {
  return self->target();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventCallback___destroy___0(EventCallback* self) {
  delete self;
}

// RayCallback

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayCallback___destroy___0(RayCallback* self) {
  delete self;
}

// ISystem

// ConvexPolyhedron

ConvexPolyhedron* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_ConvexPolyhedron_1(int id) {
  return ConvexPolyhedron::create(id);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_computeEdges_0(ConvexPolyhedron* self) {
  self->computeEdges();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_computeNormals_0(ConvexPolyhedron* self) {
  self->computeNormals();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_updateBoundingSphereRadius_0(ConvexPolyhedron* self) {
  self->updateBoundingSphereRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_volume_0(ConvexPolyhedron* self) {
  return self->volume();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_transformAllPoints_2(ConvexPolyhedron* self, const Vec3* offset, const Quaternion* quat) {
  self->transformAllPoints(*offset, *quat);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_worldVerticesNeedsUpdate_0(ConvexPolyhedron* self) {
  return self->get_worldVerticesNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_worldVerticesNeedsUpdate_1(ConvexPolyhedron* self, bool val) {
  self->set_worldVerticesNeedsUpdate(val);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_worldFaceNormalsNeedsUpdate_0(ConvexPolyhedron* self) {
  return self->get_worldFaceNormalsNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_worldFaceNormalsNeedsUpdate_1(ConvexPolyhedron* self, bool val) {
  self->set_worldFaceNormalsNeedsUpdate(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_vertices_2(ConvexPolyhedron* self, const float* vertices, int verticeCount) {
  self->set_vertices(vertices, verticeCount);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_faces_2(ConvexPolyhedron* self, const int* faces, int faceCount) {
  self->set_faces(faces, faceCount);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_uniqueAxes_2(ConvexPolyhedron* self, const float* vertices, int verticeCount) {
  self->set_uniqueAxes(vertices, verticeCount);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getVerticeCount_0(ConvexPolyhedron* self) {
  return self->getVerticeCount();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getVertice_1(ConvexPolyhedron* self, int index) {
  return &self->getVertice(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getFaceCount_0(ConvexPolyhedron* self) {
  return self->getFaceCount();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getFacePointCount_1(ConvexPolyhedron* self, int faceIndex) {
  return self->getFacePointCount(faceIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getFacePoint_2(ConvexPolyhedron* self, int faceIndex, int pointIndex) {
  return self->getFacePoint(faceIndex, pointIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getUniqueAxesCount_0(ConvexPolyhedron* self) {
  return self->getUniqueAxesCount();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_getUniqueAxes_1(ConvexPolyhedron* self, int index) {
  return &self->getUniqueAxes(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_release_0(ConvexPolyhedron* self) {
  self->release();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_id_0(ConvexPolyhedron* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_type_0(ConvexPolyhedron* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_collisionResponse_0(ConvexPolyhedron* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_collisionResponse_1(ConvexPolyhedron* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_collisionFilterGroup_0(ConvexPolyhedron* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_collisionFilterGroup_1(ConvexPolyhedron* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_collisionFilterMask_0(ConvexPolyhedron* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_collisionFilterMask_1(ConvexPolyhedron* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_body_0(ConvexPolyhedron* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_body_1(ConvexPolyhedron* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_get_material_0(ConvexPolyhedron* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexPolyhedron_set_material_1(ConvexPolyhedron* self, Material* value) {
  self->set_material(value);
}

// Equation

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Equation_get_bi_0(Equation* self) {
  return self->get_bi();
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Equation_get_bj_0(Equation* self) {
  return self->get_bj();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Equation_release_0(Equation* self) {
  self->release();
}

// Solver

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Solver_get_iterations_0(Solver* self) {
  return self->get_iterations();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Solver_set_iterations_1(Solver* self, int value) {
  self->set_iterations(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Solver_get_tolerance_0(Solver* self) {
  return self->get_tolerance();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Solver_set_tolerance_1(Solver* self, float value) {
  self->set_tolerance(value);
}

// PointToPointConstraint

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_3(int id, Body* bodyA, Body* bodyB) {
  return PointToPointConstraint::create(id, bodyA, bodyB);
}

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_4(int id, Body* bodyA, Body* bodyB, Vec3* pivotA) {
  return PointToPointConstraint::create(id, bodyA, bodyB, *pivotA);
}

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_5(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB) {
  return PointToPointConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB);
}

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_6(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, float maxForce) {
  return PointToPointConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, maxForce);
}

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_7(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, float maxForce, bool collideConnected) {
  return PointToPointConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, maxForce, collideConnected);
}

PointToPointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_PointToPointConstraint_8(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, float maxForce, bool collideConnected, bool wakeUpBodies) {
  return PointToPointConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, maxForce, collideConnected, wakeUpBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_enable_0(PointToPointConstraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_disable_0(PointToPointConstraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_getEquationCount_0(PointToPointConstraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_getEquation_1(PointToPointConstraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_PointToPointConstraint_release_0(PointToPointConstraint* self) {
  self->release();
}

// NaiveBroadphase

NaiveBroadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_NaiveBroadphase_NaiveBroadphase_0() {
  return NaiveBroadphase::create();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_NaiveBroadphase_get_useBoundingBoxes_0(NaiveBroadphase* self) {
  return self->get_useBoundingBoxes();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NaiveBroadphase_set_useBoundingBoxes_1(NaiveBroadphase* self, bool value) {
  self->set_useBoundingBoxes(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_NaiveBroadphase_release_0(NaiveBroadphase* self) {
  self->release();
}

// LockConstraint

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_3(int id, Body* bodyA, Body* bodyB) {
  return LockConstraint::create(id, bodyA, bodyB);
}

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_4(int id, Body* bodyA, Body* bodyB, float maxForce) {
  return LockConstraint::create(id, bodyA, bodyB, maxForce);
}

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_5(int id, Body* bodyA, Body* bodyB, float maxForce, const Vec3* axisA) {
  return LockConstraint::create(id, bodyA, bodyB, maxForce, *axisA);
}

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_6(int id, Body* bodyA, Body* bodyB, float maxForce, const Vec3* axisA, const Vec3* axisB) {
  return LockConstraint::create(id, bodyA, bodyB, maxForce, *axisA, *axisB);
}

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_7(int id, Body* bodyA, Body* bodyB, float maxForce, const Vec3* axisA, const Vec3* axisB, bool collideConnected) {
  return LockConstraint::create(id, bodyA, bodyB, maxForce, *axisA, *axisB, collideConnected);
}

LockConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_LockConstraint_8(int id, Body* bodyA, Body* bodyB, float maxForce, const Vec3* axisA, const Vec3* axisB, bool collideConnected, bool wakeUpBodies) {
  return LockConstraint::create(id, bodyA, bodyB, maxForce, *axisA, *axisB, collideConnected, wakeUpBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_enable_0(LockConstraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_disable_0(LockConstraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_getEquationCount_0(LockConstraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_getEquation_1(LockConstraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LockConstraint_release_0(LockConstraint* self) {
  self->release();
}

// DistanceConstraint

DistanceConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_DistanceConstraint_3(int id, Body* bodyA, Body* bodyB) {
  return DistanceConstraint::create(id, bodyA, bodyB);
}

DistanceConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_DistanceConstraint_4(int id, Body* bodyA, Body* bodyB, float distance) {
  return DistanceConstraint::create(id, bodyA, bodyB, distance);
}

DistanceConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_DistanceConstraint_5(int id, Body* bodyA, Body* bodyB, float distance, float maxForce) {
  return DistanceConstraint::create(id, bodyA, bodyB, distance, maxForce);
}

DistanceConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_DistanceConstraint_6(int id, Body* bodyA, Body* bodyB, float distance, float maxForce, bool collideConnected) {
  return DistanceConstraint::create(id, bodyA, bodyB, distance, maxForce, collideConnected);
}

DistanceConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_DistanceConstraint_7(int id, Body* bodyA, Body* bodyB, float distance, float maxForce, bool collideConnected, bool wakeUpBodies) {
  return DistanceConstraint::create(id, bodyA, bodyB, distance, maxForce, collideConnected, wakeUpBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_enable_0(DistanceConstraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_disable_0(DistanceConstraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_getEquationCount_0(DistanceConstraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_getEquation_1(DistanceConstraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DistanceConstraint_release_0(DistanceConstraint* self) {
  self->release();
}

// GSSolver

GSSolver* EMSCRIPTEN_KEEPALIVE emscripten_bind_GSSolver_GSSolver_0() {
  return GSSolver::create();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_GSSolver_get_iterations_0(GSSolver* self) {
  return self->get_iterations();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_GSSolver_set_iterations_1(GSSolver* self, int value) {
  self->set_iterations(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_GSSolver_get_tolerance_0(GSSolver* self) {
  return self->get_tolerance();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_GSSolver_set_tolerance_1(GSSolver* self, float value) {
  self->set_tolerance(value);
}

// Transform

Transform* EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_Transform_0() {
  return new Transform();
}

Transform* EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_Transform_1(const Vec3* position) {
  return new Transform(*position);
}

Transform* EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_Transform_2(const Vec3* position, const Quaternion* quaternion) {
  return new Transform(*position, *quaternion);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_get_position_0(Transform* self) {
  return &self->position;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_set_position_1(Transform* self, Vec3* arg0) {
  self->position = *arg0;
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_get_quaternion_0(Transform* self) {
  return &self->quaternion;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform_set_quaternion_1(Transform* self, Quaternion* arg0) {
  self->quaternion = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Transform___destroy___0(Transform* self) {
  delete self;
}

// ConeTwistConstraint

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_3(int id, Body* bodyA, Body* bodyB) {
  return ConeTwistConstraint::create(id, bodyA, bodyB);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_4(int id, Body* bodyA, Body* bodyB, Vec3* pivotA) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_5(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_6(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_7(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_8(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_9(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce, float angle) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce, angle);
}

ConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_ConeTwistConstraint_11(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce, float angle, bool collideConnected, float twistAngle) {
  return ConeTwistConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce, angle, collideConnected, twistAngle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_enable_0(ConeTwistConstraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_disable_0(ConeTwistConstraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_getEquationCount_0(ConeTwistConstraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_getEquation_1(ConeTwistConstraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConeTwistConstraint_release_0(ConeTwistConstraint* self) {
  self->release();
}

// SpringOptions

Spring::SpringOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions_SpringOptions_0() {
  return new Spring::SpringOptions();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions_setWorldAnchorA_1(Spring::SpringOptions* self, const Vec3* worldAnchorA) {
  self->setWorldAnchorA(*worldAnchorA);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions_setWorldAnchorB_1(Spring::SpringOptions* self, const Vec3* worldAnchorB) {
  self->setWorldAnchorB(*worldAnchorB);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions_setLocalAnchorA_1(Spring::SpringOptions* self, const Vec3* localAnchorA) {
  self->setLocalAnchorA(*localAnchorA);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions_setLocalAnchorB_1(Spring::SpringOptions* self, const Vec3* localAnchorB) {
  self->setLocalAnchorB(*localAnchorB);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SpringOptions___destroy___0(Spring::SpringOptions* self) {
  delete self;
}

// GridBroadphase

GridBroadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_GridBroadphase_GridBroadphase_0() {
  return GridBroadphase::create();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_GridBroadphase_get_useBoundingBoxes_0(GridBroadphase* self) {
  return self->get_useBoundingBoxes();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_GridBroadphase_set_useBoundingBoxes_1(GridBroadphase* self, bool value) {
  self->set_useBoundingBoxes(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_GridBroadphase_release_0(GridBroadphase* self) {
  self->release();
}

// ContactMaterial

ContactMaterial* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_ContactMaterial_3(Material* m1, Material* m2, int id) {
  return ContactMaterial::create(m1, m2, id);
}

ContactMaterial* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_ContactMaterial_4(Material* m1, Material* m2, int id, const ContactMaterial::ContactMaterialOptions* options) {
  return ContactMaterial::create(m1, m2, id, *options);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_m1_0(ContactMaterial* self) {
  return self->m1();
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_m2_0(ContactMaterial* self) {
  return self->m2();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_friction_0(ContactMaterial* self) {
  return self->get_friction();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_restitution_0(ContactMaterial* self) {
  return self->get_restitution();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_contactEquationStiffness_0(ContactMaterial* self) {
  return self->get_contactEquationStiffness();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_contactEquationRelaxation_0(ContactMaterial* self) {
  return self->get_contactEquationRelaxation();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_frictionEquationStiffness_0(ContactMaterial* self) {
  return self->get_frictionEquationStiffness();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_get_frictionEquationRelaxation_0(ContactMaterial* self) {
  return self->get_frictionEquationRelaxation();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_friction_1(ContactMaterial* self, float val) {
  self->set_friction(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_restitution_1(ContactMaterial* self, float val) {
  self->set_restitution(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_contactEquationStiffness_1(ContactMaterial* self, float val) {
  self->set_contactEquationStiffness(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_contactEquationRelaxation_1(ContactMaterial* self, float val) {
  self->set_contactEquationRelaxation(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_frictionEquationStiffness_1(ContactMaterial* self, float val) {
  self->set_frictionEquationStiffness(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_set_frictionEquationRelaxation_1(ContactMaterial* self, float val) {
  self->set_frictionEquationRelaxation(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterial_release_0(ContactMaterial* self) {
  self->release();
}

// ShapeOptions

Shape::ShapeOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ShapeOptions_ShapeOptions_0() {
  return new Shape::ShapeOptions();
}

Shape::ShapeOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ShapeOptions_ShapeOptions_6(int id, ShapeType type, bool collisionResponse, int collisionFilterGroup, int collisionFilterMask, Material* material) {
  return new Shape::ShapeOptions(id, type, collisionResponse, collisionFilterGroup, collisionFilterMask, material);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ShapeOptions___destroy___0(Shape::ShapeOptions* self) {
  delete self;
}

// Body

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_Body_1(const Body::BodyOptions* options) {
  return Body::create(*options);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_wakeUp_0(Body* self) {
  self->wakeUp();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_sleep_0(Body* self) {
  self->sleep();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_addShape_1(Body* self, Shape* shape) {
  self->addShape(shape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_addShape_2(Body* self, Shape* shape, const Vec3* offset) {
  self->addShape(shape, *offset);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_addShape_3(Body* self, Shape* shape, const Vec3* offset, const Quaternion* orientation) {
  self->addShape(shape, *offset, *orientation);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_removeShape_1(Body* self, Shape* shape) {
  self->removeShape(shape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_updateBoundingRadius_0(Body* self) {
  self->updateBoundingRadius();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_computeAABB_0(Body* self) {
  self->computeAABB();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_updateInertiaWorld_1(Body* self, bool force) {
  self->updateInertiaWorld(force);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_applyForce_2(Body* self, const Vec3* force, const Vec3* relativePoint) {
  self->applyForce(*force, *relativePoint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_applyLocalForce_2(Body* self, const Vec3* localForce, const Vec3* localPoint) {
  self->applyLocalForce(*localForce, *localPoint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_applyImpulse_2(Body* self, const Vec3* impulse, const Vec3* relativePoint) {
  self->applyImpulse(*impulse, *relativePoint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_applyLocalImpulse_2(Body* self, const Vec3* localImpulse, const Vec3* localPoint) {
  self->applyLocalImpulse(*localImpulse, *localPoint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_updateMassProperties_0(Body* self) {
  self->updateMassProperties();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_getVelocityAtWorldPoint_2(Body* self, const Vec3* worldPoint, Vec3* result) {
  return &self->getVelocityAtWorldPoint(*worldPoint, *result);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_vectorToWorldFrame_2(Body* self, const Vec3* localVector, Vec3* result) {
  return &self->vectorToWorldFrame(*localVector, *result);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_isSleeping_0(Body* self) {
  return self->isSleeping();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_isSleepy_0(Body* self) {
  return self->isSleepy();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_isAwake_0(Body* self) {
  return self->isAwake();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_id_0(Body* self) {
  return self->get_id();
}

const World* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_world_0(Body* self) {
  return self->world();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_setWorld_1(Body* self, World* world) {
  self->setWorld(world);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_updateHasTrigger_0(Body* self) {
  self->updateHasTrigger();
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_material_0(Body* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_material_1(Body* self, Material* value) {
  self->set_material(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_mass_0(Body* self) {
  return self->get_mass();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_mass_1(Body* self, float value) {
  self->set_mass(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_type_0(Body* self) {
  return self->get_type();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_type_1(Body* self, int value) {
  self->set_type(value);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_allowSleep_0(Body* self) {
  return self->get_allowSleep();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_allowSleep_1(Body* self, bool value) {
  self->set_allowSleep(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_shapesLength_0(Body* self) {
  return self->shapesLength();
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_getShape_1(Body* self, int index) {
  return self->getShape(index);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_getShapeOffset_1(Body* self, int index) {
  return self->getShapeOffset(index);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_getShapeOrientation_1(Body* self, int index) {
  return self->getShapeOrientation(index);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_position_0(Body* self) {
  return &self->get_position();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_position_1(Body* self, Vec3* value) {
  self->set_position(*value);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_quaternion_0(Body* self) {
  return &self->get_quaternion();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_quaternion_1(Body* self, Quaternion* value) {
  self->set_quaternion(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_velocity_0(Body* self) {
  return &self->get_velocity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_velocity_1(Body* self, Vec3* value) {
  self->set_velocity(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_torque_0(Body* self) {
  return &self->get_torque();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_torque_1(Body* self, Vec3* value) {
  self->set_torque(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_force_0(Body* self) {
  return &self->get_force();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_force_1(Body* self, Vec3* value) {
  self->set_force(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_angularVelocity_0(Body* self) {
  return &self->get_angularVelocity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_angularVelocity_1(Body* self, Vec3* value) {
  self->set_angularVelocity(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_angularFactor_0(Body* self) {
  return &self->get_angularFactor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_angularFactor_1(Body* self, Vec3* value) {
  self->set_angularFactor(*value);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_linearFactor_0(Body* self) {
  return &self->get_linearFactor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_linearFactor_1(Body* self, Vec3* value) {
  self->set_linearFactor(*value);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_fixedRotation_0(Body* self) {
  return self->get_fixedRotation();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_fixedRotation_1(Body* self, bool val) {
  self->set_fixedRotation(val);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_useGravity_0(Body* self) {
  return self->get_useGravity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_useGravity_1(Body* self, bool value) {
  self->set_useGravity(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_linearDamping_0(Body* self) {
  return self->get_linearDamping();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_linearDamping_1(Body* self, float value) {
  self->set_linearDamping(value);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_collisionResponse_0(Body* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_collisionResponse_1(Body* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_collisionFilterGroup_0(Body* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_collisionFilterGroup_1(Body* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_collisionFilterMask_0(Body* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_collisionFilterMask_1(Body* self, int value) {
  self->set_collisionFilterMask(value);
}

AABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_aabb_0(Body* self) {
  return &self->get_aabb();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_get_aabbNeedsUpdate_0(Body* self) {
  return self->get_aabbNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_set_aabbNeedsUpdate_1(Body* self, bool v) {
  self->set_aabbNeedsUpdate(v);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Body_release_0(Body* self) {
  self->release();
}

// ContactEquation

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_si_0(ContactEquation* self) {
  return self->get_si();
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_sj_0(ContactEquation* self) {
  return self->get_sj();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_ni_0(ContactEquation* self) {
  return &self->get_ni();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_ri_0(ContactEquation* self) {
  return &self->get_ri();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_rj_0(ContactEquation* self) {
  return &self->get_rj();
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_bi_0(ContactEquation* self) {
  return self->get_bi();
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_get_bj_0(ContactEquation* self) {
  return self->get_bj();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactEquation_release_0(ContactEquation* self) {
  self->release();
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// Material

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_Material_1(const Material::MaterialOptions* options) {
  return Material::create(*options);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_id_0(Material* self) {
  return self->id();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_friction_0(Material* self) {
  return self->get_friction();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_restitution_0(Material* self) {
  return self->get_restitution();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_friction_1(Material* self, float friction) {
  self->set_friction(friction);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_restitution_1(Material* self, float restitution) {
  self->set_restitution(restitution);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_release_0(Material* self) {
  self->release();
}

// WheelInfo

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelInfo_get_radius_0(WheelInfo* self) {
  return self->get_radius();
}

Transform* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelInfo_get_worldTransform_0(WheelInfo* self) {
  return &self->get_worldTransform();
}

// Quaternion

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_Quaternion_0() {
  return new Quaternion();
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_Quaternion_4(float x, float y, float z, float w) {
  return new Quaternion(x, y, z, w);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_op_assign_1(Quaternion* self, const Quaternion* q) {
  return &(*self = *q);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_setFromAxisAngle_2(Quaternion* self, const Vec3* axis, float angle) {
  return &self->setFromAxisAngle(*axis, angle);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_setFromVectors_2(Quaternion* self, const Vec3* u, const Vec3* v) {
  return &self->setFromVectors(*u, *v);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_mult_2(Quaternion* self, const Quaternion* q, Quaternion* target) {
  return &self->mult(*q, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_add_2(Quaternion* self, const Quaternion* q, Quaternion* target) {
  return &self->add(*q, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_sub_2(Quaternion* self, const Quaternion* q, Quaternion* target) {
  return &self->sub(*q, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_scale_2(Quaternion* self, float s, Quaternion* target) {
  return &self->scale(s, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_inverse_1(Quaternion* self, Quaternion* target) {
  return &self->inverse(*target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_conjugate_1(Quaternion* self, Quaternion* target) {
  return &self->conjugate(*target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_normalize_0(Quaternion* self) {
  return &self->normalize();
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_normalizeFast_0(Quaternion* self) {
  return self->normalizeFast();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_vmult_2(Quaternion* self, const Vec3* v, Vec3* target) {
  return &self->vmult(*v, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_copy_1(Quaternion* self, const Quaternion* q) {
  return &self->copy(*q);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_toEuler_2(Quaternion* self, Vec3* target, EulerOrder order) {
  self->toEuler(*target, order);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_setFromEuler_4(Quaternion* self, float x, float y, float z, EulerOrder order) {
  return &self->setFromEuler(x, y, z, order);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_clone_0(Quaternion* self) {
  static Quaternion temp;
  return (temp = self->clone(), &temp);
}

const Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_slerp_3(Quaternion* self, const Quaternion* toQuat, float t, Quaternion* target) {
  return &self->slerp(*toQuat, t, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_integrate_4(Quaternion* self, const Vec3* angularVelocity, float dt, const Vec3* angularFactor, Quaternion* target) {
  return &self->integrate(*angularVelocity, dt, *angularFactor, *target);
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_set_4(Quaternion* self, float x, float y, float z, float w) {
  return &self->set(x, y, z, w);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_get_x_0(Quaternion* self) {
  return self->x;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_set_x_1(Quaternion* self, float arg0) {
  self->x = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_get_y_0(Quaternion* self) {
  return self->y;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_set_y_1(Quaternion* self, float arg0) {
  self->y = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_get_z_0(Quaternion* self) {
  return self->z;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_set_z_1(Quaternion* self, float arg0) {
  self->z = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_get_w_0(Quaternion* self) {
  return self->w;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion_set_w_1(Quaternion* self, float arg0) {
  self->w = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Quaternion___destroy___0(Quaternion* self) {
  delete self;
}

// Plane

Plane* EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_Plane_1(int id) {
  return Plane::create(id);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_computeWorldNormal_1(Plane* self, const Quaternion* quat) {
  self->computeWorldNormal(*quat);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_worldNormal_0(Plane* self) {
  return &self->get_worldNormal();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_worldNormal_1(Plane* self, Vec3* val) {
  self->set_worldNormal(*val);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_worldNormalNeedsUpdate_0(Plane* self) {
  return self->get_worldNormalNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_worldNormalNeedsUpdate_1(Plane* self, bool val) {
  self->set_worldNormalNeedsUpdate(val);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_boundingSphereRadius_0(Plane* self) {
  return self->get_boundingSphereRadius();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_boundingSphereRadius_1(Plane* self, float val) {
  self->set_boundingSphereRadius(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_release_0(Plane* self) {
  self->release();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_volume_0(Plane* self) {
  return self->volume();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_id_0(Plane* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_type_0(Plane* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_collisionResponse_0(Plane* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_collisionResponse_1(Plane* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_collisionFilterGroup_0(Plane* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_collisionFilterGroup_1(Plane* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_collisionFilterMask_0(Plane* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_collisionFilterMask_1(Plane* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_body_0(Plane* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_body_1(Plane* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_get_material_0(Plane* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Plane_set_material_1(Plane* self, Material* value) {
  self->set_material(value);
}

// MaterialOptions

Material::MaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_MaterialOptions_0() {
  return new Material::MaterialOptions();
}

Material::MaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_MaterialOptions_2(int id, const char* name) {
  return new Material::MaterialOptions(id, name);
}

Material::MaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_MaterialOptions_3(int id, const char* name, float friction) {
  return new Material::MaterialOptions(id, name, friction);
}

Material::MaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_MaterialOptions_4(int id, const char* name, float friction, float restitution) {
  return new Material::MaterialOptions(id, name, friction, restitution);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_get_id_0(Material::MaterialOptions* self) {
  return self->id;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_set_id_1(Material::MaterialOptions* self, int arg0) {
  self->id = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_get_friction_0(Material::MaterialOptions* self) {
  return self->friction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_set_friction_1(Material::MaterialOptions* self, float arg0) {
  self->friction = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_get_restitution_0(Material::MaterialOptions* self) {
  return self->restitution;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_set_restitution_1(Material::MaterialOptions* self, float arg0) {
  self->restitution = arg0;
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_get_name_0(Material::MaterialOptions* self) {
  return self->name;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions_set_name_1(Material::MaterialOptions* self, char* arg0) {
  self->name = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MaterialOptions___destroy___0(Material::MaterialOptions* self) {
  delete self;
}

// WheelOptions

WheelInfo::WheelOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_WheelOptions_0() {
  return new WheelInfo::WheelOptions();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_chassisConnectionPointLocal_0(WheelInfo::WheelOptions* self) {
  return &self->chassisConnectionPointLocal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_chassisConnectionPointLocal_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->chassisConnectionPointLocal = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_chassisConnectionPointWorld_0(WheelInfo::WheelOptions* self) {
  return &self->chassisConnectionPointWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_chassisConnectionPointWorld_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->chassisConnectionPointWorld = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_directionLocal_0(WheelInfo::WheelOptions* self) {
  return &self->directionLocal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_directionLocal_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->directionLocal = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_directionWorld_0(WheelInfo::WheelOptions* self) {
  return &self->directionWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_directionWorld_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->directionWorld = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_axleLocal_0(WheelInfo::WheelOptions* self) {
  return &self->axleLocal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_axleLocal_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->axleLocal = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_axleWorld_0(WheelInfo::WheelOptions* self) {
  return &self->axleWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_axleWorld_1(WheelInfo::WheelOptions* self, Vec3* arg0) {
  self->axleWorld = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionRestLength_0(WheelInfo::WheelOptions* self) {
  return self->suspensionRestLength;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionRestLength_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionRestLength = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionMaxLength_0(WheelInfo::WheelOptions* self) {
  return self->suspensionMaxLength;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionMaxLength_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionMaxLength = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_radius_0(WheelInfo::WheelOptions* self) {
  return self->radius;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_radius_1(WheelInfo::WheelOptions* self, float arg0) {
  self->radius = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionStiffness_0(WheelInfo::WheelOptions* self) {
  return self->suspensionStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionStiffness_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_dampingCompression_0(WheelInfo::WheelOptions* self) {
  return self->dampingCompression;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_dampingCompression_1(WheelInfo::WheelOptions* self, float arg0) {
  self->dampingCompression = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_dampingRelaxation_0(WheelInfo::WheelOptions* self) {
  return self->dampingRelaxation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_dampingRelaxation_1(WheelInfo::WheelOptions* self, float arg0) {
  self->dampingRelaxation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_frictionSlip_0(WheelInfo::WheelOptions* self) {
  return self->frictionSlip;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_frictionSlip_1(WheelInfo::WheelOptions* self, float arg0) {
  self->frictionSlip = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_steering_0(WheelInfo::WheelOptions* self) {
  return self->steering;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_steering_1(WheelInfo::WheelOptions* self, float arg0) {
  self->steering = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_rotation_0(WheelInfo::WheelOptions* self) {
  return self->rotation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_rotation_1(WheelInfo::WheelOptions* self, float arg0) {
  self->rotation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_deltaRotation_0(WheelInfo::WheelOptions* self) {
  return self->deltaRotation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_deltaRotation_1(WheelInfo::WheelOptions* self, float arg0) {
  self->deltaRotation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_rollInfluence_0(WheelInfo::WheelOptions* self) {
  return self->rollInfluence;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_rollInfluence_1(WheelInfo::WheelOptions* self, float arg0) {
  self->rollInfluence = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_maxSuspensionForce_0(WheelInfo::WheelOptions* self) {
  return self->maxSuspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_maxSuspensionForce_1(WheelInfo::WheelOptions* self, float arg0) {
  self->maxSuspensionForce = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_isFrontWheel_0(WheelInfo::WheelOptions* self) {
  return self->isFrontWheel;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_isFrontWheel_1(WheelInfo::WheelOptions* self, bool arg0) {
  self->isFrontWheel = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_clippedInvContactDotSuspension_0(WheelInfo::WheelOptions* self) {
  return self->clippedInvContactDotSuspension;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_clippedInvContactDotSuspension_1(WheelInfo::WheelOptions* self, float arg0) {
  self->clippedInvContactDotSuspension = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionRelativeVelocity_0(WheelInfo::WheelOptions* self) {
  return self->suspensionRelativeVelocity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionRelativeVelocity_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionRelativeVelocity = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionForce_0(WheelInfo::WheelOptions* self) {
  return self->suspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionForce_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionForce = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_skidInfo_0(WheelInfo::WheelOptions* self) {
  return self->skidInfo;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_skidInfo_1(WheelInfo::WheelOptions* self, float arg0) {
  self->skidInfo = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_suspensionLength_0(WheelInfo::WheelOptions* self) {
  return self->suspensionLength;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_suspensionLength_1(WheelInfo::WheelOptions* self, float arg0) {
  self->suspensionLength = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_maxSuspensionTravel_0(WheelInfo::WheelOptions* self) {
  return self->maxSuspensionTravel;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_maxSuspensionTravel_1(WheelInfo::WheelOptions* self, float arg0) {
  self->maxSuspensionTravel = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_useCustomSlidingRotationalSpeed_0(WheelInfo::WheelOptions* self) {
  return self->useCustomSlidingRotationalSpeed;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_useCustomSlidingRotationalSpeed_1(WheelInfo::WheelOptions* self, bool arg0) {
  self->useCustomSlidingRotationalSpeed = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_get_customSlidingRotationalSpeed_0(WheelInfo::WheelOptions* self) {
  return self->customSlidingRotationalSpeed;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions_set_customSlidingRotationalSpeed_1(WheelInfo::WheelOptions* self, float arg0) {
  self->customSlidingRotationalSpeed = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WheelOptions___destroy___0(WheelInfo::WheelOptions* self) {
  delete self;
}

// World

World* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_World_0() {
  return World::create();
}

World* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_World_1(const World::WorldOptions* options) {
  return World::create(*options);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_numObjects_0(World* self) {
  return self->numObjects();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_collisionMatrixTick_0(World* self) {
  self->collisionMatrixTick();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_addBody_1(World* self, Body* body) {
  self->addBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_removeBody_1(World* self, Body* body) {
  self->removeBody(body);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getBody_1(World* self, int index) {
  return self->getBody(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_addConstraint_1(World* self, Constraint* c) {
  self->addConstraint(c);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_removeConstraint_1(World* self, Constraint* c) {
  self->removeConstraint(c);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_addMaterial_1(World* self, Material* m) {
  self->addMaterial(m);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_addContactMaterial_1(World* self, ContactMaterial* cmat) {
  self->addContactMaterial(cmat);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_addSystem_1(World* self, ISystem* sys) {
  return self->addSystem(sys);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_removeSystem_1(World* self, ISystem* sys) {
  return self->removeSystem(sys);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_step_1(World* self, float dt) {
  self->step(dt);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_step_2(World* self, float dt, float timeSinceLastCalled) {
  self->step(dt, timeSinceLastCalled);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_step_3(World* self, float dt, float timeSinceLastCalled, int maxSubSteps) {
  self->step(dt, timeSinceLastCalled, maxSubSteps);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_emitTriggeredEvents_0(World* self) {
  self->emitTriggeredEvents();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_emitCollisionEvents_0(World* self) {
  self->emitCollisionEvents();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_clearForces_0(World* self) {
  self->clearForces();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_raycastClosest_4(World* self, Vec3* from, Vec3* to, Ray::RayOptions* options, RaycastResult* result) {
  return self->raycastClosest(*from, *to, *options, result);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_raycastAll_2(World* self, Vec3* from, Vec3* to) {
  return self->raycastAll(*from, *to);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_raycastAll_3(World* self, Vec3* from, Vec3* to, RayCallback* callback) {
  return self->raycastAll(*from, *to, callback);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_raycastAll_4(World* self, Vec3* from, Vec3* to, RayCallback* callback, Ray::RayOptions* options) {
  return self->raycastAll(*from, *to, callback, options);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_allowSleep_0(World* self) {
  return self->get_allowSleep();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_allowSleep_1(World* self, bool val) {
  self->set_allowSleep(val);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_gravity_0(World* self) {
  return &self->get_gravity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_gravity_1(World* self, Vec3* val) {
  self->set_gravity(*val);
}

Broadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_broadphase_0(World* self) {
  return self->get_broadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_broadphase_1(World* self, Broadphase* val) {
  self->set_broadphase(val);
}

Solver* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_solver_0(World* self) {
  return self->get_solver();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_solver_1(World* self, Solver* val) {
  self->set_solver(val);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_defaultMaterial_0(World* self) {
  return self->get_defaultMaterial();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_defaultMaterial_1(World* self, Material* value) {
  self->set_defaultMaterial(value);
}

ContactMaterial* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_defaultContactMaterial_0(World* self) {
  return self->get_defaultContactMaterial();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_defaultContactMaterial_1(World* self, ContactMaterial* value) {
  self->set_defaultContactMaterial(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_quatNormalizeSkip_0(World* self) {
  return self->get_quatNormalizeSkip();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_quatNormalizeSkip_1(World* self, int value) {
  self->set_quatNormalizeSkip(value);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_quatNormalizeFast_0(World* self) {
  return self->get_quatNormalizeFast();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_set_quatNormalizeFast_1(World* self, bool value) {
  self->set_quatNormalizeFast(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_World_get_time_0(World* self) {
  return self->get_time();
}

EventTarget* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_dispatcher_0(World* self) {
  return &self->dispatcher();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genBodyId_0(World* self) {
  return self->genBodyId();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genShapeId_0(World* self) {
  return self->genShapeId();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genConstraintId_0(World* self) {
  return self->genConstraintId();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genEquationId_0(World* self) {
  return self->genEquationId();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genContactMaterialId_0(World* self) {
  return self->genContactMaterialId();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_genMaterialId_0(World* self) {
  return self->genMaterialId();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_release_0(World* self) {
  self->release();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_retain_0(World* self) {
  self->retain();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_World_removeAllConstraints_0(World* self) {
  self->removeAllConstraints();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getConstraintCount_0(World* self) {
  return self->getConstraintCount();
}

Constraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getConstraint_1(World* self, int index) {
  return self->getConstraint(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getContactMaterialCount_0(World* self) {
  return self->getContactMaterialCount();
}

ContactMaterial* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getContactMaterial_1(World* self, int index) {
  return self->getContactMaterial(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getContactCount_0(World* self) {
  return self->getContactCount();
}

ContactEquation* EMSCRIPTEN_KEEPALIVE emscripten_bind_World_getContact_1(World* self, int index) {
  return self->getContact(index);
}

// BodyOptions

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_1(World* world) {
  return new Body::BodyOptions(world);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_2(World* world, int id) {
  return new Body::BodyOptions(world, id);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_3(World* world, int id, Shape* shape) {
  return new Body::BodyOptions(world, id, shape);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_4(World* world, int id, Shape* shape, float mass) {
  return new Body::BodyOptions(world, id, shape, mass);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_5(World* world, int id, Shape* shape, float mass, Material* material) {
  return new Body::BodyOptions(world, id, shape, mass, material);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_6(World* world, int id, Shape* shape, float mass, Material* material, BodyType type) {
  return new Body::BodyOptions(world, id, shape, mass, material, type);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_7(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_8(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_9(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_10(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_11(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_12(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_13(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_14(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_15(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_16(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos, const Vec3* velocity) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos, *velocity);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_17(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos, const Vec3* velocity, const Vec3* angularVelocity) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos, *velocity, *angularVelocity);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_18(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos, const Vec3* velocity, const Vec3* angularVelocity, const Vec3* linearFactor) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos, *velocity, *angularVelocity, *linearFactor);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_19(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos, const Vec3* velocity, const Vec3* angularVelocity, const Vec3* linearFactor, const Vec3* angularFactor) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos, *velocity, *angularVelocity, *linearFactor, *angularFactor);
}

Body::BodyOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_BodyOptions_20(World* world, int id, Shape* shape, float mass, Material* material, BodyType type, bool fixedRotation, bool allowSleep, int collisionFilterGroup, int collisionFilterMask, float sleepSpeedLimit, float sleepTimeLimit, float linearDamping, float angularDamping, const Vec3* pos, const Vec3* velocity, const Vec3* angularVelocity, const Vec3* linearFactor, const Vec3* angularFactor, const Quaternion* quaternion) {
  return new Body::BodyOptions(world, id, shape, mass, material, type, fixedRotation, allowSleep, collisionFilterGroup, collisionFilterMask, sleepSpeedLimit, sleepTimeLimit, linearDamping, angularDamping, *pos, *velocity, *angularVelocity, *linearFactor, *angularFactor, *quaternion);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_position_0(Body::BodyOptions* self) {
  return &self->position;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_position_1(Body::BodyOptions* self, Vec3* arg0) {
  self->position = *arg0;
}

Quaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_quaternion_0(Body::BodyOptions* self) {
  return &self->quaternion;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_quaternion_1(Body::BodyOptions* self, Quaternion* arg0) {
  self->quaternion = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_velocity_0(Body::BodyOptions* self) {
  return &self->velocity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_velocity_1(Body::BodyOptions* self, Vec3* arg0) {
  self->velocity = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_angularVelocity_0(Body::BodyOptions* self) {
  return &self->angularVelocity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_angularVelocity_1(Body::BodyOptions* self, Vec3* arg0) {
  self->angularVelocity = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_linearFactor_0(Body::BodyOptions* self) {
  return &self->linearFactor;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_linearFactor_1(Body::BodyOptions* self, Vec3* arg0) {
  self->linearFactor = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_angularFactor_0(Body::BodyOptions* self) {
  return &self->angularFactor;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_angularFactor_1(Body::BodyOptions* self, Vec3* arg0) {
  self->angularFactor = *arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_id_0(Body::BodyOptions* self) {
  return self->id;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_id_1(Body::BodyOptions* self, int arg0) {
  self->id = arg0;
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_shape_0(Body::BodyOptions* self) {
  return self->shape;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_shape_1(Body::BodyOptions* self, Shape* arg0) {
  self->shape = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_mass_0(Body::BodyOptions* self) {
  return self->mass;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_mass_1(Body::BodyOptions* self, float arg0) {
  self->mass = arg0;
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_material_0(Body::BodyOptions* self) {
  return self->material;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_material_1(Body::BodyOptions* self, Material* arg0) {
  self->material = arg0;
}

BodyType EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_type_0(Body::BodyOptions* self) {
  return self->type;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_type_1(Body::BodyOptions* self, BodyType arg0) {
  self->type = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_fixedRotation_0(Body::BodyOptions* self) {
  return self->fixedRotation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_fixedRotation_1(Body::BodyOptions* self, bool arg0) {
  self->fixedRotation = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_allowSleep_0(Body::BodyOptions* self) {
  return self->allowSleep;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_allowSleep_1(Body::BodyOptions* self, bool arg0) {
  self->allowSleep = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_collisionFilterGroup_0(Body::BodyOptions* self) {
  return self->collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_collisionFilterGroup_1(Body::BodyOptions* self, int arg0) {
  self->collisionFilterGroup = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_collisionFilterMask_0(Body::BodyOptions* self) {
  return self->collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_collisionFilterMask_1(Body::BodyOptions* self, int arg0) {
  self->collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_sleepSpeedLimit_0(Body::BodyOptions* self) {
  return self->sleepSpeedLimit;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_sleepSpeedLimit_1(Body::BodyOptions* self, float arg0) {
  self->sleepSpeedLimit = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_sleepTimeLimit_0(Body::BodyOptions* self) {
  return self->sleepTimeLimit;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_sleepTimeLimit_1(Body::BodyOptions* self, float arg0) {
  self->sleepTimeLimit = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_linearDamping_0(Body::BodyOptions* self) {
  return self->linearDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_linearDamping_1(Body::BodyOptions* self, float arg0) {
  self->linearDamping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_get_angularDamping_0(Body::BodyOptions* self) {
  return self->angularDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions_set_angularDamping_1(Body::BodyOptions* self, float arg0) {
  self->angularDamping = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_BodyOptions___destroy___0(Body::BodyOptions* self) {
  delete self;
}

// Box

Box* EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_Box_3(int id, World* world, const Vec3* halfExtents) {
  return Box::create(id, world, *halfExtents);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_updateConvexPolyhedronRepresentation_0(Box* self) {
  self->updateConvexPolyhedronRepresentation();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_halfExtents_0(Box* self) {
  return &self->get_halfExtents();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_halfExtents_1(Box* self, Vec3* value) {
  self->set_halfExtents(*value);
}

ConvexPolyhedron* EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_convexPolyhedronRepresentation_0(Box* self) {
  return self->get_convexPolyhedronRepresentation();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_release_0(Box* self) {
  self->release();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_updateBoundingSphereRadius_0(Box* self) {
  self->updateBoundingSphereRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_volume_0(Box* self) {
  return self->volume();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_id_0(Box* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_type_0(Box* self) {
  return self->type();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_boundingSphereRadius_0(Box* self) {
  return self->get_boundingSphereRadius();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_collisionResponse_0(Box* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_collisionResponse_1(Box* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_collisionFilterGroup_0(Box* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_collisionFilterGroup_1(Box* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_collisionFilterMask_0(Box* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_collisionFilterMask_1(Box* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_body_0(Box* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_body_1(Box* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_get_material_0(Box* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Box_set_material_1(Box* self, Material* value) {
  self->set_material(value);
}

// JSRayCallback

JSRayCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_JSRayCallback_JSRayCallback_0() {
  return new JSRayCallback();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSRayCallback_reportRaycastResult_1(JSRayCallback* self, RaycastResult* result) {
  self->reportRaycastResult(result);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSRayCallback___destroy___0(JSRayCallback* self) {
  delete self;
}

// Mat3

Mat3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Mat3_Mat3_0() {
  return new Mat3();
}

Mat3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Mat3_Mat3_9(float m00, float m01, float m02, float m10, float m11, float m12, float m20, float m21, float m22) {
  return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Mat3_identity_0(Mat3* self) {
  self->identity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Mat3_setZero_0(Mat3* self) {
  self->setZero();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Mat3___destroy___0(Mat3* self) {
  delete self;
}

// Particle

Particle* EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_Particle_1(int id) {
  return Particle::create(id);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_release_0(Particle* self) {
  self->release();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_volume_0(Particle* self) {
  return self->volume();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_id_0(Particle* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_type_0(Particle* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_collisionResponse_0(Particle* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_set_collisionResponse_1(Particle* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_collisionFilterGroup_0(Particle* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_set_collisionFilterGroup_1(Particle* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_collisionFilterMask_0(Particle* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_set_collisionFilterMask_1(Particle* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_body_0(Particle* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_set_body_1(Particle* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_get_material_0(Particle* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Particle_set_material_1(Particle* self, Material* value) {
  self->set_material(value);
}

// AABB

AABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB_AABB_0() {
  return new AABB();
}

AABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB_AABB_1(const Vec3* lowerBound) {
  return new AABB(*lowerBound);
}

AABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB_AABB_2(const Vec3* lowerBound, const Vec3* upperBound) {
  return new AABB(*lowerBound, *upperBound);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB_get_lowerBound_0(AABB* self) {
  return &self->get_lowerBound();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB_get_upperBound_0(AABB* self) {
  return &self->get_upperBound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AABB___destroy___0(AABB* self) {
  delete self;
}

// SAPBroadphase

SAPBroadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_SAPBroadphase_SAPBroadphase_1(World* world) {
  return SAPBroadphase::create(world);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_SAPBroadphase_get_useBoundingBoxes_0(SAPBroadphase* self) {
  return self->get_useBoundingBoxes();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SAPBroadphase_set_useBoundingBoxes_1(SAPBroadphase* self, bool value) {
  self->set_useBoundingBoxes(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SAPBroadphase_release_0(SAPBroadphase* self) {
  self->release();
}

// JSEventCallback

JSEventCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_JSEventCallback_JSEventCallback_0() {
  return new JSEventCallback();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSEventCallback_notify_1(JSEventCallback* self, Event* e) {
  self->notify(*e);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_JSEventCallback___destroy___0(JSEventCallback* self) {
  delete self;
}

// EventTarget

EventTarget* EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_EventTarget_0() {
  return EventTarget::create();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_addEventListener_2(EventTarget* self, EventType type, EventCallback* listener) {
  self->addEventListener(type, listener);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_hasEventListener_2(EventTarget* self, EventType type, EventCallback* listener) {
  return self->hasEventListener(type, listener);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_hasAnyEventListener_1(EventTarget* self, EventType type) {
  return self->hasAnyEventListener(type);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_removeEventListener_2(EventTarget* self, EventType type, EventCallback* listener) {
  self->removeEventListener(type, listener);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_release_0(EventTarget* self) {
  self->release();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_EventTarget_retain_0(EventTarget* self) {
  self->retain();
}

// HingeConstraint

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_3(int id, Body* bodyA, Body* bodyB) {
  return HingeConstraint::create(id, bodyA, bodyB);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_4(int id, Body* bodyA, Body* bodyB, Vec3* pivotA) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_5(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_6(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_7(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_8(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_9(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce, bool collideConnected) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce, collideConnected);
}

HingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_HingeConstraint_10(int id, Body* bodyA, Body* bodyB, Vec3* pivotA, Vec3* pivotB, const Vec3* axisA, const Vec3* axisB, float maxForce, bool collideConnected, bool wakeUpBodies) {
  return HingeConstraint::create(id, bodyA, bodyB, *pivotA, *pivotB, *axisA, *axisB, maxForce, collideConnected, wakeUpBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_enableMotor_0(HingeConstraint* self) {
  self->enableMotor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_disableMotor_0(HingeConstraint* self) {
  self->disableMotor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_setMotorSpeed_1(HingeConstraint* self, float speed) {
  self->setMotorSpeed(speed);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_setMotorMaxForce_1(HingeConstraint* self, float maxForce) {
  self->setMotorMaxForce(maxForce);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_enable_0(HingeConstraint* self) {
  self->enable();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_disable_0(HingeConstraint* self) {
  self->disable();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_getEquationCount_0(HingeConstraint* self) {
  return self->getEquationCount();
}

Equation* EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_getEquation_1(HingeConstraint* self, int index) {
  return self->getEquation(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HingeConstraint_release_0(HingeConstraint* self) {
  self->release();
}

// RayOptions

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_0() {
  return new Ray::RayOptions();
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_1(bool skipBackfaces) {
  return new Ray::RayOptions(skipBackfaces);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_2(bool skipBackfaces, RayIntersectionMode mode) {
  return new Ray::RayOptions(skipBackfaces, mode);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_3(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result) {
  return new Ray::RayOptions(skipBackfaces, mode, result);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_4(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result, int collisionFilterMask) {
  return new Ray::RayOptions(skipBackfaces, mode, result, collisionFilterMask);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_5(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result, int collisionFilterMask, int collisionFilterGroup) {
  return new Ray::RayOptions(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_6(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result, int collisionFilterMask, int collisionFilterGroup, const Vec3* from) {
  return new Ray::RayOptions(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, *from);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_7(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result, int collisionFilterMask, int collisionFilterGroup, const Vec3* from, const Vec3* to) {
  return new Ray::RayOptions(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, *from, *to);
}

Ray::RayOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_RayOptions_8(bool skipBackfaces, RayIntersectionMode mode, RaycastResult* result, int collisionFilterMask, int collisionFilterGroup, const Vec3* from, const Vec3* to, RayCallback* callback) {
  return new Ray::RayOptions(skipBackfaces, mode, result, collisionFilterMask, collisionFilterGroup, *from, *to, callback);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_from_0(Ray::RayOptions* self) {
  return &self->from;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_from_1(Ray::RayOptions* self, Vec3* arg0) {
  self->from = *arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_to_0(Ray::RayOptions* self) {
  return &self->to;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_to_1(Ray::RayOptions* self, Vec3* arg0) {
  self->to = *arg0;
}

RaycastResult* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_result_0(Ray::RayOptions* self) {
  return self->result;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_result_1(Ray::RayOptions* self, RaycastResult* arg0) {
  self->result = arg0;
}

RayIntersectionMode EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_mode_0(Ray::RayOptions* self) {
  return self->mode;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_mode_1(Ray::RayOptions* self, RayIntersectionMode arg0) {
  self->mode = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_skipBackfaces_0(Ray::RayOptions* self) {
  return self->skipBackfaces;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_skipBackfaces_1(Ray::RayOptions* self, bool arg0) {
  self->skipBackfaces = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_collisionFilterMask_0(Ray::RayOptions* self) {
  return self->collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_collisionFilterMask_1(Ray::RayOptions* self, int arg0) {
  self->collisionFilterMask = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_get_collisionFilterGroup_0(Ray::RayOptions* self) {
  return self->collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions_set_collisionFilterGroup_1(Ray::RayOptions* self, int arg0) {
  self->collisionFilterGroup = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayOptions___destroy___0(Ray::RayOptions* self) {
  delete self;
}

// Trimesh

Trimesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_Trimesh_5(int id, const float* radius, int tube, const int* radialSegments, int tubularSegments) {
  return Trimesh::create(id, radius, tube, radialSegments, tubularSegments);
}

Trimesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_Trimesh_6(int id, float radius, float tube, int radialSegments, int tubularSegments, float arc) {
  return Trimesh::create(id, radius, tube, radialSegments, tubularSegments, arc);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_setScale_1(Trimesh* self, const Vec3* scale) {
  self->setScale(*scale);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_updateTree_0(Trimesh* self) {
  self->updateTree();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_updateAABB_0(Trimesh* self) {
  self->updateAABB();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_updateEdges_0(Trimesh* self) {
  self->updateEdges();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_updateNormals_0(Trimesh* self) {
  self->updateNormals();
}

AABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_aabb_0(Trimesh* self) {
  return &self->get_aabb();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_aabb_1(Trimesh* self, AABB* val) {
  self->set_aabb(*val);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_scale_0(Trimesh* self) {
  return &self->get_scale();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_scale_1(Trimesh* self, Vec3* val) {
  self->set_scale(*val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_getTriangleVertices_4(Trimesh* self, int i, Vec3* a, Vec3* b, Vec3* c) {
  self->getTriangleVertices(i, *a, *b, *c);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_getVerticeCount_0(Trimesh* self) {
  return self->getVerticeCount();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_getVertice_1(Trimesh* self, int index) {
  return self->getVertice(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_getIndiceCount_0(Trimesh* self) {
  return self->getIndiceCount();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_getIndice_1(Trimesh* self, int index) {
  return self->getIndice(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_release_0(Trimesh* self) {
  self->release();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_id_0(Trimesh* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_type_0(Trimesh* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_collisionResponse_0(Trimesh* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_collisionResponse_1(Trimesh* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_collisionFilterGroup_0(Trimesh* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_collisionFilterGroup_1(Trimesh* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_collisionFilterMask_0(Trimesh* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_collisionFilterMask_1(Trimesh* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_body_0(Trimesh* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_body_1(Trimesh* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_get_material_0(Trimesh* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Trimesh_set_material_1(Trimesh* self, Material* value) {
  self->set_material(value);
}

// SPHSystem

SPHSystem* EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_SPHSystem_0() {
  return SPHSystem::create();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_add_1(SPHSystem* self, Body* particle) {
  self->add(particle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_remove_1(SPHSystem* self, Body* particle) {
  self->remove(particle);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_get_density_0(SPHSystem* self) {
  return self->get_density();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_set_density_1(SPHSystem* self, float value) {
  self->set_density(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_get_smoothingRadius_0(SPHSystem* self) {
  return self->get_smoothingRadius();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_set_smoothingRadius_1(SPHSystem* self, float value) {
  self->set_smoothingRadius(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_get_speedOfSound_0(SPHSystem* self) {
  return self->get_speedOfSound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_set_speedOfSound_1(SPHSystem* self, float value) {
  self->set_speedOfSound(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_get_viscosity_0(SPHSystem* self) {
  return self->get_viscosity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_set_viscosity_1(SPHSystem* self, float value) {
  self->set_viscosity(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_get_eps_0(SPHSystem* self) {
  return self->get_eps();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SPHSystem_set_eps_1(SPHSystem* self, float value) {
  self->set_eps(value);
}

// RaycastVehicle

RaycastVehicle* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_RaycastVehicle_4(Body* chassisBody, int indexRightAxis, int indexLeftAxis, int indexUpAxis) {
  return RaycastVehicle::create(chassisBody, indexRightAxis, indexLeftAxis, indexUpAxis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_addWheel_1(RaycastVehicle* self, const WheelInfo::WheelOptions* options) {
  self->addWheel(*options);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_setSteeringValue_2(RaycastVehicle* self, float value, int wheelIndex) {
  self->setSteeringValue(value, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_applyEngineForce_2(RaycastVehicle* self, float value, int wheelIndex) {
  self->applyEngineForce(value, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_setBrake_2(RaycastVehicle* self, float brake, int wheelIndex) {
  self->setBrake(brake, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_addToWorld_1(RaycastVehicle* self, World* world) {
  self->addToWorld(world);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_removeFromWorld_1(RaycastVehicle* self, World* world) {
  self->removeFromWorld(world);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_updateWheelTransform_1(RaycastVehicle* self, int wheelIndex) {
  self->updateWheelTransform(wheelIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_getWheelCount_0(RaycastVehicle* self) {
  return self->getWheelCount();
}

WheelInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_getWheel_1(RaycastVehicle* self, int index) {
  return self->getWheel(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastVehicle_release_0(RaycastVehicle* self) {
  self->release();
}

// ContactMaterialOptions

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_0() {
  return new ContactMaterial::ContactMaterialOptions();
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_1(float friction) {
  return new ContactMaterial::ContactMaterialOptions(friction);
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_2(float friction, float restitution) {
  return new ContactMaterial::ContactMaterialOptions(friction, restitution);
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_3(float friction, float restitution, float contactEquationStiffness) {
  return new ContactMaterial::ContactMaterialOptions(friction, restitution, contactEquationStiffness);
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_4(float friction, float restitution, float contactEquationStiffness, float contactEquationRelaxation) {
  return new ContactMaterial::ContactMaterialOptions(friction, restitution, contactEquationStiffness, contactEquationRelaxation);
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_5(float friction, float restitution, float contactEquationStiffness, float contactEquationRelaxation, float frictionEquationStiffness) {
  return new ContactMaterial::ContactMaterialOptions(friction, restitution, contactEquationStiffness, contactEquationRelaxation, frictionEquationStiffness);
}

ContactMaterial::ContactMaterialOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_ContactMaterialOptions_6(float friction, float restitution, float contactEquationStiffness, float contactEquationRelaxation, float frictionEquationStiffness, float frictionEquationRelaxation) {
  return new ContactMaterial::ContactMaterialOptions(friction, restitution, contactEquationStiffness, contactEquationRelaxation, frictionEquationStiffness, frictionEquationRelaxation);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_friction_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->friction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_friction_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->friction = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_restitution_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->restitution;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_restitution_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->restitution = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_contactEquationStiffness_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->contactEquationStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_contactEquationStiffness_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->contactEquationStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_contactEquationRelaxation_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->contactEquationRelaxation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_contactEquationRelaxation_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->contactEquationRelaxation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_frictionEquationStiffness_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->frictionEquationStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_frictionEquationStiffness_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->frictionEquationStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_get_frictionEquationRelaxation_0(ContactMaterial::ContactMaterialOptions* self) {
  return self->frictionEquationRelaxation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions_set_frictionEquationRelaxation_1(ContactMaterial::ContactMaterialOptions* self, float arg0) {
  self->frictionEquationRelaxation = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactMaterialOptions___destroy___0(ContactMaterial::ContactMaterialOptions* self) {
  delete self;
}

// Cylinder

Cylinder* EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_Cylinder_5(int id, float radiusTop, float radiusBottom, float height, int numSegments) {
  return Cylinder::create(id, radiusTop, radiusBottom, height, numSegments);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_computeEdges_0(Cylinder* self) {
  self->computeEdges();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_computeNormals_0(Cylinder* self) {
  self->computeNormals();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_updateBoundingSphereRadius_0(Cylinder* self) {
  self->updateBoundingSphereRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_volume_0(Cylinder* self) {
  return self->volume();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_transformAllPoints_2(Cylinder* self, const Vec3* offset, const Quaternion* quat) {
  self->transformAllPoints(*offset, *quat);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_worldVerticesNeedsUpdate_0(Cylinder* self) {
  return self->get_worldVerticesNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_worldVerticesNeedsUpdate_1(Cylinder* self, bool val) {
  self->set_worldVerticesNeedsUpdate(val);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_worldFaceNormalsNeedsUpdate_0(Cylinder* self) {
  return self->get_worldFaceNormalsNeedsUpdate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_worldFaceNormalsNeedsUpdate_1(Cylinder* self, bool val) {
  self->set_worldFaceNormalsNeedsUpdate(val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_vertices_2(Cylinder* self, const float* vertices, int verticeCount) {
  self->set_vertices(vertices, verticeCount);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_faces_2(Cylinder* self, const int* faces, int faceCount) {
  self->set_faces(faces, faceCount);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_uniqueAxes_2(Cylinder* self, const float* vertices, int verticeCount) {
  self->set_uniqueAxes(vertices, verticeCount);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getVerticeCount_0(Cylinder* self) {
  return self->getVerticeCount();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getVertice_1(Cylinder* self, int index) {
  return &self->getVertice(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getFaceCount_0(Cylinder* self) {
  return self->getFaceCount();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getFacePointCount_1(Cylinder* self, int faceIndex) {
  return self->getFacePointCount(faceIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getFacePoint_2(Cylinder* self, int faceIndex, int pointIndex) {
  return self->getFacePoint(faceIndex, pointIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getUniqueAxesCount_0(Cylinder* self) {
  return self->getUniqueAxesCount();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_getUniqueAxes_1(Cylinder* self, int index) {
  return &self->getUniqueAxes(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_release_0(Cylinder* self) {
  self->release();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_id_0(Cylinder* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_type_0(Cylinder* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_collisionResponse_0(Cylinder* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_collisionResponse_1(Cylinder* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_collisionFilterGroup_0(Cylinder* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_collisionFilterGroup_1(Cylinder* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_collisionFilterMask_0(Cylinder* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_collisionFilterMask_1(Cylinder* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_body_0(Cylinder* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_body_1(Cylinder* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_get_material_0(Cylinder* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Cylinder_set_material_1(Cylinder* self, Material* value) {
  self->set_material(value);
}

// Spring

Spring* EMSCRIPTEN_KEEPALIVE emscripten_bind_Spring_Spring_2(Body* bodyA, Body* bodyB) {
  return Spring::create(bodyA, bodyB);
}

Spring* EMSCRIPTEN_KEEPALIVE emscripten_bind_Spring_Spring_3(Body* bodyA, Body* bodyB, const Spring::SpringOptions* options) {
  return Spring::create(bodyA, bodyB, *options);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Spring_applyForce_0(Spring* self) {
  self->applyForce();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Spring_release_0(Spring* self) {
  self->release();
}

// RaycastResult

RaycastResult* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_RaycastResult_0() {
  return RaycastResult::create();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_reset_0(RaycastResult* self) {
  self->reset();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_abort_0(RaycastResult* self) {
  self->abort();
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_shape_0(RaycastResult* self) {
  return self->get_shape();
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_body_0(RaycastResult* self) {
  return self->get_body();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_rayFromWorld_0(RaycastResult* self) {
  return self->rayFromWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_rayFromWorld_1(RaycastResult* self, Vec3* arg0) {
  self->rayFromWorld = arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_rayToWorld_0(RaycastResult* self) {
  return self->rayToWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_rayToWorld_1(RaycastResult* self, Vec3* arg0) {
  self->rayToWorld = arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_hitNormalWorld_0(RaycastResult* self) {
  return self->hitNormalWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_hitNormalWorld_1(RaycastResult* self, Vec3* arg0) {
  self->hitNormalWorld = arg0;
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_hitPointWorld_0(RaycastResult* self) {
  return self->hitPointWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_hitPointWorld_1(RaycastResult* self, Vec3* arg0) {
  self->hitPointWorld = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_hasHit_0(RaycastResult* self) {
  return self->hasHit;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_hasHit_1(RaycastResult* self, bool arg0) {
  self->hasHit = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_hitFaceIndex_0(RaycastResult* self) {
  return self->hitFaceIndex;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_hitFaceIndex_1(RaycastResult* self, int arg0) {
  self->hitFaceIndex = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_get_distance_0(RaycastResult* self) {
  return self->distance;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult_set_distance_1(RaycastResult* self, float arg0) {
  self->distance = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastResult___destroy___0(RaycastResult* self) {
  delete self;
}

// WorldOptions

World::WorldOptions* EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_WorldOptions_0() {
  return new World::WorldOptions();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_gravity_0(World::WorldOptions* self) {
  return &self->gravity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_gravity_1(World::WorldOptions* self, Vec3* arg0) {
  self->gravity = *arg0;
}

Broadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_broadphase_0(World::WorldOptions* self) {
  return self->broadphase;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_broadphase_1(World::WorldOptions* self, Broadphase* arg0) {
  self->broadphase = arg0;
}

Solver* EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_solver_0(World::WorldOptions* self) {
  return self->solver;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_solver_1(World::WorldOptions* self, Solver* arg0) {
  self->solver = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_allowSleep_0(World::WorldOptions* self) {
  return self->allowSleep;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_allowSleep_1(World::WorldOptions* self, bool arg0) {
  self->allowSleep = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_quatNormalizeSkip_0(World::WorldOptions* self) {
  return self->quatNormalizeSkip;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_quatNormalizeSkip_1(World::WorldOptions* self, int arg0) {
  self->quatNormalizeSkip = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_get_quatNormalizeFast_0(World::WorldOptions* self) {
  return self->quatNormalizeFast;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions_set_quatNormalizeFast_1(World::WorldOptions* self, bool arg0) {
  self->quatNormalizeFast = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_WorldOptions___destroy___0(World::WorldOptions* self) {
  delete self;
}

// Sphere

Sphere* EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_Sphere_2(int id, float radius) {
  return Sphere::create(id, radius);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_radius_0(Sphere* self) {
  return self->get_radius();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_radius_1(Sphere* self, float value) {
  self->set_radius(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_updateBoundingSphereRadius_0(Sphere* self) {
  self->updateBoundingSphereRadius();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_release_0(Sphere* self) {
  self->release();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_volume_0(Sphere* self) {
  return self->volume();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_id_0(Sphere* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_type_0(Sphere* self) {
  return self->type();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_boundingSphereRadius_0(Sphere* self) {
  return self->get_boundingSphereRadius();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_collisionResponse_0(Sphere* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_collisionResponse_1(Sphere* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_collisionFilterGroup_0(Sphere* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_collisionFilterGroup_1(Sphere* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_collisionFilterMask_0(Sphere* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_collisionFilterMask_1(Sphere* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_body_0(Sphere* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_body_1(Sphere* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_get_material_0(Sphere* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Sphere_set_material_1(Sphere* self, Material* value) {
  self->set_material(value);
}

// Octree

Octree* EMSCRIPTEN_KEEPALIVE emscripten_bind_Octree_Octree_0() {
  return new Octree();
}

Octree* EMSCRIPTEN_KEEPALIVE emscripten_bind_Octree_Octree_1(int maxDepth) {
  return new Octree(maxDepth);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Octree___destroy___0(Octree* self) {
  delete self;
}

// Vec3

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_Vec3_0() {
  return new Vec3();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_Vec3_3(float x, float y, float z) {
  return new Vec3(x, y, z);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_op_assign_1(Vec3* self, const Vec3* v) {
  return &(*self = *v);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_vsub_2(Vec3* self, const Vec3* v, Vec3* target) {
  return &self->vsub(*v, *target);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_cross_2(Vec3* self, const Vec3* v, Vec3* target) {
  return &self->cross(*v, *target);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_setZero_0(Vec3* self) {
  self->setZero();
}

Mat3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_crossmat_0(Vec3* self) {
  return self->crossmat();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_normalize_0(Vec3* self) {
  return self->normalize();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_unit_1(Vec3* self, Vec3* target) {
  return &self->unit(*target);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_norm_0(Vec3* self) {
  return self->norm();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_length_0(Vec3* self) {
  return self->length();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_norm2_0(Vec3* self) {
  return self->norm2();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_lengthSquared_0(Vec3* self) {
  return self->lengthSquared();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_distanceTo_1(Vec3* self, const Vec3* v) {
  return self->distanceTo(*v);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_distanceSquared_1(Vec3* self, const Vec3* v) {
  return self->distanceSquared(*v);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_mult_2(Vec3* self, float scalar, Vec3* target) {
  return &self->mult(scalar, *target);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_scale_2(Vec3* self, float scalar, Vec3* target) {
  return &self->scale(scalar, *target);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_vmul_2(Vec3* self, const Vec3* v, Vec3* target) {
  return &self->vmul(*v, *target);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_addScaledVector_3(Vec3* self, float scalar, Vec3* v, Vec3* target) {
  return &self->addScaledVector(scalar, *v, *target);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_dot_1(Vec3* self, const Vec3* v) {
  return self->dot(*v);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_isZero_0(Vec3* self) {
  return self->isZero();
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_negate_1(Vec3* self, Vec3* target) {
  return &self->negate(*target);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_tangents_2(Vec3* self, Vec3* v1, Vec3* v2) {
  self->tangents(*v1, *v2);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_copy_1(Vec3* self, const Vec3* v) {
  return &self->copy(*v);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_lerp_3(Vec3* self, const Vec3* v, float t, Vec3* target) {
  return &self->lerp(*v, t, *target);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_almostEquals_2(Vec3* self, const Vec3* v, float precision) {
  return self->almostEquals(*v, precision);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_almostZero_1(Vec3* self, float precision) {
  return self->almostZero(precision);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_isAntiparallelTo_2(Vec3* self, const Vec3* v, float precision) {
  return self->isAntiparallelTo(*v, precision);
}

Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_3(Vec3* self, float x, float y, float z) {
  return &self->set(x, y, z);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_x_0(Vec3* self) {
  return self->x;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_x_1(Vec3* self, float arg0) {
  self->x = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_y_0(Vec3* self) {
  return self->y;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_y_1(Vec3* self, float arg0) {
  self->y = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_get_z_0(Vec3* self) {
  return self->z;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3_set_z_1(Vec3* self, float arg0) {
  self->z = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3___destroy___0(Vec3* self) {
  delete self;
}

// RigidVehicle

RigidVehicle* EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_RigidVehicle_2(World* world, Body* chassisBody) {
  return RigidVehicle::create(world, chassisBody);
}

RigidVehicle* EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_RigidVehicle_3(World* world, Body* chassisBody, const Vec3* coordinateSystem) {
  return RigidVehicle::create(world, chassisBody, *coordinateSystem);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_setSteeringValue_2(RigidVehicle* self, float value, int wheelIndex) {
  self->setSteeringValue(value, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_setMotorSpeed_2(RigidVehicle* self, float value, int wheelIndex) {
  self->setMotorSpeed(value, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_disableMotor_1(RigidVehicle* self, int wheelIndex) {
  self->disableMotor(wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_setWheelForce_2(RigidVehicle* self, float value, int wheelIndex) {
  self->setWheelForce(value, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_applyWheelForce_2(RigidVehicle* self, float value, int wheelIndex) {
  self->applyWheelForce(value, wheelIndex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_addWheel_1(RigidVehicle* self, Body* wheelBody) {
  return self->addWheel(wheelBody);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_addWheel_2(RigidVehicle* self, Body* wheelBody, const Vec3* position) {
  return self->addWheel(wheelBody, *position);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_addWheel_3(RigidVehicle* self, Body* wheelBody, const Vec3* position, const Vec3* axis) {
  return self->addWheel(wheelBody, *position, *axis);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_getWheelBodyCount_0(RigidVehicle* self) {
  return self->getWheelBodyCount();
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_getWheelBody_1(RigidVehicle* self, int index) {
  return self->getWheelBody(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_addToWorld_1(RigidVehicle* self, World* world) {
  self->addToWorld(world);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_RigidVehicle_get_chassisBody_0(RigidVehicle* self) {
  return self->get_chassisBody();
}

// SplitSolver

SplitSolver* EMSCRIPTEN_KEEPALIVE emscripten_bind_SplitSolver_SplitSolver_1(Solver* subsolver) {
  return SplitSolver::create(subsolver);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_SplitSolver_get_iterations_0(SplitSolver* self) {
  return self->get_iterations();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplitSolver_set_iterations_1(SplitSolver* self, int value) {
  self->set_iterations(value);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_SplitSolver_get_tolerance_0(SplitSolver* self) {
  return self->get_tolerance();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplitSolver_set_tolerance_1(SplitSolver* self, float value) {
  self->set_tolerance(value);
}

// Heightfield

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_5(int id, World* world, const float* dataPtr, int width, int height) {
  return Heightfield::create(id, world, dataPtr, width, height);
}

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_6(int id, World* world, const float* dataPtr, int width, int height, float maxValue) {
  return Heightfield::create(id, world, dataPtr, width, height, maxValue);
}

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_7(int id, World* world, const float* dataPtr, int width, int height, float maxValue, float minValue) {
  return Heightfield::create(id, world, dataPtr, width, height, maxValue, minValue);
}

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_8(int id, World* world, const float* dataPtr, int width, int height, float maxValue, float minValue, int elementSize) {
  return Heightfield::create(id, world, dataPtr, width, height, maxValue, minValue, elementSize);
}

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_9(int id, World* world, const float* dataPtr, int width, int height, float maxValue, float minValue, int elementSize, bool needUpdateMax) {
  return Heightfield::create(id, world, dataPtr, width, height, maxValue, minValue, elementSize, needUpdateMax);
}

Heightfield* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_Heightfield_10(int id, World* world, const float* dataPtr, int width, int height, float maxValue, float minValue, int elementSize, bool needUpdateMax, bool needUpdateMin) {
  return Heightfield::create(id, world, dataPtr, width, height, maxValue, minValue, elementSize, needUpdateMax, needUpdateMin);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_getConvexTrianglePillar_3(Heightfield* self, int xi, int yi, bool getUpperTriangle) {
  return self->getConvexTrianglePillar(xi, yi, getUpperTriangle);
}

ConvexPolyhedron* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_pillarConvex_0(Heightfield* self) {
  return self->get_pillarConvex();
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_pillarOffset_0(Heightfield* self) {
  return &self->get_pillarOffset();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_elementSize_0(Heightfield* self) {
  return self->get_elementSize();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_getFirstArraySize_0(Heightfield* self) {
  return self->getFirstArraySize();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_getSecondArraySize_1(Heightfield* self, int index) {
  return self->getSecondArraySize(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_release_0(Heightfield* self) {
  self->release();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_id_0(Heightfield* self) {
  return self->get_id();
}

ShapeType EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_type_0(Heightfield* self) {
  return self->type();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_collisionResponse_0(Heightfield* self) {
  return self->get_collisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_set_collisionResponse_1(Heightfield* self, bool val) {
  self->set_collisionResponse(val);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_collisionFilterGroup_0(Heightfield* self) {
  return self->get_collisionFilterGroup();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_set_collisionFilterGroup_1(Heightfield* self, int value) {
  self->set_collisionFilterGroup(value);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_collisionFilterMask_0(Heightfield* self) {
  return self->get_collisionFilterMask();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_set_collisionFilterMask_1(Heightfield* self, int value) {
  self->set_collisionFilterMask(value);
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_body_0(Heightfield* self) {
  return self->get_body();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_set_body_1(Heightfield* self, Body* body) {
  self->set_body(body);
}

Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_get_material_0(Heightfield* self) {
  return self->get_material();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Heightfield_set_material_1(Heightfield* self, Material* value) {
  self->set_material(value);
}

// Event

Event* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_Event_0() {
  return new Event();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_contactCount_0(Event* self) {
  return self->contactCount();
}

ContactEquation* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_getContact_1(Event* self, int index) {
  return self->getContact(index);
}

EventType EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_type_0(Event* self) {
  return self->type;
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_event_0(Event* self) {
  return self->event;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_targetID_0(Event* self) {
  return self->targetID;
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_selfShape_0(Event* self) {
  return self->selfShape;
}

Shape* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_otherShape_0(Event* self) {
  return self->otherShape;
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_selfBody_0(Event* self) {
  return self->selfBody;
}

Body* EMSCRIPTEN_KEEPALIVE emscripten_bind_Event_get_otherBody_0(Event* self) {
  return self->otherBody;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Event___destroy___0(Event* self) {
  delete self;
}

// Ray

Ray* EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_Ray_2(const Vec3* from, const Vec3* to) {
  return Ray::create(*from, *to);
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_from_0(Ray* self) {
  return &self->from();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_setFrom_1(Ray* self, Vec3* value) {
  self->setFrom(*value);
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_to_0(Ray* self) {
  return &self->to();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_setTo_1(Ray* self, Vec3* value) {
  self->setTo(*value);
}

const Vec3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_direction_0(Ray* self) {
  return &self->direction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_updateDirection_0(Ray* self) {
  self->updateDirection();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_skipBackfaces_0(Ray* self) {
  return self->skipBackfaces();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_setSkipBackfaces_1(Ray* self, bool value) {
  self->setSkipBackfaces(value);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_get_checkCollisionResponse_0(Ray* self) {
  return self->get_checkCollisionResponse();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_set_checkCollisionResponse_1(Ray* self, bool value) {
  self->set_checkCollisionResponse(value);
}

const RaycastResult* EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray_result_0(Ray* self) {
  return &self->result();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Ray___destroy___0(Ray* self) {
  delete self;
}

// BodyState
BodyState EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyState_AWAKE() {
  return BodyState::AWAKE;
}
BodyState EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyState_SLEEPY() {
  return BodyState::SLEEPY;
}
BodyState EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyState_SLEEPING() {
  return BodyState::SLEEPING;
}

// BodyType
BodyType EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyType_DYNAMIC() {
  return BodyType::DYNAMIC;
}
BodyType EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyType_STATIC() {
  return BodyType::STATIC;
}
BodyType EMSCRIPTEN_KEEPALIVE emscripten_enum_BodyType_KINEMATIC() {
  return BodyType::KINEMATIC;
}

// ShapeType
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_NONE() {
  return ShapeType::NONE;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_SPHERE() {
  return ShapeType::SPHERE;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_PLANE() {
  return ShapeType::PLANE;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_BOX() {
  return ShapeType::BOX;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_COMPOUND() {
  return ShapeType::COMPOUND;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_CONVEXPOLYHEDRON() {
  return ShapeType::CONVEXPOLYHEDRON;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_HEIGHTFIELD() {
  return ShapeType::HEIGHTFIELD;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_PARTICLE() {
  return ShapeType::PARTICLE;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_CYLINDER() {
  return ShapeType::CYLINDER;
}
ShapeType EMSCRIPTEN_KEEPALIVE emscripten_enum_ShapeType_TRIMESH() {
  return ShapeType::TRIMESH;
}

// EventType
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_WAKEUP() {
  return EventType::WAKEUP;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_SLEEPY() {
  return EventType::SLEEPY;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_SLEEP() {
  return EventType::SLEEP;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_ADDBODY() {
  return EventType::ADDBODY;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_REMOVEBODY() {
  return EventType::REMOVEBODY;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_COLLIDE() {
  return EventType::COLLIDE;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_TRIGGERED() {
  return EventType::TRIGGERED;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_PRESTEP() {
  return EventType::PRESTEP;
}
EventType EMSCRIPTEN_KEEPALIVE emscripten_enum_EventType_POSTSTEP() {
  return EventType::POSTSTEP;
}

// EulerOrder
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_XYZ() {
  return XYZ;
}
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_YZX() {
  return YZX;
}
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_ZXY() {
  return ZXY;
}
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_ZYX() {
  return ZYX;
}
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_YXZ() {
  return YXZ;
}
EulerOrder EMSCRIPTEN_KEEPALIVE emscripten_enum_EulerOrder_XZY() {
  return XZY;
}

// RayIntersectionMode
RayIntersectionMode EMSCRIPTEN_KEEPALIVE emscripten_enum_RayIntersectionMode_CLOSEST() {
  return RayIntersectionMode::CLOSEST;
}
RayIntersectionMode EMSCRIPTEN_KEEPALIVE emscripten_enum_RayIntersectionMode_ANY() {
  return RayIntersectionMode::ANY;
}
RayIntersectionMode EMSCRIPTEN_KEEPALIVE emscripten_enum_RayIntersectionMode_ALL() {
  return RayIntersectionMode::ALL;
}

}

