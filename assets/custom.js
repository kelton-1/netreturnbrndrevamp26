/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */

// var TileSlider = class extends HTMLElement {
//   connectedCallback() {
//     this.prevNextButtons = this.querySelector("prev-next-buttons");
//     this.pageDots = this.querySelector("page-dots");
//     this.scrollBarElement = this.querySelector(".timeline__progress-bar");
//     this.listWrapperElement = this.querySelector(".timeline__list-wrapper");
//     this.listItemElements = Array.from(this.querySelectorAll(".timeline__item"));
//     this.isScrolling = false;
//     if (this.listItemElements.length > 1) {
//       this.addEventListener("prev-next:prev", this.previous.bind(this));
//       this.addEventListener("prev-next:next", this.next.bind(this));
//       this.addEventListener("page-dots:changed", (event) => this.select(event.detail.index));
//       if (Shopify.designMode) {
//         this.addEventListener("shopify:block:select", (event) => {
//           this.select([...event.target.parentNode.children].indexOf(event.target), !event.detail.load);
//         });
//       }
//       this.itemIntersectionObserver = new IntersectionObserver(this._onItemObserved.bind(this), { threshold: 0.4 });
//       const mediaQuery = window.matchMedia(window.themeVariables.breakpoints.pocket);
//       mediaQuery.addListener(this._onMediaChanged.bind(this));
//       this._onMediaChanged(mediaQuery);
//     }
//   }
//   get selectedIndex() {
//     return this.listItemElements.findIndex((item) => !item.hasAttribute("tnr-hidden"));
//   }
//   previous() {
//     this.select(Math.max(0, this.selectedIndex - 2));
//   }
//   next() {
//     this.select(Math.min(this.selectedIndex + 2, this.listItemElements.length - 1));
//   }
//   select(index, animate = true) {
//     const listItemElement = this.listItemElements[index], boundingRect = listItemElement.getBoundingClientRect();
//     if (animate) {
//       this.isScrolling = true;
//       setTimeout(() => this.isScrolling = false, 800);
//     }
//     if (window.matchMedia(window.themeVariables.breakpoints.pocket).matches) {
//       this.listWrapperElement.scrollTo({
//         behavior: animate ? "smooth" : "auto",
//         left: this.listItemElements[0].clientWidth * index
//         /* Note: the last element does not contain extra margin so we use the first element width */
//       });
//     } else {
//       this.listWrapperElement.scrollBy({
//         behavior: animate ? "smooth" : "auto",
//         left: Math.floor(boundingRect.left - window.innerWidth / 2 + boundingRect.width / 2)
//       });
//     }
//     this._onItemSelected(index);
//   }
//   _onItemSelected(index) {
//     const listItemElement = this.listItemElements[index];
//     listItemElement.removeAttribute("tnr-hidden", "false");
//     getSiblings(listItemElement).forEach((item) => item.setAttribute("tnr-hidden", ""));
//     this.prevNextButtons.isPrevDisabled = index === 0;
//     this.prevNextButtons.isNextDisabled = index === this.listItemElements.length - 1;
//     this.pageDots.selectedIndex = index;
//     this.scrollBarElement?.style.setProperty("--transform", `${100 / (this.listItemElements.length - 1) * index}%`);
//   }
//   _onItemObserved(entries) {
//     if (this.isScrolling) {
//       return;
//     }
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         this._onItemSelected([...entry.target.parentNode.children].indexOf(entry.target));
//       }
//     });
//   }
//   _onMediaChanged(event) {
//     if (event.matches) {
//       this.listItemElements.forEach((item) => this.itemIntersectionObserver.observe(item));
//     } else {
//       this.listItemElements.forEach((item) => this.itemIntersectionObserver.unobserve(item));
//     }
//   }
// };
// window.customElements.define("tile-slider", TileSlider);

