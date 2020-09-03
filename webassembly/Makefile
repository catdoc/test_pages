# Makefile for generating a Cannon library using Emscripten.
#
# build with       emmake make
#

# For placing path overrides.. this path is hidden from git
-include Makefile.local

LATEST = Cannon_v1.0.0
STABLE = Cannon_v1.0.0
PYTHON=$(ENV) python
VERSION := stable
BUILD := min

LINK_OPTS = -s GL_TRACK_ERRORS=0 -s GL_POOL_TEMP_BUFFERS=0 -s USE_SDL=0 -s USE_SDL_IMAGE=0 -s USE_SDL_TTF=0 -s USE_SDL_NET=0 -s USE_SDL_MIXER=0 -s ENVIRONMENT=web -s STRICT_JS=1 -s EXPORTED_FUNCTIONS=[] -s MODULARIZE=1 -s 'EXPORT_NAME="CANNON"' -s NO_FILESYSTEM=1 -s EXPORT_BINDINGS=1 -s RESERVED_FUNCTION_POINTERS=5 --post-js cannon_glue.js --memory-init-file 0 -s NO_EXIT_RUNTIME=1 glue_stub.cpp -s NO_FILESYSTEM=1 -s FILESYSTEM=0 -s EXPORTED_RUNTIME_METHODS=[]

ifeq ($(BUILD), debug)
	OPTS = -O0 -g2
	LINK_OPTS += -g -s ASSERTIONS=2 -s DEMANGLE_SUPPORT=1
else
	OPTS = -O3 -DNDEBUG -w
	LINK_OPTS += -O3 --llvm-lto 1 --closure 1 -s IGNORE_CLOSURE_COMPILER_ERRORS=1 -s INCOMING_MODULE_JS_API=[]
endif

ifeq ($(VERSION), latest)
	ACTIVE = $(LATEST)
else ifeq ($(VERSION), stable)
	ACTIVE = $(STABLE)
else
	ACTIVE = $(VERSION)
endif

ACTIVE_CANNON := ../src

