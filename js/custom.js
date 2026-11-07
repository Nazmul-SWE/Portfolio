
  (function ($) {
  
  "use strict";

    // PRE LOADER
    $(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });

    // CUSTOM LINK
    $('.custom-link').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = 90; // fixed offset, same as click-scroll.js (menu height changes when open)

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
  }
});

    // MOBILE MENU: close the dropdown after a link is tapped
    $('.navbar .nav-link, .navbar .nav-cta, .navbar .navbar-brand').on('click', function(){
      var $toggler = $('.navbar-toggler');
      if ($toggler.is(':visible') && $toggler.attr('aria-expanded') === 'true') {
        $toggler.trigger('click');
      }
    });

    // SCROLL REVEAL: fade/slide elements in once as they enter the viewport
    (function () {
      var items = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) {
        $(items).addClass('is-visible');
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    })();

    // PROJECT CARDS: spotlight follows the pointer (consumed by .project-card::before)
    $('.project-card').on('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      this.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });

    // CONTACT FORM: no backend, so open the visitor's email app with the message filled in
    $('#contactForm').on('submit', function (e) {
      e.preventDefault();
      var name = $('#name').val().trim();
      var email = $('#email').val().trim();
      var message = $('#message').val().trim();
      var subject = 'Portfolio message from ' + name;
      var body = message + '\n\n- ' + name + ' (' + email + ')';

      $('#formNote').addClass('is-ok').text('Opening your email app\u2026 press send there to deliver your message.');
      window.location.href = 'mailto:nazmulmridha680@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });

  })(window.jQuery);


