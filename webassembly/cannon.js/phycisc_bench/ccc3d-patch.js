(function(){

if (typeof yyrt === 'undefined') {
    return;
}

if (!yyrt.getRuntimeVersion) {
    console.error('yyrt.getRuntimeVersion is not found!');
    return;
}

var version = yyrt.getRuntimeVersion();
console.log('Runtime version: ' + version);
var versionArr = version.split('.');
if (!versionArr || versionArr.length !== 3) {
    console.error('Wrong runtime version: ' + version);
    return;
}


var gl = window.__ccgl;
var majorVersion = parseInt(versionArr[0]);
var featureVersion = parseInt(versionArr[1]);
var patchVersion = parseInt(versionArr[2]);

function needPatchForVersionsLessThan(mV, fV, pV) {
    if (majorVersion < mV) {
        return true;
    }
    else if (majorVersion > mV) {
        return false;
    }

    if (featureVersion < fV) {
        return true;
    }
    else if (featureVersion > fV) {
        return false;
    }

    if (patchVersion < pV) {
        return true;
    }

    return false;
}


var needPatchLowerThan_3_0_1 = needPatchForVersionsLessThan(3, 0, 1);
console.info('ccc3d path, needPatchLowerThan_3_0_1: ' + needPatchLowerThan_3_0_1);
if (needPatchLowerThan_3_0_1) {

    var pathname = window.location.pathname;
    var host = window.location.host;
    var url = window.location.href;

    if (pathname === '/' && url.indexOf(host + '/') === -1) {
        window.location.href = url.replace(host, host + '/');
    }

    var _allScriptElementsWithSystemJSImportType = [];

    HTMLScriptElement.prototype._innerHTML = '';
    HTMLScriptElement.prototype._scriptType = '';
    HTMLScriptElement.prototype._needEvaluteBuffer = true;

    HTMLScriptElement.prototype._evaluateBuffer = function() {
        if (this._needEvaluteBuffer && this._innerHTML) {
            yyrt.evalString(this._innerHTML);
            this._needEvaluteBuffer = false;
        }
    };

    Object.defineProperty(HTMLScriptElement.prototype, 'innerHTML', {
        set: function(v) {
            this._innerHTML = v;
            setTimeout(()=>{
                this._evaluateBuffer();
            }, 0);
        },

        get: function() {
            return this._innerHTML;
        },

        configurable: true,
        enumerable: true
    });

    Object.defineProperty(HTMLScriptElement.prototype, 'text', {
        set: function(v) {
            this.innerHTML = v;
        },

        get: function() {
            return this._innerHTML;
        },

        configurable: true,
        enumerable: true
    });

    Object.defineProperty(HTMLScriptElement.prototype, 'type', {
        set: function(v) {
            this._scriptType = v;
            if (this._scriptType === 'systemjs-importmap') {
                //TODO: how to release it, do we need to release ?
                _allScriptElementsWithSystemJSImportType.push(this);
                this._needEvaluteBuffer = false;
            }
        },

        get: function() {
            return this._scriptType;
        },

        configurable: true,
        enumerable: true
    });

    HTMLScriptElement._getAllScriptElementsSystemJSImportType = function() {
        return _allScriptElementsWithSystemJSImportType;
    };

    var oldDocuementQuerySelectorAll = document.querySelectorAll;

    document.querySelectorAll = function(query) {
        if (query === 'script[type="systemjs-importmap"]') {
            return HTMLScriptElement._getAllScriptElementsSystemJSImportType();
        }

        return oldDocuementQuerySelectorAll.apply(this, arguments);
    };

    var oldFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function() {
        if (typeof(arguments[0]) !== 'string') {
            arguments[0] = '' + arguments[0];
        }
        oldFillText.apply(this, arguments);
    };

    var oldStrokeText = CanvasRenderingContext2D.prototype.strokeText;
    CanvasRenderingContext2D.prototype.strokeText = function() {
        if (typeof(arguments[0]) !== 'string') {
            arguments[0] = '' + arguments[0];
        }
        oldStrokeText.apply(this, arguments);
    };

    var oldMeasureText = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function() {
        if (typeof(arguments[0]) !== 'string') {
            arguments[0] = '' + arguments[0];
        }
        return oldMeasureText.apply(this, arguments);
    };

    var oldAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
        oldAudioPlay.apply(this, arguments);

        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve();
            }, 0);
        });
    };

} // if (needPatchLowerThan_3_0_1) {

if (yyrt.ensureCorrectDefaultViewportAndScissor) {
    var oldEnsure = yyrt.ensureCorrectDefaultViewportAndScissor;
    yyrt.ensureCorrectDefaultViewportAndScissor = function() {
        if (!yyrt._mainCanvas) {
            return;
        }

        if (window.cc && cc.game && !cc.game.container) {
            console.warn('cc.game.container is null');
            return;
        }

        oldEnsure.apply(this, arguments);
    }
}

})();