OBJECTS += \
$(ACTIVE_CANNON)/cannon/base/Ref.o \
$(ACTIVE_CANNON)/cannon/base/RefTracker.o \
$(ACTIVE_CANNON)/cannon/base/BlockAllocator.o \
$(ACTIVE_CANNON)/cannon/base/StackAllocator.o \
$(ACTIVE_CANNON)/cannon/collision/AABB.o \
$(ACTIVE_CANNON)/cannon/collision/ObjectCollisionMatrix.o \
$(ACTIVE_CANNON)/cannon/collision/Broadphase.o \
$(ACTIVE_CANNON)/cannon/collision/NaiveBroadphase.o \
$(ACTIVE_CANNON)/cannon/collision/GridBroadphase.o \
$(ACTIVE_CANNON)/cannon/collision/SAPBroadphase.o \
$(ACTIVE_CANNON)/cannon/collision/RayCallback.o \
$(ACTIVE_CANNON)/cannon/collision/Ray.o \
$(ACTIVE_CANNON)/cannon/collision/RaycastResult.o \
$(ACTIVE_CANNON)/cannon/constraints/Constraint.o \
$(ACTIVE_CANNON)/cannon/constraints/DistanceConstraint.o \
$(ACTIVE_CANNON)/cannon/constraints/PointToPointConstraint.o \
$(ACTIVE_CANNON)/cannon/constraints/LockConstraint.o \
$(ACTIVE_CANNON)/cannon/constraints/HingeConstraint.o \
$(ACTIVE_CANNON)/cannon/constraints/ConeTwistConstraint.o \
$(ACTIVE_CANNON)/cannon/equations/Equation.o \
$(ACTIVE_CANNON)/cannon/equations/ContactEquation.o \
$(ACTIVE_CANNON)/cannon/equations/FrictionEquation.o \
$(ACTIVE_CANNON)/cannon/equations/RotationalEquation.o \
$(ACTIVE_CANNON)/cannon/equations/RotationalMotorEquation.o \
$(ACTIVE_CANNON)/cannon/equations/ConeEquation.o \
$(ACTIVE_CANNON)/cannon/material/Material.o \
$(ACTIVE_CANNON)/cannon/material/ContactMaterial.o \
$(ACTIVE_CANNON)/cannon/math/Vec3.o \
$(ACTIVE_CANNON)/cannon/math/Quaternion.o \
$(ACTIVE_CANNON)/cannon/math/Mat3.o \
$(ACTIVE_CANNON)/cannon/math/Transform.o \
$(ACTIVE_CANNON)/cannon/math/JacobianElement.o \
$(ACTIVE_CANNON)/cannon/objects/Body.o \
$(ACTIVE_CANNON)/cannon/objects/Spring.o \
$(ACTIVE_CANNON)/cannon/objects/WheelInfo.o \
$(ACTIVE_CANNON)/cannon/objects/ISystem.o \
$(ACTIVE_CANNON)/cannon/objects/SPHSystem.o \
$(ACTIVE_CANNON)/cannon/objects/RaycastVehicle.o \
$(ACTIVE_CANNON)/cannon/objects/RigidVehicle.o \
$(ACTIVE_CANNON)/cannon/shapes/Shape.o \
$(ACTIVE_CANNON)/cannon/shapes/Box.o \
$(ACTIVE_CANNON)/cannon/shapes/Cylinder.o \
$(ACTIVE_CANNON)/cannon/shapes/Heightfield.o \
$(ACTIVE_CANNON)/cannon/shapes/Particle.o \
$(ACTIVE_CANNON)/cannon/shapes/Plane.o \
$(ACTIVE_CANNON)/cannon/shapes/Sphere.o \
$(ACTIVE_CANNON)/cannon/shapes/Trimesh.o \
$(ACTIVE_CANNON)/cannon/shapes/ConvexPolyhedron.o \
$(ACTIVE_CANNON)/cannon/solver/Solver.o \
$(ACTIVE_CANNON)/cannon/solver/GSSolver.o \
$(ACTIVE_CANNON)/cannon/solver/SplitSolver.o \
$(ACTIVE_CANNON)/cannon/utils/Utils.o \
$(ACTIVE_CANNON)/cannon/utils/Octree.o \
$(ACTIVE_CANNON)/cannon/utils/Event.o \
$(ACTIVE_CANNON)/cannon/utils/EventCallback.o \
$(ACTIVE_CANNON)/cannon/utils/EventTarget.o \
$(ACTIVE_CANNON)/cannon/utils/TupleDictionary.o \
$(ACTIVE_CANNON)/cannon/world/Narrowphase.o \
$(ACTIVE_CANNON)/cannon/world/World.o

all: cannon.js cannon.wasm.js

%.o: %.cpp
	$(CXX) $(OPTS) -I$(ACTIVE_CANNON) $< -o $@ -fno-exceptions -fno-rtti

cannon.o: $(OBJECTS)
	$(CXX) $(OPTS) -I$(ACTIVE_CANNON) -o $@ $(OBJECTS)

cannon_glue.cpp: $(ACTIVE).idl
	echo start $@
	$(PYTHON) $(EMSCRIPTEN)/tools/webidl_binder.py $(ACTIVE).idl cannon_glue
	$(PYTHON) cannon_glue.py
	echo end $@

cannon_glue.h: cannon_glue.cpp

cannon.js: cannon.o cannon_glue.cpp cannon_glue.h
	echo start cannon.js
	$(CXX) $(LINK_OPTS) -I$(ACTIVE_CANNON) $< -o build/$(ACTIVE)_$(BUILD).js -s WASM=0 -fno-exceptions -fno-rtti	
	echo end cannon.js

cannon.wasm.js: cannon.o cannon_glue.cpp cannon_glue.h
	echo start cannon.wasm.js
	# -s BUILD_AS_WORKER=1 -s ENVIRONMENT=web,worker
	$(CXX) $(LINK_OPTS) -I$(ACTIVE_CANNON) $< -o build/$(ACTIVE)_$(BUILD).wasm.js -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -fno-exceptions -fno-rtti
	echo end cannon.wasm.js

clean:
	rm -f $(OBJECTS)
	rm -f cannon.o cannon_bindings.cpp cannon_bindings.o cannon.clean.h cannon_glue.js cannon_glue.cpp WebIDLGrammar.pkl parser.out

