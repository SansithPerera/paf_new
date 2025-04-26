import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaUserCircle } from 'react-icons/fa';
import './post.css';
import axios from 'axios';
import { FaBell } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";

function Post() {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState({});
    const [editingComment, setEditingComment] = useState(null); // Track the comment being edited
    const [editingText, setEditingText] = useState(''); // Track the updated text

    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = [
                {
                    id: 147896582347895,
                    ownerId: 85678901234567,
                    title: "Street Photography: Rainy Day in Paris",
                    description: "Caught this moment of a couple sharing an umbrella near the Seine. The reflections on the wet pavement add so much to the composition. Leica M10, 35mm, f/5.6, 1/250s, ISO 400.",
                    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                    timestamp: "5 days ago"
                },
                {
                    id: 2578796541236982,
                    ownerId: 5678901234567,
                    title: "Underwater Photography: Coral Reef Life",
                    description: "Diving in the Great Barrier Reef with my underwater housing to capture these vibrant colors. The challenge was dealing with the water movement and limited light. Nikon D500 in Nauticam housing, 10-17mm fisheye, f/8, 1/125s, ISO 400.",
                    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                    timestamp: "1 week ago"
                }
            ];
            setPosts(fetchedPosts);
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchLikeCounts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/like/counts');
                setLikeCounts(response.data);
            } catch (error) {
                console.error("Error fetching like counts:", error);
            }
        };
        fetchLikeCounts();
    }, []);
    const [currentUserId, setCurrentUserId] = useState(() => {
        return localStorage.getItem('userId') || null;
    });
    const handleLike = async (postId) => {
        if (!currentUserId) {
            alert('Please login to like posts');
            return;
        }

        const fullName = localStorage.getItem('fullName'); // Fetch fullName from local storage

        try {
            const isCurrentlyLiked = likedPosts.includes(postId);
            setLikedPosts((prev) =>
                isCurrentlyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
            );

            const response = await axios.post('http://localhost:8080/like', {
                postID: postId,
                userID: currentUserId,
                fullName, // Include fullName in the request
            });

            setLikeCounts((prev) => ({
                ...prev,
                [postId]: response.data.likeCount,
            }));

            if (response.data.liked && !isCurrentlyLiked) {
                setLikedPosts((prev) => [...prev, postId]);
            } else if (!response.data.liked && isCurrentlyLiked) {
                setLikedPosts((prev) => prev.filter((id) => id !== postId));
            }
        } catch (error) {
            console.error('Error liking the post:', error);
            setLikedPosts((prev) =>
                likedPosts.includes(postId)
                    ? [...prev, postId]
                    : prev.filter((id) => id !== postId)
            );
        }
    };
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const countsResponse = await axios.get('http://localhost:8080/like/counts');
                setLikeCounts(countsResponse.data);

                if (currentUserId) {
                    const likedResponse = await axios.get(`http://localhost:8080/like/user/${currentUserId}`);
                    const userLikedPosts = likedResponse.data.likedPosts || [];
                    setLikedPosts(userLikedPosts);

                    localStorage.setItem(`likedPosts_${currentUserId}`, JSON.stringify(userLikedPosts));
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };
        fetchInitialData();
    }, [currentUserId]);

    const fetchLikedStatus = async (postId) => {
        if (!currentUserId) return false;

        try {
            const response = await axios.get(`http://localhost:8080/like/user/${currentUserId}/post/${postId}`);
            return response.data.liked;
        } catch (error) {
            console.error("Error fetching liked status:", error);
            return false;
        }
    };

    useEffect(() => {
        const updateLikedPosts = async () => {
            if (!currentUserId || posts.length === 0) return;

            try {
                const likedStatuses = await Promise.all(
                    posts.map(async (post) => {
                        const isLiked = await fetchLikedStatus(post.id);
                        return isLiked ? post.id : null;
                    })
                );
                setLikedPosts(likedStatuses.filter(Boolean));
            } catch (error) {
                console.error("Error updating liked posts:", error);
            }
        };

        updateLikedPosts();
    }, [currentUserId, posts]);

    const handleCommentSubmit = async (postId, commentText) => {
        const userID = localStorage.getItem('userId');
        const userName = localStorage.getItem('fullName');

        if (!userID || !userName) {
            alert('Please login to comment');
            return;
        }

        if (!commentText.trim()) { // Validation for empty input
            alert('Comment cannot be empty');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/comment', {
                postID: postId,
                userID,
                userName,
                comment: commentText,
            });

            const newComment = response.data;

            // Dynamically update the comments state
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: [...(prevComments[postId] || []), newComment],
            }));

            setCommentText(''); // Clear the input field
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCommentDelete = async (postId, commentId) => {
        try {
            await axios.delete(`http://localhost:8080/comment/${commentId}`);

            // Dynamically update the comments state
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: prevComments[postId].filter((comment) => comment.id !== commentId),
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleCommentUpdate = async (postId, commentId) => {
        if (!editingText.trim()) {
            alert('comment cannot be empty');
            return;
        }

        try {
            await axios.put(`http://localhost:8080/comment/${commentId}`, {
                comment: editingText,
            });

            // Update the comments state dynamically
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: prevComments[postId].map((comment) =>
                    comment.id === commentId ? { ...comment, comment: editingText } : comment
                ),
            }));

            setEditingComment(null); // Exit editing mode
            setEditingText(''); // Clear the editing text
            alert('Comment updated successfully'); // Display alert
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingComment(null); // Exit editing mode
        setEditingText(''); // Clear the editing text
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/comment');
                const commentsByPost = response.data.reduce((acc, comment) => {
                    if (!acc[comment.postID]) acc[comment.postID] = [];
                    acc[comment.postID].push(comment);
                    return acc;
                }, {});
                setComments(commentsByPost);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, []);

    return (
        <div>
            <div className='nav_bar_full'>
                <div className='nav_bar'>
                    <p className='ptagnav' onClick={() => (window.location.href = '/post')}>Post</p>
                    <FaBell className='nav_icon' onClick={() => (window.location.href = '/notification')} />
                    <IoLogOut
                        className='nav_icon'
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }}
                    />
                </div>
            </div>
            <div className="posts-container">
                <div className="posts-list">
                    {posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <div className="user-avatar">
                                        <img src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`} alt="User avatar" />
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">Photographer #{post.ownerId.toString().slice(0, 5)}</span>
                                        <span className="post-time">{post.timestamp}</span>
                                    </div>
                                </div>
                                <button className="post-options">
                                    <FaEllipsisH />
                                </button>
                            </div>

                            <div className="post-content">
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-description">{post.description}</p>
                                {post.image && (
                                    <div className="post-image">
                                        <img src={post.image} alt={post.title} />
                                    </div>
                                )}
                            </div>

                            <div className="post-stats">
                                <div className="stat-item">
                                    <FaHeart
                                        className={likedPosts.includes(post.id) ? 'stat_icon_active' : 'stat-icon'}
                                        onClick={() => handleLike(post.id)}
                                    />
                                    <span>{likeCounts[post.id] || 0} likes</span>
                                </div>
                                <div className="stat-item">
                                    <FaComment className="stat-icon" />
                                    <span> comments</span>
                                </div>
                            </div>

                            <div className="post-comment">
                                <input
                                    type="text"
                                    className="comment-input"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button
                                    className="comment-button"
                                    onClick={() => handleCommentSubmit(post.id, commentText)}
                                >
                                    <FaShare className="send-icon" />
                                </button>
                            </div>
                            {comments[post.id]?.map((comment) => (
                                <div className="comment-card">
                                    <div key={comment.id} className="single-comment">
                                        <div className="comment-header">
                                            <div className="comment-user">

                                                <FaUserCircle className="comment-avatar-icon" />
                                                <span className="comment-username">{comment.userName}</span>
                                            </div>
                                        </div>
                                        <div className="comment-content">
                                            {editingComment === comment.id ? (
                                                <input
                                                    type="text"
                                                    className="comment-edit-input"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                />
                                            ) : (
                                                <p>{comment.comment}</p>
                                            )}
                                        </div>
                                        {comment.userID === localStorage.getItem('userId') && (
                                            <div className="comment-actions">
                                                {editingComment === comment.id ? (
                                                    <>
                                                        <button
                                                            className="action-btn save-btn"
                                                            onClick={() => handleCommentUpdate(post.id, comment.id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="action-btn cancel-btn"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="action-btn update-btn"
                                                            onClick={() => {
                                                                setEditingComment(comment.id);
                                                                setEditingText(comment.comment);
                                                            }}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleCommentDelete(post.id, comment.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Post;


