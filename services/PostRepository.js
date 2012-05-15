var fs = require('fs');
var path = require('path');


var PostRepository = function (options) {
  this.storage_dir = options['storage'];
  this.plugin_dir = options['plugins'];

  this.plugins = this.loadPlugins_();
};

PostRepository.prototype.createPost = function (path) {
  if (!this.Entity) {
    throw new Error('No entity wrapper');
  }

  var repo = this;

  var post = new this.Entity(path);
  post.once('ready', function () {
    repo.applyPluginsToPost(post);
  });

  return post;
};

PostRepository.prototype.getPagePosts = function (page, callback, ctx) {
  var repo = this;

  fs.readdir(repo.storage_dir, function (err, filenames) {
    if (err) {
      callback.call(ctx, err, null);
    } else {
      filenames = filenames.slice((page - 1) * 5, 5);
      var left = filenames.length;
      if (left === 0) {
        callback.call(ctx, null, []);
        return;
      }

      var updateLeft = function () {
        left -= 1;
        if (left === 0) {
          callback.call(ctx, null, posts);
        }
      };
      var onError = function (err) {
        error = true;
        callback.call(ctx, err, null);
      };

      var posts = filenames.map(function (filename) {
        var post = repo.createPost(path.join(repo.storage_dir, filename));
        post.once('ready', updateLeft);
        post.once('error', onError);
        return post;
      });
    }
  });
};

PostRepository.prototype.getPostBySlug = function (slug, callback, ctx) {
  var file_path = path.join(this.storage_dir, slug + '.html');
  var post = this.createPost(file_path);
  post.once('error', function (err) {
    callback.call(ctx, err, null);
  });
  post.once('ready', function () {
    callback.call(ctx, null, post);
  });
};

PostRepository.prototype.applyPluginsToPost = function (post) {
  this.plugins.forEach(function (plugin) {
    plugin(post);
  });
};

PostRepository.prototype.loadPlugins_ = function () {
  var plugin_dir = this.plugin_dir;
  if (!plugin_dir || !path.existsSync(plugin_dir)) {
    return [];
  }

  var filenames = fs.readdirSync(plugin_dir).filter(function (filename) {
    return require.extensions[path.extname(filename)];
  });

  var plugins = filenames.map(function (filename) {
    var plugin_path = path.join(plugin_dir, filename);
    var plugin = require(plugin_path);
    return plugin.handler;
  });

  return plugins;
};


module.exports = PostRepository;
