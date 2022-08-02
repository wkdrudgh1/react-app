import logo from './logo.svg';
import './App.css';
import {useState} from 'react'; // useState 임포트
function Header(props){ //헤더 컴포넌트
  return(
    <header>
      <h1><a href="/" onClick={(event) => {
        event.preventDefault(); // 클릭시 리로드 방지
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  )
}

function Nav(props){ // 네비 컴포넌트
  const lis = [];
  for(let i=0;i<props.topics.length; i++){ // 반복문으로 배열에 추가
    let t = props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} href={'/read/'+ t.id} onClick={(event) =>{
      event.preventDefault(); // 클릭시 리로드 방지
      props.onChangeMode(Number(event.target.id)); // 이벤트가 발생한 태그에 아이디를 받음, 문자열로 받기 때문에 숫자형으로 변경
    }}>{t.title}</a></li>)
  }
  return(
    <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}

function Article(props){ // 아티클 컴포넌트
  return(
    <article>
    <h2>{props.title}</h2>      
    {props.body}
  </article>
  )
}

function Create(props){
  return <article>
    <form onSubmit={(event) =>{
      event.preventDefault();
      const title = event.target.title.value; // 새로 작성한 타이틀
      const body = event.target.body.value; // 새로 작성한 바디

      props.onCreate(title,body); // 업데이트 클릭 시 데이터 전송
    }}>
      <p><input name='title' type='text' placeholder='title'></input></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <input type='submit' value='create'></input>   
    </form>
  </article>
}
function Update(props){  
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <form onSubmit={(event) =>{
      event.preventDefault();
      const title = event.target.title.value; // 새로 작성한 타이틀
      const body = event.target.body.value; // 새로 작성한 바디

      props.onUpdate(title,body); // 업데이트 클릭 시 데이터 전송
    }}>
      <p><input name='title' type='text' value={title} placeholder='title' onChange={(event)=>{
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name="body" value={body} placeholder='body' onChange={(event) =>{
        setBody(event.target.value);
      }}></textarea></p>
      <input type='submit' value='update'></input>   
    </form>
  </article>
}
function App() { // 메인 컴포넌트
  const [mode, setMode] = useState('WELCOM'); // 페이지 변경 확인 변수 
  const [id, setId] = useState(null); // 클릭한 아이디 확인 벼누
  const[nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([ 
    {id:1, title:'html', body:'html...'},
    {id:2, title:'css', body:'css...'},
    {id:3, title:'js', body:'js...'}
  ])  
  let content = null; // 새로운 페이지를 담는 변수 
  let contextControl = null; 
  if(mode ==='WELCOM'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode==='READ'){
    let title, body = null; // 새로 넣을 타이틀,바디 변수    
    for(let i=0;i<topics.length;i++){ // 아이디 일치여부 확인 
      if(topics[i].id === id){ // 클릭한 아이디랑 일치하면 변수에 넣음      
        title = topics[i].title;
        body = topics[i].body;
      }
    } 
  content = <Article title={title} body={body}></Article>
  contextControl = <>
      <li><a href={'/update/'+id} onClick={(event)=>{
        event.preventDefault();
        setMode("UPDATE");
        }}>update</a>
      </li>
      <li><input type="button" value="delete" onClick={()=>{
        const newTopics = [];
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOM');
      }}/>
        
      </li>
    </>  
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, body) =>{
      const newTopic = {id:nextId, title:_title, body:body} // 새로운 글을 담은 객체
      const newTopics = [...topics]; // 배열,객체는 복사해서 사용 
      newTopics.push(newTopic); // 복사한 곳에 담기 
      setTopics(newTopics);// 앱 컨포넌트 재실행 
    }}></Create>
  } else if(mode ==='UPDATE'){
    let title, body = null; // 새로 넣을 타이틀,바디 변수    
    for(let i=0;i<topics.length;i++){ // 아이디 일치여부 확인 
      if(topics[i].id === id){ // 클릭한 아이디랑 일치하면 변수에 넣음      
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics =  [...topics];
      const updatedTopic = {id:id, title:title, body:body};
      for(let i=0; i<newTopics.length;i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="WEB" onChangeMode={() =>{
        setMode('WELCOM'); // useState로 app 컴포넌트 재실행
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) =>{
        setMode('READ');// useState로 app 컴포넌트 재실행
        setId(_id); // 클릭한 아이디로 세팅 
      }}></Nav>
      {content}
      <ul>
        <li><a href='/create' onClick={(event) =>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
