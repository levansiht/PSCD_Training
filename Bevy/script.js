
$(document).ready(function(){
  // Bắt sự kiện khi nút menu-bar được nhấp
  $(".menu-bar").click(function(){
    $(".main-menu").toggleClass("opened"); // Thêm hoặc loại bỏ lớp để hiển thị menu bên phải
  });

  // Bắt sự kiện khi nút close-menu được nhấp
  $(".close-menu").click(function(){
    $(".main-menu").removeClass("opened"); // Loại bỏ lớp để ẩn menu bên phải
  });
});
