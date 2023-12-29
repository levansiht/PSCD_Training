import data from "./data.js";

$(document).ready(function () {
    let tableBody = $("#table-body");
    let select = $("#select");
    let pagination = $("#pagination");
    let searchInput = $("#search");
    let entriesInfo = $("#entries-info");
    let currentPage = 1;
    let entriesPerPage = parseInt(select.val());
    let totalEntries = data.length;
    function displayTable() {
        let start = (currentPage - 1) * entriesPerPage + 1;
        let end = start + entriesPerPage - 1;

        if (start > totalEntries) {
            currentPage = Math.ceil(totalEntries / entriesPerPage);
            start = (currentPage - 1) * entriesPerPage + 1;
        }
        let slicedData = data.slice(start - 1, Math.min(end, totalEntries));
        tableBody.html(slicedData.map(item =>
            $("<tr>").html(item.map(value => $("<td>").text(value)))
        ));
        updatePagination();
        showEntriesInfo(currentPage, entriesPerPage, totalEntries);
    }
    function updatePagination() {
        pagination.empty();
        let totalPages = Math.ceil(totalEntries / entriesPerPage);
        if (totalPages > 0 && currentPage <= totalPages) {
            let prevButton = $("<li class='pagination-btn prev'><a href='#'>Previous</a></li>");
            $(prevButton).click(() => {
                if (currentPage > 1) {
                    currentPage--;
                    displayTable();
                }
            });
            if (currentPage === 1) {
                $(prevButton).addClass('disabled');
            }
            pagination.append(prevButton);

            for (let i = 0; i < totalPages; i++) {
                let button = $("<li class='pagination-btn'><a href='#'>" + (i + 1) + "</a></li>");
                if (i === currentPage - 1) {
                    $(button).addClass('active');
                } else {
                    $(button).click(() => {
                        currentPage = i + 1;
                        displayTable();
                    });
                }
                pagination.append(button);
            }

            let nextButton = $("<li class='pagination-btn next'><a href='#'>Next</a></li>");
            $(nextButton).click(() => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayTable();
                }
            });
            if (currentPage === totalPages) {
                $(nextButton).addClass('disabled');
            }
            pagination.append(nextButton);
        }
    }
    function showEntriesInfo(currentPage, entriesPerPage, totalEntries) {
        let startIndex = ((currentPage - 1) * entriesPerPage + 1);
        let endIndex = Math.min((currentPage * entriesPerPage), totalEntries);
        entriesInfo.html(`Displaying ${startIndex} to ${endIndex} of ${totalEntries} entries`);
    }
    select.on('change', function () {
        let newEntriesPerPage = parseInt($(this).val());
        currentPage = Math.ceil((currentPage * entriesPerPage) / newEntriesPerPage);
        entriesPerPage = newEntriesPerPage;
        displayTable();
        updatePagination();
    });
    let sortColumn = 0;
    let sortState = 'asc';
    $('th.sorting').on('click', function () {
        let column = $(this).data('column');
        if (sortColumn === column) {
            sortState = sortState === 'asc' ? 'desc' : 'asc';
        } else {
            sortState = 'asc';
        }
        sortColumn = column;
        data.sort((a, b) => {
            let A, B;
            if (column === 5) {
                A = parseFloat(a[column].replace(/\$|,/g, ''));
                B = parseFloat(b[column].replace(/\$|,/g, ''));
            } else {
                A = a[sortColumn];
                B = b[sortColumn];
            }
            let compareResult = 0;

            if (A < B) {
                compareResult = -1;
            } else if (A > B) {
                compareResult = 1;
            }
            return (sortState === 'asc') ? compareResult : -compareResult;
        });
        currentPage = 1;
        displayTable();
        $('th.sorting').removeClass('sorting-asc sorting-desc');
        $('th:eq(' + sortColumn + ')').addClass('sorting-' + sortState);
    });
    searchInput.on("input", function () {
        currentPage = 1;
        displayTable();
    });
    searchInput.on("keypress", function (event) {
        if (event.which === 13) { 
            currentPage = 1;
            displayTable();
        }
    });
    displayTable()
});
