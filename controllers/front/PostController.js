var darkside = require('darkside');
var util = require('util');


var PostController = function (posts) {
  darkside.base(darkside.ViewController, this);

  this.posts = posts;
};
util.inherits(PostController, darkside.ViewController);
PostController.prototype.$deps = [ 'posts' ];


PostController.prototype['index'] = function (params) {
  var page = params['page'] ? Number(params['page']) : 1;

  this.posts.countPages(function (err, page_count) {
    if (page === 0 ||page > page_count) {
      this.response.head(404);
      return;
    }

    this.posts.getPagePosts(page, function (err, posts) {
      if (err) {
        this.response.head(503).body(err).end();
      } else {
        this.view['posts'] = posts;
        this.view['page'] = page;
        this.view['page_count'] = page_count;
        this.render();
      }
    }, this);
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
