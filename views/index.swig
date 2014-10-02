<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/_sys/assets/less/main.css">
    <style id="filter_style"></style>
  </head>
  <body>
    <div class="container">
    	<h1>{{ title }}</h1>

    	{% if loggedIn && !err && !doDelete %}

        <div class="panel panel-default panel-title">
          <div class="panel-heading">
            <ol class="breadcrumb">
              <li {% if curdirBreadcrumb.length == 0 %}class="active"{% endif %}>{% if curdirBreadcrumb.length > 0 %}<a href="/">{% endif %}root{% if curdirBreadcrumb %}</a>{% endif %}</li>
              {% for dir in curdirBreadcrumb %}
                <li {% if loop.last %}class="active"{% endif %}>{% if !loop.last %}<a href="{{dir.absolute}}">{% endif %}{{dir.relative}}{% if !loop.last %}</a>{% endif %}</li>
              {% endfor %}
            </ol>
          </div>
          <div class="panel-body">
            <form class="form-inline" action="/_sys/upload" method="POST" enctype="multipart/form-data">
              <div class="form-group has-feedback">
                <input type="seach" class="form-control" id="form-search" placeholder="Search...">
                <span class="icon-search form-control-feedback"></span>
              </div>
              <div class="checkbox">
                <label><input type="checkbox" id="form-dotfiles"> hide .dotfiles</label>
              </div>
              <div class="form-group">
                <input type="file" name="file">
                <input type="hidden" name="path" value="{{curdir}}">
              </div>
              <input type="submit">
            </form>
          </div>
        </div>

        <div class="list-group searchable list-files">

          {% for item in items %}
            <div data-name="{{item.filename.toLowerCase()}}" class="list-group-item row {% if item.eperm %}disabled{% endif %} {% if item.hidden %}item-hidden{% endif %}" {% if item.hidden %}data-hidden="true"{% endif %}>
            <a class="col-md-10" href="{{item.filename}}{% if item.type == 'folder' %}/{% endif %}">
                <span class="icon-file-{% if item.type == 'folder' %}directory{% else %}text{% endif %}" data-name="{{item.filename.toLowerCase()}}"></span>
                <span class="filename">{{item.filename}}{% if item.type == "folder" %}/{% endif %}</span>
              </a>
              {#<div class="col-md-2">
                <a href="/_sys/delete{{item.absolutePath}}">del</a>
                <a href="del">del</a>
              </div>#}
            </div>
          {% endfor %}

        </div>
      {% elseif err %}
        <p><b>{{err.stack}}</b></p>
      {% elseif !loggedIn %}
        <a href="/_sys/auth/fb" class="btn btn-primary btn-block btn-lg">Login with Facebook</a>
      {% elseif doDelete %}
        <a href="/_sys/do/delete/{{filepath}}">Eyup</a> | <a href="{{redirect}}/">Nope</a>
      {% endif %}
    </div>
    <script>var byId=document.getElementById.bind(document),filterStyle=byId("filter_style"),filter=function(){var a=byId("form-search").value.toLowerCase(),b=byId("form-dotfiles").checked;filterStyle.innerHTML='.searchable>.row[data-hidden="'+b+'"]{display:none;}'+(a?'.searchable>.row:not([data-name*="'+a+'"]){display:none;}':"")};byId("form-search").addEventListener("input",filter);byId("form-dotfiles").addEventListener("change",filter);</script>
    {#
    <script>
      var byId = document.getElementById.bind(document);
      var filterStyle = byId('filter_style');

      var filter = function(){
        var filename = byId('form-search').value.toLowerCase();
        var dotfiles = byId('form-dotfiles').checked;
        filterStyle.innerHTML = '.searchable > .row[data-hidden="' + dotfiles + '"]{ display: none; }'+(filename ? '.searchable > .row:not([data-name*="' + filename + '"]){ display: none; };' : '');
      }

      byId('form-search').addEventListener('input', filter);
      byId('form-dotfiles').addEventListener('change', filter);
    </script>
    #}
  </body>
</html>
