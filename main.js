$(document).ready(function ($) {
  "use strict";

  /**
   * @type {Swiper}
   * @description Initializes a Swiper instance for the book table image slider
   * Configuration includes:
   * - Single slide view with 20px spacing
   * - Continuous loop
   * - Autoplay with 3 second delay
   * - Coverflow effect with custom rotation and depth settings
   * - Navigation buttons and pagination
   * @property {number} slidesPerView - Number of slides shown at once (1)
   * @property {number} spaceBetween - Space between slides in pixels (20)
   * @property {boolean} loop - Enables continuous loop
   * @property {Object} autoplay - Autoplay configuration
   * @property {number} speed - Transition speed in milliseconds
   * @property {string} effect - Slide transition effect ('coverflow')
   * @property {Object} coverflowEffect - Coverflow effect parameters
   * @property {Object} navigation - Navigation buttons configuration
   * @property {Object} pagination - Pagination configuration
   */
  var book_table = new Swiper(".book-table-img-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 2000,
    effect: "coverflow",
    coverflowEffect: {
      rotate: 3,
      stretch: 2,
      depth: 100,
      modifier: 5,
      slideShadows: false,
    },
    loopAdditionSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  /* The `var team_slider` declaration is creating a new Swiper slider instance with the class
  selector `.team-slider`. This slider is configured to display 3 slides at a time with a space of
  30 pixels between each slide. It is set to loop continuously, autoplay with a delay of 3000
  milliseconds, and not disable on user interaction. */
  var team_slider = new Swiper(".team-slider", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 2000,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1.2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });

  jQuery(".filters").on("click", function () {
    jQuery("#menu-dish").removeClass("bydefault_show");
  });
  $(function () {
    var filterList = {
      init: function () {
        $("#menu-dish").mixItUp({
          selectors: {
            target: ".dish-box-wp",
            filter: ".filter",
          },
          animation: {
            effects: "fade",
            easing: "ease-in-out",
          },
          load: {
            filter: ".all, .breakfast, .lunch, .dinner",
          },
        });
      },
    };
    filterList.init();
  });

  jQuery(".menu-toggle").click(function () {
    jQuery(".main-navigation").toggleClass("toggled");
  });

  jQuery(".header-menu ul li a").click(function () {
    jQuery(".main-navigation").removeClass("toggled");
  });

  gsap.registerPlugin(ScrollTrigger);

  var elementFirst = document.querySelector('.site-header');
  ScrollTrigger.create({
    trigger: "body",
    start: "30px top",
    end: "bottom bottom",

    onEnter: () => myFunction(),
    onLeaveBack: () => myFunction(),
  });

  function myFunction() {
    elementFirst.classList.toggle('sticky_head');
  }

  var scene = $(".js-parallax-scene").get(0);
  var parallaxInstance = new Parallax(scene);

  $('#cartModalCenter').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus');
  });

  // Initialize modal functionality
  initializeModal();

  // Trigger checkout validation on button click
  $('.checkout-btns button').on('click', function () {
    const form = $('.cart-checkout-form');
    let isValid = true;

    form.find('input').each(function () {
      if (!$(this).val()) {
        isValid = false;
        $(this).addClass('is-invalid');
      } else {
        $(this).removeClass('is-invalid');
      }
    });

    if (!isValid) {
      alert('Please fill required fields');
    } else {
      alert('Form is valid and ready for submission.');
      // Proceed with form submission or further processing
    }
  });

});

jQuery(window).on('load', function () {
  $('body').removeClass('body-fixed');

  //activating tab of filter
  let targets = document.querySelectorAll(".filter");
  let activeTab = 0;
  let old = 0;
  let dur = 0.4;
  let animation;

  for (let i = 0; i < targets.length; i++) {
    targets[i].index = i;
    targets[i].addEventListener("click", moveBar);
  }

  // initial position on first === All 
  gsap.set(".filter-active", {
    x: targets[0].offsetLeft,
    width: targets[0].offsetWidth
  });

  function moveBar() {
    if (this.index != activeTab) {
      if (animation && animation.isActive()) {
        animation.progress(1);
      }
      animation = gsap.timeline({
        defaults: {
          duration: 0.4
        }
      });
      old = activeTab;
      activeTab = this.index;
      animation.to(".filter-active", {
        x: targets[activeTab].offsetLeft,
        width: targets[activeTab].offsetWidth
      });

      animation.to(targets[old], {
        color: "#0d0d25",
        ease: "none"
      }, 0);
      animation.to(targets[activeTab], {
        color: "#fff",
        ease: "none"
      }, 0);

    }

  }
});