// Activate Tabs
$('#sign-nav a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

// Outline input on focus/blur
$('.sign-input').focus(function() {
    $(this).parent().addClass('sign-input-prepend-active');
}).blur(function() {
    $(this).parent().removeClass('sign-input-prepend-active');
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
        url: 'http://localhost:9000/signin',
        data: {
            email: email,
            pass: pass
        }
    }).done(function(data) {
        console.log('Sign in success');

        localStorage.setItem('key', data.key);
        localStorage.setItem('profile', JSON.stringify(data.profile));
        localStorage.setItem('remember', remember);

        console.log('Saving Auth info in the LocalStorage: ' + data.key + ' ' + data.profile.toString());
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
        alert('Passwords don\'t match');
        $(this).find('input[type="password"]').parent().css('background-color', 'rgb(255, 80, 81)');
        setTimeout(function() {
            $('#signup form').find('input[type="password"]').parent().css('background-color', 'white');
        }, 1000);
        return;
    }

    var email = $(this).find('input')[0].value;
    var plan = $(this).find('select')[0].value;

    console.log('Sending sign up info: ' + email + ' ' + pass + ' ' + plan);

    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/signup',
        data: {
            email: email,
            pass: pass,
            plan: plan
        }
    }).done(function(data) {
        console.log('Sign up success');

        localStorage.setItem('key', data.key);
        localStorage.setItem('profile', JSON.stringify(data.profile));
        localStorage.setItem('remember', false);

        console.log('Saving Auth info in the LocalStorage: ' + data.key + ' ' + data.profile.toString());
    }).fail(function(error) {
        console.log('Sign up failed: ' + error.msg);
    });
});