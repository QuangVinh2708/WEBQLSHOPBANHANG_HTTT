import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCDPGzN9HKCKraCgX3HvsNj6hWSRCn4H28",
  authDomain: "dvpmovie.firebaseapp.com",
  databaseURL: "https://dvpmovie-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dvpmovie",
  storageBucket: "dvpmovie.appspot.com",
  messagingSenderId: "721645459692",
  appId: "1:721645459692:web:89b0bfeab85666bd552dc9",
  measurementId: "G-HXKG7H6LTV"
};

const app = initializeApp(firebaseConfig);

import { getDatabase, ref, get, set, runTransaction, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

let OrderDetail = document.getElementById('order-detail');
let ODID = document.getElementById('ODID');
let Customer = document.getElementById('Customer');
let Address = document.getElementById('Address');
let Phone = document.getElementById('Phone');
let getTotal = document.getElementById('total-full');

const db = getDatabase();

var user_id = localStorage.getItem('userID');
//var user_id = '4R0c5MSpzxMbesJNRb5bqXLN31z2';

$(document).ready(function() {
    var dataSet = [];
    const dbref = ref(db);
    let cusID;
    get(child(dbref, 'Orders')).then(async function(snapshot) {
        let promises = [];
        let count = 1;

        snapshot.forEach(function(childSnapshot) {
            var value = childSnapshot.val();
            cusID = value.UserID;

            if (cusID == user_id) {
                
            // Fetch user name asynchronously and push to dataSet once complete
            let userPromise = get(child(dbref, 'User/' + value.UserID)).then((userSnapshot) => {
                let userName; // Default name
                if(userSnapshot.exists()) {
                    userName = userSnapshot.val().FullName;
                }
                let checkStatus;
                if(value.Status == true) {
                    checkStatus = "Đã thanh toán";
                }
                else {
                    checkStatus = "Chưa thanh toán";
                }
                dataSet.push([
                    value.OrderID,
                    userName,
                    count,
                    value.OrderDate,
                    value.Total,
                    checkStatus
                ]);
                count += 1;
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });

            promises.push(userPromise);
            }
        });

        // Wait for all promises to complete
        await Promise.all(promises);
        $('#table-order').DataTable({
            // DataTable options
            data: dataSet,
            columns: [
                { title: "ID", visible: false},
                { title: "Khách hàng", visible: false },
                { title: "STT" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" },
                { title: "Trạng thái"}
            ],
            
            rowCallback: function(row, data) {
                $(row).on('click', function() {
                    $('#order-detail tbody').remove();
                    //ODID.innerText = data[0];
                    var totalFull = 0;
                    get(child(dbref, 'Orders/' + data[0])).then((snapshotOrder)=>{
                        
                        if(snapshotOrder.exists()) {
                            get(child(dbref, 'User/' + user_id)).then((snapshotUser)=>{
                                if(snapshotUser.exists()) {
                                    Customer.innerText = snapshotUser.val().FullName;
                                    Address.innerText = snapshotUser.val().Address;
                                    Phone.innerText = snapshotUser.val().Phone;
                                }
                                else {
                                    alert("User does not exist");
                                }
                            })
                        }
                        else {
                            alert("Order does not exist");
                        }
                    })
                    .catch((error)=>{
                        alert("Unsuccessful");
                        console.log(error);
                    });
                    let productCount = 1;
                    get(child(dbref, 'OrderDetail/' + data[0])).then((snapshot)=>{
                        if(snapshot.exists()) {
                            let details = snapshot.val();
                            for (let product in details) {
                                
                                let id = document.createElement('th');
                                let namePro = document.createElement('td');
                                let quantity = document.createElement('td');
                                let price = document.createElement('td');
                                let total = document.createElement('td');
                                //id.innerHTML = product;
                                //quantity.innerHTML = product;
                                get(child(dbref, 'OrderDetail/' + data[0] + '/' + product)).then((snapshot)=>{
                                    if(snapshot.exists()) {
                                        namePro.innerHTML = snapshot.val().Name;
                                        price.innerHTML = snapshot.val().Price;
                                        quantity.innerHTML = snapshot.val().Amount;
                                        total.innerHTML = snapshot.val().Total;
                                        totalFull += snapshot.val().Total;
                                        getTotal.innerHTML = totalFull;
                                    }
                                    else {
                                        alert("Product does not exist");
                                    }
                                })
                                .catch((error)=>{
                                    alert("Unsuccessful");
                                    console.log(error);
                                })
                                id.innerHTML = productCount;
                                let tr = document.createElement('tr');
                                tr.append(id, namePro, quantity, price, total);
                                let tbody = document.createElement('tbody');
                                tbody.appendChild(tr);
                                OrderDetail.append(tbody);
                                productCount = productCount + 1;
                            }
                        }
                        else {
                            alert("Product does not exist");
                        }
                    })
                    .catch((error)=>{
                        alert("Unsuccessful");
                        console.log(error);
                    });
                    
                });
            }
        });
    });
});
const logoutBtn = document.getElementById('admin__sign-out');
const pathToLogin = "../user/login.html"
logoutBtn.addEventListener('click', () => logout(pathToLogin));
