useEffect(()=>{
 axios.get("/api/posts").then(res=>setPosts(res.data));
},[]);
