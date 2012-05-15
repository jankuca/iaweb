var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


var HEADING_RX = /<h1>\s*([^<]+)\s*<\/h1>/i;
var PEREX_RX = /<p>\s*([\s\S]+?)<\/p>/i;
var CONTENT_RX = /<\/h1>\s*([\s\S]*)\s*<\/body>/i;


var Post = function (path) {
  EventEmitter.call(this);

  var post = this;
  post.heading = null;
  post.perex = null;
  post.content = null;

  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      post.emit('error', err);
    } else {
      post.heading = data.match(HEADING_RX)[1];
      post.content = data.match(CONTENT_RX)[1];
      post.perex = post.content.match(PEREX_RX)[1];
      post.emit('ready');
    }
  });
};

util.inherits(Post, EventEmitter);


module.exports = Post;
