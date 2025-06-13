import Search from "./search";
const Home = ({Theme}) =>{
  console.log(Theme)
    return <>
    <div className={`flex flex-col justify-center ${Theme ? ' bg-black text-white':'bg-white text-black'} items-center relative`}>
  <div>
  <Search Theme={Theme}/>
  </div>
    </div>

    </>
}
export default Home;