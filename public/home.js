document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        onOpenEnd : function() {
            document.querySelector("#current_job").addEventListener("change", function() {
                const endDate = document.querySelector(".end-date");
                if(this.checked)
                    endDate.classList.add('hide');
                else
                    endDate.classList.remove('hide');
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems);
});