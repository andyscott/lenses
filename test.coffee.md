    chai   = require 'chai'
    assert = chai.assert
    expect = chai.expect
    chai.should()

    es     = require 'event-stream'
    gutil  = require 'gulp-util'

    {Lense, IndexLenseNode, PathLenseNode} = require './lenses'

    describe 'lense creation', ->

      it 'should take an array', ->
        lense = new Lense ['a', 'b', 'c']
        lense.path.should.have.length 3

      it 'should take varargs of single values', ->
        lense = new Lense 'a', 'b', 'c'
        lense.path.should.have.length 3

      it 'should create path nodes for strings and index nodes for numbers', ->

        lense = new Lense 'a', 1, 'b', 2

        lense.path[0].should.be.an.instanceof PathLenseNode
        lense.path[0].key.should.equal 'a'

        lense.path[1].should.be.an.instanceof IndexLenseNode
        lense.path[1].key.should.equal 1

        lense.path[2].should.be.an.instanceof PathLenseNode
        lense.path[2].key.should.equal 'b'

        lense.path[3].should.be.an.instanceof IndexLenseNode
        lense.path[3].key.should.equal 2


    describe 'Lense.parse creation', ->
      it 'should parse dot notation with object paths', ->

        lense = Lense.parse 'foo.bar.4000'

        lense.path[0].should.be.an.instanceof PathLenseNode
        lense.path[0].key.should.equal 'foo'

        lense.path[1].should.be.an.instanceof PathLenseNode
        lense.path[1].key.should.equal 'bar'

        lense.path[2].should.be.an.instanceof PathLenseNode
        lense.path[2].key.should.equal '4000'

      it 'should parse dot notation with array paths', ->

        lense = Lense.parse '[0][1][4000]'

        lense.path[0].should.be.an.instanceof IndexLenseNode
        lense.path[0].key.should.equal 0

        lense.path[1].should.be.an.instanceof IndexLenseNode
        lense.path[1].key.should.equal 1

        lense.path[2].should.be.an.instanceof IndexLenseNode
        lense.path[2].key.should.equal 4000

      it 'should parse paths with dashes', ->

        lense = Lense.parse 'foo.bar.foo-bar'

        lense.path[0].should.be.an.instanceof PathLenseNode
        lense.path[0].key.should.equal 'foo'

        lense.path[1].should.be.an.instanceof PathLenseNode
        lense.path[1].key.should.equal 'bar'

        lense.path[2].should.be.an.instanceof PathLenseNode
        lense.path[2].key.should.equal 'foo-bar'

    describe 'rendering a lense path', ->

      it 'should be the same as what went in!', ->

        for path in [
          'a.b.c'
          'foo.bar[4000]'
          '[0][0][1][2][4000].foo.bar.a[0].b[2]'
          'bo.jan.gl[3].s'
        ]

          lense = Lense.parse path
          lense.render().should.equal path


    describe 'lense.get', ->

      it 'should return the value for objects with the lense path', ->

        obj = {a: {b: ['foo', 'bar'] }}
        lense = new Lense 'a', 'b', 1
        lense.get(obj).should.equal 'bar'

      it 'should return undefined when the object doesn\'t have the path', ->
        obj = {a: {b: ['foo', 'bar'] }}

        lense1 = new Lense 'a', 'b', 3
        expect(lense1.get(obj)).to.equal undefined

        lense2 = new Lense 'foo', 'bar'
        expect(lense2.get(obj)).to.equal undefined
