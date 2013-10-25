window.Shortly = Backbone.View.extend({

    template: _.template(' \
      <h1>Shortly</h1> \
      <div class="navigation"> \
      <ul> \
        <li><a href="" class="index">All Links</a></li> \
        <li><a href="" class="create">Shorten</a></li> \
        <li> \
          <form> \
            <input class="filter" type="text" name="searchText"> \
          </form> \
        </li> \
      </ul> \
      </div> \
      <div id="container"></div>'),

    events: {
        "click li a.index": "indexView",
        "click li a.create": "createView",
        "keyup li input.filter": "renderFilterView"
    },

    initialize: function() {
      console.log("Shortly is running");
      $('body').append(this.render().el);
      this.router = new Shortly.Router({el: this.$el.find('#container')});
      this.router.on('route', this.updateNav, this);

      Backbone.history.start({pushState: true});
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    indexView: function(e) {
      e && e.preventDefault();
      this.router.navigate('/home', {trigger:true});
    },

    createView: function(e) {
      e && e.preventDefault();
      this.router.navigate('/create', {trigger:true});
    },

    renderFilterView: function(e) {
      $.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
      };
      e && e.preventDefault();
      var filterText = $('.filter').val();
      if(filterText){
        $('.link').css("display", "none");
        $('.original:contains('+filterText+')').parent().parent().css("display", "block");
        $('.title:contains('+filterText+')').parent().parent().css("display", "block");
      } else {
        $('.link').css("display", "block");
      }
    },

    updateNav: function(className) {
      // debugger;
      this.$el.find('.navigation li a')
          .removeClass('selected')
          .filter('.' + className)
          .addClass('selected');
    }

});