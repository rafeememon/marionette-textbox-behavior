(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone.marionette', 'underscore'], factory);
  } else if (typeof exports !== 'undefined') {
    Marionette = require('backbone.marionette');
    _ = require('underscore');
    module.exports = factory(Marionette, _);
  } else {
    root.TextBoxBehavior = factory(root.Marionette, root._);
  }
})(this, function (Marionette, _) {

  return Marionette.Behavior.extend({

    defaults: {
      selector: null,
      modelField: null
    },

    modelEvents: function() {
      var modelEvents = {};
      modelEvents['change:' + this.getOption('modelField')] = '_updateView';
      return modelEvents;
    },

    events: {
      'change @ui.el': '_updateModel',
      'keydown @ui.el': '_updateModel',
      'keypress @ui.el': '_updateModel',
      'cut @ui.el': '_updateModel',
      'paste @ui.el': '_updateModel',
      'drop @ui.el': '_updateModel'
    },

    ui: function() {
      return {el: this.getOption('selector')};
    },

    initialize: function() {
      if (!this.getOption('selector')) {
        throw new Error('Must specify selector in TextBoxBehavior');
      }
      if (!this.getOption('modelField')) {
        throw new Error('Must specify modelField in TextBoxBehavior');
      }
    },

    onRender: function() {
      this._updateView();
    },

    _updateView: function() {
      var modelField = this.getOption('modelField');
      var value = this.view.model.get(modelField) || '';
      if (this.ui.el.val() != value) {
        this.ui.el.val(value);
      }
    },

    _updateModel: function() {
      _.defer(function (that) {
        if (that.ui.el) {
          var modelField = that.getOption('modelField');
          var value = that.ui.el.val();
          that.view.model.set(modelField, value);
        }
      }, this);
    }

  });

});
