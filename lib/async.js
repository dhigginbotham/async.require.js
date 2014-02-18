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
      dom.parentNode.insertBefore(script, dom);
    } else {
      return fn(new Error('Missing script url'), null);
    }
  };
  /**
   * build link/style element to dom
   * {url} accepts string for script
   * {fn} callback function
   */
  priv.buildStyleElem = function(url, fn) {
    var style, ready, dom;
    if (url) {
      ready = false;
      style = document.createElement('link');
      style.href = url;
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.onload = style.onreadystatechange = function() {
        if (!ready && (!this.readyState || this.readState == 'complete')) {
          ready = true;
          return fn(null, ready);
        }
      };
      dom = document.getElementsByTagName(async.container)[0];
      dom.parentNode.insertBefore(style, dom);
    } else {
      return fn(new Error('Missing style url'), null);
    }
  };

  /**
   * initializes the buildScriptElem
   * {url} accepts string for script
   * {fn} callback function
   */
  priv.load = function(url, fn) {
    if (getIndex(loadedScripts, url) == -1) {
      var src = url.replace(/https?:\/\//i, '//');
      var type = (/.css/.test(url) ? 'style' : 'script');
      loadedScripts.push(url);
      console.log(type);
      if (type == 'style') {
        priv.buildStyleElem(src, function(err, ready) {
          priv.count++;
          if (priv.count == loadedScripts.length) {
            return fn(err, ready);
          }
        });
      } else {
        priv.buildScriptElem(src, function(err, ready) {
          priv.count++;
          if (priv.count == loadedScripts.length) {
            return fn(err, ready);
          }
        });
      }
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

  /**
   * getIndex is a simple Array.indexOf
   * shim for lame browsers.
   * {arr}    accepts array to find index of
   * {value}  value to match for index
   */
  var getIndex = function(arr, value) {
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] == value) {
        return i;
      } else continue;
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