    chai   = require 'chai'
    assert = chai.assert
    chai.should()

    es     = require 'event-stream'
    gutil  = require 'gulp-util'

    describe 'this code', ->
      it 'should actually be tested', ->