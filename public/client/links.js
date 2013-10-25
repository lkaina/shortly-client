Shortly.Links = Backbone.Collection.extend({

  model: Shortly.Link,
  url: '/links',

  comparator: null,

  sortByColumn: function(sortCol){
    this.comparator = sortCol;
    return this.sort();
  }

});