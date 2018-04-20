var express = require('express');
var ticketRouter = express.Router();
var mongoose = require('mongoose');
var ticketModel = mongoose.model('Ticket');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var fireMail = require('./../../libs/mail.js');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR})

module.exports.controller = function(app){

	// route to save ticket data
	ticketRouter.post('/save', upload.single('file'), function(req, res){
		var newTicket = new ticketModel();
		newTicket.title = req.body.title;
		newTicket.description = req.body.description;
		newTicket.askedBy = req.decoded._id;
		// if user upload file add it to model
		if (req.file) {
			newTicket.file = req.file.path;
		}
		newTicket.save(function(err, ticket) {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {	
				return res.json(ticket);
			}
		});

	});

	// route to get auth user details

	ticketRouter.get('/me', function(req, res){
		res.send(req.decoded);
	});

	// route to list tickets

	ticketRouter.get('/list', function(req, res){

		ticketModel.find({askedBy:req.decoded._id})
				   .populate('askedBy')
				   .sort({ created : 'descending'})
                   .exec(function(error, tickets) {
               		if (error) {
               			return res.json(error);
               		}else{
               			return res.json(tickets);	
               		}
                		
            });
	});

	// route to get details of particular ticket

	ticketRouter.get('/:id', function(req, res){

			ticketModel.find({_id:req.params.id})
					   .populate('askedBy')
	                   .exec(function(error, ticket) {
	                   	if (error) {
	                   		return res.json(error);
	                   	}else{
	                		return res.json(ticket);
	                   	}
	            });
	});

	// route to change the status of ticket

	ticketRouter.put('/status/:id', function(req, res){
		//checking current status
		ticketModel.find({_id:req.params.id}, function(err, status){
			if (err) {
				return res.send(err);
			}else{
				ticketModel.findOneAndUpdate({'_id':req.params.id}, {status:status[0].status == 'O' ? 'C' : 'O'}, function(err, result){
					if (err) {
						return res.send(err);
					}
					else{
						// 'from' will be an email of admin/support 
						var mail = fireMail(req.decoded.email, 'md.abud.kamil@gmail.com', 'Ticket Status Change', 'You are receiving this because your ticket status has changed');
						mail.then(function(result){
							return res.send({result:result, status:'success'});
						}).catch((error) => {
							return res.send({error:error,status:'error'});
						});			
					}
				});
			}
		});

	});

	// route to reply by user

	ticketRouter.post('/answer/save/:id', function(req, res){
		ticketModel.update({'_id':req.params.id}, {'$push': {
			answers:{'body': req.body.body,
			'answerBy': req.decoded.fullName}
		}}, function(err, answer){
			if (err) {
				return res.send(err);
			}
			else{
				//checking if there is any answer posted by 'mentor', if yes then an email will go to mentor
				ticketModel.find({_id:req.params.id})
					   .populate('askedBy')
	                   .exec(function(error, tickets) {
                		if (error) {
                			return res.send(error);
                		}else{	
                			var data = '';
                			tickets[0].answers.forEach(function(reply) {
									if (reply.answerBy === 'Mentor') {
										// in 'to' there willl be mentor email id and 'from' will be system admin mail
										var mail = fireMail(req.decoded.email, 'md.abud.kamil@gmail.com', 'Student Reply', `You are receiving this mail because one of our student ${req.decoded.fullName} reply to your answer.click the link to answer http://abudsupport.s3-website.us-east-2.amazonaws.com/#!/admin/ticket-details/${req.params.id}`);
										mail.then(function(result){
											 data  = {result:result, status:'success'};
										}).catch((error) => {
											 data = {error:error,status:'error'};
										});	
									}
							});
							return res.send(data);            


                		}
	            });
			}
		});
	});

	// route to post answer by mentor/admin

	ticketRouter.post('/admin/answer/save/:id', function(req, res){
		ticketModel.update({'_id':req.params.id}, {'$push': {
			answers:{'body': req.body.body,
			'answerBy': 'Mentor'}
		}}, function(err, answer){
			if (err) {
				return res.send(err);
			}
			else{
				if (answer) {
					// 'from' will be email of admin or support system
					var mail = fireMail(req.decoded.email, 'md.abud.kamil@gmail.com', 'Answer to your query', `You are receiving this because you got an answer from a Mentor, go to the link http://abudsupport.s3-website.us-east-2.amazonaws.com/#!/ticket-details/${req.params.id}`);
					mail.then(function(result){
						return res.send({result:result, status:'success'});
					}).catch((error) => {
						return res.send({error:error,status:'error'});
					});	
				}
			}
		});
	});

	// get ticket list on admin panel

	ticketRouter.get('/admin/list', function(req, res){

		ticketModel.find({})
				   .populate('askedBy')
				   .sort({ created : 'descending'})
                   .exec(function(error, tickets) {
                	return res.json(tickets);
            });
	});



	app.use('/tickets', ticketRouter);

}
