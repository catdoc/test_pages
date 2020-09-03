System.register("chunks:///Benchmark.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Vec3, Prefab, Node, Vec2, EditBoxComponent, LabelComponent, ToggleComponent, RigidBodyComponent, profiler, PhysicsSystem, instantiate, randomRange, Component, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _temp, ccclass, property, KEY_INIT_STR, v3_0, Benchmark;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _dec4: void 0,
    _dec5: void 0,
    _dec6: void 0,
    _dec7: void 0,
    _dec8: void 0,
    _dec9: void 0,
    _dec10: void 0,
    _dec11: void 0,
    _dec12: void 0,
    _dec13: void 0,
    _dec14: void 0,
    _dec15: void 0,
    _dec16: void 0,
    _dec17: void 0,
    _dec18: void 0,
    _dec19: void 0,
    _dec20: void 0,
    _dec21: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _descriptor4: void 0,
    _descriptor5: void 0,
    _descriptor6: void 0,
    _descriptor7: void 0,
    _descriptor8: void 0,
    _descriptor9: void 0,
    _descriptor10: void 0,
    _descriptor11: void 0,
    _descriptor12: void 0,
    _descriptor13: void 0,
    _descriptor14: void 0,
    _descriptor15: void 0,
    _descriptor16: void 0,
    _descriptor17: void 0,
    _descriptor18: void 0,
    _descriptor19: void 0,
    _descriptor20: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
      Prefab = _cc.Prefab;
      Node = _cc.Node;
      Vec2 = _cc.Vec2;
      EditBoxComponent = _cc.EditBoxComponent;
      LabelComponent = _cc.LabelComponent;
      ToggleComponent = _cc.ToggleComponent;
      RigidBodyComponent = _cc.RigidBodyComponent;
      profiler = _cc.profiler;
      PhysicsSystem = _cc.PhysicsSystem;
      instantiate = _cc.instantiate;
      randomRange = _cc.randomRange;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3f09bZ6iAhGi7ITvWduO+pN", "Benchmark", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("KEY_INIT_STR", KEY_INIT_STR = "KEY_INIT_STR");

      v3_0 = new Vec3(0, 3, 0);

      _export("Benchmark", Benchmark = (_dec = ccclass("Benchmark"), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Prefab
      }), _dec5 = property({
        type: Prefab
      }), _dec6 = property({
        type: Node
      }), _dec7 = property({
        type: Node
      }), _dec8 = property({
        type: Node
      }), _dec9 = property({
        type: Node
      }), _dec10 = property({
        type: Vec2
      }), _dec11 = property({
        type: Vec2
      }), _dec12 = property({
        type: Vec2
      }), _dec13 = property({
        type: EditBoxComponent
      }), _dec14 = property({
        type: LabelComponent
      }), _dec15 = property({
        type: LabelComponent
      }), _dec16 = property({
        type: ToggleComponent
      }), _dec17 = property({
        type: ToggleComponent
      }), _dec18 = property({
        type: EditBoxComponent
      }), _dec19 = property({
        type: EditBoxComponent
      }), _dec20 = property({
        type: EditBoxComponent
      }), _dec21 = property({
        type: RigidBodyComponent
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(Benchmark, _Component);

        function Benchmark() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, Benchmark);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Benchmark)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "box", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "sphere", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "boxRB", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "sphereRB", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "boxContainer", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "sphereContainer", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "boxRBContainer", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "sphereRBContainer", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "rangeY", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "rangeXZ", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "rangeSize", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "l_editBox", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "l_current", _descriptor13, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "l_engineInfo", _descriptor14, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "r_rotateToggle", _descriptor15, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "r_useFixToggle", _descriptor16, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "r_frameRateEditBox", _descriptor17, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "r_subStepEditBox", _descriptor18, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "r_IntervalEditBox", _descriptor19, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "rotateDynamics", _descriptor20, _assertThisInitialized(_this));

          _this.initBoxCount = 0;
          _this.initSphereCount = 0;
          _this.initBoxRBCount = 0;
          _this.initSphereRBCount = 0;
          _this.intervalCurrent = 0;
          _this.intervalNumber = 0;
          _this.enableRotate = true;
          return _this;
        }

        _createClass(Benchmark, [{
          key: "start",
          value: function start() {
            if (CC_PHYSICS_AMMO) {
              this.l_engineInfo.string = "ammo";
            } else if (CC_PHYSICS_CANNON) {
              this.l_engineInfo.string = "cannon";
            }

            profiler.showStats();
            var item = localStorage.getItem(KEY_INIT_STR);
            var value = '';

            if (item != null && item != '') {
              this.l_editBox.string = value = item;
            } else {
              value = this.l_editBox.string;
            }

            if (value != '') {
              var arr = value.split('-');

              if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                  var count = parseInt(arr[i]);
                  if (isNaN(count)) continue;

                  switch (i) {
                    case 0:
                      this.initBoxCount = count;
                      break;

                    case 1:
                      this.initSphereCount = count;
                      break;

                    case 2:
                      this.initBoxRBCount = count;
                      break;

                    case 3:
                      this.initSphereRBCount = count;
                      break;
                  }
                }
              }
            }

            this.instantiate(this.initBoxCount, this.box, this.boxContainer);
            this.instantiate(this.initSphereCount, this.sphere, this.sphereContainer);
            this.instantiate(this.initBoxRBCount, this.boxRB, this.boxRBContainer);
            this.instantiate(this.initSphereRBCount, this.sphereRB, this.sphereRBContainer);
            this.onRotateToggole(this.r_rotateToggle);
            this.onUseFixTimeToggole(this.r_useFixToggle);
            this.onEditFrameRate(this.r_frameRateEditBox);
            this.onEditSubStep(this.r_subStepEditBox);
            this.onEditInterval(this.r_IntervalEditBox);
          }
        }, {
          key: "update",
          value: function update() {
            if (this.intervalCurrent == 0) {
              PhysicsSystem.instance.enable = true;
              this.intervalCurrent = this.intervalNumber;
            } else {
              this.intervalCurrent--;
              PhysicsSystem.instance.enable = false;
            }

            if (this.enableRotate) this.rotateDynamics.setAngularVelocity(v3_0);else this.rotateDynamics.setAngularVelocity(Vec3.ZERO);
          }
        }, {
          key: "instantiate",
          value: function instantiate(count, prefab, container) {
            for (var i = 0; i < count; i++) {
              this.instantiateSingle(prefab, container);
            }
          }
        }, {
          key: "instantiateSingle",
          value: function instantiateSingle(prefab, container) {
            var entity = instantiate(prefab);
            this.resetTransformSingle(entity);
            container.addChild(entity);
            this.updateCurrentLab();
          }
        }, {
          key: "resetTransforms",
          value: function resetTransforms() {
            for (var i = 0; i < this.boxContainer.children.length; i++) {
              var entity = this.boxContainer.children[i];
              this.resetTransformSingle(entity);
            }

            for (var _i = 0; _i < this.sphereContainer.children.length; _i++) {
              var _entity = this.sphereContainer.children[_i];
              this.resetTransformSingle(_entity);
            }

            for (var _i2 = 0; _i2 < this.boxRBContainer.children.length; _i2++) {
              var _entity2 = this.boxRBContainer.children[_i2];
              this.resetTransformSingle(_entity2);
            }

            for (var _i3 = 0; _i3 < this.sphereRBContainer.children.length; _i3++) {
              var _entity3 = this.sphereRBContainer.children[_i3];
              this.resetTransformSingle(_entity3);
            }
          }
        }, {
          key: "resetTransformSingle",
          value: function resetTransformSingle(entity) {
            var y = randomRange(this.rangeY.x, this.rangeY.y);
            var x = randomRange(this.rangeXZ.x, this.rangeXZ.y);
            var z = randomRange(this.rangeXZ.x, this.rangeXZ.y);
            entity.setWorldPosition(x, y, z);
            x = randomRange(0, 360);
            y = randomRange(0, 360);
            z = randomRange(0, 360);
            entity.setRotationFromEuler(x, y, z);

            if (Math.random() > 0.3) {
              x = randomRange(this.rangeSize.x, this.rangeSize.y);
              y = randomRange(this.rangeSize.x, this.rangeSize.y);
              z = randomRange(this.rangeSize.x, this.rangeSize.y);

              if (entity.name == "Sphere" || entity.name == "Sphere-RB") {
                entity.setWorldScale(x, x, x);
              } else {
                entity.setWorldScale(x, y, z);
              }
            }
          }
        }, {
          key: "updateCurrentLab",
          value: function updateCurrentLab() {
            var a = this.boxContainer.children.length;
            var b = this.sphereContainer.children.length;
            var c = this.boxRBContainer.children.length;
            var d = this.sphereRBContainer.children.length;
            this.l_current.string = "目前数量：" + a + "-" + b + "-" + c + "-" + d;
          }
        }, {
          key: "onAddBox",
          value: function onAddBox(touch, custom) {
            this.instantiateSingle(this.box, this.boxContainer);
          }
        }, {
          key: "onAddSphere",
          value: function onAddSphere(touch, custom) {
            this.instantiateSingle(this.sphere, this.sphereContainer);
          }
        }, {
          key: "onAddBoxRB",
          value: function onAddBoxRB(touch, custom) {
            this.instantiateSingle(this.boxRB, this.boxRBContainer);
          }
        }, {
          key: "onAddSphereRB",
          value: function onAddSphereRB(touch, custom) {
            this.instantiateSingle(this.sphereRB, this.sphereRBContainer);
          }
        }, {
          key: "onEditFinish",
          value: function onEditFinish(editBox) {
            var str = editBox.string;

            if (str != '') {
              localStorage.setItem(KEY_INIT_STR, str);
            }
          }
        }, {
          key: "onReset",
          value: function onReset(touch, custom) {
            this.resetTransforms();
          }
        }, {
          key: "onRotateToggole",
          value: function onRotateToggole(toggle) {
            this.enableRotate = toggle.isChecked;
          }
        }, {
          key: "onUseFixTimeToggole",
          value: function onUseFixTimeToggole(toggle) {
            if (toggle.isChecked) {
              PhysicsSystem.instance.useFixedTime = true;
              this.r_subStepEditBox.node.active = false;
            } else {
              PhysicsSystem.instance.useFixedTime = false;
              this.r_subStepEditBox.node.active = true;
            }
          }
        }, {
          key: "onEditFrameRate",
          value: function onEditFrameRate(editBox) {
            var v = parseInt(editBox.string);
            if (isNaN(v)) return;

            if (v > 0) {
              PhysicsSystem.instance.deltaTime = 1 / v;
            }
          }
        }, {
          key: "onEditSubStep",
          value: function onEditSubStep(editBox) {
            var v = parseInt(editBox.string);
            if (isNaN(v)) return;

            if (v >= 0) {
              PhysicsSystem.instance.maxSubStep = v;
            }
          }
        }, {
          key: "onEditInterval",
          value: function onEditInterval(editBox) {
            var v = parseInt(editBox.string);
            if (isNaN(v)) return;

            if (v >= 0) {
              this.intervalNumber = v;
            }
          }
        }]);

        return Benchmark;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "box", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sphere", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boxRB", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sphereRB", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "boxContainer", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sphereContainer", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "boxRBContainer", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "sphereRBContainer", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rangeY", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec2(10, 100);
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rangeXZ", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec2(-50, 50);
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "rangeSize", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec2(0.5, 5);
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "l_editBox", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "l_current", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "l_engineInfo", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "r_rotateToggle", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "r_useFixToggle", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "r_frameRateEditBox", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "r_subStepEditBox", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "r_IntervalEditBox", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "rotateDynamics", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///PhysicsEnvCheck.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _inherits, _createClass, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, cclegacy, _decorator, Enum, LabelComponent, SpriteComponent, Component, _dec, _dec2, _class, _temp, ccclass, property, menu, EPhysicsItem, PhysicsEnvCheck;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _temp: void 0,
    EPhysicsItem: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Enum = _cc.Enum;
      LabelComponent = _cc.LabelComponent;
      SpriteComponent = _cc.SpriteComponent;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "82e3e225yFKdIejB4TVS7Ys", "PhysicsEnvCheck", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;
      menu = _decorator.menu;

      (function (EPhysicsItem) {
        EPhysicsItem[EPhysicsItem["BUILTIN"] = 1] = "BUILTIN";
        EPhysicsItem[EPhysicsItem["CANNON"] = 2] = "CANNON";
        EPhysicsItem[EPhysicsItem["AMMO"] = 4] = "AMMO";
        EPhysicsItem[EPhysicsItem["CANNON_AMMO"] = EPhysicsItem.CANNON + EPhysicsItem.AMMO] = "CANNON_AMMO";
        EPhysicsItem[EPhysicsItem["ALL"] = -1] = "ALL";
      })(EPhysicsItem || (EPhysicsItem = {}));

      Enum(EPhysicsItem);

      _export("PhysicsEnvCheck", PhysicsEnvCheck = (_dec = ccclass("PhysicsEnvCheck"), _dec2 = menu("physics/PhysicsEnvCheck"), _dec(_class = _dec2(_class = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(PhysicsEnvCheck, _Component);

        function PhysicsEnvCheck() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, PhysicsEnvCheck);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PhysicsEnvCheck)).call.apply(_getPrototypeOf2, [this].concat(args)));
          _this.physics = EPhysicsItem.CANNON_AMMO;
          return _this;
        }

        _createClass(PhysicsEnvCheck, [{
          key: "onLoad",
          value: function onLoad() {
            if (CC_PHYSICS_BUILTIN) {
              var lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);
              lbCom.string = "当前物理：builtin";
            } else if (CC_PHYSICS_CANNON) {
              var _lbCom = this.node.getChildByName('desc').getComponent(LabelComponent);

              _lbCom.string = "当前物理：cannon wasm";
            } else if (CC_PHYSICS_AMMO) {
              var _lbCom2 = this.node.getChildByName('desc').getComponent(LabelComponent);

              _lbCom2.string = "当前物理：ammo.js";
            } else {
              var _lbCom3 = this.node.getChildByName('desc').getComponent(LabelComponent);

              _lbCom3.string = "当前物理：none";
            }

            var name = this.node.name;

            if (name == "cannon-ammo") {
              this.physics = EPhysicsItem.CANNON_AMMO;
            } else if (name == "builtin") {
              this.physics = EPhysicsItem.BUILTIN;
            } else if (name == "cannon") {
              this.physics = EPhysicsItem.CANNON;
            } else if (name == "ammo") {
              this.physics = EPhysicsItem.AMMO;
            } else if (name == "builtin-cannon-ammo") {
              this.physics = EPhysicsItem.ALL;
            }

            switch (this.physics) {
              case EPhysicsItem.ALL:
                break;

              case EPhysicsItem.CANNON_AMMO:
                if (CC_PHYSICS_CANNON || CC_PHYSICS_AMMO) {
                  break;
                }

                var _lbCom4 = this.node.getChildByName('lb').getComponent(LabelComponent);

                _lbCom4.enabled = true;
                _lbCom4.string = "测试此场景需要将物理模块设置为 cannon.js 或 ammo.js";
                var sprCom = this.getComponentInChildren(SpriteComponent);
                sprCom.enabled = true;
                break;

              case EPhysicsItem.CANNON:
                if (!CC_PHYSICS_CANNON) {
                  var _lbCom5 = this.node.getChildByName('lb').getComponent(LabelComponent);

                  _lbCom5.enabled = true;
                  _lbCom5.string = "测试此场景需要将物理模块设置为 cannon.js";

                  var _sprCom = this.getComponentInChildren(SpriteComponent);

                  _sprCom.enabled = true;
                }

                break;

              case EPhysicsItem.AMMO:
                if (!CC_PHYSICS_AMMO) {
                  var _lbCom6 = this.node.getChildByName('lb').getComponent(LabelComponent);

                  _lbCom6.enabled = true;
                  _lbCom6.string = "测试此场景需要将物理模块设置为 ammo.js";

                  var _sprCom2 = this.getComponentInChildren(SpriteComponent);

                  _sprCom2.enabled = true;
                }

                break;

              case EPhysicsItem.BUILTIN:
                if (!CC_PHYSICS_BUILTIN) {
                  var _lbCom7 = this.node.getChildByName('lb').getComponent(LabelComponent);

                  _lbCom7.enabled = true;
                  _lbCom7.string = "测试此场景需要将物理模块设置为 builtin";

                  var _sprCom3 = this.getComponentInChildren(SpriteComponent);

                  _sprCom3.enabled = true;
                }

                break;
            }
          }
        }]);

        return PhysicsEnvCheck;
      }(Component), _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/prerequisite-imports:main", ["../Benchmark.js", "../PhysicsEnvCheck.js"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_BenchmarkJs) {}, function (_PhysicsEnvCheckJs) {}],
    execute: function () {}
  };
});

(function(r) {
  r('project:///assets/scripts/Benchmark.js', 'chunks:///Benchmark.js');
  r('project:///assets/scripts/PhysicsEnvCheck.js', 'chunks:///PhysicsEnvCheck.js');
  r('virtual:///prerequisite-imports:main', 'chunks:///_virtual/prerequisite-imports:main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    var _m;
    return {
        setters: [function(m) { _m = m; }],
        execute: function () { _export(_m); }
    };
    });
});