describe('marionette-textbox-behavior', function() {

  TextBoxView = Marionette.ItemView.extend({
    template: function() {
      return '<input type="text">';
    },
    ui: {
      textbox: '> input'
    },
    behaviors: [
      {
        behaviorClass: TextBoxBehavior,
        selector: '> input',
        modelField: 'text'
      }
    ]
  });

  before(function() {
    this.region = new Marionette.Region({el: '#fixture'});
    this.setupView = function (model) {
      var view = new TextBoxView({model: model});
      this.region.show(view);
      return view;
    }
  });

  after(function() {
    this.region.reset();
  });

  var TEST_TEXT = 'wow';
  var TEST_TEXT_2 = 'amaze';

  describe('initial state', function() {
    it('should show the text when the value is set', function() {
      var model = new Backbone.Model({text: TEST_TEXT});
      var view = this.setupView(model);
      expect(view.ui.textbox.val()).to.equal(TEST_TEXT);
    });
    it('should be empty when the value is not set', function() {
      var model = new Backbone.Model({text: null});
      var view = this.setupView(model);
      expect(view.ui.textbox.val()).to.be.empty;
    });
  });

  describe('changing state from model', function() {
    it('should update when the value changes', function() {
      var model = new Backbone.Model({text: TEST_TEXT});
      var view = this.setupView(model);
      model.set('text', TEST_TEXT_2);
      expect(view.ui.textbox.val()).to.equal(TEST_TEXT_2);
    });
    it('should update when the value changes from unset to set', function() {
      var model = new Backbone.Model({text: null});
      var view = this.setupView(model);
      model.set('text', TEST_TEXT);
      expect(view.ui.textbox.val()).to.equal(TEST_TEXT);
    });
    it('should update when the value changes from set to unset', function() {
      var model = new Backbone.Model({text: TEST_TEXT});
      var view = this.setupView(model);
      model.set('text', null);
      expect(view.ui.textbox.val()).to.be.empty;
    });
  });

  describe('changing state from view', function() {
    function testViewEvent(eventName, done) {
      var model = new Backbone.Model({text: TEST_TEXT});
      var view = this.setupView(model);
      view.ui.textbox.val(TEST_TEXT_2).trigger(eventName);
      setTimeout(function() {
        expect(model.get('text')).to.equal(TEST_TEXT_2);
        done();
      }, 10);
    }

    it('should update when the view value changes', function(done) {
      testViewEvent.call(this, 'change', done);
    });
    it('should update when a key is pressed down', function(done) {
      testViewEvent.call(this, 'keydown', done);
    });
    it('should update when a key is pressed', function(done) {
      testViewEvent.call(this, 'keypress', done);
    });
    it('should update when the view value is cut', function(done) {
      testViewEvent.call(this, 'cut', done);
    });
    it('should update when the view value is pasted', function(done) {
      testViewEvent.call(this, 'paste', done);
    });
    it('should update when the view value is dropped', function(done) {
      testViewEvent.call(this, 'drop', done);
    });
  });

});
