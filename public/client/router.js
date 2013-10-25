Shortly.Router = Backbone.Router.extend({
  initialize: function(options){
    this.$el = options.el;
  },

  routes: {
    'home': 'home',
    'create': 'create'
  },

  swapView:function(view) {
    // console.log(view.render());
    // debugger
    this.$el.html(view.render().el);
  },

  home: function() {
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView({
        collection: links
    });
    this.swapView(linksView);
  },

  create: function() {
    var linkCreateView = new Shortly.LinkCreateView();
    this.swapView(linkCreateView);
  }
});
