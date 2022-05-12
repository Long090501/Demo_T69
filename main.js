var list = document.querySelector("#list");

var API = "http://localhost:3000/members";

function start() {
     //lấy dữ liệu từ API và render nó lên giao diện khi khởi chạy trang web
     getMembers(function(members) {
          renderMembers(members);
          createData();     //khi chạy hàm start() thì form thêm dữ liệu đã sẵn sàng
          changeData(members);     //khi chạy hàm start() thì form sửa đổi dữ liệu đã sẵn sàng
     })
}

start();

//lấy dữ liệu API từ phía back-end và chuyển đổi sang dạng json
function getMembers(callback) {
     fetch(API)
         .then(function(members_non_json) {
              return members_non_json.json();
         })
         .then(callback)     //hàm callback sẽ nhận dữ liệu dạng json và tiến hành xử lý
}

//lấy dữ liệu từ json từ hàm getMembers và render ra giao diện
function renderMembers(members) {
     var html = members.map(function(member) {
          return `<li>ID: ${member.id} <br> Tên thành viên: ${member.name} <br> Trường: ${member.school} <br> Vị trí: ${member.role}</li>
                  <button onclick = "deleteData(${member.id})">Xóa</button>`     //bắt sự kiện click vào nút xóa và gọi hàm xử lý xóa dữ liệu
     })

     list.innerHTML = html.join('');
}

//hàm nhận dữ liệu đầu vào và gọi hàm xử lý việc thêm dữ liệu
function createData() {
     var createButton = document.querySelector("#btn1");
     createButton.onclick = function(e) {     //bắt sự kiện click vào nút thêm dữ liệu
          //lấy các dữ liệu được nhập vào từ ô input (id sẽ tự thêm và tự tăng lên 1)
          var getName = document.querySelector('input[name="Name"]').value;
          var getSchool = document.querySelector('input[name="School"]').value;
          var getRole = document.querySelector('input[name="Role"]').value;
          var data = {
               name: getName,
               school: getSchool,
               role: getRole
          }
          //truyền dữ liệu cần thêm
          postData(data);
     }
}

//hàm nhận dữ liệu đầu vào và gọi hàm xử lý việc sửa đổi dữ liệu
function changeData(members) {
     var changeButton = document.querySelector("#btn2");
     changeButton.onclick = function(e) {     //bắt sự kiện click vào nút sửa dữ liệu
          //lấy các dữ liệu được nhập vào từ ô input
          var getID = document.querySelector('input[name="ID"]').value;
          var getName = document.querySelector('input[name="Name"]').value;
          var getSchool = document.querySelector('input[name="School"]').value;
          var getRole = document.querySelector('input[name="Role"]').value;
          var data = {
               "id": getID
          }
          //kiểm tra xem dữ liệu nào được nhập thì thêm vào data, nếu không thì giữ nguyên dữ liệu cũ
          if(Boolean(getName) == true)
               data.name = getName; 
          else
               data.name = members[getID-1].name;
          if(Boolean(getSchool) == true)
               data.school = getSchool; 
          else
               data.school = members[getID-1].school;
          if(Boolean(getRole) == true)
               data.role = getRole;
          else
               data.role = members[getID-1].role;
          //truyền dữ liệu cần sửa và id của dữ liệu mà ta muốn sửa
          patchData(data,getID);
     }
}

//hàm xử lý việc thêm dữ liệu
function postData(data) {
     var options = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
               'Content-type': 'application/json; charset=UTF-8'
               // 'Content-Type': 'application/x-www-form-urlencoded',
             },
     };
     fetch(API, options)
          .then(function() {
               alert("Đã thêm thành công!");
          })     
}

//hàm xử lý việc sửa đổi dữ liệu 
function patchData(data, patch_id) {
     var options = {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
               'Content-type': 'application/json; charset=UTF-8'
               // 'Content-Type': 'application/x-www-form-urlencoded',
          },
     };
     fetch(API+ '/' + patch_id, options)
          .then(function() {
               alert("Đã sửa thành công!");
          })   
}

//hàm xử lý việc xóa dữ liệu
function deleteData(member_id) {
     var options = {
          method: "DELETE",
     };
     fetch(API + '/' + member_id, options)
          .then(function() {
               alert("Đã xóa thành công!");
          })
}
