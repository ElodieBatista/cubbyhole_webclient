$(document).ready(function() {
  var srvEndpoint = 'http://localhost:3000';

  // Activate Tabs
  $('#sign-nav a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  // Collapse nav bar on click on a btn
  $('nav a').click(function() {
    $('nav').collapse('hide');
  });

  // Outline input on focus/blur
  $('.input-text').focus(function() {
    $(this).parent().addClass('input-prepend-active');
  }).blur(function() {
    $(this).parent().removeClass('input-prepend-active');
  });

  // Animate inputs on error
  var inputsToAnimate = [];
  $('#appmodal').on('hidden.bs.modal', function (e) {
    animateInputs();
  });

  function animateInputs() {
    if (inputsToAnimate.length > 0) {
      var i, l;

      for (i = 0, l = inputsToAnimate.length; i < l; i++) {
        inputsToAnimate[i].parent().css('background-color', 'rgb(255, 80, 81)');
      }

      setTimeout(function() {
        for (i = 0, l = inputsToAnimate.length; i < l; i++) {
          inputsToAnimate[i].parent().css('background-color', 'white');
        }
        inputsToAnimate = [];
      }, 1000);
    }
  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  // Spinner configuration
  var opts = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 2, // The line thickness
    radius: 5, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };
  var spinner = new Spinner(opts);

  // Handle email param in url
  var emailParamPos = window.location.href.indexOf('?email=');
  if (emailParamPos !== -1) {
    var emailParam = window.location.href.substring(emailParamPos + 7);

    if (validateEmail(emailParam)) {
      $('#signin form').find('input')[0].value = emailParam;
      $('#signin form').find('input')[1].focus();
    }
  }

  // Handle reset password token param in url to change password
  var tokenParamPos = window.location.href.indexOf('?resetPassword=');
  if (tokenParamPos !== -1) {
    var tokenParam = window.location.href.substring(tokenParamPos + 15);

    $('#resetpassmodal').modal('show');
  }

  // Display sign in/sign up forms if unauthenticated otherwise, display a btn to launch the webapp
  if (localStorage.getItem('cubbyhole-webapp-profile') !== undefined && localStorage.getItem('cubbyhole-webapp-profile') !== null) {
    $('#home-unauthenticated-container').css('display', 'none');
    $('#home-authenticated-title-email').text(JSON.parse(localStorage.getItem('cubbyhole-webapp-profile')).email);
    $('#home-authenticated-container').css('display', 'block');
  } else {
    $('#home-authenticated-container').css('display', 'none');
    $('#home-unauthenticated-container').css('display', 'block');
  }

  var ipAddress;
  $.getJSON('http://jsonip.appspot.com', function(data) {
    ipAddress = data.ip;
  });

  // Sign In
  $('#signin form').submit(function(e) {
    e.preventDefault();

    var email = $(this).find('input')[0].value,
        pass = $(this).find('input')[1].value,
        rememberMe = $(this).find('input')[2].checked;

    spinner.spin(document.getElementById('signin-spinner'));

    $.ajax({
      type: 'POST',
      url: srvEndpoint + '/auth/signin',
      data: {
        email: email,
        pass: pass,
        rememberMe: rememberMe
      }
    }).done(function(data) {
        spinner.stop();

        // Passing auth data to Angular via the localStorage
        localStorage.setItem('cubbyhole-webapp-dataAuth', JSON.stringify(data.profile));

        window.location.href = 'webapp.html#/login';
      }).fail(function(data) {
        spinner.stop();

        var msg = '';

        switch (data.status) {
          case 404:
            msg = 'Incorrect email or password.';
            break;
          case 401:
            msg = 'Please, check your emails to verify your address.';
            break;
          case 403:
            msg = 'Your account has been deactivated by our administrator. For more information, please send an email to cubbyhole.contact@gmail.com';
            break;
          default:
            msg = 'Something went wrong. Please, try again later.';
            break;
        }

        $('#modal-title').text('Error');
        $('#modal-msg').text(msg);
        inputsToAnimate = [$('#signin form').find('input[type="email"]'), $('#signin form').find('input[type="password"]')];
        $('#appmodal').modal('show');
      });
  });

  // Sign Up
  $('#signup form').submit(function(e) {
    e.preventDefault();

    var email = $(this).find('input')[0].value,
        pass = $(this).find('input')[1].value,
        pass2 = $(this).find('input')[2].value;

    if (pass !== pass2) {
      $('#modal-title').text('Error');
      $('#modal-msg').text('Passwords don\'t match.');
      inputsToAnimate = [$('#signup form').find('input[type="password"]')];
      $('#appmodal').modal('show');
      return;
    }

    spinner.spin(document.getElementById('signup-spinner'));

    $.ajax({
      type: 'POST',
      url: srvEndpoint + '/auth/signup',
      data: {
        email: email,
        pass: pass,
        ip: ipAddress
      }
    }).done(function(data) {
        spinner.stop();

        $('#modal-title').text('Success');
        $('#modal-msg').text('Congratulations! You\'ve just created a Cubbyhole account for ' + email + '. Check your emails to verify your address.');
        $('#appmodal').modal('show');
        $('input:not([type="submit"])').val('');
        $('#sign-nav a:first').tab('show');
      }).fail(function(data) {
        spinner.stop();

        var msg = '';

        switch (data.status) {
          case 422:
            msg = 'This email address already exists. Please, try another one.';
            break;
          default:
            msg = 'Something went wrong. Please, try again later.';
            break;
        }

        $('#modal-title').text('Error');
        $('#modal-msg').text(msg);
        inputsToAnimate = [$('#signup form').find('input[type="email"]')];
        $('#appmodal').modal('show');
      });
  });

  // Forgot Password
  $('#signin-link').click(function(e) {
    e.preventDefault();
    $('#forgotpassmodal').modal('show');
  });

  $('#forgotpass-form').submit(function(e) {
    e.preventDefault();

    var email = $(this).find('input')[0].value;

    spinner.spin(document.getElementById('signin-spinner'));

    $.ajax({
      type: 'GET',
      url: srvEndpoint + '/user/' + email + '/password'
    }).done(function(data) {
      spinner.stop();
      $('#forgotpassmodal').modal('hide');

      $('#modal-title').text('Check your emails');
      $('#modal-msg').text('We\'ve just sent you an email with a link to reset your password.');
      $('#appmodal').modal('show');
      $('input:not([type="submit"])').val('');
    }).fail(function(data) {
      spinner.stop();
      $('#forgotpassmodal').modal('hide');

      var msg = '';

      switch (data.status) {
        default:
          msg = 'Something went wrong. Please, try again later.';
          break;
      }

      $('#modal-title').text('Error');
      $('#modal-msg').text(msg);
      $('#appmodal').modal('show');
    })
  });

  // Reset Password
  $('#resetpass-form').submit(function(e) {
    e.preventDefault();

    var pass = $(this).find('input')[0].value,
      pass2 = $(this).find('input')[1].value;

    if (pass !== pass2) {
      $('#resetpass-error-msg').text('Passwords don\'t match.')
                               .fadeIn('fast');

      setTimeout(function() {
        $('#resetpass-error-msg').fadeOut();
      }, 1000);

      inputsToAnimate = [$(this).find('input[type="password"]')];
      animateInputs();
      return;
    }

    spinner.spin(document.getElementById('signin-spinner'));

    $.ajax({
      type: 'PUT',
      url: srvEndpoint + '/user/password/' + tokenParam,
      data: {
        pass: pass
      }
    }).done(function(data) {
      spinner.stop();
      $('#resetpassmodal').modal('hide');

      // Passing auth data to Angular via the localStorage
      localStorage.setItem('cubbyhole-webapp-dataAuth', JSON.stringify(data.profile));

      window.location.href = 'webapp.html#/login';
    }).fail(function(data) {
      spinner.stop();
      $('#resetpassmodal').modal('hide');

      var msg = '';

      switch (data.status) {
        default:
          msg = 'Something went wrong. Please, try again later.';
          break;
      }

      $('#modal-title').text('Error');
      $('#modal-msg').text(msg);
      $('#appmodal').modal('show');
    })
  });

  // Plans
  Handlebars.registerHelper('ifCond', function(a, b, options) {
    return (a === b ? options.fn(this) : options.inverse(this));
  });
  Handlebars.registerHelper('ifMod', function(a, b, options) {
    return ((a % b) === 0 ? options.fn(this) : options.inverse(this));
  });

  Handlebars.registerHelper('toLowerCase', function(options) {
    return options.fn(this).toLowerCase();
  });

  $.ajax({
    type: 'GET',
    url: srvEndpoint + '/plan'
  }).done(function(res) {
      var source = $('#plan-template').html();
      var template = Handlebars.compile(source);
      var html = template(res);
      $('.plans-container:first').append(html);
    }).fail(function(error) {
      console.log('Error getting the plans: ' + error);
    });
});