var TileSlider = class extends CustomHTMLElement {
  async connectedCallback() {
    this.items = Array.from(this.querySelectorAll(".list-collections__item"));
    if (this.hasAttribute("scrollable")) {
      this.scroller = this.querySelector(".list-collections__scroller");
      this.addEventListener("prev-next:prev", this.previous.bind(this));
      this.addEventListener("prev-next:next", this.next.bind(this));
      this.addEventListener("shopify:block:select", (event) => event.target.scrollIntoView({ block: "nearest", inline: "center", behavior: event.detail.load ? "auto" : "smooth" }));
    }
    if (this.hasAttribute("reveal-on-scroll")) {
      this._setupVisibility();
    }
  }
  async _setupVisibility() {
    await this.untilVisible();
    const prefersReducedMotion = MediaFeatures.prefersReducedMotion();
    const animation = new CustomAnimation(new ParallelEffect(this.items.map((item, index) => {
      return new SequenceEffect([
        new CustomKeyframeEffect(item.querySelector(".list-collections__item-image"), {
          opacity: [0, 1],
          transform: [`scale(${prefersReducedMotion ? 1 : 1.1})`, "scale(1)"]
        }, {
          duration: 250,
          delay: prefersReducedMotion ? 0 : 150 * index,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)"
        }),
        new ParallelEffect(Array.from(item.querySelectorAll(".list-collections__item-info [reveal]")).map((textItem, subIndex) => {
          return new CustomKeyframeEffect(textItem, {
            opacity: [0, 1],
            clipPath: [`inset(${prefersReducedMotion ? "0 0 0 0" : "0 0 100% 0"})`, "inset(0 0 0 0)"],
            transform: [`translateY(${prefersReducedMotion ? 0 : "100%"})`, "translateY(0)"]
          }, {
            duration: 200,
            delay: prefersReducedMotion ? 0 : 150 * index + 150 * subIndex,
            easing: "cubic-bezier(0.5, 0.06, 0.01, 0.99)"
          });
        }))
      ]);
    })));
    this._hasSectionReloaded ? animation.finish() : animation.play();
  }
  previous() {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    this.scroller.scrollBy({
      left: -this.items[0].clientWidth * directionFlip,
      behavior: "smooth"
    });
  }
  next() {
    const directionFlip = window.themeVariables.settings.direction === "ltr" ? 1 : -1;
    this.scroller.scrollBy({
      left: this.items[0].clientWidth * directionFlip,
      behavior: "smooth"
    });
  }
};
window.customElements.define("tile-slider", TileSlider);



