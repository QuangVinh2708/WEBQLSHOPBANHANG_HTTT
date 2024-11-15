import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import Utils from "../controller/utils.js";
class Supplier {
    constructor() {
        this.getFirebaseStuff();
        this.utils = new Utils();
    }
    getFirebaseStuff() {
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

        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase();
    }
    /**
     * 
     * @returns {Promise<Array<object>} array of objects {key, Name, Address, Phone, Email, ZIP}
     */
    async getSupplierList(){
        const dbref = ref(this.db, 'Supplier');
        return get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                return this.utils.snapshotToArray(snapshot);
            } else {
                return [];
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
    }
    /**
     * 
     * @param {string} supplierID 
     * @returns {Promise<object>} object {key, Name, Address, Phone, Email, ZIP}    
     */
    async querrySupplierBasedOnID(supplierID){
        const dbref = ref(this.db, 'Supplier/' + supplierID);
        return get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        }).catch((error) => {
            console.error(error);
            return null;
        });
    }
}
export default Supplier;