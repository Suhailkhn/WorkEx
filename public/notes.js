document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        onOpenStart: function(listItem) {
            listItem.querySelector('.replace-header').textContent = listItem.querySelector(".note-timestamp").textContent;
            document.querySelector('#note-content').textContent = listItem.querySelector(".content").textContent;
            M.textareaAutoResize(document.querySelector('#note-content'));
            document.querySelector('#noteId').setAttribute("value", listItem.querySelector('.note-id').textContent);
        },
        onCloseStart: function(listItem) {
            listItem.querySelector('.replace-header').textContent = listItem.querySelector(".content").textContent;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);
});