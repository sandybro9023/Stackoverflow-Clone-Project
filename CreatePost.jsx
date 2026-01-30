function CreatePost() {
  const [text, setText] = useState("");

  const submit = async () => {
    await axios.post("/api/posts", { text });
  };

  return (
    <div>
      <textarea onChange={(e)=>setText(e.target.value)} />
      <button onClick={submit}>Post</button>
    </div>
  );
}