// On document ready
document.addEventListener("DOMContentLoaded", () => {
  // Text with Icon autoslide
  document.querySelectorAll('.tnr-auto-rotate').forEach(function(el) {
    // Speed
    let speedInterval = parseInt(el.getAttribute('cycle-speed')) * 1000;
  
    // Auto slide
    let autoSlide = setInterval(function() {
      let $this = el.querySelector('.dots-nav__item[aria-current="true"]');
      let $next = $this.nextElementSibling;
      if ($next === null) {
        $next = el.querySelector('.dots-nav__item');
      }
      $next.click();
    }, speedInterval);
  
    // Stop on hover
    // el.addEventListener('mouseenter', function() {
    //   clearInterval(autoSlide);
    // });
  });

  // Product Questionaire
  document.querySelectorAll('.product-quiz-section').forEach(function(el) {
    new ProductQuestionaireStep(el);
  } );

  // Tab Active
  if( window.location.search == '?home' ) {
    document.querySelector('button[aria-controls="block-template--16411566407773__featured_collections_BiA4a4-collection_LXnMA9"]').click();
  } else if( window.location.search == '?packages' ) {
    document.querySelector('button[aria-controls="block-template--16485404213341__featured_collections_4LAcxX-collection_nzaUbq"]').click();
  } else if( window.location.search == '?home-series' ) {
    document.querySelector('button[aria-controls="block-template--16485745590365__featured_collections_PY7E6G-collection_Vq6Yf6"]').click();
  }

  
  
  let scrollToID;
  if (window.location.search === '?Safety') {
    scrollToID = 'shopify-section-template--16486395773021__featured_collections_AxtPEw';
  } else if (window.location.search === '?Simulation') {
    scrollToID = 'shopify-section-template--16486395773021__featured_collections_MD4thK';
  } else if (window.location.search === '?Other') {
    scrollToID = 'shopify-section-template--16486395773021__featured_collections_rX8fjL';
  } else if (window.location.search === '?launch-monitors') {
    scrollToID = 'shopify-section-template--16382900371549__featured_collections_i6f8Y7';
  } else {
    let sectionID = `tnr-section-${window.location.search.replace('?', '')}`;
    let sectionElement = document.getElementById(sectionID);
    if(sectionElement!=null){
      let parentDiv = sectionElement.parentElement.id;
      scrollToID = parentDiv;
    }
  }
  
  
  if (scrollToID) {
    const element = document.getElementById(scrollToID);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
});

// Product Questionaire
class ProductQuestionaireStep {
  constructor(el) {
    this.el = el;
    // Container
    this.prevBtn = el.querySelector('.step-prev-btn');
    this.overBtn = el.querySelector('.step-start-over');
    this.getStartBtn = el.querySelector('.step-get-start');
    this.welcomeBlock = el.querySelector('.question-block-welcome');
    this.resultBlock = el.querySelector('.question-block-result');
    this.resultContainer = el.querySelector('.recommended-search-result');
    this.progressBar = el.querySelector('progress');

    this.activeClass = 'active';
    this.prevIdx = -1;

    this.overBtn.addEventListener('click', this.startOver.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.getStartBtn.addEventListener('click', this.getStart.bind(this));

    // Product Questionaire Steps
    this.quesBlock = el.querySelectorAll(".question-block");
    this.totalBlock = this.quesBlock.length-1;

    // Back Data
    this.backData = [];

    // Bind
    this.init();

  }

  // Set Total Steps in Progress Bar
  setTotalSteps(totalSteps) {
    this.progressBar.max = totalSteps;
  }

  // Set Progress Bar
  setProgressBar(value) {
    this.progressBar.value = value;
  }

  getStart() {
    this.removeActive();
    this.welcomeBlock.classList.remove(this.activeClass);
    this.quesBlock[1].classList.add(this.activeClass);

    // Progress bar
    this.progressBar.value = 1;

    // Back Data
    this.backData.push({
      progress: 0,
      idx: 0
    });
  }

  // Start Over
  startOver() {
    this.removeActive();
    this.removeSelected();
    this.welcomeBlock.classList.add(this.activeClass);

    // Reset progress bar
    this.progressBar.value = 0;
    this.progressBar.max = this.totalBlock;
    this.prevIdx = 0;

    // Back Data
    this.backData = [];
  }

  // Remove all active class
  removeActive() {
    this.quesBlock.forEach((content) => {
      content.classList.remove(this.activeClass);
    });
  }

  // Remove all selected input
  removeSelected() {
    this.quesBlock.forEach((content) => {
      let quesInputBtn = content.querySelectorAll("input");
      quesInputBtn.forEach((btn) => {
        btn.checked = false;
      } );
    });
  }

  // Result Step
  resultStep( collection ) {
    this.removeActive();
    this.resultBlock.classList.add(this.activeClass);

    // Fetch the result
    var requestResponse;

    // Loading state
    this.resultContainer.innerHTML = `<div class="predictive-search__loading-state">
      <div class="spinner"><svg focusable="false" width="50" height="50" class="icon icon--spinner   " viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" fill="none" stroke="#101010" stroke-width="4"></circle>
    </svg></div>
    </div>`;

    fetch(window.Shopify.routes.root + "collections/"+collection+"?section_id=main-collection")
      .then((response) => {
        requestResponse = response;
        return response.text();
      })
      .then((text) => {
        if (!requestResponse.ok) {
          throw new Error(`${requestResponse.status}: ${text}`);
        }

        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-main-collection').innerHTML;

          this.resultContainer.innerHTML = resultsMarkup;
      })
      .catch((error) => {
        console.error(error);
      });

  }

  goToStep(step) {
    this.removeActive();
    // this.progressBar.value = step;
    this.quesBlock[step].classList.add(this.activeClass);
  }

  // // Next
  // next() {
  //   this.quesBlock.forEach((block, index) => {
  //     let quesInputBtn = block.querySelectorAll(".go-next-btn");
  //     quesInputBtn.forEach((btn) => {
  //       btn.addEventListener("click", () => {
        
  //         // Remove active class from all
  //         this.removeActive();

  //         // Get the index of the clicked button
  //         let nextIdx = index + 1;
  //         this.prevIdx = index;

  //         // Progress bar
  //         this.progressBar.value = nextIdx;

  //         // If the next index is the last block
  //         if (nextIdx === this.totalBlock-1) {
  //           this.resultStep();
  //           return;
  //         }

  //         // Add active class to the next
  //         this.quesBlock[nextIdx].classList.add(this.activeClass);

  //       });
  //     });

  //   } );
  // }

  // Previous
  prev() {
    console.log('Prev');
    console.log(this.backData);

    if( this.backData.length == 0 ) {
      return;
    }

    let prevData = this.backData.pop();
    // this.goToStep(prevData.idx);

    // Remove active class from all
    this.removeActive();

    // Add active class to the previous
    this.quesBlock[prevData.idx].classList.add(this.activeClass);

    // remove selected input
    let quesInputBtn = this.quesBlock[prevData.idx].querySelectorAll("input");
    quesInputBtn.forEach((btn) => {
      btn.checked = false;
    } );

    // Progress bar
    this.setProgressBar( prevData.progress );


  }



  init() {
    
    // Input Values
    let sportVal = '';

    let $this = this;
    $this.jqLoaded = false;

    $this.el.querySelector('.quiz-idx-1').addEventListener('change', function(event) {
    
      if (event.target.name === 'quiz[1]') {
        
        sportVal = event.target.value.toLowerCase();

        // Remove active class from all
        $this.removeActive();
       
        // Football
        if( sportVal == 'football') {
          // Set max steps
          $this.setTotalSteps(4);

          jQuery('.footbal-1').addClass('active');
          
        } else if( sportVal == 'multisport') {
          $this.setTotalSteps(2);

          jQuery('.multisport-1').addClass('active');
        } else if( sportVal == 'golf') {
          $this.setTotalSteps(4);

          jQuery('.golf-1').addClass('active');
        }

       
        if (! $this.jqLoaded ) {
          // Step Changing
          jQuery(document).on('change', '.quiz-inp', function() {
         
            let thisBlock = jQuery(this).closest('.question-block');
            let thisVal = jQuery(this).val().toLowerCase();
            

            /**
             * Football
             * If football step 1: go to step 2
             */
            if( thisBlock.hasClass('footbal-1') ) {
              $this.removeActive();
              jQuery('.footbal-2').addClass('active');

              $this.setProgressBar(2);
            }
            // If football step 2: go to step 3
            else if( thisBlock.hasClass('footbal-2') ) {
              $this.removeActive();
              jQuery('.footbal-3').addClass('active');

              $this.setProgressBar(3);
            }
            // If football step 3: make result
            else if( thisBlock.hasClass('footbal-3') ) {

              $this.setProgressBar(4);

              if( thisVal == 'yes') {
                // alert('Quiz Recommendations 6');
                $this.resultStep('quiz-recommendations-6');
              } else {
                // alert('Quiz Recommendations 7');
                $this.resultStep('quiz-recommendations-7');
              }
            }
            // .End Football

            /**
             * Multisport
             * If multisport: make result
             */
            if( sportVal == 'multisport' && thisBlock.hasClass('multisport-1') ) {

              $this.setProgressBar(2);

              if( thisVal == 'commercial') {
                // alert('Quiz Recommendations 5');
                $this.resultStep('quiz-recommendations-5');
              } else {
                // alert('Quiz Recommendations 2');
                $this.resultStep('quiz-recommendations-2');
              }
            }
            // .End Multisport

            /**
             * Golf
             * If golf step 1 & commercial: make result
             * else: go to step 2
             */
            if( sportVal == 'golf' && thisBlock.hasClass('golf-1') ) {
              if( thisVal == 'commercial') {
                $this.setProgressBar(5);
                // alert('Quiz Recommendations 5');
                $this.resultStep('quiz-recommendations-5');
              } else {
                $this.removeActive();
                jQuery('.golf-2').addClass('active');

                $this.setProgressBar(2);
              }
            }
            // If golf step 2: go to step 3
            else if( sportVal == 'golf' && thisBlock.hasClass('golf-2') ) {
              $this.removeActive();
              jQuery('.golf-3').addClass('active');

              $this.setProgressBar(3);
            }
            // If golf step 3: make result
            else if( sportVal == 'golf' && thisBlock.hasClass('golf-3') ) {

              $this.setProgressBar(4);

              if( thisVal == 'net-only') {
                // alert('Quiz Recommendations 1');
                $this.resultStep('quiz-recommendations-1');
              } else if ( thisVal == 'w-launch-monitor') {
                // alert('Quiz Recommendations 3');
                $this.resultStep('quiz-recommendations-3');
              } else if ( thisVal == 'full') {
                // alert('Quiz Recommendations 4');
                $this.resultStep('quiz-recommendations-4');
              }
            }
            // .End Golf

            setTimeout(function() {
              let thisIdx = parseInt(thisBlock.attr('data-index'));
              let progressVal = $this.progressBar.value;

              // Back Data
              $this.backData.push({
                progress: progressVal,
                idx: thisIdx
              });
            }, 500);

          });

          // Set jQuery loaded
          $this.jqLoaded = true;
        }
      }
    });
  }

}

// checkbox for added to cart another product 
document.addEventListener("variant:added", function (event) {
  const variant = event.detail.variant;
  const responseJson = event.detail.responseJson;
  try {
    // Line item properties
    const upgradeValue = variant.properties[upgradePropertyLabel] || null;

    // If has property and value
    if (upgradeValue && upgradeValue == upgradeCheckedValue) {

      // Add another product to cart
      let formData = {
        'items': [{
          'id': upgradeProductId,
          'quantity': 1,
          'properties': {
            'Main Product': variant.title,
            'Product ID': variant.id
          }
        }]
      };

      // Add the additional product to the cart
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          // Refresh the cart
          document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
            bubbles: true
          }));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  } catch (error) {
    console.log(error);
  }
});
// checkbox for added to cart another product end