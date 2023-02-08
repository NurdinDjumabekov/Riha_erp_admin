
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import PostList from './components/PostList/PostList'
import Post from './components/Post/Post'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PostList />} />
        <Route path='/posts/:postId' element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
