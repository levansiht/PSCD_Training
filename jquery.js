$(document).ready(() => {
    let activeIndex = 0;
    const totalImages = $(".image-wrapper img").length;
    {
        let selectionHTML = "";
        for (let i = 0; i < totalImages; i++) {
            selectionHTML += `<li class="select-item"><button class="btn select-btn ${i === 0 ? 'active' : ''}"></button></li>`;
        }
        $(".selection-wrapper").html(selectionHTML);
    }
    const changeSlide = (index, direction) => {
        const imgWidth = $(".image-wrapper img").eq(0).outerWidth();
        $(".image-wrapper img[class!=active]").hide();
        $(".image-wrapper").css('left', 0);
        let leftPosition = 0;

        if (direction) {
            leftPosition = -1 * imgWidth;
            if (index > activeIndex) {
                for (let j = activeIndex + 1; j <= index; j++)
                    $(".image-wrapper").append($(".image-wrapper img[alt=img" + j + "]").show());
                leftPosition = (activeIndex - index) * imgWidth;
            } else $(".image-wrapper").append($(".image-wrapper img[alt=img" + index + "]").show());
        } else {
            let step = 1;
            if (index < activeIndex) {
                for (let j = activeIndex - 1; j >= index; j--)
                    $(".image-wrapper").prepend($(".image-wrapper img[alt=img" + j + "]").show());
                step = activeIndex - index;
            } else $(".image-wrapper").prepend($(".image-wrapper img[alt=img" + index + "]").show());

            $(".image-wrapper").css('left', `${-(step * imgWidth)}px`);
        }
        $(".image-wrapper").animate({ left: leftPosition }, 500);

        $(".selection-wrapper li:eq(" + activeIndex + ") button").removeClass('active');
        $(".selection-wrapper li:eq(" + index + ") button").addClass('active');

        $(".image-wrapper img[alt=img" + activeIndex + "]").removeClass('active');
        $(".image-wrapper img[alt=img" + index + "]").addClass('active');

        activeIndex = index;
    };
    $('.select-item').click(function () {
        let newIndex = $('.selection-wrapper .select-item').index(this);
        let direction = (newIndex > activeIndex);
        changeSlide(newIndex, direction);
    });

    $(".prev-btn").click(() => {
        const indexChange = activeIndex - 1 < 0 ? totalImages - 1 : activeIndex - 1;
        changeSlide(indexChange, false);
    });

    $(".next-btn").click(() => {
        const indexChange = activeIndex + 1 > totalImages - 1 ? 0 : activeIndex + 1;
        changeSlide(indexChange, true);
    });
});
