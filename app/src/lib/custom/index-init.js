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

    console.log('Sending login info: ' + email + ' ' + pass);

    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/signin',
        data: {
            email: email,
            pass: pass
        }
    }).done(function(data) {
        console.log('Login success');

        if (remember) {
            localStorage.setItem('key', key);
            localStorage.setItem('profile', JSON.stringify(data.profile));

            console.log('Saving Auth info in the LocalStorage: ' + data.key + ' ' + data.profile.toString());
        }
    }).fail(function(error) {
        console.log('Login failed: ' + error.msg);
    });
});