# iA Web

iA Web is a simple publishing engine based on the [Darkside.js framework](https://github.com/jankuca/darkside).

The core concept behind this engine is that it reads HTML exports from iA Writer, an awesome Markdown app, and presents them in form of a blog.

## Usage

    npm install iaweb

The bootstrapping script is then as simple as

    var iaweb = require('iaweb');
    var app = iaweb.create(__dirname);
    app.listen(process.env['PORT']);

When you run this script, the most basic blog is presented to you.

## Content

To add content (blog posts), create a folder called `posts` in your app directory and place HTML exports from iA Writer in it.

The filenames are the identifiers of the posts. If a file is names `a-cool-post.html`, its URL is '/a-cool-post'.

## Static resources

Static resources such as images, CSS or JavaScript are looked up in a folder called `public`.

## Plugins

You can add custom plugins to the engine. They can only **modify posts** before they are displayed. A sample plugin can look like this:

    var IMG_EXPRESSION = /\[\[IMG:([^\]]+)\]\]/;
    
    exports.handler = function (post) {
      post.content = post.content.replace(IMG_EXPRESSION, function (match, file_path) {
        return '<img src=' + file_path + '">';
      });
      post.content = content;
    };

Place them in a folder called `plugins`.

## Templates

The package includes the most basic templates required for the engine to work. You can use your own by creating a folder called `views` in your app directory.

The file/directory structure is:

    [views]
    - @layout.eco
    - [post]
      - index.eco
      - show.eco

The templates are combined (it's always the `@layout.eco` + another template). There is a simple component system in the templates.

    In @layout.eco, you request a component from the other template:
    <%- @component 'content' %>

    And in the other templates, you define it:
    <% @component 'content', => %>
      Content
    <% end %>

Check out the provided templates to get the idea what variables are provided.

## Do I need to use iA Writer?

No, iA Writer is just the preferred method.

The way it works is that a `<h1>` tag content is the title of the given post and anything after the `<h1>` tag until the closing `</body>` tag is its content. Thus, a sample post can look like

    <body>
    <h1>Hey, a cool post!</h1>
    <p>I'm a cool post.</p>
    </body>
