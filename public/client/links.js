Shortly.Links = Backbone.Collection.extend({

  model: Shortly.Link,
  url: '/links',

  comparator: function(a, b){
  	var a = a.get(this.updated_at);
  	var b = b.get(this.updated_at);
  	return a > b ? 1 : a < b ? -1 : 0;
  },

  sortByLastVisit: function(){
  	return this.models.sort(this.comparator);
  }

  // sortByVisit: function(){
  // 	return this.sort(function(a,b){
  // 		return a.visits > b.visits;
  // 	});
  // }

});