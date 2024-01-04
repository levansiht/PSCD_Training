import data from "./data.js";

$(document).ready(() => {
    let tableBody = $("#table-body");
    let select = $("#select");
    let pagination = $("#pagination");
    let searchInput = $("#search");
    let entriesInfo = $("#entries-info");
    let currentPage = 1;
    let entriesPerPage = parseInt(select.val());
    let totalEntries = data.length;

    // const filterData = (searchTerm) => {
    //     return data.filter(row => {
    //         return Object.values(row).some(value => {
    //             return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    //         });
    //     });
    // };
    const filterData = (searchTerm) => {
        const filteredData = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            let found = false;
            for (const key in row) {
                const value = row[key];
                if (String(value).toLowerCase().includes(searchTerm.toLowerCase())) {
                    found = true; 
                    break;
                }
            }
            if (found) {
                filteredData.push(row);
            }
        }
    
        return filteredData;
    };
    
    
    
    // const binarySearch = (arr, searchTerm) => {
    //     let left = 0;
    //     let right = arr.length - 1;
    //     while (left <= right) {
    //         const mid = Math.floor((left + right) / 2);
    //         const row = arr[mid];
    //         if (Object.values(row).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))) {
    //             return mid; 
    //         } else {
    //             const result = searchTerm.localeCompare(Object.values(row).toString().toLowerCase());
    //             if (result < 0) {
    //                 right = mid - 1;
    //             } else {
    //                 left = mid + 1;
    //             }
    //         }
    //     } 
    // };
    // const filterData = (searchTerm) => {
    //     const sortedData = data.slice().sort((a, b) => Object.values(a).toString().localeCompare(Object.values(b).toString()));
    //     const index = binarySearch(sortedData, searchTerm);
    //         const result = [];
    //         for (let i = index; i < sortedData.length; i++) {
    //             const row = sortedData[i];
    //             if (Object.values(row).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))) {
    //                 result.push(row);
    //             } else {
    //                 break; 
    //             }
    //         }
    //         return result;
    //     };
    const displayTable = () => {
        let start = (currentPage - 1) * entriesPerPage + 1;
        let end = start + entriesPerPage - 1;

        if (start > totalEntries) {
            currentPage = Math.ceil(totalEntries / entriesPerPage);
            start = (currentPage - 1) * entriesPerPage + 1;
        }

        let filteredData = filterData(searchInput.val()); 
        let slicedData = filteredData.slice(start - 1, Math.min(end, totalEntries));

        let htmlString = "";
        slicedData.forEach(item => {
            htmlString += "<tr>";
            item.forEach(value => {
                htmlString += "<td>" + value + "</td>";
            });
            htmlString += "</tr>";
        });
        tableBody.html(htmlString);
        updatePagination(filteredData);
        showEntriesInfo(currentPage, entriesPerPage, totalEntries);
    };

    const updatePagination = (filteredData) => {
        pagination.empty();
        let totalPages = Math.ceil(filteredData.length / entriesPerPage);

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
    };

    const showEntriesInfo = () => {
        let startIndex = ((currentPage - 1) * entriesPerPage + 1);
        let endIndex = Math.min((currentPage * entriesPerPage), totalEntries);
        entriesInfo.html(`Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`);
    };

    select.on('change', () => {
        let newEntriesPerPage = parseInt(select.val());
        currentPage = Math.ceil((currentPage * entriesPerPage) / newEntriesPerPage);
        entriesPerPage = newEntriesPerPage;
        displayTable();
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
                A = a[column];
                B = b[column];
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

    searchInput.on("input", () => {
        currentPage = 1;
        displayTable();
    });

    searchInput.on("keypress", (event) => {
        if (event.which === 13) {
            currentPage = 1;
            displayTable();
        }
    });

    displayTable();
});
