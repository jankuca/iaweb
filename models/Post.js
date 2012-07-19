var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


var HEADING_RX = /<h1>\s*([^<]+)\s*<\/h1>/i;
var PEREX_RX = /<p>\s*([\s\S]+?)<\/p>/i;
var CONTENT_RX = /<\/h1>\s*([\s\S]*)\s*<\/body>/i;


var Post = function (file_path) {
  EventEmitter.call(this);

  var post = this;
  var slug = path.basename(file_path).replace(/\.\w+$/, '');
  var slug_parts = slug.split('-#');

  post.slug = slug_parts[0];
  post.tags = slug_parts.slice(1);

  post.heading = null;
  post.perex = null;
  post.content = null;

  fs.readFile(file_path, 'utf8', function (err, data) {
    if (err) {
      post.emit('error', err);
    } else {
      var heading = data.match(HEADING_RX);
      if (!heading) {
        post.emit('error', 'Missing <h1> in ' + path);
        return;
      }

      post.heading = heading[1];
      post.content = data.match(CONTENT_RX)[1];
      post.perex = post.content.match(PEREX_RX)[1];

      fs.stat(file_path, function (err, stat) {
        post.created_at = stat.ctime;
        post.emit('ready');
      });
    }
  });
};

util.inherits(Post, EventEmitter);


module.exports = Post;
