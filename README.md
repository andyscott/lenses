Lenses for javascript.

Minimal, and no external dependencies (except for building/testing).

#Licensing
See the [license](LICENSE.md) for licensing.

#Example

    var Lense = require('lense').Lense
    lense = Lense.parse('foo.bar[1].a')

    obj = {
      "foo": {
        "bar": [
          1,
          { "a": 2 }
        ]
      }
    }

    console.log(lense.get(obj)) // > 2
    lense.set(obj, 4000)
    console.log(lense.get(obj)) // > 4000

#Documentation
See the [source](lenses.coffee.md) for more documentation.