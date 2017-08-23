```lang-none
Lenses. For javascript. See LICENSE.md for licensing.
```

# Lenses
*authors: Andy Scott*

A half assed implementation of lenses... in Coffeescript.

Lenses consist of a getter and setter method. The getter (`get`) and setter
(`set`) are performed to a specific path. A single lense can get
and set the same path on mulitple different objects.


## Lense

    class Lense

A lense can be created by calling `Lense.parse` with a dot notation string to
describe the path.

      @parse: (pathString) ->

        path = []

Parse will loop through the path string, finding path elements and pushing them
into a new path array.

        r = /^(?:\.?([\w_-]+)|\[(\d+)\])(.*)?$/
        loop
          matches = r.exec pathString
          if matches[1] then path.push matches[1]
          else if matches[2] then path.push parseInt matches[2]
          pathString = matches[3]
          break unless pathString

        new Lense path

A lense can also be created more directly by using the contructor using an array
path. For example: `['a', 'b', 1, 'd']` would create a lense to get and set
`obj.a.b[1].d`, where `obj` is the first parameter to the get and set methods.

      constructor: (path) ->
        if arguments.length isnt 1
          path = (arg for arg in arguments)

Internally the path is represented as Path and Index lense nodes. String means
path lookup, number means index lookup.

        convert = (node) ->
          switch typeof node
            when 'string' then new PathLenseNode(node)
            when 'number' then new IndexLenseNode(node)
            else node

Store the converted path.

        @path = (convert(item) for item in path)

#### get
Get the value from object `o` at the lense path.

      get: (o) ->
        for part in @path
          break unless o?
          o = part.get o
        o

#### set
Set value `v` on object `o` at the lense path.

      set: (o, v) ->
        for i in [0 ... @path.length - 1]
          [cp, np] = @path[i .. i + 1]
          o2 = cp.get o
          if not o2? || typeof o2 != 'object'
            o2 = cp.set o, np.empty()
          o = o2
        @path[@path.length - 1].set o, v


#### del
Delete the value on object `o` at the lense path.

      del: (o) ->
        for i in [0 ... @path.length - 1]
          [cp, np] = @path[i .. i + 1]
          o2 = cp.get o
          if not o2? || typeof o2 != 'object' then return
          o = o2
        @path[@path.length - 1].del o

#### render
Utility function to render the lense path as dot notation.

      render: () ->
        path = @path.slice 0
        joined = path.splice(0, 1)[0].renderKey()
        for part in path
          joined = joined + part.renderSep() + part.renderKey()
        joined

## Lense Nodes
These are used internally. However, you can pass them directly to the `Lense`
constructor instead of strings and numbers if you want.

A general lense path node with a key value.

    class LenseNode
      constructor: (@key) ->
      get        : (o)    -> o[@key]
      set        : (o, v) -> o[@key] = v
      del        : (o)    -> delete o[@key]

    class IndexLenseNode extends LenseNode
      renderKey  : -> "[#{@key}]"
      renderSep  : -> ''
      empty      : -> []

    class PathLenseNode extends LenseNode
      renderKey  : -> @key
      renderSep  : -> '.'
      empty      : -> {}


    exports.Lense          = Lense
    exports.IndexLenseNode = IndexLenseNode
    exports.PathLenseNode  = PathLenseNode
