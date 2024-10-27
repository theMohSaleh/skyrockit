const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const user = await User.findById(req.session.user._id);
    // Render index.ejs, passing in all of the current user's 
    // applications as data in the context object. 
    res.render('applications/index.ejs', {
      applications: user.applications,
    });
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error)
    res.redirect('/')
  }
});


router.get('/new', (req, res) => {
  res.render('applications/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    // find the user from session
    const user = await User.findById(req.session.user._id);

    // format date from the form
    req.body.date = new Date(req.body.date);

    // initalize the application from the form data by adding it to the
    // application's array on the user object
    user.applications.push(req.body);

    // save the user
    await user.save();

    // redirect to application index page
    res.redirect(`/users/${session.user._id}/applications`);
  } catch (error) {
    res.redirect('/')
  }
});

router.get('/:applicationId', async (req, res) => {
  try {
    // find the user from the database
    const user = await User.findById(req.session.user._id);

    // find the application by id on the user's applications array using mongoose method
    const application = user.applications.id(req.params.applicationId);

    // render template with the application we found
    res.render('applications/show.ejs', { application })
  } catch (error) {
    res.redirect('/')
  }
});

router.delete('/:applicationId', async (req, res) => {
  try {
    // find the user from the database
    const user = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete 
    // an application using the id supplied from req.params
    user.applications.id(req.params.applicationId).deleteOne();
    // Save changes to the user
    await user.save();
    // Redirect back to the applications index view
    res.redirect(`/users/${user._id}/applications`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/')
  }
});

router.get('/:applicationId/edit', async (req, res) => {
  try {
    // find the application from the db
    // find the user from the database
    const user = await User.findById(req.session.user._id);

    const application = user.applications.id(req.params.applicationId);

    res.render('applications/edit.ejs', { application })
  } catch (error) {
    res.redirect('/');
  }
})

router.put('/:applicationId', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current application from the id supplied by req.params
    const application = currentUser.applications.id(req.params.applicationId);
    // Use the Mongoose .set() method
    // this method updates the current application to reflect the new form
    // data on `req.body`
    application.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the show view of the current application
    res.redirect(
      `/users/${currentUser._id}/applications/${req.params.applicationId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

module.exports = router;