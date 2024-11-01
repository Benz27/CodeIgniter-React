import axios from "axios";
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../components/auth/contexts/AuthContext";
import { useGlobalStateContext } from "../../../components/config/contexts/GlobalStateContext";
import { BlogPostForm } from "./BlogPostForm";
import { Dialog } from "primereact/dialog";
import { usePopAlertContext } from "../../../components/pop-alert/contexts/PopAlertContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { findIndexById } from "../../../helpers/FindIndex";



const BlogPostItem = (props) => {

    const blog = props.blog;
    const setVisible = (typeof props.setVisible === "function") ? props.setVisible : () => { };
    const setBlogPosts = (typeof props.setBlogPosts === "function") ? props.setBlogPosts : () => { };

    const authCtx = useAuthContext();
    const gsCtx = useGlobalStateContext();

    const owner = authCtx.user.id == blog.user_id;
    const { popAlertRef } = usePopAlertContext();

    const date = new Date(blog.created_at);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (<div className="col-lg-4 my-3 d-none d-lg-block">
        <div className="card">
            <div className="card-body">

                <h3 className="card-title">{blog.title}</h3>
                <p className="card-text">
                    {blog.content}
                </p>
                <hr></hr>
                <p className="card-title">{formattedDate}</p>

                {owner ? (<>

                    <button onClick={() => {
                        gsCtx.set({ key: "BlogPost", value: blog });
                        setVisible(true);
                    }} data-mdb-ripple-init className="btn btn-primary">Edit</button>
                    <br></br>

                    <button onClick={() => {
                        popAlertRef.current.fire({
                            header: "Delete BlogPost",
                            content: () => {
                                return <>
                                    Proceed to delete "{blog.title}"?
                                    <br></br>
                                    <br></br>
                                    <Button severity={"danger"} onClick={async () => {
                                        popAlertRef.current.fire({
                                            header: "Deleting BlogPost",
                                            content: () => {
                                                return <div className="flex justify-content-center">
                                                    <ProgressSpinner />
                                                </div>
                                            },
                                            closable: false,
                                        });

                                        await axios.delete(`http://localhost:8080/api/blog/${blog.id}`, {
                                            headers: {
                                                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                                            }
                                        })
                                            .then(response => {
                                                gsCtx.unset("BlogPost");
                                                setBlogPosts((prev) => {
                                                    const hold = [...prev];
                                                    const index = findIndexById(blog.id, prev);
                                                    hold.splice(index, 1)
                                                    return hold;
                                                });
                                            })
                                            .catch(error => {
                                                console.error(error);
                                                throw new Error(error);
                                            }).finally(() => {
                                                popAlertRef.current.close();

                                            });




                                    }} label="Yes"></Button>
                                </>
                            }
                        });
                    }} data-mdb-ripple-init className="btn btn-danger">Delete</button>

                </>) : <></>}

            </div>
        </div>
    </div>)
}

const BlogPostFeed = () => {

    const [blogPosts, setBlogPosts] = useState([]);
    const [visible, setVisible] = useState(false);
    const gsCtx = useGlobalStateContext();

    useEffect(() => {
        axios.get('http://localhost:8080/api/blog', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
            .then(response => {
                setBlogPosts(response.data)
            })
            .catch(error => {

            });
    }, []);


    return (<>
        <Button label="New BlogPost" onClick={() => {
            gsCtx.unset("BlogPost");
            setVisible(true);
        }} severity="success"></Button>
        <div
            id="carouselMultiItemExample"
            className="carousel slide carousel-dark text-center"
        >
            <div className="carousel-inner py-4">
                <div className="carousel-item active">
                    <div className="container">
                        <div className="row mb-3">
                            {blogPosts.map((blog, index) => {
                                return <BlogPostItem blog={blog} index={index} setBlogPosts={setBlogPosts} setVisible={setVisible}></BlogPostItem>;
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => {
            gsCtx.unset("BlogPost");
            setVisible(false);
        }}>
            <BlogPostForm onCreate={(id, data) => {
                setBlogPosts((prev) => {
                    const hold = [...prev];
                    data["id"] = id;
                    hold.push(data);
                    return hold;
                });
            }} onModify={(id, data) => {
                setBlogPosts((prev) => {
                    const hold = [...prev];
                    const index = findIndexById(id, prev);
                    hold[index]["title"] = data["title"];
                    hold[index]["content"] = data["content"];
                    console.log(data);
                    return hold;
                });
            }}></BlogPostForm>
        </Dialog>
    </>)
}



export default BlogPostFeed;