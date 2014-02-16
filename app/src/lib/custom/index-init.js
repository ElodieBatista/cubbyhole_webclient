var srvEndpoint = 'http://localhost:3000';

// Activate Tabs
$('#sign-nav a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

// Outline input on focus/blur
$('.input-text').focus(function() {
    $(this).parent().addClass('input-prepend-active');
}).blur(function() {
    $(this).parent().removeClass('input-prepend-active');
});

// Collapse navbar on click on a btn
$('nav a').click(function() {
    $('nav').collapse('hide');
});

// Sign In
$('#signin form').submit(function(event) {
    event.preventDefault();

    var email = $(this).find('input')[0].value;
    var pass = $(this).find('input')[1].value;
    var remember = $(this).find('input')[2].checked;

    console.log('Sending sign in info: ' + email + ' ' + pass);

    $.ajax({
        type: 'POST',
        url: srvEndpoint + '/auth/signin',
        data: {
            email: email,
            pass: pass,
            remember: remember
        }
    }).done(function(data) {
    // FAKE
    /*var data = {
        sessionKey: 'aaa111bbb222ccc333',
        profile: {
            email: email,
            plan: 0
        }
    };*/

        console.log('Sign in success');

        // Passing auth data to Angular
        localStorage.setItem('dataAuth', JSON.stringify(data));

        window.location.href = 'webapp.html#/login';
    }).fail(function(error) {
        console.log('Sign in failed: ' + error.msg);
    });
});

// Sign Up
$('#signup form').submit(function(event) {
    event.preventDefault();

    var pass = $(this).find('input')[1].value;
    var pass2 = $(this).find('input')[2].value;

    if (pass !== pass2) {
        $('#modal-msg').text('Passwords don\'t match.');
        $('#appmodal').modal('show');

        $('#appmodal').on('hidden.bs.modal', function (e) {
            $('#signup form').find('input[type="password"]').parent().css('background-color', 'rgb(255, 80, 81)');
            setTimeout(function() {
                $('#signup form').find('input[type="password"]').parent().css('background-color', 'white');
            }, 1000);
        });
        return;
    }

    var email = $(this).find('input')[0].value;
    var plan = $(this).find('select')[0].value;

    console.log('Sending sign up info: ' + email + ' ' + pass + ' ' + plan);

    $.ajax({
        type: 'POST',
        url: srvEndpoint + '/auth/signup',
        data: {
            email: email,
            pass: pass
        }
    }).done(function(data) {
    // FAKE
    /*var data = {
        sessionKey: 'aaa111bbb222ccc333',
        profile: {
            email: email,
            plan: 0
        }
    };*/

        console.log('Sign up success');

        // Passing auth data to Angular
        //localStorage.setItem('dataAuth', JSON.stringify(data));

        //window.location.href = 'webapp.html#/login';


    }).fail(function(error) {
        console.log('Sign up failed: ' + error.msg);
    });
});