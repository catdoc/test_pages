// (function() {

let loadScript = function (url) {
    return new Promise(function (resolve, reject) {
        var err;
        function windowErrorListener(evt) {
            if (evt.filename === url) {
                console.warn('loadScript error: ' + url);
                err = evt.error;
            }
        }
        window.addEventListener('error', windowErrorListener);
        var script = document.createElement('script');
        script.charset = 'utf-8';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.addEventListener('error', function () {
            window.removeEventListener('error', windowErrorListener);
            reject(Error('Error loading ' + url));
        });
        script.addEventListener('load', function () {
            console.warn('loadScript done: ' + url);
            window.removeEventListener('error', windowErrorListener);
            document.head.removeChild(script);
            // Note that if an error occurs that isn't caught by this if statement,
            // that getRegister will return null and a "did not instantiate" error will be thrown.
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        script.src = url;
        document.head.appendChild(script);
    });
};

let jsList = [
    "../build/cannon.demo.js",
    "../libs/dat.gui.js",
    "../libs/Three.js",
    "../libs/TrackballControls.js",
    "../libs/Detector.js",
    "../libs/Stats.js",
    "../libs/smoothie.js"
    ];

// Load all project scripts (built by creator)
let loadJsListModules = function (jsList) {
  // jsList
  var promise = Promise.resolve();
  if (jsList) {
      jsList.forEach(function (x) {
          promise = promise.then(function () {
              //return prepare.loadIIFE(boot.jsListRoot + '/' + x);
              return loadScript(x);
          });
      });
  }
  return promise;
}

let addScript = function(url) {
    var script = document.createElement('script');
    //script.charset = 'utf-8';
    //script.async = true;
    //script.crossOrigin = 'anonymous';
    script.src = url;
    document.appendChild(script);
}

runDemo = function(startFn) {

    CANNON().then(function(CANNON) {
        console.warn('wasm cannon init ' + CANNON.World);
        // window.WASM_CANNON = wrapCANNON(CANNON);
        // window.CANNON = window.WASM_CANNON;
        // console.warn('world.wasm cannon = ' + window.WASM_CANNON.World);

        console.warn('window = ' + typeof(window) + ' , self = ' + typeof(self));
        if (typeof(window) !== 'undefined') {
            window.WASM_CANNON = wrapCANNON(CANNON);
            window.CANNON = window.WASM_CANNON;
            console.warn('world.wasm cannon = ' + window.WASM_CANNON.World);
        }
        else if (typeof(self) !== 'undefined') {
            self.WASM_CANNON = wrapCANNON(CANNON);
            self.CANNON = self.WASM_CANNON;
            console.warn('world.wasm cannon = ' + self.WASM_CANNON.World);
        }
        
    }).then( function () {
        if (typeof(window) !== 'undefined') {
            return loadJsListModules(jsList);
        }
        else {
            return true;
        }
        }).then(function(){

          startFn();

        }).catch(function (error) {
            console.error("Load project module error: \n" + error + ', stack = ' + error.stack);
        } );
  }

// })();