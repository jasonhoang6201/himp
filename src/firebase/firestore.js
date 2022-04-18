
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where, getDoc } from "firebase/firestore";
import { app } from "./firebase-config";

const db = getFirestore(app);


export const User = {
    getStateUser: async (email) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email))
            const querySnapshot = await getDocs(q)
            let result = null;
            querySnapshot.forEach((doc) => {
                result = {
                    state: doc.data().state,
                    role: doc.data().role
                }

            });
            return result;
        } catch (error) {
            console.log(error)
        }
    },
    addUser: async (data) => {
        try {
            const docRef = await addDoc(collection(db, "users"), data)

            return docRef
        } catch (error) {
            console.log(error);
        }
    },
    updateName: async (email, name) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email))
            const querySnapshot = await getDocs(q)
            let id = null;
            querySnapshot.forEach((doc) => {
                id = doc.id
            });
            const nameDoc = doc(db, "users", id)
            await updateDoc(nameDoc, {
                name: name
            })

        } catch (error) {
            console.log(error)
        }
    },
    getUser: async (email) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email))
            console.log(email)
            const querySnapshot = await getDocs(q)
            let result = null;
            querySnapshot.forEach((doc) => {
                result = doc.id
                return result;
            });
            return result;
        } catch (error) {
            console.log(error)
        }
    },
    getListUser: async () => {
        try {
            let list = []
            let user = null
            let result = []
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach(async (doc) => {
                if (doc.data().role !== true) {
                    user = {
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        state: doc.data().state
                    }
                    list.push(user)
                }
            });
            for (let i = 0; i < list.length; i++) {
                result.push(list[i])
            }
            return result

        } catch (error) {
            console.log(error)
            return null
        }
    },
    blockUser: async (email) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email))
            const querySnapshot = await getDocs(q)
            let id = null;
            querySnapshot.forEach((doc) => {
                id = doc.id
            });
            const nameDoc = doc(db, "users", id)
            await updateDoc(nameDoc, {
                state: false
            })
        } catch (error) {
            console.log(error)
        }
    },
    unblockUser: async (email) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email))
            const querySnapshot = await getDocs(q)
            let id = null;
            querySnapshot.forEach((doc) => {
                id = doc.id
            });
            const nameDoc = doc(db, "users", id)
            await updateDoc(nameDoc, {
                state: true
            })
        } catch (error) {
            console.log(error)
        }
    },
    getUserById: async (documentId) => {
        try {
            const user = await (getDoc(doc(db, "users", documentId)))
            return user.data()
        } catch (error) {
            console.log(error)
        }
    }
}
export const Favourite = {
    getFavourite: async (email) => {
        try {
            const userID = await User.getUser(email)
            console.log("123 " + userID)
            const q = query(collection(db, "favourite"), where("idNguoiDung", "==", userID))
            const querySnapshot = await getDocs(q)
            let result = []
            querySnapshot.forEach(doc => {
                result = doc.data().movies
            })
            console.log("RESULT " + result)
            return result

        } catch (error) {
            console.log(error)
        }

    },
    postFavourite: async (email, id, category) => {
        try {

            const userID = await User.getUser(email)

            const q = query(collection(db, "favourite"), where("idNguoiDung", "==", userID))
            const querySnapshot = await getDocs(q)
            let result = null;
            let listID = null
            querySnapshot.forEach((doc) => {
                result = doc.data().movies
                listID = doc.id
            });
            const phim = {
                id: id,
                category: category
            }
            let check = false
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === phim.id) {
                    check = true
                }
            }
            if (check === true) {
                return
            }
            else {
                result.push(phim)
                console.log(result)
                const favouriteDoc = doc(db, "favourite", listID)
                await updateDoc(favouriteDoc, {
                    movies: result
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
}

export const Comments = {
    getOneComment: async (commentID) => {
        const docRef = doc(db, "comments", commentID);
        const docSnap = await getDoc(docRef);
        const tmp = await User.getUserById(docSnap.data().idNguoiDung)
        const result = {
            id: commentID,
            email: tmp.email,
            name: tmp.name,
            content: docSnap.data().content
        }
        return result
    },
    getAllComments: async (id) => {
        const q = query(collection(db, "comments"), where("idPhim", "==", id))
        const querySnapshot = await getDocs(q)
        const result = []

        try {
            querySnapshot.forEach((doc) => {
                console.log('doc ne', doc)
                const user = User.getUserById(doc.data().idNguoiDung)
                const comment = {
                    id: doc.id,
                    userID: doc.data().idNguoiDung,
                    content: doc.data().content,
                    email: user.email,
                    name: user.name,
                    replies: []
                }
                for (let i = 0; i < doc.data().Reply.length; i++) {
                    const reply = Comments.getOneComment(doc.data().Reply[i])
                    console.log(reply)
                    comment.replies.push(reply)
                }
                result.push(comment)
            })

        } catch (error) {
            console.log(error)
        }
        console.log('result', result)
        return result
    }
}
export default db