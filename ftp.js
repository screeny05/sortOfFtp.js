var fs = require('fs');
var path = require('path');

var async = require('async');
var humanize = require('humanize');

var conf = require("./config");


exports.getFiles = function(getPath, callback){

  async.waterfall([
    function(cb){
      fs.readdir(getPath, cb);
    },
    function(files, cb){
      async.map(files, function(filename, next){
        var absolutePath = path.join(getPath, filename);

        fs.stat(absolutePath, function(err, stats){
          if(err)  return next(err);
          var ret = {
            filename: filename,
            absolutePath: absolutePath,
            eperm: false,
            size: stats.size,
            sizePretty: humanize.filesize(stats.size),
            modified: stats.mtime,
            created: stats.ctime,
            type: (stats.isFile() ? 'file' : 'folder'),
            hidden: filename[0] == '.'
          };

          if(ret.type === 'file')  ret.fileType = path.extname(filename);

          ret.fontClass = exports.getFontClass(ret);

          fs.stat(path.join(absolutePath, 'xxx'), function(err){
            if(err.code === "EACCES")  ret.eperm = true;
          });
          next(null, ret);

        })
      }, cb);
    }
  ], function(err, files){
    if(err)  return callback(err);

    files.sort(function(a, b){
      if(a.type === b.type){
        return a.name > b.name;
      } else {
        return (a.type === 'folder' ? -1 : 1);
      }
    });

    callback(err, files);
  });
};

exports.getFontClass = function(element){
  if(element.type === 'folder')
    if(element.eperm)
      return 'fa-folder';
    else
      return 'fa-folder-open';
}

exports.getBreadcrumbs = function(getPath){
  var splitted = getPath.split(path.sep);
  var paths = [];

  splitted.forEach(function(curPath, index){
    if(curPath.length === 0)  return;
    paths.push({
      relative: curPath,
      absolute: splitted.reduce(function(prev, cur, i){
        if(i <= index)
          return prev + '/' + cur;
        else
          return prev;
      }) + '/'
    });
  });

  return paths;
}

exports.SendFile = function(tmpPath, uploadPath, callback){
  var s = fs.createReadStream(tmpPath);
  var d = fs.createWriteStream(uploadPath);

  s.pipe(d);
  s.on('end', callback);
  s.on('error', callback);
};

exports.remove = function(req, loc_, callback){

  var loc = path.join(req.user.path, loc_);
  fs.stat(loc, function(err, stats){
    if(err)
      return callback(err);
    if(!stats.isFile())
      return callback({ stack: 'Cant\'t delete a whole folder' });
    fs.unlink(loc, function(err){
      var red = path.join(loc_.replace("/_sys/delete/", "/"), "..") + "/";
      callback(err, red);
    });
  });
};
