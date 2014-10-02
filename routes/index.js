var ftp = require('../ftp');
var conf = require("../config");

var fs = require('fs');
var path = require('path');

var async = require('async');

exports.index = function(req, res){
	if(!req.user){
		return res.render('index', { title: 'Please Auth.', loggedIn: false });
	}

	// we have to retrieve the directory relative to the users home
	var getPath = path.join(req.user.path, decodeURIComponent(req.url));

	fs.stat(getPath, function(err, stats){
		if(err)  return res.render('index', { err: err });
		if(stats.isFile())  return res.download(getPath);
		if(getPath[getPath.length - 1] !== '/')  return res.redirect(getPath + '/');

		ftp.getFiles(getPath, function(err, files){
			if(err)  return res.render('index', { err: err });
			return res.render('index', {
				title: 'Hello there!',
				loggedIn: true,
				items: files,
				curdir: getPath,
				curdirBreadcrumb: ftp.getBreadcrumbs(getPath),
				isRoot: req.url === req.user.path,
				isSecond: path.join(req.url, "..").length == 1
			});
		})
	});

};

exports.upload = function(req, res){
	if(req.user){
		if(req.files.file){
			ftp.SendFile(req.files.file.path, path.join(req.body.path, req.files.file.name), function(err){
				if(err)
					res.render('index', { title: "Error!", loggedIn: true, err: err });
				else
					res.redirect("back");
			});
		} else {
			res.render('index', { title: "Error - Please Send File", loggedIn: true });
		}
	} else {
		res.render('index', { title: "Error - Please login", loggedIn: false });
	}

};

exports.edit = function(req, res){

};

exports.remove = function(req, res){
	req.params[0] = '/' + req.params[0];
	res.render('index', { title: "Delete " + req.params[0] + "?", loggedIn: true, doDelete: true, redirect: path.join(req.params[0], ".."), filepath: req.params[0] });
};

exports.remove_yes = function(req, res){
	console.log(req.user, !req.user);
	if(!req.user)  return res.render('index', { title: "Error - Please login", loggedIn: false });

	ftp.remove(req, req.params[0], function(err, redirect){
		if(err)
			res.render('index', { title: "Error!", err: err, loggedIn: true });
		else
			res.redirect(redirect);
	});
};
