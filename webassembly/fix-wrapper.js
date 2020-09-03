var wrapCANNON = function(CANNON) {
    console.info('cannon wasm wrapper start');

    CANNON.World.prototype._nativeRaycastAll = CANNON.World.prototype.raycastAll;
    CANNON.World.prototype.raycastAll = function(from, to, raycastOpt, callback) {
        let jsRayCallback = new CANNON.JSRayCallback();
        jsRayCallback.reportRaycastResult = function(result) {
            var newresult = CANNON.wrapPointer(result, CANNON.RaycastResult);
            callback(newresult);
        }

        let rayOptions = new CANNON.RayOptions();
        rayOptions.skipBackfaces = raycastOpt.skipBackfaces;
        rayOptions.collisionFilterMask = raycastOpt.collisionFilterMask;
        rayOptions.collisionFilterGroup = raycastOpt.collisionFilterGroup;
        var hit = CANNON.__cur_world._nativeRaycastAll(from, to, jsRayCallback, rayOptions);
        CANNON.destroy(rayOptions);
        CANNON.destroy(jsRayCallback);
        return hit;
    }

    CANNON.World.prototype.remove = CANNON.World.prototype.removeBody;
    CANNON.World.prototype.add = CANNON.World.prototype.addBody

    CANNON._NativeWorld = CANNON.World;
    CANNON.World = function(worldOptions) {
        console.warn('before create native world: ' + CANNON._NativeWorld);
        let world = new CANNON._NativeWorld(worldOptions);
        console.warn('after create native world : ' + world);
        CANNON.__cur_world = world;
        return world;
    }
    CANNON.World.prototype = CANNON._NativeWorld.prototype;

    let __eventType2ID = {
        'wakeUp' : CANNON.WAKEUP,
        'sleepy' : CANNON.SLEEPY,
        'sleep' : CANNON.SLEEP,

        'addBody' : CANNON.ADDBODY,
        'removeBody' : CANNON.REMOVEBODY,

        'trigger' : CANNON.TRIGGERED,
        'collide' : CANNON.COLLIDE,
        'cc-trigger' : CANNON.TRIGGERED,
        'cc-collide' : CANNON.COLLIDE,


        'preStep' : CANNON.PRESTEP,
        'postStep' : CANNON.POSTSTEP,
    };

    let __jsEventCallbackMap = {

    }

    let __addEventLisener = function(type, target, listener) {
        if ( ! CANNON.__cur_world) {
            console.warn('wasm __addEventLisener: CANNON.__cur_world is null !');
            return;
        }

        if ( __jsEventCallbackMap[listener]) {
            console.warn('wasm __addEventLisener: listener has been added, type = ' + type + ', listener = ' + listener);
            return;
        }

        let typeID = __eventType2ID[type];
        console.warn('typeID ' + typeID + ', type = ' + type);

        let collideListener = new CANNON.JSEventCallback();
        
        // Something different, it needs CANNON.__cur_world as the target for preStep and postStep event.
        
        if (typeID === CANNON.PRESTEP || typeID === CANNON.POSTSTEP || typeID === CANNON.ADDBODY 
            || typeID === CANNON.REMOVEBODY) {
            collideListener.setTarget(CANNON.__cur_world);
        }
        else {
            collideListener.setTarget(target);
        }
         

        collideListener.notify = function(e) {
            e = CANNON.wrapPointer(e, CANNON.Event);
            listener(e);
        };
        
        CANNON.__cur_world.dispatcher().addEventListener(typeID, collideListener); 
        __jsEventCallbackMap[listener] = collideListener; 
    }

    let __removeEventListender = function(type, listener) {
        if ( ! CANNON.__cur_world) {
            console.warn('wasm __removeEventListender: CANNON.__cur_world is null !');
            return;
        }

        let collideListener = __jsEventCallbackMap[listener]
        if ( !collideListener) {
            console.warn('wasm __removeEventListender: listener not exists, type = ' + type + ', listener = ' + listener);
            return;
        }

        let typeID = __eventType2ID[type];
        console.warn('remove typeID ' + typeID)

        CANNON.__cur_world.dispatcher().removeEventListener(typeID, collideListener); 
        delete __jsEventCallbackMap[listener]; 
    }

    CANNON.cc_wrapper_map = {}  // for cocos ?

    CANNON.World.prototype.addEventListener = function(type, listener) {
        listener = listener.bind(this);
        __addEventLisener(type, this, listener);
    }

    CANNON.World.prototype.removeEventListener = function(type, listener) {
        __removeEventListender(type, listener);
    }

    CANNON.Body.prototype.addEventListener = function(type, listener) {
        console.warn('body addEventListener len=' + this.shapesLength());
        listener = listener.bind(this);
        __addEventLisener(type, this, listener);
    };

    CANNON.Body.prototype.removeEventListener = function(type, listener) {
        console.warn('body removeEventListener ' + type + ' is not supported.');
        __removeEventListender(type, listener);
    }

    CANNON.Shape.prototype.addEventListener = function(type, listener) {
        __addEventLisener(type, this, listener);
    }

    CANNON.Shape.prototype.removeEventListener = function(type, listener) {
        //console.warn('shape removeEventListener ' + type + ' is not supported.');
        __removeEventListender(type, listener);
    }

    CANNON._NativeBody = CANNON.Body;
    CANNON.Body = function(options) {
        let bodyId = CANNON.__cur_world.genBodyId();
        let bodyOptions = new CANNON.BodyOptions(CANNON.__cur_world, bodyId);
        
        if (options) {
            bodyOptions.position = options.position || bodyOptions.position;
            bodyOptions.quaternion = options.quaternion || bodyOptions.quaternion;
            bodyOptions.velocity = options.velocity || bodyOptions.velocity;
            bodyOptions.angularVelocity = options.angularVelocity || bodyOptions.angularVelocity;
            bodyOptions.linearFactor = options.linearFactor || bodyOptions.linearFactor;
            bodyOptions.angularFactor = options.angularFactor || bodyOptions.angularFactor;
            
            bodyOptions.shape = options.shape || bodyOptions.shape;
            bodyOptions.mass = options.mass || bodyOptions.mass;
            bodyOptions.material = options.material || bodyOptions.material;
            bodyOptions.type = options.type || bodyOptions.type;

            bodyOptions.fixedRotation = options.fixedRotation || bodyOptions.fixedRotation;
            bodyOptions.allowSleep = options.allowSleep || bodyOptions.allowSleep;
            bodyOptions.collisionFilterGroup = options.collisionFilterGroup || bodyOptions.collisionFilterGroup;
            bodyOptions.collisionFilterMask = options.collisionFilterMask || bodyOptions.collisionFilterMask;

            bodyOptions.sleepSpeedLimit = options.sleepSpeedLimit || bodyOptions.sleepSpeedLimit;
            bodyOptions.sleepTimeLimit = options.sleepTimeLimit || bodyOptions.sleepTimeLimit;
            bodyOptions.linearDamping = options.linearDamping || bodyOptions.linearDamping;
            bodyOptions.angularDamping = options.angularDamping || bodyOptions.angularDamping;
        }
        
        let body = new CANNON._NativeBody(bodyOptions);
        CANNON.destroy(bodyOptions);
        /*
        Object.defineProperty(body, 'shapes', { 
            get: function() { 
                var shapesLength = this.shapesLength();
                var shapes = {}
                shapes.length = shapesLength;
               return shapes;
            },
        });    
        */
        return body;
    }
    CANNON.Body.prototype = CANNON._NativeBody.prototype;
    CANNON.Body.prototype.constructor = CANNON.Body; 
    CANNON.Body.prototype.__class__ = CANNON.Body; 
    CANNON.Body.__cache__ = CANNON._NativeBody.__cache__; 

    CANNON.Body.STATIC = CANNON.Body.STATIC || CANNON.STATIC;
    CANNON.Body.DYNAMIC = CANNON.Body.DYNAMIC || CANNON.DYNAMIC;
    CANNON.Body.KINEMATIC = CANNON.Body.KINEMATIC || CANNON.KINEMATIC;

    CANNON.Shape.types = {};
    CANNON.Shape.types.SPHERE = CANNON.SPHERE;
    CANNON.Shape.types.PLANE = CANNON.PLANE;
    CANNON.Shape.types.BOX = CANNON.BOX;
    CANNON.Shape.types.COMPOUND = CANNON.COMPOUND;
    CANNON.Shape.types.CONVEXPOLYHEDRON = CANNON.CONVEXPOLYHEDRON;
    CANNON.Shape.types.HEIGHTFIELD = CANNON.HEIGHTFIELD;
    CANNON.Shape.types.PARTICLE = CANNON.PARTICLE;
    CANNON.Shape.types.CYLINDER = CANNON.CYLINDER;
    CANNON.Shape.types.TRIMESH = CANNON.TRIMESH;

    CANNON._NativeBox = CANNON.Box;
    CANNON.Box = function(halfExtents) {
        let shapeId = CANNON.__cur_world.genShapeId();
        let box = new CANNON._NativeBox(shapeId, CANNON.__cur_world, halfExtents);
        return box;   
    }
    CANNON.Box.prototype = CANNON._NativeBox.prototype;
    CANNON.Box.prototype.constructor = CANNON.Box; 
    CANNON.Box.prototype.__class__ = CANNON.Box;
    CANNON.Box.__cache__ = CANNON._NativeBox.__cache__;

    CANNON._NativeSphere = CANNON.Sphere;
    CANNON.Sphere = function(radius) {
        let shapeId = CANNON.__cur_world.genShapeId();
        let sphere = new CANNON._NativeSphere(shapeId, radius);
        return sphere;
    }
    CANNON.Sphere.prototype = CANNON._NativeSphere.prototype;
    CANNON.Sphere.prototype.constructor = CANNON.Sphere; 
    CANNON.Sphere.prototype.__class__ = CANNON.Sphere;
    CANNON.Sphere.__cache__ = CANNON._NativeSphere.__cache__;

    CANNON._NativePlane = CANNON.Plane;
    CANNON.Plane = function() {
        let shapeId = CANNON.__cur_world.genShapeId();
        let plane = new CANNON._NativePlane(shapeId);
        return plane;
    }
    CANNON.Plane.prototype = CANNON._NativePlane.prototype;
    CANNON.Plane.prototype.constructor = CANNON.Plane; 
    CANNON.Plane.prototype.__class__ = CANNON.Plane;
    CANNON.Plane.__cache__ = CANNON._NativePlane.__cache__;

    CANNON._NativeParticle = CANNON.Particle;
    CANNON.Particle = function() {
        let shapeId = CANNON.__cur_world.genShapeId();
        let shape = new CANNON._NativeParticle(shapeId);
        return shape;
    }
    CANNON.Particle.prototype = CANNON._NativeParticle.prototype;
    CANNON.Particle.prototype.constructor = CANNON.Particle; 
    CANNON.Particle.prototype.__class__ = CANNON.Particle;
    CANNON.Particle.__cache__ = CANNON._NativeParticle.__cache__;

    CANNON._NativeConvexPolyhedron = CANNON.ConvexPolyhedron;
    CANNON.ConvexPolyHedron = function(points, faces, uniqueAxes) {
        let shapeId = CANNON.__cur_world.genShapeId();
        let shape = new CANNON._NativeConvexPolyhedron(shapeId);
        // TODO: set points, faces, uniqueAxes by ArrayBuffer

        points = points || [];
        faces = faces || [];
        uniqueAxes = uniqueAxes || [];

        if (points.length > 0) {
            let tempPoint;
            let verticeBuffer = new Float32Array(points.length * 3);
            for (let i = 0; i < points.length; ++i) {
                tempPoint = points[i];
                verticeBuffer[i * 3 + 0] = tempPoint.x;
                verticeBuffer[i * 3 + 1] = tempPoint.y;
                verticeBuffer[i * 3 + 2] = tempPoint.z;
            }
            shape.set_vertices(verticeBuffer, points.length * 3);
        }

        if (faces.length > 0) {
            let tempFace;
            let currBufferSize = faces.length * 6; 
            let faceBuffer = new Float32Array(currBufferSize);
            let bufferPos = 0;
            for (let i = 0; i < faces.length; ++i) {

                tempFace = faces[i];

                if (bufferPos + 1 + tempFace.length  >= currBufferSize) {

                    currBufferSize = currBufferSize * 2;
                    let newFaceBuffer = new Float32Array(currBufferSize);
                    newFaceBuffer.set(faceBuffer, 0);

                    faceBuffer = newFaceBuffer;
                }

                faceBuffer[bufferPos] = tempFace.length;
                ++bufferPos;
                /*
                for (let j = 0; j < tempFace.length; ++j) {
                    faceBuffer[bufferPos] = tempFace[j];
                    ++bufferPos; 
                }
                */
               faceBuffer.set(tempFace, bufferPos);
               bufferPos += tempFace.length;
            }

            shape.set_faces(faceBuffer, bufferPos);
        }

        if (uniqueAxes.length > 0) {
            let tempAxes;
            let axesBuffer = new Float32Array(uniqueAxes.length * 3);
            for (let i = 0; i < uniqueAxes.length; ++i) {
                let tempAxes = uniqueAxes[i];
                axesBuffer[i * 3 + 0] = tempAxes.x;
                axesBuffer[i * 3 + 1] = tempAxes.y;
                axesBuffer[i * 3 + 2] = tempAxes.z;
            }
            shape.set_uniqueAxes(axesBuffer, uniqueAxes.length * 3);
        }

        shape.computeEdges();
        shape.computeNormals();
        shape.updateBoundingSphereRadius();

        return shape;
    }
    CANNON.ConvexPolyhedron.prototype = CANNON._NativeConvexPolyhedron.prototype;
    CANNON.ConvexPolyhedron.prototype.constructor = CANNON.ConvexPolyhedron; 
    CANNON.ConvexPolyhedron.prototype.__class__ = CANNON.ConvexPolyhedron;
    CANNON.ConvexPolyhedron.__cache__ = CANNON._NativeConvexPolyhedron.__cache__;

    CANNON._NativeCylinder = CANNON.Cylinder;
    CANNON.Cylinder = function(radiusTop, radiusBottom, height, numSegments) {
        let shapeId = CANNON.__cur_world.genShapeId();
        let shape = new CANNON._NativeCylinder(shapeId, radiusTop, radiusBottom, height, numSegments);
        return shape;
    }
    CANNON.Cylinder.prototype = CANNON._NativeCylinder.prototype;
    CANNON.Cylinder.prototype.constructor = CANNON.Cylinder; 
    CANNON.Cylinder.prototype.__class__ = CANNON.Cylinder;
    CANNON.Cylinder.__cache__ = CANNON._NativeCylinder.__cache__;

    CANNON._NativeHeightfield = CANNON.Heightfield;
    CANNON.Heightfield = function(data, options) {
        let shapeId = CANNON.__cur_world.genShapeId();

        let height = data.length;
        let width = data[0].length;
        let dataArray = new Float32Array(height * width);

        for ( let j = 0; j < height; ++j) {
            //dataArray.set(data[j], width * j);
            for (let i = 0; i < width; ++i) {
                let pos = j * width + i;
                dataArray[pos] = data[j][i];
                // console.warn('data' + i + ',' + j + ',' + pos + '->' + dataArray[pos]);
            }
        }

        let maxValue = options.maxValue || 0;
        let minValue = options.minValue || 0;
        let elementSize = options.elementSize || 1;

        let shape = new CANNON._NativeHeightfield(shapeId, CANNON.__cur_world, dataArray, width, height, maxValue, minValue, elementSize);
        console.info('hf.esize = ' + shape.get_elementSize());
        return shape;
    }
    CANNON.Heightfield.prototype = CANNON._NativeHeightfield.prototype;
    CANNON.Heightfield.prototype.constructor = CANNON.Heightfield; 
    CANNON.Heightfield.prototype.__class__ = CANNON.Heightfield;
    CANNON.Heightfield.__cache__ = CANNON._NativeHeightfield.__cache__;

    CANNON._NativeTrimesh = CANNON.Trimesh;
    CANNON.Trimesh = function(vertices, indices) {

        let verticeBuffer = new Float32Array(vertices);
        let indiceBuffer = new Int32Array(indices);

        let shapeId = CANNON.__cur_world.genShapeId();
        let shape = new CANNON._NativeTrimesh(shapeId, verticeBuffer, indiceBuffer);
        return shape;
    }

    CANNON.Trimesh.createTorus = function (radius, tube, radialSegments, tubularSegments, arc) {
        radius = radius || 1;
        tube = tube || 0.5;
        radialSegments = radialSegments || 8;
        tubularSegments = tubularSegments || 6;
        arc = arc || Math.PI * 2;
        
        let shapeId = CANNON.__cur_world.genShapeId();
        return new CANNON._NativeTrimesh(shapeId, radius, tube, radialSegments, tubularSegments, arc);
    }

    CANNON.Trimesh.prototype = CANNON._NativeTrimesh.prototype;
    CANNON.Trimesh.prototype.constructor = CANNON.Trimesh; 
    CANNON.Trimesh.prototype.__class__ = CANNON.Trimesh;
    CANNON.Trimesh.__cache__ = CANNON._NativeTrimesh.__cache__;

    CANNON.castBoxShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeBox); 
    } 

    CANNON.castSphereShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeSphere); 
    }

    CANNON.castPlaneShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativePlane); 
    }

    CANNON.castParticleShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeParticle); 
    }

    CANNON.castConvexPolyHedronShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeConvexPolyhedron); 
    }

    CANNON.castCylinderShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeCylinder); 
    }

    CANNON.castHeightfieldShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeHeightfield); 
    }

    CANNON.castTrimeshShape = function(shape) {
        return CANNON.castObject(shape, CANNON._NativeTrimesh); 
    }

    CANNON._NativeMaterial = CANNON.Material;
    CANNON.Material = function(options) {
        let matId = CANNON.__cur_world.genMaterialId();
        console.warn('gen mat id = ' + matId);

        let matOptions = new CANNON.MaterialOptions();
        matOptions.id = matId;
        if (options) {
            matOptions.friction = options.friction || matOptions.friction;
            matOptions.restitution = options.restitution || matOptions.restitution;
            matOptions.name = options.name || matOptions.name;
        }

        let mat = new CANNON._NativeMaterial(matOptions);
        CANNON.destroy(matOptions);
        return mat;
    }
    CANNON.Material.prototype = CANNON._NativeMaterial.prototype;
    CANNON.Material.prototype.constructor = CANNON.Material; 
    CANNON.Material.prototype.__class__ = CANNON.Material;
    CANNON.Material.__cache__ = CANNON._NativeMaterial.__cache__;

    CANNON._NativeContactMaterial = CANNON.ContactMaterial;
    CANNON.ContactMaterial = function(mat1, mat2, options) {
        let cmMatId = CANNON.__cur_world.genContactMaterialId();
        let cmMatOptions = new CANNON.ContactMaterialOptions();
        if (options) {
            cmMatOptions.friction = options.friction || cmMatOptions.friction;
            cmMatOptions.restitution = options.restitution || cmMatOptions.restitution;
            cmMatOptions.contactEquationStiffness = options.contactEquationStiffness || cmMatOptions.contactEquationStiffness;
            cmMatOptions.contactEquationRelaxation = options.contactEquationRelaxation || cmMatOptions.contactEquationRelaxation;
            cmMatOptions.frictionEquationStiffness = options.frictionEquationStiffness || cmMatOptions.frictionEquationStiffness;
            cmMatOptions.frictionEquationRelaxation = options.frictionEquationRelaxation || cmMatOptions.frictionEquationRelaxation;
        
            console.warn('cmMatOptions.restitution = ' + cmMatOptions.restitution + ' mat=,' + mat1.id() + ' , ' + mat2.id());
        }

        let cmMat = new CANNON._NativeContactMaterial(mat1, mat2, cmMatId, cmMatOptions);
        CANNON.destroy(cmMatOptions);
        return cmMat;
    }
    CANNON.ContactMaterial.prototype = CANNON._NativeContactMaterial.prototype;
    CANNON.ContactMaterial.prototype.constructor = CANNON.ContactMaterial; 
    CANNON.ContactMaterial.prototype.__class__ = CANNON.ContactMaterial;
    CANNON.ContactMaterial.__cache__ = CANNON._NativeContactMaterial.__cache__;

    CANNON._NativeDistanceConstraint = CANNON.DistanceConstraint;
    CANNON.DistanceConstraint = function(bodyA,bodyB,distance,maxForce) {
        let constraintId = CANNON.__cur_world.genConstraintId();
        let constraint = new CANNON._NativeDistanceConstraint(constraintId, bodyA, bodyB, distance, maxForce);
        return constraint;
    }
    CANNON.DistanceConstraint.prototype = CANNON._NativeDistanceConstraint.prototype;
    CANNON.DistanceConstraint.prototype.constructor = CANNON.DistanceConstraint; 
    CANNON.DistanceConstraint.prototype.__class__ = CANNON.DistanceConstraint;
    CANNON.DistanceConstraint.__cache__ = CANNON._NativeDistanceConstraint.__cache__;

    CANNON._NativePointToPointConstraint = CANNON.PointToPointConstraint;
    CANNON.PointToPointConstraint = function(bodyA,pivotA,bodyB,pivotB,maxForce) {
        let constraintId = CANNON.__cur_world.genConstraintId();
        let constraint = new CANNON._NativePointToPointConstraint(constraintId, bodyA, bodyB, pivotA, pivotB, maxForce);
        return constraint;
    }
    CANNON.PointToPointConstraint.prototype = CANNON._NativePointToPointConstraint.prototype;
    CANNON.PointToPointConstraint.prototype.constructor = CANNON.PointToPointConstraint; 
    CANNON.PointToPointConstraint.prototype.__class__ = CANNON.PointToPointConstraint;
    CANNON.PointToPointConstraint.__cache__ = CANNON._NativePointToPointConstraint.__cache__;

    CANNON._NativeLockConstraint = CANNON.LockConstraint;
    CANNON.LockConstraint = function(bodyA, bodyB, options) {
        let constraintId = CANNON.__cur_world.genConstraintId();

        options = options || {};
        let maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;
        let constraint = new CANNON._NativeLockConstraint(constraintId, bodyA, bodyB, maxForce);
        return constraint;
    }
    CANNON.LockConstraint.prototype = CANNON._NativeLockConstraint.prototype;
    CANNON.LockConstraint.prototype.constructor = CANNON.LockConstraint; 
    CANNON.LockConstraint.prototype.__class__ = CANNON.LockConstraint;
    CANNON.LockConstraint.__cache__ = CANNON._NativeLockConstraint.__cache__;

    CANNON._NativeConeTwistConstraint = CANNON.ConeTwistConstraint;
    CANNON.ConeTwistConstraint = function(bodyA, bodyB, options) {
        let constraintId = CANNON.__cur_world.genConstraintId();

        options = options || {};
        let maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;
        
        // Set pivot point in between
        let pivotA = options.pivotA ? options.pivotA : new CANNON.Vec3();
        let pivotB = options.pivotB ? options.pivotB : new CANNON.Vec3();
        let axisA = options.axisA ? options.axisA : new CANNON.Vec3();
        let axisB = options.axisB ? options.axisB : new CANNON.Vec3();

        let angle = typeof(options.angle) !== 'undefined' ? options.angle : 0;
        let twistAngle = typeof(options.twistAngle) !== 'undefined' ? options.twistAngle : 0;

        let constraint = new CANNON._NativeConeTwistConstraint(constraintId, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce, angle, false, twistAngle);
        return constraint;
    }
    CANNON.ConeTwistConstraint.prototype = CANNON._NativeConeTwistConstraint.prototype;
    CANNON.ConeTwistConstraint.prototype.constructor = CANNON.ConeTwistConstraint; 
    CANNON.ConeTwistConstraint.prototype.__class__ = CANNON.ConeTwistConstraint;
    CANNON.ConeTwistConstraint.__cache__ = CANNON._NativeConeTwistConstraint.__cache__;

    CANNON._NativeHingeConstraint = CANNON.HingeConstraint;
    CANNON.HingeConstraint = function(bodyA, bodyB, options) {
        let constraintId = CANNON.__cur_world.genConstraintId();

        options = options || {};

        var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;
        // clone cannot return [Value]
        var pivotA = options.pivotA ? options.pivotA : new CANNON.Vec3();
        var pivotB = options.pivotB ? options.pivotB : new CANNON.Vec3();
        var axisA = options.axisA ? options.axisA : new CANNON.Vec3(1,0,0);
        axisA.normalize();

        var axisB = options.axisB ? options.axisB : new CANNON.Vec3(1,0,0);
        axisB.normalize();

        let constraint = new CANNON._NativeHingeConstraint(constraintId, bodyA, bodyB, pivotA, pivotB, axisA, axisB, maxForce);
        return constraint;
    }
    CANNON.HingeConstraint.prototype = CANNON._NativeHingeConstraint.prototype;
    CANNON.HingeConstraint.prototype.constructor = CANNON.HingeConstraint; 
    CANNON.HingeConstraint.prototype.__class__ = CANNON.HingeConstraint;
    CANNON.HingeConstraint.__cache__ = CANNON._NativeHingeConstraint.__cache__;

    CANNON._NativeRigidVehicle = CANNON.RigidVehicle;
    CANNON.RigidVehicle = function(options) {
        let coordinateSystem = typeof(options.coordinateSystem)==='undefined' ? new CANNON.Vec3(1, 2, 3) : options.coordinateSystem;
        let chassisBody = options.chassisBody;

        let vechile = new CANNON._NativeRigidVehicle(CANNON.__cur_world, chassisBody, coordinateSystem);
        return vechile;
    }
    CANNON.RigidVehicle.prototype = CANNON._NativeRigidVehicle.prototype;
    CANNON.RigidVehicle.prototype.constructor = CANNON.RigidVehicle; 
    CANNON.RigidVehicle.prototype.__class__ = CANNON.RigidVehicle;
    CANNON.RigidVehicle.__cache__ = CANNON._NativeRigidVehicle.__cache__;

    CANNON.RigidVehicle.prototype._oldAddWheel = CANNON.RigidVehicle.prototype.addWheel;
    CANNON.RigidVehicle.prototype.addWheel = function(options) {
        options = options || {};
        let wheelBody = options.body;
        let position = typeof(options.position) !== 'undefined' ? options.position : new CANNON.Vec3(0,2,0);
        let axis = typeof(options.axis) !== 'undefined' ? options.axis : new CANNON.Vec3(0, 1, 0);

        return this._oldAddWheel(wheelBody, position, axis);
    }

    CANNON._NativeRaycastVehicle = CANNON.RaycastVehicle;
    CANNON.RaycastVehicle = function(options) {
        options = options || {};

        let chassisBody = options.chassisBody;
        let indexRightAxis = typeof(options.indexRightAxis) !== 'undefined' ? options.indexRightAxis : 1;
        let indexForwardAxis = typeof(options.indexForwardAxis) !== 'undefined' ? options.indexForwardAxis : 0;
        let indexUpAxis = typeof(options.indexUpAxis) !== 'undefined' ? options.indexUpAxis : 2;

        let vechile = new CANNON._NativeRaycastVehicle(chassisBody, indexRightAxis, indexForwardAxis, indexUpAxis);
        return vechile;
    }
    CANNON.RaycastVehicle.prototype = CANNON._NativeRaycastVehicle.prototype;
    CANNON.RaycastVehicle.prototype.constructor = CANNON.RaycastVehicle; 
    CANNON.RaycastVehicle.prototype.__class__ = CANNON.RaycastVehicle;
    CANNON.RaycastVehicle.__cache__ = CANNON._NativeRaycastVehicle.__cache__;

    CANNON.RaycastVehicle.prototype._oldAddWheel = CANNON.RaycastVehicle.prototype.addWheel;
    CANNON.RaycastVehicle.prototype.addWheel = function(options) {
        options = options || {};
        
        let wheelOptions = new CANNON.WheelOptions();
        wheelOptions.chassisConnectionPointLocal = options.chassisConnectionPointLocal || new CANNON.Vec3();
        wheelOptions.chassisConnectionPointWorld = options.chassisConnectionPointWorld || new CANNON.Vec3();
        wheelOptions.directionLocal = options.directionLocal || new CANNON.Vec3();
        wheelOptions.directionWorld = options.directionWorld || new CANNON.Vec3();
        wheelOptions.axleLocal = options.axleLocal || new CANNON.Vec3();
        wheelOptions.axleWorld = options.axleWorld || new CANNON.Vec3();
        wheelOptions.suspensionRestLength = options.suspensionRestLength || 1;
        wheelOptions.suspensionMaxLength = options.suspensionMaxLength || 2;
        wheelOptions.radius = options.radius || 1;
        wheelOptions.suspensionStiffness = options.suspensionStiffness || 100;
        wheelOptions.dampingCompression = options.dampingCompression || 10;
        wheelOptions.dampingRelaxation = options.dampingRelaxation || 10;
        wheelOptions.frictionSlip = options.frictionSlip || 10000;
        wheelOptions.steering = options.steering || 0;
        wheelOptions.rotation = options.rotation || 0;
        wheelOptions.deltaRotation = options.deltaRotation || 0;
        wheelOptions.rollInfluence = options.rollInfluence || 0.01;
        wheelOptions.maxSuspensionForce = options.maxSuspensionForce || Number.MAX_VALUE;
        wheelOptions.isFrontWheel = options.isFrontWheel || true;
        wheelOptions.clippedInvContactDotSuspension = options.clippedInvContactDotSuspension || 1;
        wheelOptions.suspensionRelativeVelocity = options.suspensionRelativeVelocity || 0;
        wheelOptions.suspensionForce = options.suspensionForce || 0;
        wheelOptions.skidInfo = options.skidInfo || 0;
        wheelOptions.suspensionLength = options.suspensionLength || 0;
        wheelOptions.maxSuspensionTravel = options.maxSuspensionTravel || 1;
        wheelOptions.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed || false;
        wheelOptions.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed || -0.1;

        let index = this._oldAddWheel(wheelOptions);
        CANNON.destroy(wheelOptions);
        return index;
    }

    Object.defineProperty(CANNON.World.prototype, 'bodies', { get: function() {
        let count = this.numObjects();
        let bodies = [];
        for (let i = 0; i < count; ++i) {
            let body = this.getBody(i);
            bodies[i] = body;
        }
        return bodies;
    } });

    Object.defineProperty(CANNON.World.prototype, 'allowSleep', { get: CANNON.World.prototype.get_allowSleep, set: CANNON.World.prototype.set_allowSleep });
    Object.defineProperty(CANNON.World.prototype, 'gravity', { get: CANNON.World.prototype.get_gravity, set: CANNON.World.prototype.set_gravity });
    Object.defineProperty(CANNON.World.prototype, 'broadphase', { get: CANNON.World.prototype.get_broadphase, set: CANNON.World.prototype.set_broadphase });
    Object.defineProperty(CANNON.World.prototype, 'solver', { get: CANNON.World.prototype.get_solver, set: CANNON.World.prototype.set_solver });
    Object.defineProperty(CANNON.World.prototype, 'defaultMaterial', { get: CANNON.World.prototype.get_defaultMaterial, set: CANNON.World.prototype.set_defaultMaterial });
    Object.defineProperty(CANNON.World.prototype, 'defaultContactMaterial', { get: CANNON.World.prototype.get_defaultContactMaterial, set: CANNON.World.prototype.set_defaultContactMaterial });
    Object.defineProperty(CANNON.World.prototype, 'quatNormalizeSkip', { get: CANNON.World.prototype.get_quatNormalizeSkip, set: CANNON.World.prototype.set_quatNormalizeSkip });
    Object.defineProperty(CANNON.World.prototype, 'quatNormalizeFast', { get: CANNON.World.prototype.get_quatNormalizeFast, set: CANNON.World.prototype.set_quatNormalizeFast });
    Object.defineProperty(CANNON.World.prototype, 'time', { get: CANNON.World.prototype.get_time });

    Object.defineProperty(CANNON.World.prototype, 'constraints', { get: function() {
        let count = this.getConstraintCount();
        let constraints = [];
        for (let i = 0; i < count; ++i) {
            let constraint = this.getConstraint(i);
            constraints[i] = constraint;
        }
        return constraints;
    } });

    Object.defineProperty(CANNON.World.prototype, 'contacts', { get: function() {
        let count = this.getContactCount();
        let contacts = [];
        for (let i = 0; i < count; ++i) {
            let contact = this.getContact(i);
            contacts[i] = contact;
        }
        return contacts;
    } });

    Object.defineProperty(CANNON.BodyOptions.prototype, 'position', { get: CANNON.BodyOptions.prototype.get_position, set: CANNON.BodyOptions.prototype.set_position });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'quaternion', { get: CANNON.BodyOptions.prototype.get_quaternion, set: CANNON.BodyOptions.prototype.set_quaternion });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'velocity', { get: CANNON.BodyOptions.prototype.get_velocity, set: CANNON.BodyOptions.prototype.set_velocity });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'angularVelocity', { get: CANNON.BodyOptions.prototype.get_angularVelocity, set: CANNON.BodyOptions.prototype.set_angularVelocity });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'linearFactor', { get: CANNON.BodyOptions.prototype.get_linearFactor, set: CANNON.BodyOptions.prototype.set_linearFactor });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'angularFactor', { get: CANNON.BodyOptions.prototype.get_angularFactor, set: CANNON.BodyOptions.prototype.set_angularFactor });

    Object.defineProperty(CANNON.BodyOptions.prototype, 'shape', { get: CANNON.BodyOptions.prototype.get_shape, set: CANNON.BodyOptions.prototype.set_shape });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'mass', { get: CANNON.BodyOptions.prototype.get_mass, set: CANNON.BodyOptions.prototype.set_mass });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'material', { get: CANNON.BodyOptions.prototype.get_material, set: CANNON.BodyOptions.prototype.set_material });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'type', { get: CANNON.BodyOptions.prototype.get_type, set: CANNON.BodyOptions.prototype.set_type });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'fixedRotation', { get: CANNON.BodyOptions.prototype.get_fixedRotation, set: CANNON.BodyOptions.prototype.set_fixedRotation });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'allowSleep', { get: CANNON.BodyOptions.prototype.get_allowSleep, set: CANNON.BodyOptions.prototype.set_allowSleep });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'collisionFilterGroup', { get: CANNON.BodyOptions.prototype.get_collisionFilterGroup, set: CANNON.BodyOptions.prototype.set_collisionFilterGroup });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'collisionFilterMask', { get: CANNON.BodyOptions.prototype.get_collisionFilterMask, set: CANNON.BodyOptions.prototype.set_collisionFilterMask });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'sleepSpeedLimit', { get: CANNON.BodyOptions.prototype.get_sleepSpeedLimit, set: CANNON.BodyOptions.prototype.set_sleepSpeedLimit });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'sleepTimeLimit', { get: CANNON.BodyOptions.prototype.get_sleepTimeLimit, set: CANNON.BodyOptions.prototype.set_sleepTimeLimit });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'linearDamping', { get: CANNON.BodyOptions.prototype.get_linearDamping, set: CANNON.BodyOptions.prototype.set_linearDamping });
    Object.defineProperty(CANNON.BodyOptions.prototype, 'angularDamping', { get: CANNON.BodyOptions.prototype.get_angularDamping, set: CANNON.BodyOptions.prototype.set_angularDamping });

    Object.defineProperty(CANNON.Body.prototype, 'id', { get: CANNON.Body.prototype.get_id });
    Object.defineProperty(CANNON.Body.prototype, 'material', { get: CANNON.Body.prototype.get_material, set: CANNON.Body.prototype.set_material });
    Object.defineProperty(CANNON.Body.prototype, 'mass', { get: CANNON.Body.prototype.get_mass, set: CANNON.Body.prototype.set_mass });
    Object.defineProperty(CANNON.Body.prototype, 'type', { get: CANNON.Body.prototype.get_type, set: CANNON.Body.prototype.set_type });
    Object.defineProperty(CANNON.Body.prototype, 'allowSleep', { get: CANNON.Body.prototype.get_allowSleep, set: CANNON.Body.prototype.set_allowSleep });
    Object.defineProperty(CANNON.Body.prototype, 'position', { get: CANNON.Body.prototype.get_position, set: CANNON.Body.prototype.set_position });
    Object.defineProperty(CANNON.Body.prototype, 'quaternion', { get: CANNON.Body.prototype.get_quaternion, set: CANNON.Body.prototype.set_quaternion });
    Object.defineProperty(CANNON.Body.prototype, 'velocity', { get: CANNON.Body.prototype.get_velocity, set: CANNON.Body.prototype.set_velocity });
    Object.defineProperty(CANNON.Body.prototype, 'torque', { get: CANNON.Body.prototype.get_torque, set: CANNON.Body.prototype.set_torque });
    Object.defineProperty(CANNON.Body.prototype, 'force', { get: CANNON.Body.prototype.get_force, set: CANNON.Body.prototype.set_force });
    Object.defineProperty(CANNON.Body.prototype, 'angularVelocity', { get: CANNON.Body.prototype.get_angularVelocity, set: CANNON.Body.prototype.set_angularVelocity });
    Object.defineProperty(CANNON.Body.prototype, 'angularFactor', { get: CANNON.Body.prototype.get_angularFactor, set: CANNON.Body.prototype.set_angularFactor });
    Object.defineProperty(CANNON.Body.prototype, 'linearFactor', { get: CANNON.Body.prototype.get_linearFactor, set: CANNON.Body.prototype.set_linearFactor });
    Object.defineProperty(CANNON.Body.prototype, 'fixedRotation', { get: CANNON.Body.prototype.get_fixedRotation, set: CANNON.Body.prototype.set_fixedRotation });
    Object.defineProperty(CANNON.Body.prototype, 'useGravity', { get: CANNON.Body.prototype.get_useGravity, set: CANNON.Body.prototype.set_useGravity });
    Object.defineProperty(CANNON.Body.prototype, 'linearDamping', { get: CANNON.Body.prototype.get_linearDamping, set: CANNON.Body.prototype.set_linearDamping });
    Object.defineProperty(CANNON.Body.prototype, 'collisionResponse', { get: CANNON.Body.prototype.get_collisionResponse, set: CANNON.Body.prototype.set_collisionResponse });
    Object.defineProperty(CANNON.Body.prototype, 'collisionFilterGroup', { get: CANNON.Body.prototype.get_collisionFilterGroup, set: CANNON.Body.prototype.set_collisionFilterGroup });
    Object.defineProperty(CANNON.Body.prototype, 'collisionFilterMask', { get: CANNON.Body.prototype.get_collisionFilterMask, set: CANNON.Body.prototype.set_collisionFilterMask });
    Object.defineProperty(CANNON.Body.prototype, 'aabb', { get: CANNON.Body.prototype.get_aabb });
    Object.defineProperty(CANNON.Body.prototype, 'aabbNeedsUpdate', { get: CANNON.Body.prototype.get_aabbNeedsUpdate, set: CANNON.Body.prototype.set_aabbNeedsUpdate });

    Object.defineProperty(CANNON.Shape.prototype, 'id', { get: CANNON.Shape.prototype.get_id });
    Object.defineProperty(CANNON.Shape.prototype, 'type', { get: CANNON.Shape.prototype.type });
    Object.defineProperty(CANNON.Shape.prototype, 'boundingSphereRadius', { get: CANNON.Shape.prototype.get_boundingSphereRadius });        
    Object.defineProperty(CANNON.Shape.prototype, 'collisionFilterGroup', { get: CANNON.Shape.prototype.get_collisionFilterGroup, set: CANNON.Shape.prototype.set_collisionFilterGroup });
    Object.defineProperty(CANNON.Shape.prototype, 'collisionFilterMask', { get: CANNON.Shape.prototype.get_collisionFilterMask, set: CANNON.Shape.prototype.set_collisionFilterMask });
    Object.defineProperty(CANNON.Shape.prototype, 'collisionResponse', { get: CANNON.Shape.prototype.get_collisionResponse, set: CANNON.Shape.prototype.set_collisionResponse });
    Object.defineProperty(CANNON.Shape.prototype, 'body', { get: CANNON.Shape.prototype.get_body, set: CANNON.Shape.prototype.set_body });
    Object.defineProperty(CANNON.Shape.prototype, 'material', { get: CANNON.Shape.prototype.get_material, set: CANNON.Shape.prototype.set_material });

    Object.defineProperty(CANNON.Box.prototype, 'halfExtents', { get: CANNON.Box.prototype.get_halfExtents, set: CANNON.Box.prototype.set_halfExtents });
    Object.defineProperty(CANNON.Box.prototype, 'convexPolyhedronRepresentation', { get: CANNON.Box.prototype.get_convexPolyhedronRepresentation });

    Object.defineProperty(CANNON.Sphere.prototype, 'radius', { get: CANNON.Sphere.prototype.get_radius, set: CANNON.Sphere.prototype.set_radius });

    Object.defineProperty(CANNON.Plane.prototype, 'worldNormal', { get: CANNON.Plane.prototype.get_worldNormal, set: CANNON.Plane.prototype.set_worldNormal });
    Object.defineProperty(CANNON.Plane.prototype, 'worldNormalNeedsUpdate', { get: CANNON.Plane.prototype.get_worldNormalNeedsUpdate, set: CANNON.Plane.prototype.set_worldNormalNeedsUpdate });
    Object.defineProperty(CANNON.Plane.prototype, 'boundingSphereRadius', { get: CANNON.Plane.prototype.get_boundingSphereRadius, set: CANNON.Plane.prototype.set_boundingSphereRadius });

    Object.defineProperty(CANNON.ConvexPolyhedron.prototype, 'vertices', {get: function(){
        let verticeCount = this.getVerticeCount();
        let vertices = [];
        for (let i = 0; i < verticeCount; ++i) {
            let vertice = this.getVertice(i);
            vertices[i] = vertice;
        }
        return vertices;
    }});

    Object.defineProperty(CANNON.ConvexPolyhedron.prototype, 'faces', {get: function(){
        let faceCount = this.getFaceCount();
        let faces = [];
        for (let i = 0; i < faceCount; ++i) {
            let facePoints = [];
            let facePointCount = this.getFacePointCount(i);
            for (let j = 0; j < facePointCount; ++j) {
                facePoints[j] = this.getFacePoint(i, j);
            }
            faces[i] = facePoints;
        }
        return faces;
    }});

    Object.defineProperty(CANNON.Heightfield.prototype, 'pillarConvex', {get: CANNON.Heightfield.prototype.get_pillarConvex });
    Object.defineProperty(CANNON.Heightfield.prototype, 'pillarOffset', {get: CANNON.Heightfield.prototype.get_pillarOffset });
    Object.defineProperty(CANNON.Heightfield.prototype, 'elementSize', {get: CANNON.Heightfield.prototype.get_elementSize });

    Object.defineProperty(CANNON.Trimesh.prototype, 'vertices', {get: function() {
        let count = this.getVerticeCount();
        let vertices = new Array(count);

        for (let i = 0; i < count; ++i) {
            vertices[i] = this.getVertice(i);
        }

        return vertices;
    } });

    Object.defineProperty(CANNON.Trimesh.prototype, 'indices', {get: function() {
        let count = this.getIndiceCount();
        let indices = new Array(count);

        for (let i = 0; i < count; ++i) {
            indices[i] = this.getIndice(i);
        }

        return indices;
    } });

    Object.defineProperty(CANNON.Material.prototype, 'friction', { get: CANNON.Material.prototype.get_friction, set: CANNON.Material.prototype.set_friction });
    Object.defineProperty(CANNON.Material.prototype, 'restitution', { get: CANNON.Material.prototype.get_restitution, set: CANNON.Material.prototype.set_restitution });

    Object.defineProperty(CANNON.ContactMaterial.prototype, 'friction', { get: CANNON.ContactMaterial.prototype.get_friction, set: CANNON.ContactMaterial.prototype.set_friction });
    Object.defineProperty(CANNON.ContactMaterial.prototype, 'restitution', { get: CANNON.ContactMaterial.prototype.get_restitution, set: CANNON.ContactMaterial.prototype.set_restitution });
    Object.defineProperty(CANNON.ContactMaterial.prototype, 'contactEquationStiffness', { get: CANNON.ContactMaterial.prototype.get_contactEquationStiffness, set: CANNON.ContactMaterial.prototype.set_contactEquationStiffness });
    Object.defineProperty(CANNON.ContactMaterial.prototype, 'contactEquationRelaxation', { get: CANNON.ContactMaterial.prototype.get_contactEquationRelaxation, set: CANNON.ContactMaterial.prototype.set_contactEquationRelaxation });
    Object.defineProperty(CANNON.ContactMaterial.prototype, 'frictionEquationStiffness', { get: CANNON.ContactMaterial.prototype.get_frictionEquationStiffness, set: CANNON.ContactMaterial.prototype.set_frictionEquationStiffness });
    Object.defineProperty(CANNON.ContactMaterial.prototype, 'frictionEquationRelaxation', { get: CANNON.ContactMaterial.prototype.get_frictionEquationRelaxation, set: CANNON.ContactMaterial.prototype.set_frictionEquationRelaxation });

    Object.defineProperty(CANNON.RaycastResult.prototype, 'shape', { get: CANNON.RaycastResult.prototype.get_shape});
    Object.defineProperty(CANNON.RaycastResult.prototype, 'body', { get: CANNON.RaycastResult.prototype.get_body});
    
    Object.defineProperty(CANNON.Vec3.prototype, 'x', { get: CANNON.Vec3.prototype.get_x, set: CANNON.Vec3.prototype.set_x});
    Object.defineProperty(CANNON.Vec3.prototype, 'y', { get: CANNON.Vec3.prototype.get_y, set: CANNON.Vec3.prototype.set_y});
    Object.defineProperty(CANNON.Vec3.prototype, 'z', { get: CANNON.Vec3.prototype.get_z, set: CANNON.Vec3.prototype.set_z});

    CANNON.Vec3.prototype.vadd = function(v, target) {
        target = target || new CANNON.Vec3();
        target.x = this.x + v.x;
        target.y = this.y + v.y;
        target.z = this.z + v.z;
        return target;
    }

    CANNON.Vec3.prototype.vsub = function(v, target) {
        target = target || new CANNON.Vec3();
        target.x = this.x - v.x;
        target.y = this.y - v.y;
        target.z = this.z - v.z;
        return target;
    }

    CANNON.Vec3.prototype.clone = function() {
        let target = new CANNON.Vec3();
        target.x = this.x;
        target.y = this.y;
        target.z = this.z;
        return target;
    }

    Object.defineProperty(CANNON.Equation.prototype, 'bi', { get: CANNON.Equation.prototype.get_bi });
    Object.defineProperty(CANNON.Equation.prototype, 'bj', { get: CANNON.Equation.prototype.get_bj });

    Object.defineProperty(CANNON.AABB.prototype, 'lowerBound', { get: CANNON.AABB.prototype.get_lowerBound });
    Object.defineProperty(CANNON.AABB.prototype, 'upperBound', { get: CANNON.AABB.prototype.get_upperBound });

    Object.defineProperty(CANNON.ContactEquation.prototype, 'si', { get: CANNON.ContactEquation.prototype.get_si });
    Object.defineProperty(CANNON.ContactEquation.prototype, 'sj', { get: CANNON.ContactEquation.prototype.get_sj });
    Object.defineProperty(CANNON.ContactEquation.prototype, 'ni', { get: CANNON.ContactEquation.prototype.get_ni });
    Object.defineProperty(CANNON.ContactEquation.prototype, 'ri', { get: CANNON.ContactEquation.prototype.get_ri });
    Object.defineProperty(CANNON.ContactEquation.prototype, 'rj', { get: CANNON.ContactEquation.prototype.get_rj });

    Object.defineProperty(CANNON.RigidVehicle.prototype, 'chassisBody', {get: CANNON.RigidVehicle.prototype.get_chassisBody});

    Object.defineProperty(CANNON.RigidVehicle.prototype, 'wheelBodies', {
        get: function() {
            let count = this.getWheelBodyCount();
            let wheelBodies = new Array(count);

            for (let i = 0; i < count; ++i) {
                wheelBodies[i] = this.getWheelBody(i);
            }

            return wheelBodies;
        }
    });

    Object.defineProperty(CANNON.WheelInfo.prototype, 'radius', { get: CANNON.WheelInfo.prototype.get_radius});
    Object.defineProperty(CANNON.WheelInfo.prototype, 'worldTransform', { get: CANNON.WheelInfo.prototype.get_worldTransform});

    Object.defineProperty(CANNON.RaycastVehicle.prototype, 'wheelInfos', {
        get: function() {
            let count = this.getWheelCount();
            let wheelInfos = new Array(count);

            for (let i = 0; i < count; ++i) {
                wheelInfos[i] = this.getWheel(i);
            }

            return wheelInfos;
        }
    });

    Object.defineProperty(CANNON.SPHSystem.prototype, 'density', { get: CANNON.SPHSystem.prototype.get_density, set: CANNON.SPHSystem.prototype.set_density });
    Object.defineProperty(CANNON.SPHSystem.prototype, 'smoothingRadius', { get: CANNON.SPHSystem.prototype.get_smoothingRadius, set: CANNON.SPHSystem.prototype.set_smoothingRadius });
    Object.defineProperty(CANNON.SPHSystem.prototype, 'speedOfSound', { get: CANNON.SPHSystem.prototype.get_speedOfSound, set: CANNON.SPHSystem.prototype.set_speedOfSound });
    Object.defineProperty(CANNON.SPHSystem.prototype, 'viscosity', { get: CANNON.SPHSystem.prototype.get_viscosity, set: CANNON.SPHSystem.prototype.set_viscosity });
    Object.defineProperty(CANNON.SPHSystem.prototype, 'eps', { get: CANNON.SPHSystem.prototype.get_eps, set: CANNON.SPHSystem.prototype.set_eps });

    CANNON.dump = function(obj) {
        for (var key in obj) {
            console.info('key:' + key + ' -> ' + obj[key]);
        }
    }

    console.info('cannon wasm wrapper end');

    return CANNON;
}