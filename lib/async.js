/**
 * async loader
 * author: dhigginbotham
 */

(function(root) {

  /**
   * public api
   */
  var async = {};

  /**
   * internal private methods, these aren't
   * avail outside of the async api.
   */
  var priv = {};

  /**
   * count for scripts loaded, this makes sure
   * all assets are loaded before it fires ready
   */
  priv.count = 0;

  /**
   * scripts already loaded, because we
   * don't want duplicate loads
   */
  var loadedScripts = [];

  /**
   * default element for scripts
   */
  async.container = 'body';

  /**
   * build script element to dom
   * {url} accepts string for script
   * {fn} callback function
   */
  priv.buildScriptElem = function(url, fn) {
    var script, ready, dom;
    if (url) {
      ready = false;
      script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true;
      script.onload = script.onreadystatechange = function() {
        if (!ready && (!this.readyState || this.readyState == 'complete')) {
          ready = true;
          return fn(null, ready);
        }
      };
      dom = document.getElementsByTagName(async.container)[0];
      dom.appendChild(script);
    } else {
      return fn(new Error('Missing script url'), null);
    }
  };

  /**
   * initializes the buildScriptElem
   * {url} accepts string for script
   * {fn} callback function
   */
  priv.load = function(url, fn) {
    if (getIndex(loadedScripts, url) == -1) {
      var script = url.replace(/https?:\/\//i, '//');
      loadedScripts.push(url);
      priv.buildScriptElem(script, function(err, ready) {
        priv.count++;
        if (priv.count == loadedScripts.length) {
          return fn(err, ready);
        }
      });
    }
  };

  /**
   * get current scripts loaded to dom
   */
  async.scripts = function() {
    return loadedScripts;
  };

  /**
   * public api to require items
   * {arr} accepts a string or an array
   * {fn} callback function
   */
  async.require = function(arr, fn) {
    var url = arr;
    var ln = url.length;
    if (typeof url != 'string' && ln) {
      for (var i = 0; i < ln; ++i) {
        priv.load(url[i], function(err, rdy) {
          fn(err, rdy);
        });
      }
    } else {
      priv.load(url, function(err, rdy) {
        fn(err, rdy);
      });
    }
  };

  var getIndex = function(arr, value) {
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] == value) return i;
    }
    return -1;
  };

  /**
   * expose public api
   */
  if (typeof module != 'undefined' && module.exports) {
    module.exports = async;
  } else {
    root.async = async;
  }

}(window));