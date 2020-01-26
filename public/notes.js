document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        onOpenStart: function(listItem) {
            listItem.querySelector('.replace-header').textContent = listItem.querySelector(".note-timestamp").textContent;
        },
        onCloseStart: function(listItem) {
            listItem.querySelector('.replace-header').textContent = listItem.querySelector(".content").textContent;
        }
    });
});