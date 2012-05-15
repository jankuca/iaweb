var darkside = require('darkside');
var util = require('util');


var PostController = function (posts) {
  darkside.base(darkside.ViewController, this);

  this.posts = posts;
};
util.inherits(PostController, darkside.ViewController);
PostController.prototype.$deps = [ 'posts' ];


PostController.prototype['index'] = function (params) {
  var page = Number(params['page']) || 1;

  this.posts.getPagePosts(page, function (err, posts) {
    if (err) {
      this.response.head(503).body(err).end();
    } else {
      this.view['posts'] = posts;
      this.render();
    }
  }, this);
};

PostController.prototype['show'] = function (params) {
  var slug = params['slug'];
  this.posts.getPostBySlug(slug, function (err, post) {
    this.view['post'] = post;
    this.render();
  }, this);
};


module.exports = PostController;
