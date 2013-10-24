window.Shortly = Backbone.View.extend({

    template: _.template(' \
      <h1>Shortly</h1> \
      <div class="navigation"> \
      <ul> \
        <li><a href="#" class="index">All Links</a></li> \
        <li><a href="#" class="create">Shorten</a></li> \
        <li> \
          <form> \
            <input class="filter" type="text" name="searchText"> \
          </form> \
        </li> \
      </ul> \
      </div> \
      <div id="container"></div>'),

    events: {
        "click li a.index": "renderIndexView",
        "click li a.create": "renderCreateView",
        "keyup li input.filter": "renderFilterView"
    },

    initialize: function() {
        console.log("Shortly is running");
        $('body').append(this.render().el);
        this.renderIndexView(); // default view
    },

    render: function() {
        this.$el.html(this.template());
        return this;
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
      // $(this).css("display", "block");
    },

    renderIndexView: function(e) {
        e && e.preventDefault();
        var links = new Shortly.Links();
        var linksView = new Shortly.LinksView({
            collection: links
        });
        this.$el.find('#container').html(linksView.render().el);
        this.updateNav('index');
    },

    renderCreateView: function(e) {
        e && e.preventDefault();
        var linkCreateView = new Shortly.LinkCreateView();
        this.$el.find('#container').html(linkCreateView.render().el);
        this.updateNav('create');
    },

    updateNav: function(className) {
        this.$el.find('.navigation li a')
            .removeClass('selected')
            .filter('.' + className)
            .addClass('selected');
    }

});