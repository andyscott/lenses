var IndexLenseNode, Lense, LenseNode, PathLenseNode,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Lense = (function() {
  function Lense(path) {
    var convert, item;
    convert = function(node) {
      switch (typeof node) {
        case 'string':
          return new PathLenseNode(node);
        case 'number':
          return new IndexLenseNode(node);
        default:
          return node;
      }
    };
    this.path = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        item = path[_i];
        _results.push(convert(item));
      }
      return _results;
    })();
  }

  Lense.prototype.render = function() {
    var joined, part, path, _i, _len;
    path = this.path.slice(0);
    joined = path.splice(0, 1)[0].renderKey();
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      part = path[_i];
      joined = joined + part.renderSep() + part.renderKey();
    }
    return joined;
  };

  Lense.prototype.get = function(o) {
    var part, _i, _len, _ref;
    _ref = this.path;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      if (o == null) {
        break;
      }
      o = part.get(o);
    }
    return o;
  };

  Lense.prototype.set = function(o, v) {
    var cp, i, np, o2, _i, _ref, _ref1;
    for (i = _i = 0, _ref = this.path.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _ref1 = this.path.slice(i, +(i + 1) + 1 || 9e9), cp = _ref1[0], np = _ref1[1];
      o2 = cp.get(o);
      if ((o2 == null) || typeof o2 !== 'object') {
        o2 = cp.set(o, np.empty());
      }
      o = o2;
    }
    return this.path[this.path.length - 1].set(o, v);
  };

  Lense.prototype.del = function(o) {
    var cp, i, np, o2, _i, _ref, _ref1;
    for (i = _i = 0, _ref = this.path.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _ref1 = this.path.slice(i, +(i + 1) + 1 || 9e9), cp = _ref1[0], np = _ref1[1];
      o2 = cp.get(o);
      if ((o2 == null) || typeof o2 !== 'object') {
        return;
      }
      o = o2;
    }
    return this.path[this.path.length - 1].del(o);
  };

  return Lense;

})();

LenseNode = (function() {
  function LenseNode(key) {
    this.key = key;
  }

  LenseNode.prototype.get = function(o) {
    return o[this.key];
  };

  LenseNode.prototype.set = function(o, v) {
    return o[this.key] = v;
  };

  LenseNode.prototype.del = function(o) {
    return delete o[this.key];
  };

  return LenseNode;

})();

IndexLenseNode = (function(_super) {
  __extends(IndexLenseNode, _super);

  function IndexLenseNode() {
    return IndexLenseNode.__super__.constructor.apply(this, arguments);
  }

  IndexLenseNode.prototype.renderKey = function() {
    return "[" + this.key + "]";
  };

  IndexLenseNode.prototype.renderSep = function() {
    return '';
  };

  IndexLenseNode.prototype.empty = function() {
    return [];
  };

  return IndexLenseNode;

})(LenseNode);

PathLenseNode = (function(_super) {
  __extends(PathLenseNode, _super);

  function PathLenseNode() {
    return PathLenseNode.__super__.constructor.apply(this, arguments);
  }

  PathLenseNode.prototype.renderKey = function() {
    return this.key;
  };

  PathLenseNode.prototype.renderSep = function() {
    return '.';
  };

  PathLenseNode.prototype.empty = function() {
    return {};
  };

  return PathLenseNode;

})(LenseNode);

exports.Lense = Lense;

exports.IndexLenseNode = IndexLenseNode;

exports.PathLenseNode = PathLenseNode;
