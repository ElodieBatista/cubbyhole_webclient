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