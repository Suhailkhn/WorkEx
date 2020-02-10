document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
        noWrap: true,
        indicators: true,
        shift: 30,
        padding: 40
    });
});