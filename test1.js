$(document).ready(function(){
    let totalSlides = $('.example-slider img').length;
    let currentSlide = 0;
    function showSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        $('.example-slider img.active').fadeOut(300, function () {
            $(this).removeClass('active');
            $('.example-slider img:eq(' + index + ')').addClass('active').fadeIn(500);
        });
        currentSlide = index;
        updatePager(index);
    }
    function updatePager(index) {
        $('.bx-pager-item').empty(); 
        for (let i = 0; i < totalSlides; i++) {
            let pagerItem = $('<div class="bx-pager-item"></div>');
            let pagerLink = $('<a href="#" data-slide-index="' + i + '" class="bx-pager-link">' + (i + 1) + '</a>');
            if (i === index) {
                pagerLink.addClass('active');
            }
            pagerItem.append(pagerLink);
            $('.bx-pager').append(pagerItem);
        }
        let coffeeText = "Coffee " + (index + 1);
        $('.bx-caption span').text(coffeeText);
    }
    $(".bx-next").on('click', function(){
        showSlide(currentSlide + 1);
    });
    $(".bx-prev").on('click', function(){
        showSlide(currentSlide - 1);
    });
    $(document).on('click', '.bx-pager-link', function(e) {
        e.preventDefault();
        let slideIndex = $(this).data('slide-index');
        showSlide(slideIndex);
    });
    updatePager(currentSlide);
});