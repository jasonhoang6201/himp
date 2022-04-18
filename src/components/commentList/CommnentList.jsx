import React, { useEffect, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { OutlineButton } from '../button/Button'
import './CommentList.scss'
import Notification from '../notifications/Notification'
import { Comments } from '../../firebase/firestore'
import propType from 'prop-types'
let array =[]   
const CommentList = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModal, setIsModal] = useState(false)
    const [commentArray,setCommentArray] = useState([])
    let user =localStorage.getItem("authUser")
    console.log("commentArray")
    setTimeout(()=>{    console.log(commentArray.length)},2000)

    const handleClick = async () => {
        user=localStorage.getItem("authUser")

        if (user === null) {
            setIsModal(true)
        } else {
   
        }
    }
    useEffect(async ()=>{
        const getCommentList = async () => {

            array=await Comments.getAllComments(props.id)
            console.log("ARRAY ")
            console.log(array)
            setTimeout(setCommentArray(array),2000)
            
        }
        await getCommentList()

    },[props.id])


    return (
        <div className="comment_list">
            <div className="comment_list_container">
                <div className="comment_input">
                    <textarea type="text" placeholder='write a comment' />
                    <div className='button_input'>
                        <OutlineButton onClick={() => handleClick()}>POST COMMENT</OutlineButton>
                    </div>
                </div>
                {
                    isLoading &&
                    <div className="loader_wrapper">
                        <div className="loader"></div>
                    </div>
                }
                {
                    Array.from({ length: commentArray.length }).map((item, index) => (
                        
                        <div className="root_comment" key={index}>
                            <Comment userName ={commentArray[index].name} content={commentArray[index].content}/> 
                             {/* <Comment /> */}
                            {
                                Array.from({ length: 2 }).map((item, index) => (
                                    <div className="reply_comment" key={index}>
                                        <Comment />
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
                
            </div>

            <div className="comment_load_more">
                <OutlineButton>Load more</OutlineButton>
            </div>
            {isModal && <Notification closeModal={setIsModal}/>}
        </div>
    )
}

const Comment = (props) => {
    console.log(props.userName)
    return (
        <div className="comment">
            <div className="comment_item_icon">
                <FaEllipsisH />

                <ul className="comment_item_option_list">
                    <li className="comment_item_option_item">Reply</li>
                    <li className="comment_item_option_item">Delete</li>
                </ul>
            </div>
            <div className="comment_item_name">
                <h3>{props.userName}</h3>
            </div>
            <div className="comment_item_content">
                {props.content}
            </div>
        </div>
    )
}
Comment.propType={
    userName:propType.string,
    content: propType.string
}

export default CommentList

